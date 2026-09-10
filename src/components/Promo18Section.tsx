import { Link } from "react-router-dom";
import { Snowflake, Flower2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isPromo18Active, PROMO_18_PATH, PROMO_18_PRICE } from "@/lib/promo18";
import heroImage from "@/assets/promo-18-hero.jpg";

export const Promo18Section = () => {
  if (!isPromo18Active()) return null;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-sky-50 to-cyan-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 items-center rounded-3xl bg-card border border-cyan-200 shadow-lg overflow-hidden">
          <img
            src={heroImage}
            alt="Tina de agua fría con hielo y mat de yoga al atardecer en Santiago"
            width={1600}
            height={912}
            loading="lazy"
            className="w-full h-56 md:h-full object-cover"
          />
          <div className="p-6 md:p-8">
            <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-3 py-1.5 rounded-full text-xs font-medium mb-4">
              <Snowflake className="w-3.5 h-3.5" />
              <span>Promo Fiestas Patrias · hasta el 30 de septiembre</span>
            </div>
            <h2 className="font-space-grotesk text-2xl md:text-3xl font-bold text-foreground mb-3">
              Bautizo de Hielo + Yoga
            </h2>
            <p className="text-muted-foreground mb-4">
              2 sesiones de Método Wim Hof y 4 clases de Yoga que puedes terminar en agua fría.
              Válidas 3 meses, compartibles con quien quieras.
            </p>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-cyan-600">
                ${PROMO_18_PRICE.toLocaleString("es-CL")}
              </span>
              <span className="text-sm text-muted-foreground">6 sesiones · $10.000 c/u</span>
            </div>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to={PROMO_18_PATH}>
                <Flower2 className="w-4 h-4 mr-2" />
                Ver la promo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
