import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Snowflake, Wind, Users } from "lucide-react";
import { Link } from "react-router-dom";

const BautizoHieloPromo = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-card border border-primary/30 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <Badge className="bg-primary text-primary-foreground px-3 py-1">
                🧊 Promo bautizo · Solo, Dúo o Trío 🎁
              </Badge>
              <h2 className="font-space text-2xl md:text-3xl font-bold text-primary">
                Bautizo de Hielo · desde $15.000
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-md">
                Una sesión guiada de Criomedicina (Método Wim Hof).
                Vívela tú (<strong>$15.000</strong>), ven con alguien (<strong>Dúo $30.000</strong>)
                o con tus amigos (<strong>Trío $45.000</strong>). También se puede regalar.
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-primary" />
                  <span>Breathwork guiado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Snowflake className="w-4 h-4 text-primary" />
                  <span>Agua a 3°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Solo / Dúo / Trío</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <Link to="/bautizo-hielo">
                <Button size="lg" className="w-full md:w-auto">
                  Ver opciones
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { BautizoHieloPromo };
