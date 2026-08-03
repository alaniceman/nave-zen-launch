import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";

const AGENDA_URL = "https://studiolanave.com/agenda-nave-studio";
const PROMO_URL = "https://studiolanave.com/promo-invierno";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { previewEmail } = await req.json().catch(() => ({}));

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const fmtDate = (iso: string) =>
      new Intl.DateTimeFormat("es-CL", {
        timeZone: "America/Santiago",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(iso));

    const buildEmail = (name: string, remaining: number, expiresAt: string) => {
      const firstName = (name || "").trim().split(" ")[0] || "hola";
      const plural = remaining === 1 ? "sesión" : "sesiones";
      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.7; color: #2E4D3A; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f8fb;">
  <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0e7490 50%, #06b6d4 100%); padding: 42px 30px; text-align: center; border-radius: 16px 16px 0 0;">
    <p style="color: rgba(255,255,255,0.85); margin: 0 0 10px 0; font-size: 13px; letter-spacing: 3px; text-transform: uppercase;">Nave Studio</p>
    <h1 style="color: white; margin: 0; font-size: 30px; letter-spacing: 1px;">❄️ Tienes ${remaining} ${plural} esperándote</h1>
    <p style="color: #fde68a; margin: 14px 0 0 0; font-size: 14px; font-weight: bold; letter-spacing: 1px;">Vencen el ${fmtDate(expiresAt)}</p>
  </div>

  <div style="background: white; padding: 32px 28px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
    <h2 style="color: #1A1A1A; margin-top: 0; font-size: 22px;">Hola ${firstName} 👋</h2>

    <p style="font-size: 16px;">
      Revisamos tu cuenta y todavía te quedan <strong>${remaining} ${plural}</strong> disponibles en tu paquete. No queremos que se te venzan: <strong>expiran el ${fmtDate(expiresAt)}</strong>.
    </p>

    <p style="font-size: 16px;">
      El agua fría te devuelve <strong>claridad, energía y foco</strong>. Cada inmersión es un recordatorio de que puedes con más de lo que crees. Solo tienes que venir y conectar con tu poder. 🧊
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${AGENDA_URL}" style="display: inline-block; background: linear-gradient(135deg, #0c4a6e 0%, #06b6d4 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-size: 17px; font-weight: bold;">
        📅 Agendar mi sesión
      </a>
    </div>

    <div style="background: #f7f9fb; border-radius: 12px; padding: 22px; margin: 22px 0; border: 1px solid #e8ecf0;">
      <p style="margin: 8px 0; font-size: 15px;">🎁 <strong>Puedes compartirlas</strong> con quien quieras — pareja, amigos o familia. Solo entrega el código.</p>
      <p style="margin: 8px 0; font-size: 15px;">🧘 Úsalas en <strong>Método Wim Hof / Criomedicina</strong> o en <strong>Yoga</strong>. Tú eliges.</p>
      <p style="margin: 8px 0; font-size: 15px;">🕐 <strong>Ampliamos los horarios</strong> — hay más franjas para que agendes cuando te acomode.</p>
    </div>

    <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0e7490 100%); border-radius: 16px; padding: 24px; margin: 26px 0; text-align: center; color: white;">
      <p style="margin: 0 0 4px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; opacity: 0.9;">❄️ Promo de Invierno</p>
      <p style="margin: 0; font-size: 38px; font-weight: bold;">$60.000</p>
      <p style="margin: 8px 0 16px 0; font-size: 15px; opacity: 0.95;">6 sesiones · Solo <strong>$10.000</strong> por sesión</p>
      <a href="${PROMO_URL}" style="display: inline-block; background: white; color: #0c4a6e; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 15px; font-weight: bold;">Quiero continuar con la promo</a>
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;">

    <p style="font-size: 14px; color: #666;">
      ¿Dudas o quieres que te ayudemos a agendar? Escríbenos por <a href="https://wa.me/56946120426" style="color: #0e7490; font-weight: bold;">WhatsApp</a>.
    </p>

    <div style="text-align: center; margin-top: 22px; padding-top: 18px; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 14px; color: #666; margin: 4px 0;">
        Nave Studio ❄️<br>
        <a href="https://studiolanave.com" style="color: #0e7490; text-decoration: none;">studiolanave.com</a>
      </p>
    </div>
  </div>

  <p style="text-align: center; font-size: 12px; color: #999; margin-top: 18px;">
    Recibiste este email porque tienes sesiones activas en Nave Studio.
  </p>
</body>
</html>`;
    };

    const sendOne = (to: string, name: string, remaining: number, expiresAt: string) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Nave Studio <agenda@studiolanave.com>",
          reply_to: "lanave@alaniceman.com",
          to: [to],
          subject: `❄️ Te quedan ${remaining} ${remaining === 1 ? "sesión" : "sesiones"} — agéndalas antes de que expiren`,
          html: buildEmail(name, remaining, expiresAt),
        }),
      });

    if (previewEmail) {
      const res = await sendOne(previewEmail, "Alan", 3, new Date(Date.now() + 30 * 86400000).toISOString());
      return new Response(JSON.stringify({ success: true, preview: true, result: await res.json() }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Unused, paid codes expiring within the next 60 days
    const nowISO = new Date().toISOString();
    const cutoffISO = new Date(Date.now() + 60 * 86400000).toISOString();

    const rows: Array<{ buyer_email: string; buyer_name: string; expires_at: string }> = [];
    let from = 0;
    const pageSize = 1000;
    while (true) {
      const { data, error } = await supabase
        .from("session_codes")
        .select("buyer_email, buyer_name, expires_at")
        .not("mercado_pago_payment_id", "is", null)
        .or("is_used.is.null,is_used.eq.false")
        .gt("expires_at", nowISO)
        .lt("expires_at", cutoffISO)
        .range(from, from + pageSize - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      rows.push(...(data as any));
      if (data.length < pageSize) break;
      from += pageSize;
    }

    const map = new Map<string, { name: string; remaining: number; expiresAt: string }>();
    for (const r of rows) {
      const email = (r.buyer_email || "").trim().toLowerCase();
      if (!email || !email.includes("@")) continue;
      const cur = map.get(email);
      if (!cur) {
        map.set(email, { name: r.buyer_name || "", remaining: 1, expiresAt: r.expires_at });
      } else {
        cur.remaining++;
        if (new Date(r.expires_at) < new Date(cur.expiresAt)) cur.expiresAt = r.expires_at;
        if (!cur.name && r.buyer_name) cur.name = r.buyer_name;
      }
    }

    const targets = [...map.entries()];
    console.log(`Targets: ${targets.length}`);

    let sent = 0;
    const errors: string[] = [];
    for (const [email, v] of targets) {
      try {
        const res = await sendOne(email, v.name, v.remaining, v.expiresAt);
        if (res.ok) sent++;
        else errors.push(`${email}: ${await res.text()}`);
      } catch (e: any) {
        errors.push(`${email}: ${e.message}`);
      }
      await new Promise((r) => setTimeout(r, 600));
    }

    console.log(`Sent ${sent}/${targets.length}. Errors: ${errors.length}`);

    return new Response(JSON.stringify({ success: true, total: targets.length, sent, errors }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-expiring-sessions-reminder:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
