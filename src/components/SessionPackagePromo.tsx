import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SessionPackagePromo = () => {
  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="p-3 bg-primary/20 rounded-full">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground">
              ¿Vienes seguido? Ahorra con un Paquete
            </h2>
            <p className="text-sm text-muted-foreground">
              Compra sesiones por adelantado y obtén descuentos
            </p>
          </div>
        </div>
        <Link to="/bonos">
          <Button variant="outline" className="font-semibold whitespace-nowrap border-primary/30 hover:bg-primary/10">
            Ver Paquetes
          </Button>
        </Link>
      </div>
    </div>
  );
};
