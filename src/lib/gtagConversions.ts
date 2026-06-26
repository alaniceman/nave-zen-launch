// Centralized Google Ads conversion tracking helper.
// Each conversion needs its own send_to label from Google Ads (AW-XXX/LABEL).
// Replace TODO_* placeholders with the real labels once created in Google Ads.

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GOOGLE_ADS_ID = "AW-18275451491";

// Map of conversion event keys to their send_to labels.
// TODO: replace placeholder labels with the ones generated in Google Ads.
export const CONVERSIONS = {
  purchase_paquete: `${GOOGLE_ADS_ID}/HoB3CIumm8YcEOOEtYpE`, // Compra (provisto)
  lead_plan_prueba: `${GOOGLE_ADS_ID}/u-g1CJLfpMYcEOOEtYpE`,
  whatsapp_click: `${GOOGLE_ADS_ID}/TODO_WHATSAPP_CLICK`,
  suscribirme_click: `${GOOGLE_ADS_ID}/TODO_SUSCRIBIRME_CLICK`,
  agendar_clase_click: `${GOOGLE_ADS_ID}/TODO_AGENDAR_CLICK`,
  contacto_form_submit: `${GOOGLE_ADS_ID}/TODO_CONTACTO_FORM`,
} as const;

export type ConversionKey = keyof typeof CONVERSIONS;

interface ConversionParams {
  value?: number;
  currency?: string;
  transaction_id?: string;
}

export function trackConversion(key: ConversionKey, params: ConversionParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const send_to = CONVERSIONS[key];
  if (!send_to || send_to.includes("TODO_")) {
    // Label not configured yet — skip silently in production.
    if (import.meta.env.DEV) {
      console.info(`[gtag] Conversion "${key}" not configured yet (missing send_to label).`);
    }
    return;
  }
  window.gtag("event", "conversion", {
    send_to,
    value: params.value ?? 1.0,
    currency: params.currency ?? "CLP",
    transaction_id: params.transaction_id ?? "",
  });
}
