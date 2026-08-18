/**
 * Meta Conversions API (CAPI) — módulo server-side compartido.
 *
 * Reglas:
 * - Graph API v26.0.
 * - PII normalizada + SHA-256 (em, ph, fn, ln, external_id). fbp/fbc/IP/UA NO se hashean.
 * - event_id determinista + outbox (`meta_event_deliveries`) para idempotencia.
 * - event_time original se conserva en reintentos.
 * - Nunca se loguea PII ni el access token.
 */

const FACEBOOK_API_VERSION = "v26.0";
const GRAPH_URL = `https://graph.facebook.com/${FACEBOOK_API_VERSION}`;

export const ALLOWED_CURRENCIES = ["CLP", "USD", "EUR"] as const;

/** Eventos que el cliente puede pedir directamente (no son conversiones de negocio). */
export const CLIENT_ALLOWED_EVENTS = [
  "ViewContent",
  "InitiateCheckout",
  "Contact",
  "Search",
  "AddToCart",
  "whatsapp_click",
  "plan_trial_page_view",
  "plan_trial_form_started",
  "membership_form_started",
] as const;

/** Eventos que sólo pueden originarse server-side (tras confirmar la acción). */
export const SERVER_ONLY_EVENTS = [
  "Purchase",
  "Lead",
  "Schedule",
  "CompleteRegistration",
  "Subscribe",
  "StartTrial",
  "plan_trial_form_completed",
  "membership_form_completed",
] as const;

export const ALL_ALLOWED_EVENTS: string[] = [
  ...CLIENT_ALLOWED_EVENTS,
  ...SERVER_ONLY_EVENTS,
  "PageView",
];

export type MetaUserData = {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  /** nombre completo; se divide en fn/ln si no vienen por separado */
  fullName?: string | null;
  externalId?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  clientIpAddress?: string | null;
  clientUserAgent?: string | null;
};

export type MetaCustomData = {
  value?: number;
  currency?: string;
  contentName?: string;
  contentType?: string;
  contentCategory?: string;
  contentIds?: string[];
  numItems?: number;
  orderId?: string;
  extra?: Record<string, string | number | boolean>;
};

export type SendMetaEventInput = {
  eventName: string;
  /** determinista, p.ej. purchase-taller-<orderId> */
  eventId: string;
  eventSourceUrl?: string | null;
  /** segundos epoch; se conserva en reintentos */
  eventTime?: number;
  user?: MetaUserData;
  custom?: MetaCustomData;
  funnel?: string;
  entityType?: string;
  entityId?: string;
  /** cliente Supabase con service role, para el outbox */
  supabase?: {
    from: (t: string) => any;
  };
};

export type SendMetaEventResult = {
  success: boolean;
  skipped?: boolean;
  reason?: string;
  errorCode?: string;
  errorMessage?: string;
  traceId?: string;
  httpStatus?: number;
};

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const normalizeText = (v: string) => v.trim().toLowerCase();

/** Teléfono chileno -> E.164 sin '+' (formato que espera Meta: sólo dígitos con país). */
export function normalizeChileanPhone(raw: string): string | undefined {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("56")) return digits;
  // 9XXXXXXXX (móvil chileno) o 2XXXXXXXX (fijo)
  if (digits.length === 9) return `56${digits}`;
  if (digits.length === 8) return `569${digits}`;
  return digits;
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidHttpUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** IP pública válida (IPv4 o IPv6). Las privadas/loopback se descartan. */
export function sanitizePublicIp(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  const ip = raw.trim();
  const isIPv4 = /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
  const isIPv6 = ip.includes(":") && /^[0-9a-fA-F:.]+$/.test(ip);
  const privateV4 =
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip === "127.0.0.1" ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    ip.startsWith("169.254.");
  const lower = ip.toLowerCase();
  const privateV6 = ip === "::1" || lower.startsWith("fe80") || lower.startsWith("fc") || lower.startsWith("fd");
  if (isIPv4 && !privateV4) return ip;
  if (isIPv6 && !privateV6) return ip;
  return undefined;
}

async function buildUserData(user?: MetaUserData) {
  const out: Record<string, unknown> = {};
  if (!user) return out;

  if (user.email) {
    const email = normalizeText(user.email);
    if (isValidEmail(email)) out.em = [await sha256(email)];
  }

  if (user.phone) {
    const phone = normalizeChileanPhone(user.phone);
    if (phone && phone.length >= 8) out.ph = [await sha256(phone)];
  }

  let firstName = user.firstName?.trim() || undefined;
  let lastName = user.lastName?.trim() || undefined;
  if ((!firstName || !lastName) && user.fullName) {
    const parts = user.fullName.trim().split(/\s+/);
    firstName = firstName || parts[0];
    if (!lastName && parts.length > 1) lastName = parts.slice(1).join(" ");
  }
  if (firstName) out.fn = [await sha256(normalizeText(firstName))];
  if (lastName) out.ln = [await sha256(normalizeText(lastName))];

  if (user.externalId) out.external_id = [await sha256(normalizeText(user.externalId))];

  // NO hashear
  if (user.fbp) out.fbp = user.fbp;
  if (user.fbc) out.fbc = user.fbc;
  const ip = sanitizePublicIp(user.clientIpAddress);
  if (ip) out.client_ip_address = ip;
  if (user.clientUserAgent) out.client_user_agent = user.clientUserAgent;

  return out;
}

function buildCustomData(custom?: MetaCustomData) {
  if (!custom) return undefined;
  const out: Record<string, unknown> = {};
  if (typeof custom.value === "number" && Number.isFinite(custom.value) && custom.value >= 0) {
    out.value = Math.round(custom.value * 100) / 100;
    const currency = (custom.currency || "CLP").toUpperCase();
    out.currency = (ALLOWED_CURRENCIES as readonly string[]).includes(currency) ? currency : "CLP";
  }
  if (custom.contentName) out.content_name = custom.contentName;
  if (custom.contentType) out.content_type = custom.contentType;
  if (custom.contentCategory) out.content_category = custom.contentCategory;
  if (custom.contentIds?.length) out.content_ids = custom.contentIds;
  if (typeof custom.numItems === "number" && custom.numItems > 0) out.num_items = custom.numItems;
  if (custom.orderId) out.order_id = custom.orderId;
  if (custom.extra) Object.assign(out, custom.extra);
  return Object.keys(out).length ? out : undefined;
}

/**
 * Reserva el event_id en el outbox.
 * Devuelve `{ claimed:false }` si ya fue enviado (idempotencia) y el event_time original.
 */
async function claimDelivery(input: SendMetaEventInput, eventTime: number) {
  const supabase = input.supabase;
  if (!supabase) return { claimed: true, eventTime, rowId: null as string | null };

  try {
    const { data: existing } = await supabase
      .from("meta_event_deliveries")
      .select("id, status, attempts, event_time")
      .eq("event_name", input.eventName)
      .eq("event_id", input.eventId)
      .maybeSingle();


    if (existing) {
      if (existing.status === "sent") {
        return { claimed: false, eventTime, rowId: existing.id as string };
      }
      const original = existing.event_time ? Math.floor(new Date(existing.event_time).getTime() / 1000) : eventTime;
      await supabase
        .from("meta_event_deliveries")
        .update({ status: "pending", attempts: (existing.attempts ?? 0) + 1 })
        .eq("id", existing.id);
      return { claimed: true, eventTime: original, rowId: existing.id as string };
    }

    const { data: inserted, error } = await supabase
      .from("meta_event_deliveries")
      .insert({
        event_name: input.eventName,
        event_id: input.eventId,
        funnel: input.funnel ?? null,
        entity_type: input.entityType ?? null,
        entity_id: input.entityId ?? null,
        status: "pending",
        attempts: 1,
        event_time: new Date(eventTime * 1000).toISOString(),
      })
      .select("id")
      .maybeSingle();

    if (error) {
      // Carrera: otro proceso lo insertó primero
      console.log("meta outbox insert conflict, treating as duplicate:", input.eventId);
      return { claimed: false, eventTime, rowId: null as string | null };
    }
    return { claimed: true, eventTime, rowId: (inserted?.id as string) ?? null };
  } catch (e) {
    console.error("meta outbox claim failed (continuing):", (e as Error).message);
    return { claimed: true, eventTime, rowId: null as string | null };
  }
}

async function finishDelivery(
  supabase: SendMetaEventInput["supabase"],
  rowId: string | null,
  patch: Record<string, unknown>
) {
  if (!supabase || !rowId) return;
  try {
    await supabase.from("meta_event_deliveries").update(patch).eq("id", rowId);
  } catch (e) {
    console.error("meta outbox update failed:", (e as Error).message);
  }
}

const sanitizeError = (msg?: string) => (msg ? String(msg).slice(0, 300) : null);

/** Envía un evento a Meta CAPI con validación, hashing e idempotencia. */
export async function sendMetaEvent(input: SendMetaEventInput): Promise<SendMetaEventResult> {
  const PIXEL_ID = Deno.env.get("FACEBOOK_PIXEL_ID");
  const ACCESS_TOKEN = Deno.env.get("FACEBOOK_ACCESS_TOKEN");

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    console.error("Meta CAPI not configured");
    return { success: false, reason: "not_configured", errorCode: "not_configured" };
  }

  if (!input.eventName || !ALL_ALLOWED_EVENTS.includes(input.eventName)) {
    return { success: false, reason: "event_not_allowed", errorCode: "event_not_allowed" };
  }
  if (!input.eventId || input.eventId.length > 200) {
    return { success: false, reason: "invalid_event_id", errorCode: "invalid_event_id" };
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const requestedTime =
    typeof input.eventTime === "number" && input.eventTime > 0 ? Math.floor(input.eventTime) : nowSeconds;

  const claim = await claimDelivery(input, requestedTime);
  if (!claim.claimed) {
    console.log("Meta CAPI event already sent, skipping:", input.eventId);
    return { success: true, skipped: true, reason: "already_sent" };
  }

  const sourceUrl =
    input.eventSourceUrl && isValidHttpUrl(input.eventSourceUrl) ? input.eventSourceUrl : undefined;

  const event: Record<string, unknown> = {
    event_name: input.eventName,
    event_time: claim.eventTime,
    event_id: input.eventId,
    action_source: "website",
    user_data: await buildUserData(input.user),
  };
  if (sourceUrl) event.event_source_url = sourceUrl;
  const customData = buildCustomData(input.custom);
  if (customData) event.custom_data = customData;

  try {
    const res = await fetch(`${GRAPH_URL}/${PIXEL_ID}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: [event], access_token: ACCESS_TOKEN }),
    });
    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errCode = String(result?.error?.code ?? res.status);
      const errMsg = sanitizeError(result?.error?.message ?? "Meta rejected the event");
      console.error("Meta CAPI rejected event", input.eventName, input.eventId, errCode, errMsg);
      await finishDelivery(input.supabase, claim.rowId, {
        status: "failed",
        error_code: errCode,
        error_message: errMsg,
        meta_trace_id: result?.error?.fbtrace_id ?? null,
      });
      return {
        success: false,
        errorCode: errCode,
        errorMessage: errMsg ?? undefined,
        traceId: result?.error?.fbtrace_id,
        httpStatus: res.status,
      };
    }

    console.log("Meta CAPI event sent:", input.eventName, input.eventId);
    await finishDelivery(input.supabase, claim.rowId, {
      status: "sent",
      sent_at: new Date().toISOString(),
      error_code: null,
      error_message: null,
      meta_trace_id: result?.fbtrace_id ?? null,
    });
    return { success: true, traceId: result?.fbtrace_id, httpStatus: res.status };
  } catch (e) {
    const errMsg = sanitizeError((e as Error).message);
    console.error("Meta CAPI network error:", input.eventName, input.eventId, errMsg);
    await finishDelivery(input.supabase, claim.rowId, {
      status: "failed",
      error_code: "network_error",
      error_message: errMsg,
    });
    return { success: false, errorCode: "network_error", errorMessage: errMsg ?? undefined };
  }
}
