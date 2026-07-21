import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { getCorsHeaders } from "../_shared/cors.ts";

const bodySchema = z.object({ leadId: z.string().uuid() });

const PLAN_LABELS: Record<string, string> = {
  trial_7d: "Plan de prueba 7 días",
  trial_15d: "Plan de prueba 15 días",
};

function fmt(d: string | null) {
  if (!d) return "-";
  return new Date(d + "T12:00:00").toLocaleDateString("es-CL", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    timeZone: "America/Santiago",
  });
}

function html(p: { name: string; planLabel: string; start: string; end: string; email: string }) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#F4F4F5;line-height:1.7}
.wrap{max-width:580px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
.hdr{background:#2E4D3A;padding:32px 28px;text-align:center}
.hdr h1{margin:0;color:#fff;font-size:22px;font-weight:700}
.body{padding:32px 28px;color:#2A2A2A;font-size:15px}
.body p{margin:0 0 16px}
.card{background:#F7F9FB;border-radius:12px;padding:18px 22px;margin:0 0 22px;border:1px solid #E2E8F0}
.card p{margin:0 0 8px;font-size:15px}
.card p:last-child{margin:0}
.btn{display:inline-block;background:#2E4D3A;color:#fff!important;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600}
.cta-row{text-align:center;margin:24px 0}
.footer{padding:20px;text-align:center;color:#9CA3AF;font-size:12px;border-top:1px solid #F0F0F0}
</style></head><body><div class="wrap">
<div class="hdr"><h1>Nave Studio</h1></div>
<div class="body">
<p>Hola <strong>${p.name}</strong>!</p>
<p>Tu plan de prueba en Nave Studio ya está listo.</p>
<div class="card">
<p><strong>Plan:</strong> ${p.planLabel}</p>
<p><strong>Fecha de inicio:</strong> <span style="text-transform:capitalize">${p.start}</span></p>
<p><strong>Fecha de término:</strong> <span style="text-transform:capitalize">${p.end}</span></p>
</div>
<p>Para ver los horarios y reservar tus clases, entra a BoxMagic:</p>
<div class="cta-row"><a class="btn" href="https://members.boxmagic.app/">Ver horarios y reservar</a></div>
<p style="font-size:14px;color:#4A4A4A;text-align:center;margin:0 0 12px">Entra a BoxMagic para revisar todos los horarios disponibles y reservar las clases que prefieras.</p>
<p style="font-size:13px;color:#6B7280;text-align:center;margin:0 0 22px">
Web: <a href="https://members.boxmagic.app/" style="color:#2E4D3A">members.boxmagic.app</a><br>
<a href="https://apps.apple.com/cl/app/boxmagic-members/id6479632550" style="color:#2E4D3A">Descargar en App Store</a>
&nbsp;·&nbsp;
<a href="https://play.google.com/store/apps/details?id=app.boxmagic.members" style="color:#2E4D3A">Descargar en Google Play</a>
</p>
<div class="card">
<p><strong>Tus datos de acceso:</strong></p>
<p>Email: ${p.email}</p>
<p>Contraseña: <strong>Nave7</strong> (solo si aún no la cambiaste)</p>
</div>
<p>Durante estos días puedes venir a probar la Nave y vivir nuestras clases de Yoga, Criomedicina y Método Wim Hof.</p>
<p>Aprovecha tu plan al máximo. Agenda tus clases, ven con curiosidad y permítete conocer lo que pasa cuando entrenas tu cuerpo, tu respiración y tu mente en un espacio diseñado para que te sientas sano, fuerte y feliz.</p>
<p style="margin-bottom:0">Nos vemos en la Nave ❄️🛸<br><strong>Equipo Nave Studio</strong></p>
</div>
<div class="footer">Nave Studio · Antares 259, Las Condes</div>
</div></body></html>`;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const data = bodySchema.parse(await req.json());
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: lead, error } = await supabase
      .from("trial_bookings")
      .select("customer_name, customer_email, plan_type, actual_start_date, actual_end_date")
      .eq("id", data.leadId)
      .single();
    if (error || !lead) throw new Error("Lead no encontrado");

    const RESEND = Deno.env.get("RESEND_API_KEY");
    if (!RESEND) throw new Error("RESEND no configurado");
    const resend = new Resend(RESEND);

    await resend.emails.send({
      from: "Nave Studio <no-reply@studiolanave.com>",
      reply_to: "lanave@alaniceman.com",
      to: [lead.customer_email],
      subject: "Tu plan de prueba Nave Studio ya está activo",
      html: html({
        name: lead.customer_name,
        planLabel: PLAN_LABELS[lead.plan_type ?? ""] ?? "Plan de prueba",
        start: fmt(lead.actual_start_date),
        end: fmt(lead.actual_end_date),
        email: lead.customer_email,
      }),
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-plan-prueba-activo error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
