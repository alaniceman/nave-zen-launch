import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Snowflake,
  Flower2,
  Loader2,
  Check,
  Clock,
  Gift,
  Users,
  Brain,
  Zap,
  Heart,
  ShieldCheck,
  Timer,
  CalendarDays,
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
import {
  PROMO_18_END_DATE,
  PROMO_18_PACKAGE_ID,
  PROMO_18_NAME,
  PROMO_18_PRICE,
  PROMO_18_REGULAR_PRICE,
} from "@/lib/promo18";
import heroImage from "@/assets/promo-18-hero.jpg";

const SESSIONS = 6;
const PER_SESSION = PROMO_18_PRICE / SESSIONS;
const SAVINGS = PROMO_18_REGULAR_PRICE - PROMO_18_PRICE;

const benefits = [
  {
    icon: Brain,
    title: "Sistema nervioso en calma",
    desc: "Frío guiado + respiración: entrenas tu respuesta al estrés, no sólo tu resistencia.",
  },
  {
    icon: Zap,
    title: "Energía sin cafeína",
    desc: "Dopamina y norepinefrina que se sostienen por horas después de cada sesión.",
  },
  {
    icon: Heart,
    title: "Cuerpo suelto, mente clara",
    desc: "El yoga abre y el hielo cierra: la combinación deja el cuerpo liviano por días.",
  },
  {
    icon: ShieldCheck,
    title: "Siempre acompañado",
    desc: "Hielo a 3 °C con máximo 2 minutos, guiado por instructores certificados.",
  },
];

export default function Promo18Septiembre() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const [deadline] = useState(() => PROMO_18_END_DATE.getTime());
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    trackViewContentOnce(PROMO_18_NAME, { contentCategory: "package" });
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
    if (!appliedCoupon) return PROMO_18_PRICE;
    const discount =
      appliedCoupon.discount_type === "percentage"
        ? Math.floor(PROMO_18_PRICE * (appliedCoupon.discount_value / 100))
        : appliedCoupon.discount_value;
    return Math.max(0, PROMO_18_PRICE - discount);
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
          packageId: PROMO_18_PACKAGE_ID,
          purchaseAmount: PROMO_18_PRICE,
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
          packageId: PROMO_18_PACKAGE_ID,
          buyerName: formData.name,
          buyerEmail: formData.email,
          buyerPhone: formData.phone,
          couponCode: appliedCoupon?.code,
          isGiftCard: false,
          promoType: "promo_18_septiembre",
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
            contentName: PROMO_18_NAME,
            contentType: "product",
            contentCategory: "package",
            contentIds: [PROMO_18_PACKAGE_ID],
            numItems: 1,
            value,
            currency: "CLP",
            funnel: "package",
            entityType: "package_order",
            entityId: data.orderId,
            pixelParams: {
              content_name: PROMO_18_NAME,
              content_category: "package",
              content_ids: [PROMO_18_PACKAGE_ID],
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
        <title>Promo 18 de Septiembre: Bautizo de Hielo + Yoga | Nave Studio</title>
        <meta
          name="description"
          content="Promo Fiestas Patrias: 2 sesiones de Método Wim Hof + 4 clases de Yoga por $60.000. Válidas 3 meses y compartibles. Nave Studio, Las Condes."
        />
        <link rel="canonical" href="https://studiolanave.com/promo-18-septiembre" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Promo 18 de Septiembre: Bautizo de Hielo + Yoga" />
        <meta
          property="og:description"
          content="2 sesiones de Método Wim Hof + 4 clases de Yoga por $60.000. Válidas 3 meses."
        />
        <meta property="og:url" content="https://studiolanave.com/promo-18-septiembre" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-sky-50 via-background to-cyan-50">
        {/* Hero */}
        <section className="relative pt-24 pb-12 md:pt-28 md:pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <CalendarDays className="w-4 h-4" />
                  <span>Promo Fiestas Patrias · hasta el 30 de septiembre</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Bautizo de Hielo + Yoga{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-sky-600">
                    para este 18
                  </span>
                </h1>

                <p className="text-lg text-muted-foreground mb-6">
                  Seis sesiones para llegar (y salir) de las fiestas patrias con el cuerpo liviano:
                  <strong className="text-foreground"> 2 sesiones de Método Wim Hof</strong> y{" "}
                  <strong className="text-foreground">4 clases de Yoga</strong> que puedes terminar
                  en agua fría. Válidas 3 meses y compartibles.
                </p>

                <div className="flex flex-col items-start gap-3">
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
                      ].map((unit) => (
                        <div
                          key={unit.label}
                          className="flex flex-col items-center bg-card border border-rose-200 rounded-xl px-3 py-2 min-w-[62px] shadow-sm"
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

              <img
                src={heroImage}
                alt="Tina de agua fría con hielo y mat de yoga en una terraza al atardecer en Santiago"
                width={1600}
                height={912}
                className="rounded-2xl shadow-xl w-full h-auto object-cover"
              />
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
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">6 Sesiones</h2>
                    <p className="text-sm text-muted-foreground">
                      2 Método Wim Hof + 4 Yoga
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-50 to-sky-50 rounded-xl p-5 mb-5">
                  <div className="flex items-baseline gap-3">
                    <span className="text-muted-foreground line-through text-lg">
                      ${PROMO_18_REGULAR_PRICE.toLocaleString("es-CL")}
                    </span>
                    <span className="text-4xl font-bold text-cyan-600">
                      ${PROMO_18_PRICE.toLocaleString("es-CL")}
                    </span>
                  </div>
                  <p className="text-green-600 font-medium text-sm mt-1">
                    ¡Ahorras ${SAVINGS.toLocaleString("es-CL")}!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${PER_SESSION.toLocaleString("es-CL")} por sesión
                  </p>
                </div>

                <div className="space-y-3 mb-5">
                  <div className="flex items-start gap-3 rounded-xl bg-muted p-4">
                    <Snowflake className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">
                      <strong>2 códigos de Método Wim Hof</strong> — breathwork + ice bath a 3 °C,
                      tu bautizo de hielo guiado.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl bg-muted p-4">
                    <Flower2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">
                      <strong>4 códigos de Yoga</strong> — cualquier estilo de la agenda, con la
                      opción de cerrar en agua fría.
                    </p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {[
                    "Cada sesión llega como un código independiente",
                    "Válidas 3 meses desde la compra",
                    "Los códigos de Wim Hof y de Yoga vienen identificados por separado",
                    "Compartibles: úsalas tú o regálalas",
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
                    Recibirás <strong className="text-foreground">6 códigos</strong> a tu correo:
                    2 para hielo y 4 para yoga. Cada uno sirve para reservar una clase del tipo que
                    corresponde.
                  </p>
                </div>
              </div>

              {/* Purchase form */}
              <Card id="comprar" className="border border-muted shadow-xl bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Gift className="w-5 h-5 text-cyan-500" />
                    Comprar el pack 18
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
                      {couponError && <p className="text-sm text-destructive">{couponError}</p>}
                      {appliedCoupon && (
                        <p className="text-sm text-green-600">
                          Cupón {appliedCoupon.code} aplicado · Total $
                          {finalPrice.toLocaleString("es-CL")}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || expired}
                      className="w-full bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-primary-foreground font-semibold py-6 text-lg shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Procesando...
                        </>
                      ) : expired ? (
                        "Promo terminada"
                      ) : (
                        <>
                          <Snowflake className="w-5 h-5 mr-2" />
                          Comprar Pack 18 — ${finalPrice.toLocaleString("es-CL")}
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

        {/* Beneficios */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-cyan-50/40 to-sky-50/60">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
              Por qué hielo y yoga funcionan juntos
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((b) => (
                <div key={b.title} className="rounded-2xl border border-cyan-100 bg-card p-6">
                  <div className="p-3 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-xl text-primary-foreground w-fit mb-4">
                    <b.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ReviewsTrustBar />
        <PurchaseFAQ />
        <Footer />
      </main>
    </>
  );
}
