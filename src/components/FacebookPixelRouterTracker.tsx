import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackMetaPageView } from "@/lib/metaPixel";

/**
 * Único emisor de PageView del sitio: exactamente uno por navegación SPA.
 */
export function FacebookPixelRouterTracker() {
  const location = useLocation();

  useEffect(() => {
    const navKey = `${location.key ?? "initial"}:${location.pathname}${location.search}`;
    const t = window.setTimeout(() => trackMetaPageView(navKey), 100);
    return () => window.clearTimeout(t);
  }, [location.key, location.pathname, location.search]);

  return null;
}

export default FacebookPixelRouterTracker;
