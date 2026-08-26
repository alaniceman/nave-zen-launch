import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";

const EVENT_DATE = "2026-08-23";
const SUBJECT = "⏳ Hoy es el último día: pack de 6 sesiones a $60.000";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const previewEmail: string | undefined = body?.previewEmail;

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const buildEmail = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.7; color: #4A4A4A; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f9ff;">
  <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0e7490 50%, #06b6d4 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
    <p style="color: rgba(255,255,255,0.8); margin: 0 0 8px 0; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Nave Studio · Criomedicina</p>
    <h1 style="color: white; margin: 0; font-size: 30px; letter-spacing: 1px;">Hoy termina la promo ⏳</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 17px;">Último día para tomar tu pack de 6 sesiones</p>
  </div>

  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 16px 16px;">
    <h2 style="color: #1A1A1A; margin-top: 0; font-size: 22px;">Hola ${name} 👋</h2>
    <p style="font-size: 16px;">Este es el recordatorio final: <strong>hoy es el último día</strong> para acceder al pack exclusivo de asistentes del taller del 23 de agosto. A medianoche se cierra y vuelve al valor normal.</p>

    <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0e7490 100%); border-radius: 16px; padding: 25px; margin: 25px 0; text-align: center; color: white;">
      <p style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; opacity: 0.9;">Solo por hoy · asistentes del taller</p>
      <p style="margin: 0 0 6px 0; font-size: 19px; font-weight: bold;">Pack 6 sesiones</p>
      <p style="margin: 0; font-size: 40px; font-weight: bold;">$60.000</p>
      <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.95;">Solo <strong>$10.000</strong> por sesión · válidas 3 meses · <strong>compartibles</strong></p>
      <div style="margin-top: 20px;">
        <a href="https://studiolanave.com/promo-talleres" style="display: inline-block; background: #ffffff; color: #0c4a6e; text-decoration: none; padding: 14px 34px; border-radius: 10px; font-size: 16px; font-weight: bold;">Comprar antes de que cierre</a>
      </div>
    </div>

    <p style="font-size: 15px; color: #555;">Sirven para Criomedicina / Método Wim Hof y también para Yoga. Puedes usarlas tú o compartir los códigos con quien quieras — la forma más simple de que el hielo se vuelva hábito y no una anécdota.</p>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

    <p style="font-size: 14px; color: #666;">¿Dudas antes de decidir? Escríbenos por <a href="https://wa.me/56946120426" style="color: #0e7490;">WhatsApp</a> y te ayudamos.</p>

    <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
      <p style="font-size: 14px; color: #666; margin: 5px 0;">
        Nave Studio 🧊<br>
        <a href="https://studiolanave.com" style="color: #0e7490; text-decoration: none;">studiolanave.com</a>
      </p>
    </div>
  </div>

  <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
    Recibiste este email porque participaste en el taller del 23 de agosto.
  </p>
</body>
</html>`;

    const send = async (to: string, name: string) => {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Nave Studio <agenda@studiolanave.com>",
          reply_to: "lanave@alaniceman.com",
          to: [to],
          subject: SUBJECT,
          html: buildEmail(name),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
    };

    if (previewEmail) {
      await send(previewEmail, "Alan");
      return new Response(JSON.stringify({ success: true, preview: true, sent: 1 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: rows, error } = await supabase
      .from("taller_inscripciones")
      .select("email, nombre")
      .eq("fecha_evento", EVENT_DATE)
      .eq("status", "paid");

    if (error) throw error;

    const recipients = new Map<string, string>();
    for (const r of rows || []) {
      const email = (r.email || "").trim().toLowerCase();
      if (!email) continue;
      if (!recipients.has(email)) recipients.set(email, (r.nombre || "").split(" ")[0] || "");
    }

    let sent = 0;
    const errors: string[] = [];
    for (const [email, name] of recipients) {
      try {
        await send(email, name);
        sent++;
      } catch (e: any) {
        errors.push(`${email}: ${e.message}`);
      }
      await new Promise((r) => setTimeout(r, 600));
    }

    return new Response(
      JSON.stringify({ success: true, total: recipients.size, sent, errors }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("send-post-taller-lastday error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
