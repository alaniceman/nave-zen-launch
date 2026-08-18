import { useEffect } from "react";
import { trackConversion, type ConversionKey } from "@/lib/gtagConversions";
import { trackWhatsAppContact } from "@/lib/metaTracking";

/**
 * Global click delegation:
 * - WhatsApp links (wa.me / api.whatsapp.com) → whatsapp_click conversion (Google)
 *   + Meta Contact / whatsapp_click (nunca Lead ni InitiateCheckout)
 * - Buttons/links whose visible text contains "Suscribirme" → suscribirme_click conversion
 * - Links/buttons whose visible text starts with "Agendar" → agendar_clase_click conversion
 */
export function GtagClickTracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Explicit opt-in via attribute (most reliable, copy-independent)
      const explicit = target.closest("[data-gtag-conversion]") as HTMLElement | null;
      if (explicit) {
        const key = explicit.getAttribute("data-gtag-conversion") as ConversionKey | null;
        if (key) {
          trackConversion(key);
          return;
        }
      }

      const interactive = target.closest("a, button") as HTMLElement | null;
      if (!interactive) return;

      // WhatsApp links (href) or buttons that open WhatsApp programmatically
      const href = (interactive as HTMLAnchorElement).href || "";
      const aria = interactive.getAttribute("aria-label") || "";
      const describeLocation = () =>
        interactive.getAttribute("data-meta-location") ||
        aria ||
        (interactive.innerText || interactive.textContent || "").trim().slice(0, 60) ||
        "unknown";

      if (/wa\.me|api\.whatsapp\.com/i.test(href) || /whatsapp/i.test(aria)) {
        trackConversion("whatsapp_click");
        trackWhatsAppContact({ buttonLocation: describeLocation() });
        return;
      }


      const text = (interactive.innerText || interactive.textContent || "").trim();
      if (!text) return;

      if (/whatsapp/i.test(text)) {
        trackConversion("whatsapp_click");
        trackWhatsAppContact({ buttonLocation: describeLocation() });
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
