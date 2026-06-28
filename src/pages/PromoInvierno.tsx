import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Gift, Clock, Check, Loader2, Sparkles, Snowflake, Mountain, Wind, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import { toast } from "sonner";

const PACKAGE_ID = "577d13fc-590e-4e9f-a99e-18cc1e62e414";
const PRICE = 60000;

export default function PromoInvierno() {
  const { trackViewContent, trackInitiateCheckout } = useFacebookPixel();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    trackViewContent({
      content_name: "Promo Invierno - 6 Sesiones",
      content_type: "product",
      value: PRICE,
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
    setIsLoading(true);
    trackInitiateCheckout({
      content_name: "Promo Invierno - 6 Sesiones",
      content_type: "product",
      value: PRICE,
      currency: "CLP",
    });
    try {
      const { data, error } = await supabase.functions.invoke("purchase-session-package", {
        body: {
          packageId: PACKAGE_ID,
          buyerName: formData.name,
          buyerEmail: formData.email,
          buyerPhone: formData.phone,
          isGiftCard: true,
          promoType: "promo_invierno",
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
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error al procesar la compra");
      setIsLoading(false);
    }
  };

  const features = [
    "6 códigos de sesión transferibles",
    "Ice Bath, Método Wim Hof o Yoga · tú eliges",
    "Compártelos con quien quieras",
    "Válidos por 3 meses desde la compra",
    "Pago seguro · entrega inmediata",
  ];

  return (
    <>
      <Helmet>
        <title>Promo Invierno · 6 Sesiones en Nave Studio</title>
        <meta
          name="description"
          content="6 sesiones de Yoga o Criomedicina por $60.000 en Nave Studio. Está comprobado: 6 sesiones te ayudan a tolerar el frío el doble. El invierno deja de ser tema. Validez 3 meses."
        />
        <link rel="canonical" href="https://studiolanave.com/promo-invierno" />
        <meta property="og:title" content="Promo Invierno · 6 Sesiones en Nave Studio" />
        <meta property="og:description" content="6 sesiones de Yoga o Criomedicina por $60.000. Tolera el frío el doble. Validez 3 meses." />
        <meta property="og:type" content="product" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50">
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <Snowflake className="absolute top-12 left-8 w-10 h-10 text-sky-200" />
            <Snowflake className="absolute top-24 right-16 w-14 h-14 text-sky-200" />
            <Mountain className="absolute bottom-16 left-1/3 w-10 h-10 text-slate-200" />
            <Wind className="absolute bottom-24 right-12 w-10 h-10 text-slate-200" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Snowflake className="w-4 h-4" />
                <span>Promo Invierno · Edición limitada</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Tolera el frío{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-sky-600">
                  el doble
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-4 leading-relaxed">
                Está comprobado: <strong>6 sesiones</strong> de Ice Bath, Método Wim Hof
                o Yoga te ayudan a tolerar el frío el doble. El invierno ya no será tema nunca más.
              </p>
              <p className="text-base text-gray-500 italic">
                6 sesiones por $60.000 · vigencia 3 meses · puedes compartirlas.
              </p>
            </div>
          </div>
        </section>

        {/* Promo + Form */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="border-2 border-slate-200 shadow-xl bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-slate-800 to-sky-700 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Promo Invierno
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-br from-slate-800 to-sky-700 rounded-xl text-white">
                      <Snowflake className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl md:text-2xl text-gray-900">
                      6 Sesiones en Nave Studio
                    </CardTitle>
                  </div>
                  <p className="text-gray-600">Ice Bath, Método Wim Hof o Yoga · tú eliges</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-slate-50 to-sky-50 rounded-xl p-4">
                    <span className="text-3xl font-bold text-slate-800">
                      ${PRICE.toLocaleString("es-CL")}
                    </span>
                    <p className="text-gray-600 text-sm mt-1">Pago único · sin renovación</p>
                  </div>

                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="p-1 bg-slate-100 rounded-full mt-0.5">
                          <Check className="w-3 h-3 text-slate-700" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Válido por 3 meses desde la compra</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Flame className="w-5 h-5 text-slate-700" />
                    Súmate al invierno
                  </CardTitle>
                  <p className="text-gray-600 text-sm">
                    Recibirás los 6 códigos al email indicado para usar o compartir cuando quieras
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input id="name" name="name" type="text" placeholder="Tu nombre"
                        value={formData.name} onChange={handleInputChange} required disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="tu@email.com"
                        value={formData.email} onChange={handleInputChange} required disabled={isLoading} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Celular</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="+56 9 1234 5678"
                        value={formData.phone} onChange={handleInputChange} required disabled={isLoading} />
                    </div>

                    <Button type="submit" disabled={isLoading}
                      className="w-full bg-gradient-to-r from-slate-800 to-sky-700 hover:from-slate-900 hover:to-sky-800 text-white font-semibold py-6 text-lg shadow-lg">
                      {isLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Procesando...</>
                      ) : (
                        <><Gift className="w-5 h-5 mr-2" /> Quiero la promo de invierno</>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">Pago seguro con Mercado Pago</p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Beneficios */}
        <section className="py-16 bg-gradient-to-r from-slate-100 to-sky-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
              Por qué 6 sesiones funcionan
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Snowflake, title: "Adaptación real", text: "6 inmersiones entrenan al cuerpo a tolerar el frío el doble." },
                { icon: Wind, title: "Sistema nervioso", text: "Respiración Wim Hof regula estrés y mejora el sueño." },
                { icon: Mountain, title: "Energía estable", text: "Yoga + frío = más foco, mejor humor, menos fatiga invernal." },
                { icon: Sparkles, title: "El invierno cambia", text: "Dejas de sufrir el frío y empiezas a usarlo a tu favor." },
              ].map((b, i) => (
                <div key={i} className="bg-white rounded-xl p-6 text-center shadow-md">
                  <div className="inline-flex p-3 bg-gradient-to-br from-slate-800 to-sky-700 rounded-full text-white mb-4">
                    <b.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{b.title}</h3>
                  <p className="text-gray-600 text-sm">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
              Preguntas Frecuentes
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "¿Qué clases puedo tomar?",
                  a: "Las 6 sesiones son intercambiables entre Yoga (Vinyasa, Yin, Integral, Power) y Criomedicina / Método Wim Hof. Tú eliges cuándo y qué tomar.",
                },
                {
                  q: "¿Puedo compartir los códigos?",
                  a: "Sí. Cada sesión viene con un código transferible. Puedes usar las 6 tú o repartirlas con quien quieras.",
                },
                {
                  q: "¿Cuánto duran?",
                  a: "Los códigos son válidos por 3 meses desde la fecha de compra.",
                },
                {
                  q: "¿Cómo agendo las sesiones?",
                  a: "En studiolanave.com/agenda-nave-studio. Eliges servicio, fecha y hora, e ingresas el código al reservar.",
                },
                {
                  q: "Reglas de seguridad para Ice Bath",
                  a: "Para entrar al hielo después de yoga se requiere haber hecho una sesión guiada del Método Wim Hof previamente. Las clases de yoga incluyen máximo 2 minutos de inmersión.",
                },
              ].map((f, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-md border border-slate-100">
                  <h3 className="font-semibold text-gray-900 mb-2">{f.q}</h3>
                  <p className="text-gray-600">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
