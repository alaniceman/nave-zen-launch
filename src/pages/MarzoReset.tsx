import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Snowflake, Zap, Gift, Clock, Check, Loader2, Brain, Heart, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PACKAGE_2_ID = "448c825b-575e-4e37-84b6-0dfea116ac3e";
const PACKAGE_3_ID = "c89ccd95-1aea-4e94-977e-0b48ea307ef8";

const packages = [
  {
    id: PACKAGE_2_ID,
    sessions: 2,
    price: 40000,
    originalPrice: 60000,
    perSession: 20000,
    savings: 20000,
    discount: "33%",
    popular: false,
  },
  {
    id: PACKAGE_3_ID,
    sessions: 3,
    price: 50000,
    originalPrice: 90000,
    perSession: 16667,
    savings: 40000,
    discount: "44%",
    popular: true,
  },
];

export default function MarzoReset() {
  const { trackViewContent, trackInitiateCheckout } = useFacebookPixel();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState(PACKAGE_3_ID);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    trackViewContent({
      content_name: "Promo Marzo Reset",
      content_type: "product",
      content_ids: [PACKAGE_2_ID, PACKAGE_3_ID],
      currency: "CLP",
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    const pkg = packages.find((p) => p.id === selectedPackage)!;
    setIsLoading(pkg.id);

    trackInitiateCheckout({
      content_name: `Marzo Reset - ${pkg.sessions} Sesiones`,
      content_type: "product",
      value: pkg.price,
      currency: "CLP",
    });

    try {
      const { data, error } = await supabase.functions.invoke("purchase-session-package", {
        body: {
          packageId: selectedPackage,
          buyerName: formData.name,
          buyerEmail: formData.email,
          buyerPhone: formData.phone,
          isGiftCard: true,
          promoType: "marzo_reset",
        },
      });

      if (error) throw new Error(error.message);

      if (data?.freeOrder) {
        window.location.href = `/giftcards/success?order=${data.orderId}`;
        return;
      }

      if (data?.initPoint) {
        window.location.href = data.initPoint;
      } else {
        throw new Error("No se pudo crear el link de pago");
      }
    } catch (error: any) {
      console.error("Error purchasing:", error);
      toast.error(error.message || "Error al procesar la compra");
      setIsLoading(null);
    }
  };

  const benefits = [
    { icon: Brain, text: "Reduce el estrés y la ansiedad", desc: "El agua fría activa el sistema nervioso parasimpático" },
    { icon: Zap, text: "Recarga tu energía", desc: "Libera dopamina y norepinefrina naturalmente" },
    { icon: ShieldCheck, text: "Fortalece tu sistema inmune", desc: "Aumenta la producción de glóbulos blancos" },
    { icon: Heart, text: "Mejora tu sueño", desc: "Regula el cortisol y mejora la calidad del descanso" },
  ];

  return (
    <>
      <Helmet>
        <title>Marzo Reset — Baja el estrés con Criomedicina | Nave Studio</title>
        <meta
          name="description"
          content="Promo Marzo Reset: 2 sesiones de Criomedicina desde $40.000 o 3 sesiones por $50.000. Baja el estrés de marzo con agua fría guiada y respiración Wim Hof."
        />
        <meta property="og:title" content="Marzo Reset — Criomedicina desde $40.000" />
        <meta property="og:description" content="Baja el estrés de marzo. 2 o 3 sesiones de Criomedicina / Método Wim Hof desde $40.000." />
        <link rel="canonical" href="https://nave-zen-launch.lovable.app/marzo-reset" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
        {/* Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 text-cyan-200 animate-pulse"><Snowflake className="w-8 h-8" /></div>
            <div className="absolute top-20 right-20 text-sky-200 animate-pulse" style={{ animationDelay: "0.5s" }}><Snowflake className="w-12 h-12" /></div>
            <div className="absolute bottom-20 left-1/4 text-cyan-200 animate-pulse" style={{ animationDelay: "1s" }}><Snowflake className="w-6 h-6" /></div>
            <div className="absolute bottom-10 right-10 text-sky-200 animate-pulse" style={{ animationDelay: "1.5s" }}><Snowflake className="w-10 h-10" /></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Snowflake className="w-4 h-4" />
                <span>Oferta Especial Marzo</span>
                <Snowflake className="w-4 h-4" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
                Marzo{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-sky-600">
                  Reset
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                Para bajar el estrés de marzo
              </p>

              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Sesiones de Criomedicina / Método Wim Hof desde <strong className="text-foreground">$20.000 por sesión</strong>. Respira, sumérgete y resetea tu cuerpo y mente.
              </p>
            </div>
          </div>
        </section>

        {/* Package Selection + Form */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Package Cards */}
              <div className="grid sm:grid-cols-2 gap-6 mb-10 max-w-3xl mx-auto">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={cn(
                      "relative text-left rounded-2xl border-2 p-6 transition-all duration-200",
                      selectedPackage === pkg.id
                        ? "border-cyan-500 bg-white shadow-xl ring-2 ring-cyan-200 scale-[1.02]"
                        : "border-muted bg-card hover:border-cyan-300 hover:shadow-md"
                    )}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-sky-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Más popular
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-xl text-white">
                        <Snowflake className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{pkg.sessions} Sesiones</h3>
                        <p className="text-sm text-muted-foreground">Criomedicina / Wim Hof</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-cyan-50 to-sky-50 rounded-xl p-4 mb-3">
                      <div className="flex items-baseline gap-3">
                        <span className="text-muted-foreground line-through text-base">
                          ${pkg.originalPrice.toLocaleString("es-CL")}
                        </span>
                        <span className="text-3xl font-bold text-cyan-600">
                          ${pkg.price.toLocaleString("es-CL")}
                        </span>
                      </div>
                      <p className="text-green-600 font-medium text-sm mt-1">
                        ¡Ahorra ${pkg.savings.toLocaleString("es-CL")}! ({pkg.discount} OFF)
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      ${Math.round(pkg.perSession).toLocaleString("es-CL")} por sesión · Válido 365 días
                    </p>

                    {/* Selection indicator */}
                    <div className={cn(
                      "absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      selectedPackage === pkg.id ? "border-cyan-500 bg-cyan-500" : "border-muted-foreground/30"
                    )}>
                      {selectedPackage === pkg.id && <Check className="w-4 h-4 text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Purchase Form */}
              <Card className="border border-muted shadow-xl bg-card max-w-lg mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Gift className="w-5 h-5 text-cyan-500" />
                    Comprar Marzo Reset
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Recibirás tus códigos de sesión y Gift Card descargable al email indicado
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input id="name" name="name" type="text" placeholder="Tu nombre" value={formData.name} onChange={handleInputChange} required disabled={!!isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="tu@email.com" value={formData.email} onChange={handleInputChange} required disabled={!!isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Celular</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+56 9 1234 5678" value={formData.phone} onChange={handleInputChange} required disabled={!!isLoading} />
                    </div>

                    <Button
                      type="submit"
                      disabled={!!isLoading}
                      className="w-full bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-600 hover:to-sky-700 text-white font-semibold py-6 text-lg shadow-lg"
                    >
                      {isLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin mr-2" />Procesando...</>
                      ) : (
                        <>
                          <Snowflake className="w-5 h-5 mr-2" />
                          Comprar {packages.find(p => p.id === selectedPackage)?.sessions} Sesiones — ${packages.find(p => p.id === selectedPackage)?.price.toLocaleString("es-CL")}
                        </>
                      )}
                    </Button>

                    <div className="flex items-center gap-2 text-muted-foreground bg-muted p-3 rounded-lg">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">Válido por 365 días desde la compra</span>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      Pago seguro con Mercado Pago · También funciona como Gift Card
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-gradient-to-r from-cyan-50 to-sky-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-4">
              ¿Por qué el frío baja el estrés?
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              La ciencia detrás de la inmersión en agua fría y la respiración Wim Hof
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-card rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
                  <div className="inline-flex p-3 bg-gradient-to-br from-cyan-500 to-sky-500 rounded-full text-white mb-4">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <p className="text-foreground font-semibold mb-1">{benefit.text}</p>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
              Preguntas Frecuentes
            </h2>

            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-md border border-cyan-100">
                <h3 className="font-semibold text-foreground mb-2">¿Cómo funciona?</h3>
                <p className="text-muted-foreground">
                  Al comprar, recibirás un email con tus códigos de sesión y un link para descargar tu Gift Card en PDF. Luego agenda tus sesiones en studiolanave.com/agenda-nave-studio ingresando tu código.
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-md border border-cyan-100">
                <h3 className="font-semibold text-foreground mb-2">¿Puedo regalar los códigos?</h3>
                <p className="text-muted-foreground">
                  ¡Sí! La Gift Card es descargable y puedes enviarla a quien quieras. Cada código es independiente y puede ser usado por personas distintas.
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-md border border-cyan-100">
                <h3 className="font-semibold text-foreground mb-2">¿Necesito experiencia previa?</h3>
                <p className="text-muted-foreground">
                  No. Todas las sesiones son guiadas por instructores certificados. Te acompañamos paso a paso en la respiración y la inmersión.
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 shadow-md border border-cyan-100">
                <h3 className="font-semibold text-foreground mb-2">¿Cuánto tiempo tengo para usarlos?</h3>
                <p className="text-muted-foreground">
                  Los códigos son válidos por 365 días desde la fecha de compra.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-cyan-600 to-sky-600 text-white">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Reseteá tu marzo ahora
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Desde $16.667 por sesión. La mejor inversión para tu bienestar.
            </p>
            <Button
              onClick={() => document.getElementById("name")?.focus()}
              size="lg"
              className="bg-white text-cyan-600 hover:bg-white/90 font-bold text-lg py-6 px-8 rounded-xl shadow-xl hover:scale-105 transition-all"
            >
              <Snowflake className="w-5 h-5 mr-2" />
              Comprar Marzo Reset
            </Button>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
