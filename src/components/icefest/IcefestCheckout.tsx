import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Ticket,
  ShieldCheck,
  Calendar,
  MapPin,
  Check,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  type IcefestEvent,
  type IcefestTier,
  icefestCall,
  icefestDate,
  icefestMoney,
  normalizeIcefestPhone,
} from "@/lib/icefest";
import { trackMetaClientEvent } from "@/lib/metaTracking";
import { getMetaBrowserContext } from "@/lib/metaPixel";
import ice from "@/assets/icefest/ice-bath-new.webp";

type Quote = { total_amount: number; discount_amount: number };
type Props = {
  tier: IcefestTier | null;
  event: IcefestEvent | null;
  canBuy: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function IcefestCheckout({
  tier,
  event,
  canBuy,
  open,
  onOpenChange,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [buyer, setBuyer] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
  });
  const [coupon, setCoupon] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState<"quote" | "payment" | null>(null);
  const [error, setError] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const locked = useRef(false);
  const tracked = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const revision = useRef(0);
  const limit = tier
    ? Math.max(
        0,
        Math.min(
          tier.max_per_order,
          tier.stock === null
            ? tier.max_per_order
            : tier.stock - tier.stock_sold,
        ),
      )
    : 0;

  useEffect(() => {
    revision.current += 1;
    setQuote(null);
    setError("");
    setStep((current) => (current === 2 ? 1 : current));
  }, [quantity, coupon, tier?.id, tier?.price]);
  useEffect(() => {
    if (limit > 0) setQuantity((current) => Math.min(current, limit));
  }, [limit]);
  useEffect(() => {
    if (open && tier && !tracked.current) {
      tracked.current = true;
      trackMetaClientEvent("InitiateCheckout", {
        contentName: "Icefest Santiago",
        contentIds: [tier.id],
        value: tier.price * quantity,
        currency: "CLP",
        funnel: "icefest",
      });
    }
  }, [open, tier, quantity]);
  useEffect(() => {
    if (open) heading.current?.focus();
  }, [step, open]);

  const payload = {
    ticket_type_id: tier?.id,
    quantity,
    buyer: {
      name: buyer.name.trim(),
      surname: buyer.surname.trim(),
      email: buyer.email.trim().toLowerCase(),
      phone: normalizeIcefestPhone(buyer.phone),
    },
    coupon,
    accept_terms: accepted,
  };
  const checkoutAvailable = canBuy && limit > 0 && quantity <= limit;

  async function review(e: React.FormEvent) {
    e.preventDefault();
    if (locked.current || !checkoutAvailable || !accepted) return;
    const phone = normalizeIcefestPhone(buyer.phone);
    if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
      setError("Revisa tu número de WhatsApp, incluyendo el código de país.");
      return;
    }
    locked.current = true;
    setBusy("quote");
    setError("");
    const version = revision.current;
    try {
      const result = await icefestCall<Quote>("icefest-checkout", {
        ...payload,
        quote: true,
      });
      if (version !== revision.current) return;
      if (!Number.isFinite(result.total_amount) || result.total_amount < 0)
        throw new Error("No se pudo confirmar el total. Intenta nuevamente.");
      setQuote(result);
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo revisar el total.");
    } finally {
      locked.current = false;
      setBusy(null);
    }
  }

  async function pay() {
    if (locked.current || !checkoutAvailable || !quote || !accepted) return;
    locked.current = true;
    setBusy("payment");
    setError("");
    try {
      const ctx = getMetaBrowserContext();
      const result = await icefestCall<{
        init_point?: string;
        redirect_url?: string;
      }>("icefest-checkout", {
        ...payload,
        meta: {
          fbp: ctx.fbp || undefined,
          fbc: ctx.fbc || undefined,
          clientUserAgent: navigator.userAgent,
        },
      });
      const destination = result.init_point || result.redirect_url;
      if (!destination)
        throw new Error("No recibimos el enlace de pago. Intenta nuevamente.");
      const url = new URL(destination);
      if (url.protocol !== "https:")
        throw new Error("No se pudo abrir un enlace de pago seguro.");
      window.location.assign(url.href);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar el pago.");
      locked.current = false;
      setBusy(null);
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        if (!locked.current) onOpenChange(value);
      }}
    >
      <SheetContent
        className="icefest-theme text-foreground w-full sm:max-w-xl p-0 flex flex-col h-[100dvh]"
        onEscapeKeyDown={(e) => {
          if (locked.current) e.preventDefault();
        }}
        onPointerDownOutside={(e) => {
          if (locked.current) e.preventDefault();
        }}
      >
        <SheetHeader className="px-6 pt-6 pb-5 border-b text-left shrink-0">
          <SheetTitle className="text-xl pr-8">Tu viaje a Icefest</SheetTitle>
          <SheetDescription>Icefest + Breath Act · Santiago</SheetDescription>
          <ol className="flex gap-5 pt-4 text-xs" aria-label="Pasos de compra">
            {["Entradas", "Tus datos", "Pago"].map((label, i) => (
              <li
                key={label}
                aria-current={step === i ? "step" : undefined}
                className={`flex items-center gap-2 ${step >= i ? "text-primary" : "text-muted-foreground"}`}
              >
                <span className="w-6 h-6 rounded-full border flex items-center justify-center">
                  {step > i ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                {label}
              </li>
            ))}
          </ol>
        </SheetHeader>
        <div className="overflow-y-auto flex-1 min-h-0 px-6 py-6">
          <h2 ref={heading} tabIndex={-1} className="text-xl mb-6 outline-none">
            {
              [
                "Elige tus entradas",
                "¿A quién enviamos las entradas?",
                "Revisa tu compra",
              ][step]
            }
          </h2>
          {!checkoutAvailable && (
            <p role="alert" className="text-destructive mb-5">
              La disponibilidad cambió. Cierra el carrito y revisa las entradas
              disponibles.
            </p>
          )}
          {tier && (
            <>
              {step === 0 && (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <img
                      src={ice}
                      alt="Icefest"
                      className="w-20 h-24 object-cover rounded-md shrink-0"
                    />
                    <div>
                      <h3 className="text-lg mb-1">Icefest + Breath Act</h3>
                      <p className="text-primary text-sm">{tier.name}</p>
                      <p className="text-secondary font-bold mt-2">
                        {icefestMoney(tier.price)}{" "}
                        <span className="text-muted-foreground text-xs font-normal">
                          por persona
                        </span>
                      </p>
                    </div>
                  </div>
                  {event && (
                    <div className="text-sm text-muted-foreground space-y-3">
                      <p className="flex gap-2">
                        <Calendar className="w-4 h-4 shrink-0 mt-1" />
                        {icefestDate(event.date)} · {event.schedule}
                      </p>
                      <p className="flex gap-2">
                        <MapPin className="w-4 h-4 shrink-0 mt-1" />
                        {event.location}
                      </p>
                    </div>
                  )}
                  <div className="border-y py-5 flex justify-between items-center">
                    <Label>Cantidad</Label>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Quitar entrada"
                        disabled={quantity <= 1 || Boolean(busy)}
                        onClick={() => setQuantity((q) => q - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span
                        aria-live="polite"
                        className="w-7 text-center font-bold"
                      >
                        {quantity}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label="Agregar entrada"
                        disabled={quantity >= limit || Boolean(busy)}
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Respiración inmersiva, baño de hielo, ceremonia de cacao y
                    Ecstatic Dance. Cada entrada tiene un código único.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="icefest-coupon">¿Tienes un cupón?</Label>
                    <Input
                      id="icefest-coupon"
                      placeholder="Código de descuento"
                      maxLength={50}
                      value={coupon}
                      onChange={(e) =>
                        setCoupon(
                          e.target.value.replace(/\s/g, "").toUpperCase(),
                        )
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Se validará al revisar tu compra.
                    </p>
                  </div>
                </div>
              )}
              {step === 1 && (
                <form
                  id="icefest-details"
                  onSubmit={review}
                  className="space-y-5"
                >
                  <fieldset disabled={Boolean(busy)} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {(
                        [
                          {
                            key: "name",
                            label: "Nombre",
                            type: "text",
                            autoComplete: "given-name",
                          },
                          {
                            key: "surname",
                            label: "Apellido",
                            type: "text",
                            autoComplete: "family-name",
                          },
                          {
                            key: "email",
                            label: "Email",
                            type: "email",
                            autoComplete: "email",
                          },
                          {
                            key: "phone",
                            label: "WhatsApp",
                            type: "tel",
                            autoComplete: "tel",
                          },
                        ] as const
                      ).map((f) => (
                        <div
                          key={f.key}
                          className={`space-y-2 ${f.key === "email" ? "sm:col-span-2" : ""}`}
                        >
                          <Label htmlFor={`icefest-${f.key}`}>{f.label}</Label>
                          <Input
                            id={`icefest-${f.key}`}
                            type={f.type}
                            autoComplete={f.autoComplete}
                            required
                            maxLength={f.key === "email" ? 255 : 100}
                            value={buyer[f.key]}
                            placeholder={
                              f.key === "phone" ? "+56 9 1234 5678" : ""
                            }
                            onChange={(e) =>
                              setBuyer((current) => ({
                                ...current,
                                [f.key]: e.target.value,
                              }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enviaremos el comprobante y los códigos a este email.
                      Revísalo antes de continuar.
                    </p>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="icefest-terms"
                        checked={accepted}
                        onCheckedChange={(v) => setAccepted(v === true)}
                      />
                      <Label
                        htmlFor="icefest-terms"
                        className="text-sm leading-relaxed"
                      >
                        Acepto los{" "}
                        <Link
                          to="/terminos"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          términos
                        </Link>{" "}
                        y la{" "}
                        <Link
                          to="/privacidad"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          política de privacidad
                        </Link>
                        . Las prácticas son guiadas, voluntarias y no reemplazan
                        atención médica.
                      </Label>
                    </div>
                  </fieldset>
                </form>
              )}
              {step === 2 && quote && (
                <div className="space-y-6">
                  <div className="border-b pb-5">
                    <p className="font-bold">
                      {quantity} {quantity === 1 ? "entrada" : "entradas"} ·{" "}
                      {tier.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 break-words">
                      {buyer.name} {buyer.surname}
                      <br />
                      {buyer.email}
                    </p>
                  </div>
                  <dl className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <dt>Entradas</dt>
                      <dd>{icefestMoney(tier.price * quantity)}</dd>
                    </div>
                    {quote.discount_amount > 0 && (
                      <div className="flex justify-between text-primary">
                        <dt>Descuento aplicado</dt>
                        <dd>−{icefestMoney(quote.discount_amount)}</dd>
                      </div>
                    )}
                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                      <dt>Total</dt>
                      <dd>{icefestMoney(quote.total_amount)}</dd>
                    </div>
                  </dl>
                  <p className="text-sm text-muted-foreground flex gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    Pago seguro con Mercado Pago. Puedes elegir hasta 3 cuotas;
                    las condiciones de tu tarjeta se muestran al pagar.
                  </p>
                </div>
              )}
            </>
          )}
          {error && (
            <div role="alert" className="mt-6 text-sm text-destructive">
              <p>{error}</p>
              {step === 1 && coupon && (
                <Button
                  variant="link"
                  className="px-0"
                  disabled={Boolean(busy)}
                  onClick={() => {
                    setCoupon("");
                    setStep(0);
                  }}
                >
                  Editar o quitar cupón
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="festival-bottom border-t px-6 pt-4 shrink-0 space-y-4 bg-background">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {quote ? "Total confirmado" : "Subtotal"}
            </span>
            <strong className="text-xl text-secondary">
              {icefestMoney(
                quote?.total_amount ?? (tier?.price || 0) * quantity,
              )}
            </strong>
          </div>
          <div className="flex gap-3">
            {step > 0 && (
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 shrink-0"
                aria-label="Volver al paso anterior"
                disabled={Boolean(busy)}
                onClick={() => {
                  setStep((s) => s - 1);
                  setError("");
                }}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            {step === 0 ? (
              <Button
                className="festival-cta h-12 flex-1"
                disabled={!checkoutAvailable}
                onClick={() => setStep(1)}
              >
                Continuar
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : step === 1 ? (
              <Button
                form="icefest-details"
                type="submit"
                className="festival-cta h-12 flex-1"
                disabled={!accepted || Boolean(busy) || !checkoutAvailable}
              >
                {busy ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                {busy ? "Revisando total…" : "Revisar mi compra"}
              </Button>
            ) : (
              <Button
                className="festival-cta h-12 flex-1"
                disabled={Boolean(busy) || !checkoutAvailable || !quote}
                onClick={() => void pay()}
              >
                {busy ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Ticket className="w-4 h-4 mr-2" />
                )}
                {busy
                  ? "Abriendo pago seguro…"
                  : quote?.total_amount === 0
                    ? "Confirmar entradas"
                    : "Ir al pago"}
              </Button>
            )}
          </div>
          <p
            role="status"
            className="text-xs text-center text-muted-foreground"
          >
            {busy === "payment"
              ? "Espera un momento, estamos conectando con el pago."
              : "Tus entradas llegan por email al confirmar la compra."}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
