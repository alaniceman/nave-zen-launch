import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";

export default function BonosSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("external_reference");
  const { trackPurchase } = useFacebookPixel();
  const [hasFiredPixel, setHasFiredPixel] = useState(false);

  useEffect(() => {
    const fetchOrderAndTrack = async () => {
      if (!orderId || hasFiredPixel) return;

      const { data: order } = await supabase
        .from("package_orders")
        .select("final_price, status, session_packages(name)")
        .eq("id", orderId)
        .maybeSingle();

      if (order?.status === "paid") {
        trackPurchase({
          value: order.final_price,
          currency: "CLP",
          content_name: order.session_packages?.name || "Paquete de sesiones",
          content_type: "product",
          content_ids: [orderId],
        });
        setHasFiredPixel(true);
      }
    };

    fetchOrderAndTrack();
  }, [orderId, hasFiredPixel, trackPurchase]);

  return (
    <>
      <Helmet>
        <title>Compra Exitosa - Studio La Nave</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h1 className="text-4xl font-bold mb-4">¡Compra Exitosa!</h1>
          
          <div className="bg-muted/50 rounded-lg p-8 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Mail className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Revisa tu email</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Te hemos enviado un email con todos tus códigos de sesión.
            </p>
            <p className="text-sm text-muted-foreground">
              Guarda ese email para tener tus códigos siempre disponibles.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">¿Cómo usar tus códigos?</h3>
            <ol className="text-left space-y-3 max-w-md mx-auto">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <span className="text-sm text-muted-foreground">
                  Ve a la página de agenda y selecciona el profesional, fecha y hora
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <span className="text-sm text-muted-foreground">
                  Ingresa uno de tus códigos en el campo "¿Tienes un código de sesión?"
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <span className="text-sm text-muted-foreground">
                  ¡Listo! Tu sesión quedará confirmada sin costo adicional
                </span>
              </li>
            </ol>
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <Button onClick={() => navigate("/agenda-nave-studio")} size="lg">
              Agendar ahora
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" size="lg">
              Volver al inicio
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
