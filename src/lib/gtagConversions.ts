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
  whatsapp_click: `${GOOGLE_ADS_ID}/4AroCNXdjcYcEOOEtYpE`,
  suscribirme_click: `${GOOGLE_ADS_ID}/Q80SCN-OpcYcEOOEtYpE`,
  agendar_clase_click: `${GOOGLE_ADS_ID}/TODO_AGENDAR_CLICK`,
  contacto_form_submit: `${GOOGLE_ADS_ID}/TODO_CONTACTO_FORM`,
} as const;

export type ConversionKey = keyof typeof CONVERSIONS;

interface ConversionParams {
  value?: number;
  currency?: string;
  transaction_id?: string;
}

function isDebug() {
  if (typeof window === "undefined") return false;
  try {
    return (
      import.meta.env.DEV ||
      new URLSearchParams(window.location.search).has("gtag_debug") ||
      window.localStorage.getItem("gtag_debug") === "1"
    );
  } catch {
    return false;
  }
}

export function trackConversion(key: ConversionKey, params: ConversionParams = {}) {
  if (typeof window === "undefined") return;
  const debug = isDebug();

  if (typeof window.gtag !== "function") {
    if (debug) console.warn(`[gtag] "${key}" NO enviado: window.gtag no está disponible (¿bloqueador?).`);
    return;
  }

  // Always send a GA4 event so the action is measurable even if the
  // Google Ads label is not created yet.
  window.gtag("event", `nave_${key}`, {
    value: params.value ?? undefined,
    currency: params.currency ?? "CLP",
    transaction_id: params.transaction_id ?? undefined,
  });

  const send_to = CONVERSIONS[key];
  if (!send_to || send_to.includes("TODO_")) {
    if (debug) console.warn(`[gtag] "${key}": falta el label de Google Ads (send_to). Solo se envió el evento GA4.`);
    return;
  }

  window.gtag("event", "conversion", {
    send_to,
    value: params.value ?? 1.0,
    currency: params.currency ?? "CLP",
    transaction_id: params.transaction_id ?? "",
  });

  if (debug) console.info(`[gtag] conversion "${key}" enviada →`, send_to, params);
}

