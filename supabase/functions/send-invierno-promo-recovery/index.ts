import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { previewEmail } = await req.json().catch(() => ({}));

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const buildEmail = (name: string, segment: "depleted" | "low") => {
      const firstName = (name || "").split(" ")[0] || "hola";
      const openingLine = segment === "depleted"
        ? `Vimos que ya usaste todas las sesiones de tu último paquete. ¡Eso significa que lo aprovechaste al máximo! 💪`
        : `Vimos que te quedan solo 1 o 2 sesiones en tu paquete. No pierdas el ritmo que ya construiste. ❄️`;

      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.7; color: #2E4D3A; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f8fb;">
  <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0e7490 50%, #06b6d4 100%); padding: 44px 30px; text-align: center; border-radius: 16px 16px 0 0;">
    <p style="color: rgba(255,255,255,0.85); margin: 0 0 10px 0; font-size: 13px; letter-spacing: 3px; text-transform: uppercase;">Nave Studio</p>
    <h1 style="color: white; margin: 0; font-size: 34px; letter-spacing: 1px;">❄️ Promo de Invierno</h1>
    <p style="color: rgba(255,255,255,0.95); margin: 12px 0 0 0; font-size: 18px;">6 sesiones · <strong>$60.000</strong></p>
    <p style="color: #fde68a; margin: 14px 0 0 0; font-size: 14px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">⏰ Termina mañana</p>
  </div>

  <div style="background: white; padding: 32px 28px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
    <h2 style="color: #1A1A1A; margin-top: 0; font-size: 22px;">Hola ${firstName} 👋</h2>

    <p style="font-size: 16px;">${openingLine}</p>

    <p style="font-size: 16px;">
      Queremos que sigas con tu práctica. El agua fría no es solo una sesión — es una herramienta poderosa que te devuelve <strong>claridad, energía y foco</strong>, activa tu sistema inmune, acelera tu recuperación y te entrena para responder mejor al estrés de la vida diaria.
    </p>

    <p style="font-size: 16px;">
      Cada inmersión es un recordatorio de que <em>puedes con más de lo que crees</em>. Y ahora, con el invierno instalado, es cuando más se siente el cambio. 🧊
    </p>

    <!-- Card promo -->
    <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0e7490 100%); border-radius: 16px; padding: 26px; margin: 28px 0; text-align: center; color: white;">
      <p style="margin: 0 0 4px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; opacity: 0.9;">❄️ Promo de Invierno</p>
      <p style="margin: 0; font-size: 44px; font-weight: bold; letter-spacing: 1px;">$60.000</p>
      <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.95;">6 sesiones · Solo <strong>$10.000</strong> por sesión</p>
    </div>

    <!-- Urgencia -->
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 14px 18px; margin: 20px 0; border-radius: 6px;">
      <p style="margin: 0; font-size: 15px; color: #78350f;">
        ⏰ <strong>La promo termina mañana.</strong> Aprovecha antes de que suba el precio.
      </p>
    </div>

    <!-- Novedades -->
    <div style="background: #f7f9fb; border-radius: 12px; padding: 22px; margin: 22px 0; border: 1px solid #e8ecf0;">
      <p style="margin: 0 0 14px 0; font-size: 17px; font-weight: bold; color: #0e7490;">Novedades de esta edición:</p>
      <p style="margin: 8px 0; font-size: 15px;">🕐 <strong>Ampliamos los horarios</strong> — más franjas para que agendes cuando te acomode.</p>
      <p style="margin: 8px 0; font-size: 15px;">🧘 Úsalas en <strong>Método Wim Hof / Criomedicina</strong> o en <strong>Yoga</strong>. Tú eliges.</p>
      <p style="margin: 8px 0; font-size: 15px;">📅 Válidas por <strong>3 meses</strong> — sin apuros.</p>
      <p style="margin: 8px 0; font-size: 15px;">🎁 <strong>Compártelas</strong> con quien quieras — pareja, amigos, familia.</p>
    </div>

    <!-- CTA -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="https://studiolanave.com/promo-invierno" style="display: inline-block; background: linear-gradient(135deg, #0c4a6e 0%, #06b6d4 100%); color: white; text-decoration: none; padding: 16px 42px; border-radius: 10px; font-size: 17px; font-weight: bold; letter-spacing: 0.5px;">
        ❄️ Aprovechar Promo de Invierno
      </a>
    </div>

    <p style="font-size: 14px; text-align: center; color: #666;">
      Agenda desde <a href="https://studiolanave.com/agenda-nave-studio" style="color: #0e7490; font-weight: bold;">studiolanave.com/agenda-nave-studio</a>
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 28px 0;">

    <p style="font-size: 14px; color: #666;">
      ¿Dudas? Escríbenos por <a href="https://wa.me/56946120426" style="color: #0e7490; font-weight: bold;">WhatsApp</a> y te ayudamos.
    </p>

    <div style="text-align: center; margin-top: 22px; padding-top: 18px; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 14px; color: #666; margin: 4px 0;">
        Nave Studio ❄️<br>
        <a href="https://studiolanave.com" style="color: #0e7490; text-decoration: none;">studiolanave.com</a>
      </p>
    </div>
  </div>

  <p style="text-align: center; font-size: 12px; color: #999; margin-top: 18px;">
    Recibiste este email porque compraste sesiones en Nave Studio.
  </p>
</body>
</html>`;
    };

    const subjectFor = (segment: "depleted" | "low") =>
      segment === "depleted"
        ? "❄️ Se te acabaron las sesiones — Promo de Invierno termina mañana"
        : "❄️ Te quedan pocas sesiones — Promo de Invierno termina mañana";

    const sendOne = async (to: string, name: string, segment: "depleted" | "low") => {
      return fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Nave Studio <agenda@studiolanave.com>",
          reply_to: "lanave@alaniceman.com",
          to: [to],
          subject: subjectFor(segment),
          html: buildEmail(name, segment),
        }),
      });
    };

    // Preview
    if (previewEmail) {
      const r1 = await sendOne(previewEmail, "Alan", "depleted");
      await new Promise((r) => setTimeout(r, 600));
      const r2 = await sendOne(previewEmail, "Alan", "low");
      const b1 = await r1.json();
      const b2 = await r2.json();
      return new Response(JSON.stringify({ success: true, preview: true, depleted: b1, low: b2 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch all paid session_codes (paginated to bypass 1000 row default)
    const rows: Array<{ buyer_email: string; buyer_name: string; is_used: boolean | null; used_at: string | null }> = [];
    let from = 0;
    const pageSize = 1000;
    while (true) {
      const { data, error } = await supabase
        .from("session_codes")
        .select("buyer_email, buyer_name, is_used, used_at")
        .not("mercado_pago_payment_id", "is", null)
        .range(from, from + pageSize - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      rows.push(...data);
      if (data.length < pageSize) break;
      from += pageSize;
    }

    const cutoff = Date.now() - 60 * 24 * 60 * 60 * 1000;
    const map = new Map<string, { name: string; total: number; used: number; lastUsedMs: number }>();
    for (const c of rows) {
      const email = (c.buyer_email || "").trim().toLowerCase();
      if (!email) continue;
      if (!map.has(email)) map.set(email, { name: c.buyer_name || "", total: 0, used: 0, lastUsedMs: 0 });
      const e = map.get(email)!;
      e.total++;
      if (c.is_used) e.used++;
      if (c.used_at) {
        const t = new Date(c.used_at).getTime();
        if (t > e.lastUsedMs) e.lastUsedMs = t;
      }
    }

    const targets: Array<{ email: string; name: string; segment: "depleted" | "low" }> = [];
    for (const [email, v] of map.entries()) {
      if (v.total === 0) continue;
      const remaining = v.total - v.used;
      if (remaining === 0 && v.lastUsedMs >= cutoff) {
        targets.push({ email, name: v.name, segment: "depleted" });
      } else if (remaining === 1 || remaining === 2) {
        targets.push({ email, name: v.name, segment: "low" });
      }
    }

    console.log(`Targets: ${targets.length} (depleted=${targets.filter(t => t.segment === "depleted").length}, low=${targets.filter(t => t.segment === "low").length})`);

    let sent = 0;
    const errors: string[] = [];
    for (const t of targets) {
      try {
        const res = await sendOne(t.email, t.name, t.segment);
        if (res.ok) sent++;
        else errors.push(`${t.email}: ${await res.text()}`);
        await new Promise((r) => setTimeout(r, 600));
      } catch (e: any) {
        errors.push(`${t.email}: ${e.message}`);
      }
    }

    console.log(`Sent ${sent}/${targets.length}. Errors: ${errors.length}`);

    return new Response(JSON.stringify({ success: true, total: targets.length, sent, errors }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-invierno-promo-recovery:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
