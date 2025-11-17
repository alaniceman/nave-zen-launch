import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function AgendaSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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