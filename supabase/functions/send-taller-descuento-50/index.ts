import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { TALLERES } from "../_shared/talleres.ts";

const SUBJECT = "Tu código de 50% para el próximo taller Wim Hof (3 y 4 de octubre)";
const VALID_UNTIL = "2026-10-04T02:59:00Z"; // 3 de octubre 23:59 Chile
const LANDING = "https://studiolanave.com/taller-wim-hof-santiago-fundamentales-avanzado";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Código único por persona, estable (mismo email = mismo código en reintentos)
async function codeForEmail(email: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`taller50:${email}`));
  const hex = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 5; i++) suffix += alphabet[parseInt(hex.slice(i * 2, i * 2 + 2), 16) % alphabet.length];
  return `HIELO50${suffix}`;
}

const buildEmail = (nombre: string, code: string) => {
  const saludo = nombre ? `Hola ${escapeHtml(nombre)} 👋` : "Hola 👋";
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;line-height:1.7;color:#4A4A4A;max-width:600px;margin:0 auto;padding:20px;background-color:#f0f9ff;">
  <div style="background:linear-gradient(135deg,#0c4a6e 0%,#0e7490 50%,#06b6d4 100%);padding:38px 30px;text-align:center;border-radius:16px 16px 0 0;">
    <p style="color:rgba(255,255,255,0.85);margin:0 0 8px 0;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Nave Studio · Método Wim Hof</p>
    <h1 style="color:#fff;margin:0;font-size:28px;letter-spacing:1px;">50% de descuento para ti 🧊</h1>
    <p style="color:rgba(255,255,255,0.92);margin:12px 0 0 0;font-size:17px;">Nueva edición: sábado 3 y domingo 4 de octubre</p>
  </div>

  <div style="background:#fff;padding:30px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 16px 16px;">
    <h2 style="color:#1A1A1A;margin-top:0;font-size:22px;">${saludo}</h2>
    <p style="font-size:16px;">Gracias por haber estado en un taller del Método Wim Hof con nosotros. Viene una nueva edición y quiero que vuelvas: te dejo un <strong>código personal con 50% de descuento</strong>, válido una sola vez y solo para ti.</p>

    <div style="background:#f0f9ff;border:2px dashed #0e7490;border-radius:16px;padding:24px;margin:26px 0;text-align:center;">
      <p style="margin:0 0 12px 0;font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#0c4a6e;font-weight:bold;">Tu código personal</p>
      <p style="margin:0;font-size:34px;line-height:1.2;font-weight:bold;letter-spacing:3px;color:#0c4a6e;font-family:'Courier New',monospace;">${code}</p>
      <p style="margin:14px 0 0 0;font-size:14px;color:#555;">Cópialo y pégalo en el formulario de inscripción · un solo uso · válido hasta el 3 de octubre</p>
    </div>

    <div style="border:1px solid #e0e0e0;border-radius:14px;padding:20px;margin:22px 0;">
      <p style="margin:0 0 10px 0;font-size:16px;"><strong>🧩 Fundamentales</strong> · ${TALLERES.fundamentos.fechaLarga}, ${TALLERES.fundamentos.horario} · $${TALLERES.fundamentos.valor.toLocaleString("es-CL")} <span style="color:#0e7490;">→ $${(TALLERES.fundamentos.valor / 2).toLocaleString("es-CL")}</span></p>
      <p style="margin:0;font-size:16px;"><strong>🐍 Avanzado</strong> · ${TALLERES.avanzado.fechaLarga}, ${TALLERES.avanzado.horario} · $${TALLERES.avanzado.valor.toLocaleString("es-CL")} <span style="color:#0e7490;">→ $${(TALLERES.avanzado.valor / 2).toLocaleString("es-CL")}</span></p>
      <p style="margin:12px 0 0 0;font-size:14px;color:#666;">El Avanzado incluye <strong>The Snake</strong>: una práctica guiada de foco y calor interno para quienes quieran desafiar su poder mental. Requiere experiencia previa.</p>
    </div>

    <div style="text-align:center;margin:28px 0;">
      <a href="${LANDING}" style="display:inline-block;background:#0c4a6e;color:#fff;text-decoration:none;padding:16px 36px;border-radius:10px;font-size:17px;font-weight:bold;">Reservar mi cupo con 50%</a>
    </div>

    <p style="font-size:15px;color:#555;">Son 15 cupos por taller y se van rápido. Cualquier duda, escríbeme por <a href="https://wa.me/56946120426" style="color:#0e7490;">WhatsApp</a>.</p>

    <div style="text-align:center;margin-top:25px;padding-top:20px;border-top:1px solid #e0e0e0;">
      <p style="font-size:14px;color:#666;margin:5px 0;">Nave Studio 🧊<br><a href="https://studiolanave.com" style="color:#0e7490;text-decoration:none;">studiolanave.com</a></p>
    </div>
  </div>
</body></html>`;
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const previewEmail: string | undefined = body?.previewEmail;
    const dryRun: boolean = body?.dryRun === true;

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const send = async (to: string, nombre: string, code: string) => {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
          "Idempotency-Key": `taller50-${code}`,
        },
        body: JSON.stringify({
          from: "Nave Studio <agenda@studiolanave.com>",
          reply_to: "lanave@alaniceman.com",
          to: [to],
          subject: SUBJECT,
          html: buildEmail(nombre, code),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
    };

    const ensureCoupon = async (code: string) => {
      const { data: existing } = await supabase
        .from("discount_coupons")
        .select("id")
        .eq("code", code)
        .maybeSingle();
      if (existing) return;
      const { error } = await supabase.from("discount_coupons").insert({
        code,
        discount_type: "percentage",
        discount_value: 50,
        max_uses: 1,
        current_uses: 0,
        applies_to_talleres: true,
        is_active: true,
        valid_until: VALID_UNTIL,
      });
      if (error) throw error;
    };

    if (previewEmail) {
      const code = await codeForEmail(previewEmail.toLowerCase());
      if (!dryRun) {
        await ensureCoupon(code);
        await send(previewEmail, "Alan", code);
      }
      return new Response(JSON.stringify({ success: true, preview: true, code }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: rows, error } = await supabase
      .from("taller_inscripciones")
      .select("email, nombre")
      .eq("status", "paid");
    if (error) throw error;

    const recipients = new Map<string, string>();
    for (const r of rows ?? []) {
      const email = (r.email || "").trim().toLowerCase();
      if (!email) continue;
      if (!recipients.has(email)) recipients.set(email, (r.nombre || "").split(" ")[0] || "");
    }

    if (dryRun) {
      const preview = [] as { email: string; code: string }[];
      for (const [email] of recipients) preview.push({ email, code: await codeForEmail(email) });
      return new Response(JSON.stringify({ success: true, dryRun: true, total: preview.length, preview }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let sent = 0;
    const errors: string[] = [];
    const codes: { email: string; code: string }[] = [];
    for (const [email, nombre] of recipients) {
      const code = await codeForEmail(email);
      try {
        await ensureCoupon(code);
        await send(email, nombre, code);
        codes.push({ email, code });
        sent++;
      } catch (e) {
        errors.push(`${email}: ${(e as Error).message}`);
      }
      await new Promise((r) => setTimeout(r, 600));
    }

    return new Response(JSON.stringify({ success: true, total: recipients.size, sent, codes, errors }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("send-taller-descuento-50 error:", (error as Error).message);
    return new Response(JSON.stringify({ error: "No se pudo procesar el envío" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
