import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackConversion } from "@/lib/gtagConversions";

const TiendaSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId =
    searchParams.get("external_reference") || searchParams.get("order") || "";

  useEffect(() => {
    trackConversion("purchase_paquete", {
      currency: "CLP",
      transaction_id: orderId,
    });
  }, [orderId]);

  return (
    <>
      <Helmet>
        <title>Compra confirmada | Nave Studio</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <main className="min-h-screen flex items-center justify-center px-4 py-24 bg-background">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-9 w-9 text-green-600" />
          </div>
          <h1 className="text-3xl font-space-grotesk font-bold text-primary">¡Compra confirmada!</h1>
          <p className="text-muted-foreground">
            Recibimos tu pago. Muestra esta pantalla o tu comprobante de Mercado Pago al equipo para retirar tu producto.
          </p>
          <Button asChild className="w-full"><Link to="/tienda">Volver a la tienda</Link></Button>
        </div>
      </main>
    </>
  );
};
export default TiendaSuccess;
