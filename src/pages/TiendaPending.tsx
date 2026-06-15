import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const TiendaPending = () => (
  <>
    <Helmet>
      <title>Pago pendiente | Nave Studio</title>
      <meta name="robots" content="noindex,nofollow" />
    </Helmet>
    <main className="min-h-screen flex items-center justify-center px-4 py-24 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <Clock className="h-9 w-9 text-amber-600" />
        </div>
        <h1 className="text-3xl font-space-grotesk font-bold text-primary">Pago pendiente</h1>
        <p className="text-muted-foreground">
          Tu pago quedó pendiente de confirmación. Te avisaremos por email apenas Mercado Pago lo confirme.
        </p>
        <Button asChild className="w-full"><Link to="/tienda">Volver a la tienda</Link></Button>
      </div>
    </main>
  </>
);
export default TiendaPending;
