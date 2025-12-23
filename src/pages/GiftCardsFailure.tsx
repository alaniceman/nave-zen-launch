import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/Footer";

export default function GiftCardsFailure() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setStatusMessage("El pago no pudo ser procesado.");
      setIsLoading(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-order-status?orderId=${orderId}`,
          {
            headers: {
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setStatusMessage(data.statusMessage || "El pago no pudo ser procesado.");
        } else {
          setStatusMessage("El pago no pudo ser procesado.");
        }
      } catch {
        setStatusMessage("El pago no pudo ser procesado.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, [orderId]);

  return (
    <>
      <Helmet>
        <title>Pago Fallido - Gift Cards - Studio La Nave</title>
      </Helmet>

      <main className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          {isLoading ? (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Cargando información...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <XCircle className="h-16 w-16 mx-auto text-destructive" />
              <h1 className="text-2xl font-bold text-destructive">Pago No Completado</h1>
              <p className="text-muted-foreground">{statusMessage}</p>
              <div className="space-y-2 pt-4">
                <Button asChild className="w-full">
                  <Link to="/giftcards">Intentar nuevamente</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/">Volver al inicio</Link>
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>

      <Footer />
    </>
  );
}
