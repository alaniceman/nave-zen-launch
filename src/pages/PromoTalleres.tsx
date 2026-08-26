import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Snowflake,
  Loader2,
  Check,
  Clock,
  Gift,
  Users,
  Brain,
  Zap,
  Heart,
  ShieldCheck,
  MapPin,
  ShoppingBag,
  ArrowRight,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { ReviewsTrustBar } from "@/components/ReviewsTrustBar";
import { PurchaseFAQ } from "@/components/PurchaseFAQ";
import { supabase } from "@/integrations/supabase/client";
import { trackMetaClientEvent, trackViewContentOnce } from "@/lib/metaTracking";
import { deterministicEventId, getMetaBrowserContext } from "@/lib/metaPixel";
import { toast } from "sonner";

const PACKAGE_ID = "577d13fc-590e-4e9f-a99e-18cc1e62e414";
const PACKAGE_NAME = "Pack Post Taller · 6 Sesiones";
const SESSIONS = 6;
const PRICE = 60000;
const REGULAR_PRICE = 180000;
const PER_SESSION = PRICE / SESSIONS;
const SAVINGS = REGULAR_PRICE - PRICE;

const benefits = [
  {
    icon: Brain,
    title: "Regula tu sistema nervioso",
    desc: "La constancia es lo que hace la diferencia: el frío entrena tu respuesta al estrés.",
  },
  {
    icon: Zap,
    title: "Energía real, sin cafeína",
    desc: "Dopamina y norepinefrina que se sostienen por horas después de cada sesión.",
  },
  {
    icon: Heart,
    title: "Mejor sueño y recuperación",
    desc: "Regula el cortisol y baja la inflamación muscular.",
  },
  {
    icon: ShieldCheck,
    title: "Técnica acompañada",
    desc: "Cada sesión es guiada: respiración Wim Hof + hielo a 3 °C, máximo 2 minutos.",
  },
];

export default function PromoTalleres() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Countdown: la promo cierra el 31 de agosto 2026 a las 23:59 (Chile, UTC-4)
  const [deadline] = useState(() => new Date("2026-09-01T03:59:00Z").getTime());
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    trackViewContentOnce(PACKAGE_NAME, { contentCategory: "package" });
  }, []);

  useEffect(() => {
    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const finalPrice = (() => {
    if (!appliedCoupon) return PRICE;
    const discount =
      appliedCoupon.discount_type === "percentage"
        ? Math.floor(PRICE * (appliedCoupon.discount_value / 100))
        : appliedCoupon.discount_value;
    return Math.max(0, PRICE - discount);
  })();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError("");
    setAppliedCoupon(null);
    try {
      const { data: result, error } = await supabase.functions.invoke("validate-coupon", {
        body: {
          code: couponCode.trim().toUpperCase(),
          packageId: PACKAGE_ID,
          purchaseAmount: PRICE,
        },
      });
      if (error || !result?.valid) {
        setCouponError(result?.error || "Cupón no encontrado");
        return;
      }
      setAppliedCoupon(result.coupon);
      toast.success("¡Cupón aplicado!");
    } catch (err) {
      console.error("Error validating coupon:", err);
      setCouponError("Error al validar cupón");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);
    try {
      const ctx = getMetaBrowserContext();
      const { data, error } = await supabase.functions.invoke("purchase-session-package", {
        body: {
          packageId: PACKAGE_ID,
          buyerName: formData.name,
          buyerEmail: formData.email,
          buyerPhone: formData.phone,
          couponCode: appliedCoupon?.code,
          isGiftCard: false,
          promoType: "promo_talleres",
          fbp: ctx.fbp,
          fbc: ctx.fbc,
          eventSourceUrl: ctx.eventSourceUrl,
        },
      });

      if (error) throw new Error(error.message || "Error al procesar la compra");

      if (data?.freeOrder) {
        toast.success("¡Compra completada! Revisa tu email para obtener tus códigos.");
        window.location.href = "/bonos/success?free=true";
        return;
      }

      if (data?.orderId && data?.initPoint) {
        const value = typeof data.finalPrice === "number" ? data.finalPrice : finalPrice;
        if (value > 0) {
          trackMetaClientEvent("InitiateCheckout", {
            eventId: deterministicEventId("initiatecheckout-package", data.orderId),
            userEmail: formData.email,
            userName: formData.name,
            userPhone: formData.phone,
            contentName: PACKAGE_NAME,
            contentType: "product",
            contentCategory: "package",
            contentIds: [PACKAGE_ID],
            numItems: 1,
            value,
            currency: "CLP",
            funnel: "package",
            entityType: "package_order",
            entityId: data.orderId,
            pixelParams: {
              content_name: PACKAGE_NAME,
              content_category: "package",
              content_ids: [PACKAGE_ID],
              currency: "CLP",
              value,
            },
          });
        }
      }

      if (data?.initPoint) {
        window.location.href = data.initPoint;
      } else {
        throw new Error("No se pudo crear el link de pago");
      }
    } catch (err: any) {
      console.error("Error purchasing package:", err);
      toast.error(err.message || "Error al procesar la compra");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Pack Post Taller · 6 Sesiones | Nave Studio</title>
        <meta
          name="description"
          content="Pack exclusivo para asistentes del Taller Wim Hof: 6 sesiones por $60.000, válidas 3 meses y compartibles."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-sky-50 via-background to-cyan-50">
        {/* Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-8 text-cyan-200 animate-pulse">
              <Snowflake className="w-8 h-8" />
            </div>
            <div
              className="absolute top-24 right-16 text-sky-200 animate-pulse"
              style={{ animationDelay: "0.6s" }}
            >
              <Snowflake className="w-12 h-12" />
            </div>
            <div
              className="absolute bottom-10 right-8 text-cyan-200 animate-pulse"
              style={{ animationDelay: "1.2s" }}
            >
              <Snowflake className="w-10 h-10" />
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Snowflake className="w-4 h-4" />
                <span>Exclusivo asistentes Taller Wim Hof · 23 de agosto</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Ya sentiste el frío.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-sky-600">
                  Ahora hazlo hábito.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
                Un pack que solo existe en esta página: 6 sesiones a{" "}
                <strong className="text-foreground">$10.000 cada una</strong>, para seguir el
                proceso que empezaste en el taller. Y si quieres, compártelas.
              </p>

              {/* Countdown timer */}
              <div className="mt-8 flex flex-col items-center gap-3">
                <div className="inline-flex items-center gap-2 text-rose-600 font-semibold text-sm uppercase tracking-wide">
                  <Timer className="w-4 h-4" />
                  {expired ? "La promo ha terminado" : "La promo termina en"}
                </div>
                {!expired && (
                  <div className="flex items-center gap-2 md:gap-3">
                    {[
                      { label: "Días", value: timeLeft.days },
                      { label: "Horas", value: timeLeft.hours },
                      { label: "Min", value: timeLeft.minutes },
                      { label: "Seg", value: timeLeft.seconds },
                    ].map((unit, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-center bg-card border border-rose-200 rounded-xl px-3 py-2 min-w-[64px] shadow-sm"
                      >
                        <span className="text-2xl md:text-3xl font-bold tabular-nums text-rose-600">
                          {String(unit.value).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                          {unit.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Pack + Form */}
        <section className="pb-12 md:pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
              {/* Pack card */}
              <div className="rounded-2xl border-2 border-cyan-500 bg-card p-6 md:p-8 shadow-xl ring-2 ring-cyan-200">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-xl text-primary-foreground">
                    <Snowflake className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">
                      6 Sesiones
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Criomedicina / Wim Hof y Yoga
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-50 to-sky-50 rounded-xl p-5 mb-5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-muted-foreground line-through text-lg">
                      ${REGULAR_PRICE.toLocaleString("es-CL")}
                    </span>
                    <span className="text-4xl font-bold text-cyan-600">
                      ${PRICE.toLocaleString("es-CL")}
                    </span>
                  </div>
                  <p className="text-green-600 font-medium text-sm mt-1">
                    ¡Ahorras ${SAVINGS.toLocaleString("es-CL")}! (67% OFF)
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${PER_SESSION.toLocaleString("es-CL")} por sesión
                  </p>
                </div>

                <ul className="space-y-3">
                  {[
                    "6 sesiones para usar cuando quieras",
                    "Válidas 3 meses desde la compra",
                    "Sirven para Criomedicina / Método Wim Hof y para Yoga",
                    "Compartibles: cada sesión llega como un código independiente",
                    "Reservas online en la agenda de Nave Studio",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                      <Check className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-start gap-3 bg-muted p-4 rounded-xl">
                  <Users className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    Recibirás <strong className="text-foreground">6 códigos</strong> a tu correo.
                    Puedes usarlos todos tú o regalarlos a quien quieras: pareja, amigos, familia.
                  </p>
                </div>
              </div>

              {/* Purchase form */}
              <Card id="comprar" className="border border-muted shadow-xl bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Gift className="w-5 h-5 text-cyan-500" />
                    Comprar el pack
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Recibirás tus 6 códigos de sesión en el email que indiques.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Tu nombre"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Celular</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+56 9 1234 5678"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    {/* Coupon */}
                    <div className="space-y-2">
                      <Label htmlFor="coupon">Código de descuento (opcional)</Label>
                      <div className="flex gap-2">
                        <Input
                          id="coupon"
                          value={couponCode}
                          onChange={(e) =>
                            setCouponCode(e.target.value.replace(/\s/g, "").toUpperCase())
                          }
                          placeholder="CUPON"
                          disabled={isLoading || !!appliedCoupon}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={validateCoupon}
                          disabled={isValidatingCoupon || isLoading || !!appliedCoupon}
                        >
                          {isValidatingCoupon ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : appliedCoupon ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            "Aplicar"
                          )}
                        </Button>
                      </div>
                      {couponError && (
                        <p className="text-sm text-destructive">{couponError}</p>
                      )}
                      {appliedCoupon && (
                        <p className="text-sm text-green-600">
                          Cupón {appliedCoupon.code} aplicado · Total $
                          {finalPrice.toLocaleString("es-CL")}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-primary-foreground font-semibold py-6 text-lg shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Snowflake className="w-5 h-5 mr-2" />
                          Comprar 6 Sesiones — ${finalPrice.toLocaleString("es-CL")}
                        </>
                      )}
                    </Button>

                    <div className="flex items-center gap-2 text-muted-foreground bg-muted p-3 rounded-lg">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">Válidas 3 meses desde la compra</span>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      Pago seguro con Mercado Pago
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Cómo seguir profundizando */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-cyan-50/40 to-sky-50/60">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-1.5 rounded-full text-xs font-medium mb-4">
                <ArrowRight className="w-3.5 h-3.5" />
                <span>El siguiente paso</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Cómo seguir profundizando
              </h2>
              <p className="text-muted-foreground">
                El taller encendió la chispa. Estas son tres formas de no dejarla apagar — cada
                una pensada para un nivel de compromiso distinto.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Pack 6 sesiones Wim Hof */}
              <a
                href="/bonos"
                className="group rounded-2xl border border-cyan-200 bg-card p-6 shadow-sm hover:shadow-lg hover:border-cyan-400 transition-all flex flex-col"
              >
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-xl text-primary-foreground w-fit mb-4">
                  <Snowflake className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">
                  Pack 6 sesiones Método Wim Hof
                </h3>
                <p className="text-sm text-muted-foreground flex-1">
                  El mismo pack que tienes arriba, pero para quienes todavía no asistieron al
                  taller. Seis sesiones guiadas a 3 °C, compartibles, con 3 meses de vigencia. La
                  forma más accesible de hacer del hielo un hábito real.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-cyan-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
                  Ver packs
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>

              {/* Retiro Guatemala */}
              <a
                href="https://guatemala.criomedicina.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-cyan-200 bg-card p-6 shadow-sm hover:shadow-lg hover:border-cyan-400 transition-all flex flex-col"
              >
                <div className="p-3 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-xl text-primary-foreground w-fit mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">
                  Retiro Criomedicina · Guatemala
                </h3>
                <p className="text-sm text-muted-foreground flex-1">
                  Lleva la inmersión al siguiente nivel: varios días de respiración, hielo y
                  naturaleza en un retiro presencial. Pensado para quienes ya probaron el frío y
                  quieren una transformación profunda, no una clase más.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-cyan-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
                  Conocer el retiro
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>

              {/* Comprar una Nave */}
              <a
                href="https://crionave.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-cyan-200 bg-card p-6 shadow-sm hover:shadow-lg hover:border-cyan-400 transition-all flex flex-col"
              >
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl text-primary-foreground w-fit mb-4">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">
                  Comprar una Nave
                </h3>
                <p className="text-sm text-muted-foreground flex-1">
                  ¿Y si pudieras hacer criomedicina en casa? Crionave es el baño de hielo
                  portátil que diseñamos para que el método no dependa de ir al estudio. Para los
                  que ya decidieron que el frío es parte de su vida.
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-cyan-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
                  Ver Crionave
                  <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 md:py-16 bg-card/60">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-3">
                El taller fue el inicio. El cambio está en la constancia.
              </h2>
              <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
                Seis sesiones en tres meses es el ritmo justo para que tu cuerpo aprenda a
                responder distinto al estrés.
              </p>

              <div className="grid sm:grid-cols-2 gap-5">
                {benefits.map((b) => (
                  <div
                    key={b.title}
                    className="flex items-start gap-4 p-5 rounded-2xl border border-muted bg-background"
                  >
                    <div className="p-2.5 rounded-xl bg-cyan-100 text-cyan-700 flex-shrink-0">
                      <b.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{b.title}</h3>
                      <p className="text-sm text-muted-foreground">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <Button
                  onClick={() =>
                    document.getElementById("comprar")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-primary-foreground font-semibold px-8 py-6 text-lg"
                >
                  Quiero mis 6 sesiones
                </Button>
              </div>
            </div>
          </div>
        </section>

        <ReviewsTrustBar />

        {/* Grupo Crionautas */}
        <section className="pt-12 md:pt-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 md:p-8 text-center">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-medium mb-4">
                <Users className="w-3.5 h-3.5" />
                <span>Comunidad</span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-3">
                Únanse al grupo de WhatsApp: los Crionautas
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Un grupo de solo gente que se ha metido al agua fría: avisos de sesiones,
                desafíos, dudas y mucha motivación para no soltar el hábito.
              </p>
              <Button
                asChild
                className="bg-emerald-600 hover:bg-emerald-700 text-primary-foreground font-semibold px-8 py-6 text-base"
              >
                <a
                  href="https://chat.whatsapp.com/HdTFY3RryAMA5e7GAleMHq?mode=gi_t"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Entrar al grupo de los Crionautas
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <PurchaseFAQ type="bonos" />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
