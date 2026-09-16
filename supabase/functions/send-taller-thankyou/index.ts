import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";
import {
  TALLERES,
  TALLER_ENCUESTA_URL,
  TALLER_WHATSAPP_GROUP_URL,
  type TallerKey,
} from "../_shared/talleres.ts";

const TIMEZONE = "America/Santiago";

function chileDateString(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(d);
}

function buildHtml(nombre: string, t: (typeof TALLERES)[TallerKey]) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:24px 12px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#F4F4F5;line-height:1.7">
  <div style="max-width:580px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden">
    <div style="background:#2E4D3A;padding:32px 28px;text-align:center;color:#ffffff">
      <h1 style="margin:0;font-size:22px;font-weight:600">Gracias por respirar conmigo</h1>
      <p style="margin:6px 0 0;font-size:14px;opacity:.85">Taller ${t.nombreCorto} · Método Wim Hof</p>
    </div>
    <div style="padding:28px">
      <h2 style="font-size:18px;color:#1A1A1A;margin:0 0 12px">Hola ${nombre} 👋</h2>
      <p style="color:#3F3F46;font-size:15px;margin:0 0 14px">Quiero agradecerte de verdad por haber estado ayer en el ${t.nombre}. Compartir la respiración, el hielo y ese silencio después no es algo menor, y me alegra mucho que hayas sido parte.</p>
      <p style="color:#3F3F46;font-size:15px;margin:0 0 18px">Si puedes responder la encuesta de satisfacción, te lo agradecería mucho. Las leo todas.</p>
      <p style="margin:0 0 22px"><a href="${TALLER_ENCUESTA_URL}" style="display:inline-block;background:#2E4D3A;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:600;font-size:15px">Responder la encuesta</a></p>
      <p style="color:#3F3F46;font-size:15px;margin:0 0 14px">Si aún no estás en el grupo de WhatsApp del taller, ahí compartimos las fotos y las novedades: <a href="${TALLER_WHATSAPP_GROUP_URL}" style="color:#2E4D3A">entrar al grupo</a>.</p>
      <p style="color:#3F3F46;font-size:15px;margin:0 0 4px">Un abrazo,</p>
      <p style="color:#3F3F46;font-size:15px;margin:0">Alan Earle · Nave Studio</p>
    </div>
    <div style="padding:20px 28px;text-align:center;background:#FAFAFA;color:#71717A;font-size:12px">Nave Studio · studiolanave.com</div>
  </div>
</body></html>`;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const jsonRes = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const body = await req.json().catch(() => ({} as any));
    const dryRun = body?.dryRun === true;

    // Protección: token interno guardado en base de datos (no en el código).
    const provided = req.headers.get("x-cron-token") ?? body?.cronToken ?? "";
    const { data: tokenRow } = await supabase
      .from("internal_cron_tokens")
      .select("token")
      .eq("name", "taller_thankyou")
      .maybeSingle();

    if (!tokenRow?.token || provided !== tokenRow.token) {
      return jsonRes({ error: "unauthorized" }, 401);
    }

    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not configured");

    // Fecha local en Chile: solo envía el día siguiente a cada taller.
    const today = typeof body?.dateOverride === "string" ? body.dateOverride : chileDateString(new Date());
    const keys = (Object.keys(TALLERES) as TallerKey[]).filter(
      (k) => TALLERES[k].thankYouDateISO === today,
    );

    if (keys.length === 0) {
      return jsonRes({ skipped: true, reason: "no_taller_yesterday", today });
    }

    const results: Array<Record<string, unknown>> = [];

    for (const key of keys) {
      const t = TALLERES[key];

      const { data: inscripciones, error: inscError } = await supabase
        .from("taller_inscripciones")
        .select("id, nombre, email, event_id, status, paid_at")
        .eq("event_id", t.eventId)
        .eq("status", "paid");

      if (inscError) throw inscError;

      for (const insc of inscripciones ?? []) {
        // Claim idempotente: una fila por inscripción.
        const { data: claimed } = await supabase
          .from("taller_thankyou_logs")
          .insert({
            inscripcion_id: insc.id,
            event_id: t.eventId,
            email: insc.email,
            status: "pending",
            attempts: 1,
          })
          .select("id, status")
          .maybeSingle();

        let logId = claimed?.id as string | undefined;

        if (!logId) {
          const { data: existing } = await supabase
            .from("taller_thankyou_logs")
            .select("id, status, attempts")
            .eq("inscripcion_id", insc.id)
            .maybeSingle();

          if (!existing || existing.status === "sent") {
            results.push({ email: insc.email, skipped: "already_sent" });
            continue;
          }
          // Reintento permitido solo si el envío anterior falló o quedó colgado.
          await supabase
            .from("taller_thankyou_logs")
            .update({ status: "pending", attempts: (existing.attempts ?? 0) + 1 })
            .eq("id", existing.id);
          logId = existing.id;
        }

        if (dryRun) {
          await supabase.from("taller_thankyou_logs").delete().eq("id", logId).eq("status", "pending");
          results.push({ email: insc.email, dryRun: true });
          continue;
        }

        try {
          // Resend: máximo 2 req/seg
          await new Promise((r) => setTimeout(r, 600));
          const r = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: "Nave Studio <agenda@studiolanave.com>",
              to: [insc.email],
              subject: `Gracias por el taller ${t.nombreCorto} · Nave Studio`,
              html: buildHtml((insc.nombre || "").trim() || "Aliada", t),
            }),
          });

          if (!r.ok) {
            const errTxt = await r.text();
            console.error(`Resend error (thankyou ${insc.email}) [${r.status}]:`, errTxt);
            await supabase
              .from("taller_thankyou_logs")
              .update({ status: "failed", error_message: errTxt.slice(0, 500) })
              .eq("id", logId);
            results.push({ email: insc.email, error: r.status });
            continue;
          }

          await supabase
            .from("taller_thankyou_logs")
            .update({ status: "sent", sent_at: new Date().toISOString(), error_message: null })
            .eq("id", logId);
          results.push({ email: insc.email, sent: true });
        } catch (err) {
          console.error("thankyou send failed:", err);
          await supabase
            .from("taller_thankyou_logs")
            .update({ status: "failed", error_message: String(err).slice(0, 500) })
            .eq("id", logId);
          results.push({ email: insc.email, error: String(err) });
        }
      }
    }

    return jsonRes({
      today,
      talleres: keys,
      sent: results.filter((r) => r.sent).length,
      skipped: results.filter((r) => r.skipped).length,
      errors: results.filter((r) => r.error).length,
      results,
    });
  } catch (err) {
    console.error("send-taller-thankyou error:", err);
    return jsonRes({ error: String(err) }, 500);
  }
});
