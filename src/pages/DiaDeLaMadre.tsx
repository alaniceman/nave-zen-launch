import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Heart, Gift, Clock, Check, Loader2, Sparkles, Snowflake, Flower2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import { toast } from "sonner";

const DIA_MADRE_PACKAGE_ID = "438912c4-213d-43a9-b0e5-d952540f1ff9";
const PRICE = 45000;

export default function DiaDeLaMadre() {
  const { trackViewContent, trackInitiateCheckout } = useFacebookPixel();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    trackViewContent({
      content_name: "Promo Día de la Madre - 4 Sesiones",
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
      content_name: "Promo Día de la Madre - 4 Sesiones",
      content_type: "product",
      value: PRICE,
      currency: "CLP",
    });
    try {
      const { data, error } = await supabase.functions.invoke("purchase-session-package", {
        body: {
          packageId: DIA_MADRE_PACKAGE_ID,
          buyerName: formData.name,
          buyerEmail: formData.email,
          buyerPhone: formData.phone,
          isGiftCard: true,
          promoType: "dia_de_la_madre",
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
    "4 códigos de sesión transferibles",
    "Yoga o Criomedicina · ella elige",
    "Puede usarlas sola o compartirlas contigo",
    "Gift Card descargable en PDF",
    "Válido por 200 días desde la compra",
  ];

  return (
    <>
      <Helmet>
        <title>Día de la Madre · 4 Sesiones en Nave Studio</title>
        <meta
          name="description"
          content="Regálale a mamá un reset real: 4 sesiones de Yoga o Criomedicina en Nave Studio por $45.000. Puede usarlas sola o contigo. Validez 200 días."
        />
        <link rel="canonical" href="https://studiolanave.com/dia-de-la-madre" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50">
        {/* Hero */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <Flower2 className="absolute top-12 left-8 w-10 h-10 text-rose-200" />
            <Heart className="absolute top-24 right-16 w-12 h-12 text-rose-200 fill-current" />
            <Sparkles className="absolute bottom-16 left-1/3 w-8 h-8 text-amber-200" />
            <Flower2 className="absolute bottom-24 right-12 w-10 h-10 text-rose-200" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Heart className="w-4 h-4 fill-current" />
                <span>Día de la Madre · Edición limitada</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Mamá también necesita un{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">
                  reset
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-4 leading-relaxed">
                Este Día de la Madre regálale algo que realmente pueda sentir:
                un espacio para moverse, respirar profundo, soltar el estrés y volver a sí misma.
              </p>
              <p className="text-base text-gray-500 italic">
                Puede usar las 4 sesiones ella sola o compartirlas contigo.
              </p>
            </div>
          </div>
        </section>

        {/* Promo + Form */}
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card className="border-2 border-rose-200 shadow-xl bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-rose-500 to-amber-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Edición Día de la Madre
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-br from-rose-500 to-amber-500 rounded-xl text-white">
                      <Gift className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl md:text-2xl text-gray-900">
                      4 Sesiones en Nave Studio
                    </CardTitle>
                  </div>
                  <p className="text-gray-600">Yoga o Criomedicina · ella elige</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-xl p-4">
                    <span className="text-3xl font-bold text-rose-600">
                      ${PRICE.toLocaleString("es-CL")}
                    </span>
                    <p className="text-gray-600 text-sm mt-1">Pago único · sin renovación</p>
                  </div>

                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="p-1 bg-rose-100 rounded-full mt-0.5">
                          <Check className="w-3 h-3 text-rose-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Válido por 200 días desde la compra</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Heart className="w-5 h-5 text-rose-500 fill-current" />
                    Regálale bienestar
                  </CardTitle>
                  <p className="text-gray-600 text-sm">
                    Recibirás la Gift Card al email indicado para entregársela cuando quieras
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
                      className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold py-6 text-lg shadow-lg">
                      {isLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Procesando...</>
                      ) : (
                        <><Heart className="w-5 h-5 mr-2 fill-current" /> Quiero regalarle bienestar</>
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
        <section className="py-16 bg-gradient-to-r from-rose-100 to-amber-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
              Por qué este regalo importa
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Flower2, title: "Espacio para sí misma", text: "Una pausa real, lejos del ruido y las pantallas." },
                { icon: Heart, title: "Menos estrés", text: "Yoga y respiración consciente para regular el sistema nervioso." },
                { icon: Snowflake, title: "Más energía", text: "Criomedicina para activar el cuerpo y la mente." },
                { icon: Sparkles, title: "Algo que se siente", text: "Una experiencia, no una cosa más en la repisa." },
              ].map((b, i) => (
                <div key={i} className="bg-white rounded-xl p-6 text-center shadow-md">
                  <div className="inline-flex p-3 bg-gradient-to-br from-rose-500 to-amber-500 rounded-full text-white mb-4">
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
                  q: "¿Qué clases puede tomar?",
                  a: "Las 4 sesiones son intercambiables entre Yoga (Vinyasa, Yin, Integral, Power) y Criomedicina / Método Wim Hof. Ella elige cuándo y qué tomar.",
                },
                {
                  q: "¿Puede compartirlas conmigo?",
                  a: "¡Sí! Cada sesión viene con un código transferible. Puede usar las 4 sola o compartirlas contigo o con quien quiera.",
                },
                {
                  q: "¿Cuánto tiempo tienen validez?",
                  a: "Los códigos son válidos por 200 días desde la fecha de compra.",
                },
                {
                  q: "¿Cómo se entrega el regalo?",
                  a: "Recibirás un email con los códigos y un PDF con diseño de Gift Card descargable. Puedes imprimirlo o enviárselo digitalmente cuando quieras.",
                },
                {
                  q: "¿Cómo se agendan las sesiones?",
                  a: "En studiolanave.com/agenda-nave-studio. Se elige el servicio, fecha y hora, y se ingresa el código en el campo de cupón al reservar.",
                },
                {
                  q: "Reglas de seguridad para Ice Bath",
                  a: "Para entrar al hielo después de yoga se requiere haber hecho una sesión guiada del Método Wim Hof previamente. Las clases de yoga incluyen máximo 2 minutos de inmersión.",
                },
              ].map((f, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-md border border-rose-100">
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
