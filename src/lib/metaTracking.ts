/**
 * Meta tracking de alto nivel (cliente).
 *
 * Pixel + CAPI comparten `event_id` para deduplicar.
 * Sólo eventos NO conversivos pueden originarse aquí: las conversiones
 * (Lead, Purchase, Schedule) se emiten server-side tras confirmar la acción.
 */
import { supabase } from "@/integrations/supabase/client";
import {
  MetaEventParams,
  getMetaBrowserContext,
  hasFired,
  markFired,
  randomEventId,
  trackMetaEvent,
} from "@/lib/metaPixel";

export type ClientMetaEvent =
  | "ViewContent"
  | "InitiateCheckout"
  | "Contact"
  | "Search"
  | "AddToCart"
  | "whatsapp_click"
  | "plan_trial_page_view"
  | "plan_trial_form_started"
  | "membership_form_started";

export type SendClientCapiInput = {
  eventName: ClientMetaEvent;
  eventId: string;
  userEmail?: string;
  userPhone?: string;
  userName?: string;
  value?: number;
  currency?: string;
  contentName?: string;
  contentType?: string;
  contentCategory?: string;
  contentIds?: string[];
  numItems?: number;
  funnel?: string;
  entityType?: string;
  entityId?: string;
};

/** Envía el evento a CAPI. Nunca lanza; los fallos de tracking no rompen la UI. */
export async function sendClientCapiEvent(input: SendClientCapiInput): Promise<void> {
  const ctx = getMetaBrowserContext();
  try {
    const { error } = await supabase.functions.invoke("facebook-conversions", {
      body: {
        event_name: input.eventName,
        event_id: input.eventId,
        event_source_url: ctx.eventSourceUrl,
        user_email: input.userEmail,
        user_phone: input.userPhone,
        user_name: input.userName,
        value: input.value,
        currency: input.currency || (input.value !== undefined ? "CLP" : undefined),
        content_name: input.contentName,
        content_type: input.contentType,
        content_category: input.contentCategory,
        content_ids: input.contentIds,
        num_items: input.numItems,
        funnel: input.funnel,
        entity_type: input.entityType,
        entity_id: input.entityId,
        fbp: ctx.fbp,
        fbc: ctx.fbc,
      },
    });
    if (error) console.warn("Meta CAPI event not delivered:", input.eventName);
  } catch {
    // silencio intencional: tracking nunca bloquea la UX
  }
}

/** Pixel + CAPI con el mismo event_id. */
export function trackMetaClientEvent(
  eventName: ClientMetaEvent,
  options: Omit<SendClientCapiInput, "eventName" | "eventId"> & {
    eventId?: string;
    pixelParams?: MetaEventParams;
  } = {}
): string {
  const { eventId = randomEventId(), pixelParams, ...capi } = options;
  trackMetaEvent(eventName, pixelParams, eventId);
  void sendClientCapiEvent({ eventName, eventId, ...capi });
  return eventId;
}

/** Igual que trackMetaClientEvent, pero como máximo una vez por `dedupeKey`. */
export function trackMetaClientEventOnce(
  dedupeKey: string,
  eventName: ClientMetaEvent,
  options: Parameters<typeof trackMetaClientEvent>[1] = {}
): string | undefined {
  if (hasFired(dedupeKey)) return undefined;
  markFired(dedupeKey);
  return trackMetaClientEvent(eventName, options);
}

/** ViewContent: una sola vez por página/contenido. */
export function trackViewContentOnce(
  contentName: string,
  options: { contentCategory?: string; value?: number; contentIds?: string[] } = {}
): void {
  trackMetaClientEventOnce(`viewcontent:${contentName}`, "ViewContent", {
    contentName,
    contentCategory: options.contentCategory,
    value: options.value,
    contentIds: options.contentIds,
    pixelParams: {
      content_name: contentName,
      content_category: options.contentCategory,
      content_ids: options.contentIds,
      value: options.value,
      currency: options.value !== undefined ? "CLP" : undefined,
    },
  });
}

/** Un clic en WhatsApp es Contact (+ custom para segmentar), nunca Lead. */
export function trackWhatsAppContact(params: {
  buttonLocation: string;
  contactType?: string;
}): void {
  const { buttonLocation, contactType = "whatsapp" } = params;
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const pixelParams: MetaEventParams = {
    content_name: "WhatsApp",
    page: path,
    button_location: buttonLocation,
    contact_type: contactType,
  };

  const eventId = randomEventId();
  trackMetaEvent("Contact", pixelParams, eventId);
  void sendClientCapiEvent({
    eventName: "Contact",
    eventId,
    contentName: "WhatsApp",
    contentCategory: "contact",
    funnel: "contact",
  });

  // custom sólo en Pixel, para segmentación de audiencias
  trackMetaEvent("whatsapp_click", pixelParams);
}
