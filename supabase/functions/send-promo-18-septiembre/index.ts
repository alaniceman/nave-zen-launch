import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";

const EVENT_DATE = "2026-08-23";
const LANDING = "https://studiolanave.com/promo-18-septiembre";

const SUBJECT_TALLER = "🇨🇱 Gracias por el taller + tu promo de Fiestas Patrias (2 Wim Hof + 4 Yoga)";
const SUBJECT_OTROS = "🇨🇱 Promo Fiestas Patrias: 2 sesiones Método Wim Hof + 4 de Yoga por $60.000";

const promoBlock = `
    <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0e7490 100%); border-radius: 16px; padding: 26px; margin: 26px 0; text-align: center; color: white;">
      <p style="margin: 0 0 6px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; opacity: 0.9;">Promo Fiestas Patrias · hasta el 30 de septiembre</p>
      <p style="margin: 0 0 8px 0; font-size: 22px; font-weight: bold;">Bautizo de Hielo + Yoga</p>
      <p style="margin: 0 0 4px 0; font-size: 15px; opacity: 0.95;">2 sesiones de Método Wim Hof + 4 clases de Yoga</p>
      <p style="margin: 10px 0 0 0; font-size: 15px; opacity: 0.85;"><s>$120.000</s></p>
      <p style="margin: 0; font-size: 40px; font-weight: bold;">$60.000</p>
      <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.95;">Válidas 3 meses · puedes compartirlas con quien quieras</p>
      <div style="margin-top: 20px;">
        <a href="${LANDING}" style="display: inline-block; background: #ffffff; color: #0c4a6e; text-decoration: none; padding: 14px 34px; border-radius: 10px; font-size: 16px; font-weight: bold;">Ver la promo</a>
      </div>
    </div>
    <p style="font-size: 15px; color: #555;">Recibes tus códigos por email: 2 para Método Wim Hof (baño de hielo a 3 °C) y 4 para Yoga —con opción de terminar en agua fría—. Sirven tanto si es tu primera vez como si ya tienes experiencia, y agendas cuando quieras en <a href="https://studiolanave.com/agenda-nave-studio" style="color: #0e7490;">nuestra agenda</a>.</p>
`;

const footer = (reason: string) => `
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
    <p style="font-size: 14px; color: #666;">¿Dudas? Escríbenos por <a href="https://wa.me/56946120426" style="color: #0e7490;">WhatsApp</a> y te ayudamos a elegir.</p>
    <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
      <p style="font-size: 14px; color: #666; margin: 5px 0;">
        Nave Studio 🧊 · Antares 259, Las Condes<br>
        <a href="https://studiolanave.com" style="color: #0e7490; text-decoration: none;">studiolanave.com</a>
      </p>
    </div>
  </div>
  <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">${reason}</p>
</body>
</html>`;

const head = (title: string, sub: string) => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.7; color: #4A4A4A; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f9ff;">
  <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0e7490 50%, #06b6d4 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
    <p style="color: rgba(255,255,255,0.8); margin: 0 0 8px 0; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Nave Studio · Las Condes</p>
    <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 1px;">${title}</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 17px;">${sub}</p>
  </div>
  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 16px 16px;">`;

const buildTaller = (name: string) => `${head("Gracias por el taller 🧊", "Y una promo para seguir la práctica")}
    <h2 style="color: #1A1A1A; margin-top: 0; font-size: 22px;">Hola ${name || "Crionauta"} 👋</h2>
    <p style="font-size: 16px;">Gracias por haber estado en el último taller de Método Wim Hof. Verte respirar, entrar al hielo y sostenerlo fue lo mejor del día.</p>
    <p style="font-size: 16px;">Para que no quede en una sola experiencia, armamos esta promo de Fiestas Patrias:</p>
    ${promoBlock}
${footer("Recibiste este email porque participaste en nuestro taller de Método Wim Hof.")}`;

const buildOtros = (name: string) => `${head("Promo Fiestas Patrias 🇨🇱", "Bautizo de Hielo + Yoga")}
    <h2 style="color: #1A1A1A; margin-top: 0; font-size: 22px;">Hola ${name || ""} 👋</h2>
    <p style="font-size: 16px;">Estas Fiestas Patrias armamos algo especial en Nave Studio: la combinación de frío y yoga que más recomendamos para partir (o para volver) —a mitad de precio.</p>
    ${promoBlock}
    <p style="font-size: 15px; color: #555;">Somos un estudio en Las Condes con baños de hielo a 3 °C, Método Wim Hof y clases de Yoga (Yin, Vinyasa, Power e Integral) toda la semana.</p>
${footer("Recibiste este email porque eres parte de la comunidad de Nave Studio.")}`;

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const mode: string = body?.mode ?? "taller";
    const previewEmail: string | undefined = body?.previewEmail;
    const offset: number = Number(body?.offset ?? 0);
    const batchSize: number = Number(body?.batchSize ?? 40);

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const send = async (to: string, name: string, variant: string) => {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendApiKey}` },
        body: JSON.stringify({
          from: "Nave Studio <agenda@studiolanave.com>",
          reply_to: "lanave@alaniceman.com",
          to: [to],
          subject: variant === "taller" ? SUBJECT_TALLER : SUBJECT_OTROS,
          html: variant === "taller" ? buildTaller(name) : buildOtros(name),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
    };

    if (previewEmail) {
      await send(previewEmail, "Alan", mode);
      return new Response(JSON.stringify({ success: true, preview: true, mode }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }


    // Attendees of the last workshop
    const { data: tallerRows, error: tallerErr } = await supabase
      .from("taller_inscripciones")
      .select("email, nombre")
      .eq("fecha_evento", EVENT_DATE)
      .eq("status", "paid");
    if (tallerErr) throw tallerErr;

    const tallerMap = new Map<string, string>();
    for (const r of tallerRows || []) {
      const email = (r.email || "").trim().toLowerCase();
      if (!email) continue;
      if (!tallerMap.has(email)) tallerMap.set(email, (r.nombre || "").split(" ")[0] || "");
    }

    let recipients: Array<[string, string]> = [];

    if (mode === "taller") {
      recipients = [...tallerMap.entries()];
    } else {
      const { data: customers, error: custErr } = await supabase
        .from("customers")
        .select("email, name")
        .order("created_at", { ascending: true })
        .range(0, 4999);
      if (custErr) throw custErr;

      const map = new Map<string, string>();
      for (const c of customers || []) {
        const email = (c.email || "").trim().toLowerCase();
        if (!email || !email.includes("@")) continue;
        if (tallerMap.has(email) || map.has(email)) continue;
        const first = (c.name || "").split(" ")[0] || "";
        map.set(email, first.includes("@") ? "" : first);
      }
      recipients = [...map.entries()];
    }

    // Skip anyone who already got this campaign
    const campaign = `promo18_${mode}`;
    const { data: alreadySent } = await supabase
      .from("email_campaign_sends")
      .select("email")
      .eq("campaign", campaign)
      .range(0, 4999);
    const sentSet = new Set((alreadySent || []).map((r: any) => (r.email || "").toLowerCase()));
    recipients = recipients.filter(([email]) => !sentSet.has(email));

    const total = recipients.length;
    const slice = recipients.slice(0, batchSize);

    let sent = 0;
    const errors: string[] = [];
    for (const [email, name] of slice) {
      try {
        await send(email, name, mode);
        await supabase.from("email_campaign_sends").insert({ campaign, email });
        sent++;
      } catch (e: any) {
        errors.push(`${email}: ${e.message}`);
      }
      await new Promise((r) => setTimeout(r, 600));
    }

    const remaining = total - slice.length;
    return new Response(
      JSON.stringify({
        success: true,
        mode,
        pending: total,
        sent,
        remaining,
        done: remaining <= 0,
        errors,
      }),

      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("send-promo-18-septiembre error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
