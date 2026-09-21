import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { trackMetaClientEvent } from "@/lib/metaTracking";
import { getMetaBrowserContext } from "@/lib/metaPixel";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  MapPin,
  Minus,
  Plus,
  Shield,
  Tag,
  X,
} from "lucide-react";
import {
  PACK,
  TALLERES,
  TALLER_LANDING_PATH,
  TALLER_MAX_QUANTITY,
  clp,
  contentIdsFor,
  isSelKey,
  type SelKey,
  type TallerKey,
} from "@/lib/talleres";

const FORM_STORAGE_KEY = "taller_checkout_form";
const ATTEMPT_STORAGE_PREFIX = "taller_checkout_attempt_";
const IC_FIRED_PREFIX = "taller_checkout_ic_fired_";

type FormState = { nombre: string; apellido: string; email: string; celular: string };

const emptyForm: FormState = { nombre: "", apellido: "", email: "", celular: "" };

const readStoredForm = (): FormState => {
  try {
    const raw = window.sessionStorage.getItem(FORM_STORAGE_KEY);
    if (!raw) return emptyForm;
    const parsed = JSON.parse(raw);
    return {
      nombre: String(parsed.nombre ?? ""),
      apellido: String(parsed.apellido ?? ""),
      email: String(parsed.email ?? ""),
      celular: String(parsed.celular ?? ""),
    };
  } catch {
    return emptyForm;
  }
};

/** event_id estable por intento de checkout (sobrevive rerenders, refresh y StrictMode). */
const getAttemptId = (producto: SelKey): string => {
  const key = `${ATTEMPT_STORAGE_PREFIX}${producto}`;
  try {
    const existing = window.sessionStorage.getItem(key);
    if (existing) return existing;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    window.sessionStorage.setItem(key, id);
    return id;
  } catch {
    return `${producto}-${Date.now()}`;
  }
};

const TallerCheckout = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const rawProducto = params.get("producto");
  const producto: SelKey = isSelKey(rawProducto) ? rawProducto : "fundamentos";
  const isPack = producto === "pack";

  const [quantity, setQuantity] = useState<number>(() => {
    const q = parseInt(params.get("cantidad") || "1", 10);
    return Number.isFinite(q) && q >= 1 ? Math.min(q, TALLER_MAX_QUANTITY) : 1;
  });
  const [form, setForm] = useState<FormState>(() =>
    typeof window === "undefined" ? emptyForm : readStoredForm()
  );
  const [couponInput, setCouponInput] = useState("");
  const [couponChecking, setCouponChecking] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount_type: string;
    discount_value: number;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cupos, setCupos] = useState<Record<TallerKey, { total: number; vendidos: number }>>({
    fundamentos: { total: TALLERES.fundamentos.cupos, vendidos: 0 },
    avanzado: { total: TALLERES.avanzado.cupos, vendidos: 0 },
  });
  // Nunca inventamos disponibilidad: hasta cargar (o si falla) no asumimos stock.
  const [cuposLoaded, setCuposLoaded] = useState(false);
  const [cuposError, setCuposError] = useState(false);

  // Persistimos los datos para no perderlos al cambiar de producto o volver atrás
  useEffect(() => {
    try {
      window.sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(form));
    } catch {
      /* noop */
    }
  }, [form]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("event_cupos")
        .select("event_id, cupos_total, cupos_vendidos")
        .in("event_id", [TALLERES.fundamentos.eventId, TALLERES.avanzado.eventId]);
      if (error || !data || data.length === 0) {
        console.error("No pudimos cargar los cupos del taller:", error);
        setCuposError(true);
        return;
      }
      setCupos((prev) => {
        const next = { ...prev };
        for (const row of data) {
          if (row.event_id === TALLERES.fundamentos.eventId) {
            next.fundamentos = { total: row.cupos_total, vendidos: row.cupos_vendidos };
          } else if (row.event_id === TALLERES.avanzado.eventId) {
            next.avanzado = { total: row.cupos_total, vendidos: row.cupos_vendidos };
          }
        }
        return next;
      });
      setCuposError(false);
      setCuposLoaded(true);
    })();
  }, []);

  const disponibles = useCallback(
    (k: TallerKey) => Math.max(0, cupos[k].total - cupos[k].vendidos),
    [cupos]
  );
  const packDisponibles = Math.min(disponibles("fundamentos"), disponibles("avanzado"));
  const packFaltante =
    disponibles("fundamentos") <= 0
      ? "Fundamentales"
      : disponibles("avanzado") <= 0
      ? "Avanzado"
      : null;

  const maxQuantity = Math.max(
    1,
    Math.min(TALLER_MAX_QUANTITY, isPack ? packDisponibles : disponibles(producto as TallerKey))
  );
  const soldOut = cuposLoaded
    ? isPack
      ? packDisponibles <= 0
      : disponibles(producto as TallerKey) <= 0
    : false;

  // Nunca permitimos una cantidad mayor al stock real
  useEffect(() => {
    if (!cuposLoaded) return;
    setQuantity((q) => Math.min(Math.max(1, q), maxQuantity));
  }, [maxQuantity, cuposLoaded]);


  const unitPrice = isPack ? PACK.precio : TALLERES[producto as TallerKey].valor;
  const subtotal = unitPrice * quantity;
  const discount = useMemo(() => {
    if (isPack || !appliedCoupon) return 0;
    return appliedCoupon.discount_type === "percentage"
      ? Math.round((subtotal * appliedCoupon.discount_value) / 100)
      : Math.min(appliedCoupon.discount_value, subtotal);
  }, [appliedCoupon, isPack, subtotal]);
  const total = Math.max(0, subtotal - discount);

  const productoNombre = isPack ? PACK.nombre : TALLERES[producto as TallerKey].nombre;
  const productoCorto = isPack ? PACK.nombreCorto : TALLERES[producto as TallerKey].nombreCorto;
  const contentIds = contentIdsFor(producto);
  const cuposComprometidos = contentIds.length * quantity;

  /**
   * InitiateCheckout al entrar al primer paso válido del checkout: una sola vez por
   * intento (rerenders, refresh y StrictMode), y sólo cuando ya conocemos el stock real
   * y la cantidad quedó validada contra él.
   */
  const icFired = useRef(false);
  useEffect(() => {
    if (icFired.current || !cuposLoaded || cuposError || soldOut) return;
    if (quantity > maxQuantity) return; // esperamos el clamp contra stock real
    const attemptId = getAttemptId(producto);
    const firedKey = `${IC_FIRED_PREFIX}${attemptId}`;
    try {
      if (window.sessionStorage.getItem(firedKey)) {
        icFired.current = true;
        return;
      }
      window.sessionStorage.setItem(firedKey, "1");
    } catch {
      /* noop */
    }
    icFired.current = true;

    const icNumItems = contentIds.length * quantity;
    const icContents = contentIds.map((id) => ({
      id,
      quantity,
      item_price: unitPrice / contentIds.length,
    }));

    trackMetaClientEvent("InitiateCheckout", {
      eventId: `initiatecheckout-taller-${attemptId}`,
      contentName: productoNombre,
      contentType: "product",
      contentCategory: "workshop",
      contentIds,
      numItems: icNumItems,
      value: subtotal,
      currency: "CLP",
      funnel: "workshop",
      entityType: "taller_checkout",
      entityId: attemptId,
      pixelParams: {
        content_name: productoNombre,
        content_category: "workshop",
        content_ids: contentIds,
        contents: icContents,
        num_items: icNumItems,
        value: subtotal,
        currency: "CLP",
      } as unknown as Record<string, string | number | boolean | string[] | undefined>,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [producto, soldOut, cuposLoaded, cuposError, quantity, maxQuantity]);

  const setProducto = (next: SelKey) => {
    if (next === "pack" && appliedCoupon) {
      setAppliedCoupon(null);
      setCouponInput("");
      toast({
        title: "Quitamos tu cupón",
        description: "El precio del pack ya incluye el descuento y no es acumulable con cupones.",
      });
    }
    setParams({ producto: next, cantidad: String(quantity) }, { replace: true });
  };

  const changeQuantity = (next: number) => {
    const q = Math.min(Math.max(1, Math.round(next)), maxQuantity);
    setQuantity(q);
    // La cantidad vive también en la URL: recargar o volver atrás no la pierde
    setParams({ producto, cantidad: String(q) }, { replace: true });
    // El cupón se revalida con el nuevo subtotal
    if (appliedCoupon && !isPack) void revalidateCoupon(appliedCoupon.code, unitPrice * q);
  };


  const revalidateCoupon = async (code: string, amount: number) => {
    const { data } = await supabase.functions.invoke("validate-coupon", {
      body: { code, context: "taller", purchaseAmount: amount },
    });
    if (!data?.valid) {
      setAppliedCoupon(null);
      setCouponInput("");
      toast({
        title: "Tu cupón ya no aplica",
        description: data?.error || "Cambió el total de la compra.",
        variant: "destructive",
      });
    }
  };

  const applyCoupon = async () => {
    if (isPack) return;
    const code = couponInput.replace(/\s/g, "").toUpperCase();
    if (!code) return;
    setCouponChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke("validate-coupon", {
        body: { code, context: "taller", purchaseAmount: subtotal },
      });
      if (error) throw error;
      if (!data?.valid) {
        setAppliedCoupon(null);
        toast({
          title: "Cupón no válido",
          description: data?.error || "Revisa el código e intenta de nuevo.",
          variant: "destructive",
        });
        return;
      }
      const c = data.coupon;
      setAppliedCoupon({
        code: c.code,
        discount_type: c.discount_type,
        discount_value: c.discount_value,
      });
      toast({ title: `Cupón ${c.code} aplicado` });
    } catch (err) {
      console.error("Coupon validation error:", err);
      toast({ title: "No pudimos validar el cupón", variant: "destructive" });
    } finally {
      setCouponChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nombre = form.nombre.trim();
    const apellido = form.apellido.trim();
    const celular = form.celular.trim();
    const email = form.email.trim().toLowerCase();
    const emailOk = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);

    if (!nombre || !apellido || !celular || !emailOk) {
      toast({
        title: "Revisa tus datos",
        description: "Necesitamos nombre, apellido, celular y un email válido.",
        variant: "destructive",
      });
      return;
    }
    if (soldOut) {
      toast({
        title: "Cupos agotados",
        description: isPack
          ? `El taller ${packFaltante ?? ""} ya no tiene cupos, así que el pack no está disponible.`
          : "Este taller ya no tiene cupos disponibles. Escríbenos por WhatsApp para la lista de espera.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const ctx = getMetaBrowserContext();
      const { data, error } = await supabase.functions.invoke("create-taller-preference", {
        body: {
          taller: producto,
          quantity,
          nombre,
          apellido,
          celular,
          email,
          couponCode: isPack ? null : appliedCoupon?.code ?? null,
          fbp: ctx.fbp,
          fbc: ctx.fbc,
          eventSourceUrl: ctx.eventSourceUrl,
        },
      });
      if (error) throw error;
      if (!data?.initPoint) throw new Error(data?.error || "No se pudo iniciar el pago");
      window.location.href = data.initPoint;
    } catch (err: any) {
      console.error("Taller checkout error:", err);
      toast({
        title: "No pudimos iniciar el pago",
        description: `Intenta de nuevo o escríbenos por WhatsApp. (${productoCorto})`,
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  const fechasResumen = isPack
    ? [TALLERES.fundamentos, TALLERES.avanzado]
    : [TALLERES[producto as TallerKey]];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Checkout · Talleres Wim Hof Santiago | Nave Studio</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div
        className="max-w-[880px] mx-auto px-4 pt-6"
        style={{ paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom))" }}
      >
        <Link
          to={TALLER_LANDING_PATH}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-5"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al taller
        </Link>

        <h1 className="font-heading text-2xl md:text-3xl text-foreground mb-1">
          Reservar {productoCorto}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Completa tus datos y te llevamos al pago seguro por Mercado Pago.
        </p>

        <div className="grid md:grid-cols-[1fr_340px] gap-6 items-start">
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5 order-2 md:order-1">
            {/* Upsell / cambio de producto */}
            {!isPack && packDisponibles > 0 && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {producto === "fundamentos"
                    ? `Completa la experiencia: agrega Avanzado por ${PACK.avanzadoConDescuentoTxt} en vez de ${TALLERES.avanzado.valorTxt}.`
                    : `Suma Fundamentales y llévate los dos talleres por ${PACK.precioTxt} en vez de ${PACK.precioNormalTxt}.`}
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => setProducto("pack")}
                >
                  Cambiar a la Experiencia completa ({PACK.precioTxt})
                </Button>
              </div>
            )}
            {isPack && (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-2">
                <p className="text-sm text-foreground">
                  Llevas los dos talleres: {TALLERES.fundamentos.fechaLarga} y{" "}
                  {TALLERES.avanzado.fechaLarga}. El precio del pack ya incluye{" "}
                  {PACK.descuentoAvanzadoPct}% de descuento en Avanzado, por eso no es acumulable
                  con cupones.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setProducto("fundamentos")}
                  >
                    Solo Fundamentales
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setProducto("avanzado")}
                  >
                    Solo Avanzado
                  </Button>
                </div>
              </div>
            )}

            {/* Cantidad */}
            <div className="rounded-xl border border-border p-4 space-y-3">
              <Label className="text-sm">¿Cuántas personas van?</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Quitar una persona"
                  onClick={() => changeQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={maxQuantity}
                  step={1}
                  value={quantity}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (Number.isFinite(v)) changeQuantity(v);
                  }}
                  className="w-20 text-center"
                  aria-label="Cantidad de personas"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Agregar una persona"
                  onClick={() => changeQuantity(quantity + 1)}
                  disabled={quantity >= maxQuantity}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <span className="text-xs text-muted-foreground">
                  Máximo {maxQuantity} según cupos disponibles
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {isPack
                  ? `${quantity} ${quantity === 1 ? "pack" : "packs"} = ${quantity} ${
                      quantity === 1 ? "cupo" : "cupos"
                    } en Fundamentales + ${quantity} en Avanzado (${cuposComprometidos} cupos en total).`
                  : `${quantity} ${quantity === 1 ? "cupo" : "cupos"} para ${productoCorto}.`}
              </p>
            </div>

            {/* Datos del comprador */}
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    autoComplete="given-name"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    maxLength={100}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    autoComplete="family-name"
                    value={form.apellido}
                    onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                    maxLength={100}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  maxLength={255}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="celular">Celular</Label>
                <Input
                  id="celular"
                  type="tel"
                  autoComplete="tel"
                  value={form.celular}
                  onChange={(e) => setForm({ ...form, celular: e.target.value })}
                  placeholder="+56 9 4612 0426"
                  maxLength={30}
                  required
                />
              </div>
            </div>

            {/* Cupón (solo talleres individuales) */}
            {!isPack && (
              <div className="space-y-2">
                <Label htmlFor="cupon" className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" /> ¿Tienes un cupón?
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="cupon"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.replace(/\s/g, "").toUpperCase())}
                    placeholder="CÓDIGO"
                    disabled={!!appliedCoupon}
                  />
                  {appliedCoupon ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponInput("");
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={applyCoupon}
                      disabled={couponChecking || !couponInput}
                    >
                      {couponChecking ? "..." : "Aplicar"}
                    </Button>
                  )}
                </div>
                {appliedCoupon && (
                  <p className="text-xs text-primary flex items-center gap-1">
                    <Check className="w-3 h-3" /> Cupón {appliedCoupon.code} aplicado
                  </p>
                )}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={submitting || soldOut}>
              {submitting
                ? "Redirigiendo a Mercado Pago..."
                : soldOut
                ? `${packFaltante ?? "Taller"} sin cupos`
                : `Pagar ${clp(total)}`}
              {!submitting && !soldOut && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Serás redirigido a Mercado Pago para completar tu reserva.
            </p>
          </form>

          {/* Resumen */}
          <aside className="order-1 md:order-2 rounded-2xl border border-border bg-card p-5 space-y-4 md:sticky md:top-6">
            <p className="font-heading text-lg text-foreground">{productoCorto}</p>
            {fechasResumen.map((t) => (
              <div key={t.eventId} className="text-sm text-muted-foreground space-y-1">
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" /> {t.fechaLarga}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> {t.horario} ({t.duracion})
                </p>
                {isPack && (
                  <p className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> {quantity}{" "}
                    {quantity === 1 ? "cupo" : "cupos"}
                  </p>
                )}
              </div>
            ))}
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" /> Nave Studio, Antares 259, Las Condes
            </p>

            <div className="border-t border-border pt-4 space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>
                  {clp(unitPrice)} × {quantity}
                </span>
                <span>{clp(subtotal)}</span>
              </div>
              {isPack && (
                <div className="flex justify-between text-muted-foreground">
                  <span className="line-through">{clp(PACK.precioNormal * quantity)}</span>
                  <span className="text-primary">
                    Ahorras {clp(PACK.ahorro * quantity)}
                  </span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Cupón {appliedCoupon?.code}</span>
                  <span>-{clp(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-foreground pt-1 text-base">
                <span>Total</span>
                <span>{clp(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground pt-1">
                {cuposComprometidos} {cuposComprometidos === 1 ? "cupo" : "cupos"} en total
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TallerCheckout;
