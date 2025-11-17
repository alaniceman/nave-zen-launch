import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function AgendaFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Pago Rechazado</h1>
        <p className="text-muted-foreground mb-6">
          No pudimos procesar tu pago. Por favor intenta nuevamente o usa otro método de pago.
        </p>
        <div className="space-y-2">
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