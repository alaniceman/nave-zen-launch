import { Link } from "react-router-dom";
import { Snowflake, ArrowRight } from "lucide-react";
import { PROMO_18_BANNER_HEIGHT, PROMO_18_PATH, usePromo18Banner } from "@/lib/promo18";

/** Espaciador para compensar la altura de la barra superior de la promo. */
export const Promo18Offset = () => {
  const show = usePromo18Banner();
  if (!show) return null;
  return <div style={{ height: PROMO_18_BANNER_HEIGHT }} aria-hidden="true" />;
};

export const Promo18Banner = () => {
  const show = usePromo18Banner();
  if (!show) return null;

  return (
    <Link
      to={PROMO_18_PATH}
      className="fixed top-0 left-0 right-0 z-[60] h-9 flex items-center justify-center gap-2 px-3 bg-gradient-to-r from-primary via-primary to-secondary text-primary-foreground text-[11px] sm:text-sm font-medium hover:opacity-95 transition-opacity"
    >
      <Snowflake className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
      <span className="truncate">
        Promo 18 de Septiembre: Bautizo de Hielo + Yoga · 6 sesiones $60.000
      </span>
      <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
    </Link>
  );
};
