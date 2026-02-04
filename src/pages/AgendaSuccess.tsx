import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Loader2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import { useFacebookConversionsAPI } from "@/hooks/useFacebookConversionsAPI";

type BookingStatus = "CONFIRMED" | "PENDING_PAYMENT" | "CANCELLED" | null;

interface BookingData {
  status: string;
  customer_email: string;
  customer_name: string;
  customer_phone: string;
  final_price: number | null;
  services: { name: string } | null;
}

export default function AgendaSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>(null);
  const [loading, setLoading] = useState(true);
  const [hasFiredPixel, setHasFiredPixel] = useState(false);
  const { trackPurchase } = useFacebookPixel();
  const { trackPurchase: trackServerPurchase } = useFacebookConversionsAPI();

  useEffect(() => {
    const checkBookingStatus = async () => {
      // Mercado Pago sends external_reference with booking ID
      const externalReference = searchParams.get("external_reference");

      if (externalReference) {
        const { data, error } = await supabase
          .from("bookings")
          .select("status, customer_email, customer_name, customer_phone, final_price, services(name)")
          .eq("id", externalReference)
          .maybeSingle();

        if (data) {
          setBookingStatus(data.status as BookingStatus);
          
          // Track purchase if confirmed and not already tracked
          if (data.status === "CONFIRMED" && !hasFiredPixel) {
            const bookingData = data as unknown as BookingData;
            const serviceName = bookingData.services?.name || "Sesión";
            const price = bookingData.final_price || 0;
            
            // Client-side pixel
            trackPurchase({
              value: price,
              currency: "CLP",
              content_name: serviceName,
              content_type: "product",
              content_ids: [externalReference],
            });
            
            // Server-side Conversions API
            trackServerPurchase({
              userEmail: bookingData.customer_email,
              userName: bookingData.customer_name,
              userPhone: bookingData.customer_phone || undefined,
              value: price,
              currency: "CLP",
              contentName: serviceName,
              orderId: externalReference,
            });
            
            setHasFiredPixel(true);
          }
        } else {
          // If no booking found, assume pending (could be processing)
          setBookingStatus("PENDING_PAYMENT");
        }
      } else {
        // No external_reference, show pending state
        setBookingStatus("PENDING_PAYMENT");
      }
      setLoading(false);
    };

    checkBookingStatus();
  }, [searchParams, hasFiredPixel, trackPurchase, trackServerPurchase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-bold mb-2">Verificando tu pago...</h1>
          <p className="text-muted-foreground">
            Por favor espera mientras confirmamos el estado de tu reserva.
          </p>
        </Card>
      </div>
    );
  }

  // Payment was rejected/cancelled
  if (bookingStatus === "CANCELLED") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Pago Rechazado</h1>
          <p className="text-muted-foreground mb-6">
            Lamentablemente tu pago no pudo ser procesado. Por favor intenta nuevamente con otro medio de pago.
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate("/agenda-nave-studio")} className="w-full">
              Intentar nuevamente
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">
              Volver al inicio
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Payment is pending (bank transfer, etc.)
  if (bookingStatus === "PENDING_PAYMENT") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Pago en Proceso</h1>
          <p className="text-muted-foreground mb-6">
            Tu pago está siendo procesado. Recibirás un email de confirmación una vez que se complete.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Si pagaste con transferencia bancaria, puede tomar hasta 24 horas en confirmarse.
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            Volver al inicio
          </Button>
        </Card>
      </div>
    );
  }

  // Payment confirmed
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">¡Reserva Confirmada!</h1>
        <p className="text-muted-foreground mb-6">
          Tu pago se ha procesado correctamente. Recibirás un email de confirmación con todos los detalles de tu sesión.
        </p>
        <div className="space-y-2 text-sm text-muted-foreground mb-6">
          <p>Recuerda traer:</p>
          <ul className="list-disc list-inside">
            <li>Traje de baño</li>
            <li>Toalla grande</li>
            <li>Bolsa para ropa mojada</li>
          </ul>
          <p className="mt-4">Por favor llega puntual y en ayunas ligeras.</p>
        </div>
        <Button onClick={() => navigate("/")} className="w-full">
          Volver al inicio
        </Button>
      </Card>
    </div>
  );
}
