import { useEffect } from "react";
import { trackConversion } from "@/lib/gtagConversions";

/**
 * Global click delegation:
 * - WhatsApp links (wa.me / api.whatsapp.com) → whatsapp_click conversion
 * - Buttons/links whose visible text contains "Suscribirme" → suscribirme_click conversion
 * - Links/buttons whose visible text starts with "Agendar" → agendar_clase_click conversion
 */
export function GtagClickTracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest("a, button") as HTMLElement | null;
      if (!interactive) return;

      // WhatsApp links
      const href = (interactive as HTMLAnchorElement).href || "";
      if (/wa\.me|api\.whatsapp\.com/i.test(href)) {
        trackConversion("whatsapp_click");
        return;
      }

      const text = (interactive.innerText || interactive.textContent || "").trim();
      if (!text) return;

      if (/suscribirme/i.test(text)) {
        trackConversion("suscribirme_click");
        return;
      }
      if (/^agendar\b/i.test(text)) {
        trackConversion("agendar_clase_click");
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);
  return null;
}
