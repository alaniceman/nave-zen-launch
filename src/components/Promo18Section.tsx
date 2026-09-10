import { Link } from "react-router-dom";
import { Snowflake, ArrowRight, Clock } from "lucide-react";
import { isPromo18Active, PROMO_18_PATH, PROMO_18_PRICE, PROMO_18_REGULAR_PRICE } from "@/lib/promo18";
import heroImage from "@/assets/promo-18-hero.jpg";

export const Promo18Section = () => {
  if (!isPromo18Active()) return null;

  const discount = Math.round((1 - PROMO_18_PRICE / PROMO_18_REGULAR_PRICE) * 100);

  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <img
        src={heroImage}
        alt="Tina de agua fría con hielo y mat de yoga al atardecer en Santiago"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/75 to-primary/40" />

      <div className="relative container mx-auto px-6 py-10 md:py-16">
        <div className="max-w-xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium mb-4">
            <Snowflake className="w-3.5 h-3.5" />
            <span>Promo Fiestas Patrias · hasta el 30 de septiembre</span>
          </div>

          {/* Title */}
          <h2 className="font-space-grotesk text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            Bautizo de Hielo + Yoga
          </h2>

          {/* Description */}
          <p className="text-white/85 text-base md:text-lg mb-5 leading-relaxed">
            2 sesiones de Método Wim Hof y 4 clases de Yoga que puedes terminar en agua fría.
            Válidas 3 meses, compartibles con quien quieras.
          </p>

          {/* Price row */}
          <div className="flex items-baseline gap-3 mb-6">
            {discount > 0 && (
              <span className="text-white/50 line-through text-lg">
                ${PROMO_18_REGULAR_PRICE.toLocaleString("es-CL")}
              </span>
            )}
            <span className="text-4xl md:text-5xl font-bold text-white">
              ${PROMO_18_PRICE.toLocaleString("es-CL")}
            </span>
            <span className="text-white/70 text-sm">6 sesiones · $10.000 c/u</span>
          </div>

          {/* CTA */}
          <Link
            to={PROMO_18_PATH}
            className="inline-flex items-center gap-2 bg-white text-primary font-inter font-semibold px-7 py-3.5 rounded-xl hover:bg-white/90 transition-all duration-200 hover:scale-105"
          >
            Ver la promo
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Urgency note */}
          <p className="flex items-center gap-1.5 text-white/70 text-xs mt-4">
            <Clock className="w-3.5 h-3.5" />
            <span>Oferta válida solo durante septiembre</span>
          </p>
        </div>
      </div>
    </section>
  );
};
