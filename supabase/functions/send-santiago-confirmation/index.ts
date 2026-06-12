import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAPS_URL = "https://maps.app.goo.gl/oW6G58gLd5oYWmGn8";
const WHATSAPP = "https://wa.me/56946120426";

const TALLERES = {
  fundamentos: {
    nombre: "Fundamentos Wim Hof",
    fecha: "Sábado 27 de junio de 2026",
    horario: "11:30 a 15:00",
    valorTxt: "$50.000",
    pagoUrl: "https://mpago.la/2c9NhLM",
  },
  avanzado: {
    nombre: "Avanzado Wim Hof",
    fecha: "Domingo 28 de junio de 2026",
    horario: "11:30 a 15:00",
    valorTxt: "$60.000",
    pagoUrl: "https://mpago.la/1edQqad",
  },
} as const;

type TallerKey = keyof typeof TALLERES;

interface Payload {
  nombre: string;
  apellido?: string;
  email: string;
  celular: string;
  taller: TallerKey;
}

function buildHtml(p: Payload) {
  const t = TALLERES[p.taller];
  const fullName = [p.nombre, p.apellido].filter(Boolean).join(" ");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
body{margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#F4F4F5;line-height:1.7;-webkit-font-smoothing:antialiased}
.wrap{max-width:580px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
.hdr{background:#2E4D3A;padding:36px 28px;text-align:center;color:#fff}
.hdr h1{margin:0;font-size:22px;font-weight:600;letter-spacing:.3px}
.hdr p{margin:6px 0 0;opacity:.85;font-size:14px}
.body{padding:28px}
.body h2{font-size:18px;color:#1A1A1A;margin:0 0 12px}
.body p{color:#3F3F46;font-size:15px;margin:0 0 14px}
.box{background:#F8FAFB;border-left:4px solid #2E4D3A;padding:16px 18px;border-radius:8px;margin:18px 0}
.box p{margin:4px 0;font-size:14px;color:#1A1A1A}
.cta{display:inline-block;background:#2E4D3A;color:#fff !important;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:600;font-size:15px;margin:8px 0}
.muted{color:#71717A;font-size:13px}
a{color:#2E4D3A}
.foot{padding:20px 28px;text-align:center;background:#FAFAFA;color:#71717A;font-size:12px}
</style></head>
<body>
<div class="wrap">
  <div class="hdr">
    <h1>Reserva en proceso · ${t.nombre}</h1>
    <p>Nave Studio · Antares 259, Las Condes</p>
  </div>
  <div class="body">
    <h2>Hola ${fullName || "Aliada"} 👋</h2>
    <p>Recibimos tu reserva para el taller <strong>${t.nombre}</strong>. Para confirmar tu cupo necesitamos que completes el pago.</p>

    <div class="box">
      <p><strong>📅 Fecha:</strong> ${t.fecha}</p>
      <p><strong>⏰ Horario:</strong> ${t.horario}</p>
      <p><strong>💸 Valor:</strong> ${t.valorTxt}</p>
      <p><strong>📍 Lugar:</strong> Nave Studio, Antares 259, Las Condes — <a href="${MAPS_URL}">ver mapa</a></p>
    </div>

    <p>Si aún no completaste el pago, puedes hacerlo desde aquí:</p>
    <p><a href="${t.pagoUrl}" class="cta">Ir al pago seguro →</a></p>

    <p class="muted">El cupo se confirma una vez recibido el pago. Si tienes cualquier duda escríbenos a <a href="${WHATSAPP}">WhatsApp +56 9 4612 0426</a>.</p>
  </div>
  <div class="foot">Nave Studio · studiolanave.com</div>
</div>
</body></html>`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const payload = (await req.json()) as Payload;
    if (!payload?.email || !payload?.taller || !TALLERES[payload.taller]) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const t = TALLERES[payload.taller];
    const html = buildHtml(payload);

    const result = await resend.emails.send({
      from: "Nave Studio <lanave@alaniceman.com>",
      to: [payload.email],
      bcc: ["flowithmaral@gmail.com"],
      subject: `Tu reserva del Taller ${t.nombre} · Nave Studio`,
      html,
    });

    return new Response(JSON.stringify({ ok: true, result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-santiago-confirmation error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
