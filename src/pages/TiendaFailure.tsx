import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const TiendaFailure = () => (
  <>
    <Helmet>
      <title>Pago no completado | Nave Studio</title>
      <meta name="robots" content="noindex,nofollow" />
    </Helmet>
    <main className="min-h-screen flex items-center justify-center px-4 py-24 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-9 w-9 text-red-600" />
        </div>
        <h1 className="text-3xl font-space-grotesk font-bold text-primary">Pago no completado</h1>
        <p className="text-muted-foreground">
          No pudimos procesar tu pago. Puedes intentarlo de nuevo o pedir ayuda al equipo en el local.
        </p>
        <Button asChild className="w-full"><Link to="/tienda">Volver a la tienda</Link></Button>
      </div>
    </main>
  </>
);
export default TiendaFailure;
