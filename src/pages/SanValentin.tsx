import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Heart, Snowflake, Gift, Clock, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import { useEffect } from "react";
import { toast } from "sonner";

const SAN_VALENTIN_PACKAGE_ID = "9c870d12-f9cc-40c4-968b-fbbe3d0fc4ca";
const ORIGINAL_PRICE = 60000;
const PROMO_PRICE = 40000;
const SAVINGS = ORIGINAL_PRICE - PROMO_PRICE;

export default function SanValentin() {
  const { trackViewContent, trackInitiateCheckout } = useFacebookPixel();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    trackViewContent({
      content_name: "Promo San Valentín - 2 Sesiones",
      content_type: "product",
      value: PROMO_PRICE,
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
      content_name: "Promo San Valentín - 2 Sesiones",
      content_type: "product",
      value: PROMO_PRICE,
      currency: "CLP",
    });

    try {
      const { data, error } = await supabase.functions.invoke(
        "purchase-session-package",
        {
          body: {
            packageId: SAN_VALENTIN_PACKAGE_ID,
            buyerName: formData.name,
            buyerEmail: formData.email,
            buyerPhone: formData.phone,
            isGiftCard: true,
            promoType: "san_valentin",
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

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
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: Snowflake, text: "Fortalece el sistema inmune" },
    { icon: Heart, text: "Reduce el estrés y la ansiedad" },
    { icon: Snowflake, text: "Mejora la circulación sanguínea" },
    { icon: Heart, text: "Experiencia para compartir en pareja" },
  ];

  const features = [
    "2 códigos de sesión para usar cuando quieran",
    "Válido por 6 meses",
    "Gift Card descargable con diseño San Valentín",
    "Agenda online fácil y rápida",
  ];

  return (
    <>
      <Helmet>
        <title>San Valentín 2025 - 2 Sesiones Criomedicina | Studio La Nave</title>
        <meta
          name="description"
          content="Regala una experiencia transformadora este San Valentín. 2 sesiones de Criomedicina / Método Wim Hof por solo $40.000 (antes $60.000). Gift Card digital incluida."
        />
        <meta property="og:title" content="San Valentín 2025 - Promo Criomedicina" />
        <meta
          property="og:description"
          content="2 sesiones de Criomedicina / Método Wim Hof por $40.000. Ahorra $20.000 y regala bienestar."
        />
        <link rel="canonical" href="https://studiolanave.com/san-valentin" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-rose-50">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 text-pink-200 animate-pulse">
              <Heart className="w-8 h-8 fill-current" />
            </div>
            <div className="absolute top-20 right-20 text-rose-200 animate-pulse delay-300">
              <Heart className="w-12 h-12 fill-current" />
            </div>
            <div className="absolute bottom-20 left-1/4 text-pink-200 animate-pulse delay-500">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div className="absolute top-1/3 right-10 text-rose-200 animate-pulse delay-700">
              <Heart className="w-10 h-10 fill-current" />
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Heart className="w-4 h-4 fill-current" />
                <span>Oferta Especial San Valentín</span>
                <Heart className="w-4 h-4 fill-current" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Regala una experiencia{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">
                  transformadora
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8">
                2 sesiones de Criomedicina / Método Wim Hof para compartir en
                pareja o regalar a alguien especial
              </p>
            </div>
          </div>
        </section>

        {/* Promo Card + Form Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Promo Card */}
              <Card className="border-2 border-pink-200 shadow-xl bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-rose-500 to-pink-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  -33% OFF
                </div>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl text-white">
                      <Snowflake className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl md:text-2xl text-gray-900">
                      2 Sesiones Criomedicina
                    </CardTitle>
                  </div>
                  <p className="text-gray-600">Método Wim Hof / Ice Bath</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Pricing */}
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4">
                    <div className="flex items-baseline gap-3">
                      <span className="text-gray-400 line-through text-lg">
                        ${ORIGINAL_PRICE.toLocaleString("es-CL")}
                      </span>
                      <span className="text-3xl font-bold text-rose-600">
                        ${PROMO_PRICE.toLocaleString("es-CL")}
                      </span>
                    </div>
                    <p className="text-green-600 font-medium mt-1">
                      ¡Ahorra ${SAVINGS.toLocaleString("es-CL")}!
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="p-1 bg-pink-100 rounded-full mt-0.5">
                          <Check className="w-3 h-3 text-pink-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Validity */}
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Válido por 6 meses desde la compra</span>
                  </div>
                </CardContent>
              </Card>

              {/* Purchase Form */}
              <Card className="border border-gray-200 shadow-xl bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Gift className="w-5 h-5 text-pink-500" />
                    Comprar Gift Card
                  </CardTitle>
                  <p className="text-gray-600 text-sm">
                    Recibirás la Gift Card al email indicado
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

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold py-6 text-lg shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Heart className="w-5 h-5 mr-2 fill-current" />
                          Comprar Gift Card - $40.000
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      Pago seguro con Mercado Pago
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gradient-to-r from-pink-100 to-rose-100">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
              Beneficios de la Criomedicina
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="inline-flex p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full text-white mb-4">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <p className="text-gray-700 font-medium">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
              Preguntas Frecuentes
            </h2>

            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-md border border-pink-100">
                <h3 className="font-semibold text-gray-900 mb-2">
                  ¿Cómo funciona la Gift Card?
                </h3>
                <p className="text-gray-600">
                  Al comprar, recibirás un email con 2 códigos de sesión y un link
                  para descargar tu Gift Card en PDF con diseño especial de San
                  Valentín. Puedes imprimir la Gift Card o enviarla digitalmente.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-pink-100">
                <h3 className="font-semibold text-gray-900 mb-2">
                  ¿Cómo agendo mis sesiones?
                </h3>
                <p className="text-gray-600">
                  Ingresa a studiolanave.com/agenda-nave-studio, elige el
                  profesional, fecha y hora, e ingresa uno de tus códigos en el
                  formulario de reserva. ¡Listo!
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-pink-100">
                <h3 className="font-semibold text-gray-900 mb-2">
                  ¿Puedo usar los códigos en distintas fechas?
                </h3>
                <p className="text-gray-600">
                  ¡Sí! Cada código es independiente. Pueden usarse en la misma
                  fecha para ir en pareja, o en fechas distintas según les
                  acomode.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-pink-100">
                <h3 className="font-semibold text-gray-900 mb-2">
                  ¿Cuánto tiempo tengo para usar los códigos?
                </h3>
                <p className="text-gray-600">
                  Los códigos son válidos por 6 meses desde la fecha de compra.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
