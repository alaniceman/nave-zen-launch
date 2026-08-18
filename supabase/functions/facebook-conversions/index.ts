import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import {
  ALL_ALLOWED_EVENTS,
  CLIENT_ALLOWED_EVENTS,
  sanitizePublicIp,
  sendMetaEvent,
} from "../_shared/metaCapi.ts";

/**
 * Endpoint CAPI para eventos NO conversivos del navegador
 * (ViewContent, InitiateCheckout, Contact y customs de embudo).
 *
 * Las conversiones (Purchase, Lead, Schedule, ...) sólo se aceptan cuando el
 * llamador presenta el service role key, es decir cuando el evento se origina
 * en una función server-side que ya confirmó la acción.
 */

const ALLOWED_ORIGIN_SUFFIXES = [
  "studiolanave.com",
  "lovable.app",
  "lovableproject.com",
  "localhost",
  "127.0.0.1",
];

/** Sólo host exacto o subdominio real. Nunca prefijos (evita `localhost.evil.com`). */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname.toLowerCase();
    return ALLOWED_ORIGIN_SUFFIXES.some((s) => host === s || host.endsWith(`.${s}`));
  } catch {
    return false;
  }
}

/**
 * Rate limit best-effort en memoria por origen + hash no reversible de IP.
 * No persiste IP ni PII; sólo aplica a llamadas client-side.
 */
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_EVENTS = 60;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

async function rateLimitKey(origin: string | null, ip: string | null): Promise<string> {
  const raw = `${origin ?? "none"}|${ip ?? "none"}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(digest).slice(0, 8))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  if (rateBuckets.size > 5000) rateBuckets.clear(); // techo de memoria
  const bucket = rateBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX_EVENTS;
}

function corsFor(req: Request) {
  const origin = req.headers.get("origin");
  return {
    "Access-Control-Allow-Origin": isAllowedOrigin(origin) ? (origin as string) : "https://studiolanave.com",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

type RequestBody = {
  event_name?: string;
  event_id?: string;
  event_source_url?: string;
  event_time?: number;
  user_email?: string;
  user_phone?: string;
  user_name?: string;
  external_id?: string;
  value?: number;
  currency?: string;
  content_name?: string;
  content_type?: string;
  content_category?: string;
  content_ids?: string[];
  num_items?: number;
  order_id?: string;
  funnel?: string;
  entity_type?: string;
  entity_id?: string;
  fbc?: string;
  fbp?: string;
};

const isStr = (v: unknown) => typeof v === "string" && v.trim().length > 0;

serve(async (req) => {
  const corsHeaders = corsFor(req);
  const json = (body: unknown, status: number) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  try {
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const authHeader = req.headers.get("authorization") ?? "";
    const isServiceCall = serviceRoleKey.length > 0 && authHeader === `Bearer ${serviceRoleKey}`;

    const origin = req.headers.get("origin");
    const forwardedIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip");

    // Llamadas del navegador: Origin obligatorio y permitido (CORS no basta).
    if (!isServiceCall) {
      if (!isAllowedOrigin(origin)) {
        return json({ error: "origin_not_allowed" }, 403);
      }
      if (isRateLimited(await rateLimitKey(origin, forwardedIp))) {
        return json({ error: "rate_limited" }, 429);
      }
    }

    let body: RequestBody;
    try {
      body = await req.json();
    } catch {
      return json({ error: "invalid_json" }, 400);
    }

    // --- validación estricta de schema ---
    const errors: string[] = [];
    if (!isStr(body.event_name)) errors.push("event_name");
    if (!isStr(body.event_id)) errors.push("event_id");
    if (body.value !== undefined && (typeof body.value !== "number" || !Number.isFinite(body.value) || body.value < 0))
      errors.push("value");
    if (body.currency !== undefined && !isStr(body.currency)) errors.push("currency");
    if (body.content_ids !== undefined && (!Array.isArray(body.content_ids) || body.content_ids.some((c) => typeof c !== "string")))
      errors.push("content_ids");
    if (body.num_items !== undefined && (typeof body.num_items !== "number" || body.num_items <= 0)) errors.push("num_items");
    if (body.event_time !== undefined && (typeof body.event_time !== "number" || body.event_time <= 0)) errors.push("event_time");
    if (errors.length) return json({ error: "invalid_payload", fields: errors }, 400);

    const eventName = body.event_name as string;
    if (!ALL_ALLOWED_EVENTS.includes(eventName)) {
      return json({ error: "event_not_allowed", event_name: eventName }, 400);
    }
    if (!isServiceCall && !(CLIENT_ALLOWED_EVENTS as readonly string[]).includes(eventName)) {
      console.warn("Rejected client-originated conversion event:", eventName);
      return json({ error: "event_requires_server_origin", event_name: eventName }, 403);
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", serviceRoleKey);

    const result = await sendMetaEvent({
      eventName,
      eventId: body.event_id as string,
      eventSourceUrl: body.event_source_url,
      eventTime: body.event_time,
      funnel: body.funnel,
      entityType: body.entity_type,
      entityId: body.entity_id,
      user: {
        email: body.user_email,
        phone: body.user_phone,
        fullName: body.user_name,
        externalId: body.external_id,
        fbp: body.fbp,
        fbc: body.fbc,
        clientIpAddress: sanitizePublicIp(forwardedIp),
        clientUserAgent: req.headers.get("user-agent"),
      },
      custom: {
        value: body.value,
        currency: body.currency,
        contentName: body.content_name,
        contentType: body.content_type,
        contentCategory: body.content_category,
        contentIds: body.content_ids,
        numItems: body.num_items,
        orderId: body.order_id,
      },
      supabase,
    });

    if (!result.success) {
      return json(
        {
          success: false,
          error: result.errorCode ?? result.reason ?? "meta_error",
          message: result.errorMessage,
          trace_id: result.traceId,
        },
        502
      );
    }

    return json({ success: true, skipped: result.skipped ?? false, trace_id: result.traceId }, 200);
  } catch (error) {
    console.error("facebook-conversions unexpected error:", (error as Error).message);
    return json({ success: false, error: "unexpected_error" }, 500);
  }
});
