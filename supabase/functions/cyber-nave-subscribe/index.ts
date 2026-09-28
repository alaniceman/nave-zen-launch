import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { sanitizePublicIp, sendMetaEvent } from "../_shared/metaCapi.ts";

const AUDIO_URL = "https://d.pr/a/XcczAM";
const CONSENT_VERSION = "cyber-nave-2026-09-v1";
const IP_LIMIT_PER_HOUR = 5;
const RESEND_COOLDOWN_MIN = 30;
const MAX_ATTEMPTS = 4;

const bodySchema = z.object({
  name: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.string().trim().toLowerCase().email().max(254),
  consent: z.literal(true),
  website: z.string().max(200).optional(), // honeypot
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
  fbp: z.string().max(200).optional(),
  fbc: z.string().max(300).optional(),
  eventSourceUrl: z.string().url().max(500).optional(),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function buildEmail(name: string | null) {
  const hello = name ? `Hola ${escapeHtml(name.split(" ")[0])},` : "Hola 👋";
  const pre = "Tu grabación musical de 7 minutos creada por Alan Earle ya está lista.";
  const html = `<!doctype html><html lang="es"><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1f2a24;line-height:1.7">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${pre}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#F6F1E7;border-radius:16px">
<tr><td style="padding:32px 28px">
<p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#2E4D3A">Nave Studio · Cyber</p>
<h1 style="margin:0 0 20px;font-size:24px;line-height:1.3;color:#2E4D3A">Tu música para volver al presente</h1>
<p style="margin:0 0 14px;font-size:16px">${hello}</p>
<p style="margin:0 0 14px;font-size:16px">Gracias por sumarte a las novedades del Cyber de Nave Studio. Como agradecimiento, te regalo una grabación musical personal de 7 minutos que creé para acompañar el antes, el durante y el después: la preparación, la inmersión en agua fría y la recuperación.</p>
<p style="margin:0 0 24px;font-size:16px">Es música, no una guía de respiración. Úsala como fondo para volver al presente.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px"><tr><td style="background:#2E4D3A;border-radius:10px">
<a href="${AUDIO_URL}" style="display:inline-block;padding:14px 28px;color:#ffffff;text-decoration:none;font-weight:bold;font-size:16px">Escuchar mi grabación</a>
</td></tr></table>
<div style="border-left:3px solid #2E4D3A;padding:4px 0 4px 14px;margin:0 0 24px;font-size:14px;color:#3a4a40">
<p style="margin:0 0 8px">Los 7 minutos corresponden a la experiencia completa, no al tiempo dentro del agua. Adapta la inmersión a tu experiencia y a la indicación de tu instructor.</p>
<p style="margin:0">No practiques hiperventilación ni retenciones de aire dentro del agua.</p>
</div>
<p style="margin:0;font-size:16px">Con cariño,<br><strong>Alan Earle</strong><br>Nave Studio</p>
</td></tr></table>
<p style="font-size:12px;color:#6b7280;margin:16px 0 0">Nave Studio · Antares 259, Las Condes, Santiago · <a href="https://studiolanave.com" style="color:#2E4D3A">studiolanave.com</a></p>
</td></tr></table></body></html>`;
  const text = `${name ? `Hola ${name.split(" ")[0]},` : "Hola,"}\n\nGracias por sumarte a las novedades del Cyber de Nave Studio. Te regalo una grabación musical personal de 7 minutos para acompañar la preparación, la inmersión en agua fría y la recuperación.\n\nEscuchar mi grabación: ${AUDIO_URL}\n\nLos 7 minutos corresponden a la experiencia completa, no al tiempo dentro del agua. Adapta la inmersión a tu experiencia y a la indicación de tu instructor.\nNo practiques hiperventilación ni retenciones de aire dentro del agua.\n\nAlan Earle\nNave Studio`;
  return { html, text };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let data: z.infer<typeof bodySchema>;
  try {
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) return json({ ok: false, error: "invalid_input" }, 400);
    data = parsed.data;
  } catch {
    return json({ ok: false, error: "invalid_input" }, 400);
  }

  // Honeypot: respuesta neutra, sin guardar ni enviar
  if (data.website) return json({ ok: true, status: "sent" });

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const rawIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip") || "";
  const ipHash = rawIp ? await sha256(`cyber-nave:${rawIp}`) : null;
  const name = data.name ? data.name.trim() || null : null;

  try {
    // Rate limit por IP (filas nuevas en la última hora)
    if (ipHash) {
      const since = new Date(Date.now() - 3600_000).toISOString();
      const { count } = await supabase.from("cyber_nave_subscribers")
        .select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
      if ((count ?? 0) >= IP_LIMIT_PER_HOUR) return json({ ok: false, error: "rate_limited" }, 429);
    }

    // Insert sin duplicar (email unique)
    const { data: inserted } = await supabase.from("cyber_nave_subscribers")
      .upsert({
        name, email: data.email, consent: true, consent_at: new Date().toISOString(),
        consent_version: CONSENT_VERSION, utm_source: data.utm_source ?? null,
        utm_medium: data.utm_medium ?? null, utm_campaign: data.utm_campaign ?? null, ip_hash: ipHash,
      }, { onConflict: "email", ignoreDuplicates: true })
      .select("id");
    const isNew = !!inserted && inserted.length > 0;

    const { data: sub, error: selErr } = await supabase.from("cyber_nave_subscribers")
      .select("*").eq("email", data.email).single();
    if (selErr || !sub) throw new Error("subscriber_not_found");

    const leadEventId = `cyber-lead-${sub.id}`;

    if (isNew) {
      sendMetaEvent({
        eventName: "Lead", eventId: leadEventId, eventSourceUrl: data.eventSourceUrl,
        funnel: "cyber-nave", entityType: "cyber_nave_subscriber", entityId: String(sub.id),
        user: {
          email: data.email, fullName: name ?? undefined, externalId: data.email, fbp: data.fbp, fbc: data.fbc,
          clientIpAddress: sanitizePublicIp(rawIp), clientUserAgent: req.headers.get("user-agent") ?? undefined,
        },
        custom: { contentName: "Cyber Nave · Regalo musical", contentCategory: "cyber" },
        supabase,
      }).catch((e: unknown) => console.error("[cyber-nave] meta", e));
    }

    // Reclamo atómico del envío
    const cutoff = new Date(Date.now() - RESEND_COOLDOWN_MIN * 60_000).toISOString();
    const staleSending = new Date(Date.now() - 5 * 60_000).toISOString();
    let claimQ = supabase.from("cyber_nave_subscribers")
      .update({ delivery_status: "sending", delivery_attempts: sub.delivery_attempts + 1, last_attempt_at: new Date().toISOString() })
      .eq("id", sub.id).eq("delivery_attempts", sub.delivery_attempts).lt("delivery_attempts", MAX_ATTEMPTS);
    if (sub.delivery_status === "pending" || sub.delivery_status === "failed") {
      claimQ = claimQ.in("delivery_status", ["pending", "failed"]);
    } else if (sub.delivery_status === "sent") {
      claimQ = claimQ.eq("delivery_status", "sent").lt("last_attempt_at", cutoff);
    } else {
      claimQ = claimQ.eq("delivery_status", "sending").lt("last_attempt_at", staleSending);
    }
    const { data: claimed } = await claimQ.select("id, delivery_attempts");

    if (!claimed || claimed.length === 0) {
      // Ya enviado recientemente o en curso: respuesta neutra, sin reenviar
      if (sub.delivery_status === "failed") return json({ ok: false, status: "delivery_failed", leadEventId }, 502);
      return json({ ok: true, status: "sent", leadEventId });
    }

    const RESEND = Deno.env.get("RESEND_API_KEY");
    if (!RESEND) throw new Error("resend_not_configured");
    const { html, text } = buildEmail(name ?? sub.name);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND}`, "Content-Type": "application/json",
        "Idempotency-Key": `cyber-nave-${sub.id}-${claimed[0].delivery_attempts}`,
      },
      body: JSON.stringify({
        from: "Nave Studio <agenda@studiolanave.com>", to: [data.email],
        subject: "Tu música para volver al presente · Nave Studio", html, text,
      }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body?.id) {
      console.error("[cyber-nave] resend", res.status, JSON.stringify(body));
      await supabase.from("cyber_nave_subscribers").update({
        delivery_status: "failed", delivery_error: `${res.status}: ${String(body?.message ?? "").slice(0, 300)}`,
      }).eq("id", sub.id).eq("delivery_status", "sending");
      return json({ ok: false, status: "delivery_failed", leadEventId }, 502);
    }
    await supabase.from("cyber_nave_subscribers").update({
      delivery_status: "sent", resend_email_id: body.id, delivery_error: null, sent_at: new Date().toISOString(),
    }).eq("id", sub.id);
    return json({ ok: true, status: "sent", leadEventId });
  } catch (e) {
    console.error("[cyber-nave] error", e);
    return json({ ok: false, error: "server_error" }, 500);
  }
});
