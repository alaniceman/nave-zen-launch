import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, Loader2, AlertCircle, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";

interface OrderStatus {
  orderId: string;
  status: string;
  statusType: "success" | "pending" | "error";
  statusMessage: string;
  packageName: string;
  sessionsQuantity: number;
  finalPrice: number;
}

export default function GiftCardsSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order");
  const isFree = searchParams.get("free") === "true";
  
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isFree) {
      setOrderStatus({
        orderId: "free",
        status: "paid",
        statusType: "success",
        statusMessage: "¡Compra completada! Revisa tu email para obtener tus códigos.",
        packageName: "Gift Card",
        sessionsQuantity: 0,
        finalPrice: 0,
      });
      setIsLoading(false);
      return;
    }

    if (!orderId) {
      setError("No se encontró información del pedido");
      setIsLoading(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-order-status", {
          body: null,
          headers: { "Content-Type": "application/json" },
        });

        // Use query params instead
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-order-status?orderId=${orderId}`,
          {
            headers: {
              "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener estado");
        }

        const status = await response.json();
        setOrderStatus(status);
      } catch (err: any) {
        console.error("Error fetching order status:", err);
        setError("Error al verificar el estado del pago");
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
    
    // Poll for status updates if pending
    const interval = setInterval(() => {
      if (orderStatus?.status === "created") {
        checkStatus();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, isFree, orderStatus?.status]);

  return (
    <>
      <Helmet>
        <title>Compra Exitosa - Gift Cards - Studio La Nave</title>
      </Helmet>

      <main className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          {isLoading ? (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground">Verificando pago...</p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
              <h1 className="text-2xl font-bold">Error</h1>
              <p className="text-muted-foreground">{error}</p>
              <Button asChild>
                <Link to="/giftcards">Volver a Gift Cards</Link>
              </Button>
            </div>
          ) : orderStatus?.statusType === "success" ? (
            <div className="space-y-4">
              <CheckCircle2 className="h-16 w-16 mx-auto text-green-600" />
              <h1 className="text-2xl font-bold text-green-600">¡Compra Exitosa!</h1>
              <p className="text-muted-foreground">{orderStatus.statusMessage}</p>
              {orderStatus.packageName && (
                <div className="bg-primary/10 rounded-lg p-4 mt-4">
                  <Gift className="h-6 w-6 mx-auto text-primary mb-2" />
                  <p className="font-semibold">{orderStatus.packageName}</p>
                </div>
              )}
              <Button asChild className="mt-6">
                <Link to="/">Volver al inicio</Link>
              </Button>
            </div>
          ) : orderStatus?.statusType === "pending" ? (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <h1 className="text-2xl font-bold">Procesando Pago</h1>
              <p className="text-muted-foreground">{orderStatus.statusMessage}</p>
              <p className="text-sm text-muted-foreground">
                Esta página se actualizará automáticamente...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
              <h1 className="text-2xl font-bold text-destructive">Pago No Completado</h1>
              <p className="text-muted-foreground">{orderStatus?.statusMessage}</p>
              <Button asChild>
                <Link to="/giftcards">Intentar nuevamente</Link>
              </Button>
            </div>
          )}
        </Card>
      </main>

      <Footer />
    </>
  );
}
