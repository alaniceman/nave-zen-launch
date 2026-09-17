import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
export const SessionPackagePromo = () => {
  return <div className="mb-6 px-4 py-3 bg-gradient-to-r from-primary/8 to-accent/8 rounded-xl border border-primary/15">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-primary/15 rounded-lg shrink-0">
            <Package className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-foreground leading-snug">¿Vienes seguido? Ahorra con un paquete</h2>
            <p className="text-xs text-muted-foreground leading-snug">Compra sesiones por adelantado y compártelas.</p>
          </div>
        </div>
        <Link to="/bonos" className="shrink-0">
          <Button variant="outline" size="sm" className="font-semibold whitespace-nowrap border-primary/30 hover:bg-primary/10">
            Ver
          </Button>
        </Link>
      </div>
    </div>;
};