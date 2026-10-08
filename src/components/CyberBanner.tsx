import { Link, useLocation } from "react-router-dom";
import { Zap, ArrowRight } from "lucide-react";
import { CYBER_ENDS_AT, CYBER_ROUTES } from "@/lib/cyberNave";
import { PROMO_18_BANNER_HEIGHT, usePromo18Banner } from "@/lib/promo18";

/** Altura de la franja roja del Cyber. */
export const CYBER_BANNER_HEIGHT = 34;

/** Muestra la franja sólo mientras la campaña está vigente, fuera del admin y de las páginas Cyber. */
export function useCyberBanner(): boolean {
  const { pathname } = useLocation();
  if (Date.now() >= CYBER_ENDS_AT) return false;
  if (pathname.startsWith("/admin")) return false;
  if (pathname.startsWith(CYBER_ROUTES.home)) return false;
  return true;
};

/** Espaciador para compensar la altura de la franja roja del Cyber. */
export const CyberBannerOffset = () => {
  const show = useCyberBanner();
  if (!show) return null;
  return <div style={{ height: CYBER_BANNER_HEIGHT }} aria-hidden="true" />;
};

export const CyberBanner = () => {
  const show = useCyberBanner();
  const showPromo18 = usePromo18Banner();
  if (!show) return null;

  return (
    <Link
      to={CYBER_ROUTES.home}
      style={{ top: showPromo18 ? PROMO_18_BANNER_HEIGHT : 0, height: CYBER_BANNER_HEIGHT }}
      className="fixed left-0 right-0 z-[60] flex items-center justify-center gap-2 bg-cyber px-3 text-cyber-foreground hover:opacity-95 transition-opacity"
    >
      <Zap className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
      <span className="truncate text-[11px] sm:text-sm font-semibold tracking-wide">
        CYBER NAVE STUDIO · Packs desde $15.000 y 50% para nuevos · Termina mañana 23:59
      </span>
      <ArrowRight className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
    </Link>
  );
};
