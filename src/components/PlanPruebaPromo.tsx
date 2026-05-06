import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Infinity, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import planPruebaHero from "@/assets/plan-prueba-hero.webp";

const PlanPruebaPromo = () => {
  return (
    <section className="py-12 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-card border border-primary/30 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[320px]">
              <img
                src={planPruebaHero}
                alt="Plan de Prueba — Yoga en Nave Studio"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="p-6 md:p-8 flex flex-col justify-center space-y-4">
              <Badge className="bg-primary text-primary-foreground px-3 py-1 w-fit">
                ✨ Plan de Prueba · 7 o 15 días
              </Badge>
              <h2 className="font-space text-2xl md:text-3xl font-bold text-primary">
                Plan de Prueba — desde $9.900
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Acceso ilimitado a Yoga, Breathwork, Criomedicina y Método Wim Hof.
                <strong> 7 días por $9.900</strong> o <strong>15 días por $19.900</strong>. Tú eliges cuándo empezar.
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-1">
                <div className="flex items-center gap-2">
                  <Infinity className="w-4 h-4 text-primary" />
                  <span>Acceso ilimitado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Inicio flexible</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Todas las disciplinas</span>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/plan-de-prueba">
                  <Button size="lg" className="w-full md:w-auto">
                    Ver planes de prueba
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { PlanPruebaPromo };
