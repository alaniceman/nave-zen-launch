import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { getCorsHeaders } from "../_shared/cors.ts";

const WHATSAPP_URL = "https://wa.me/56946120426";
const PLAN_PRUEBA_URL = "https://studiolanave.com/plan-de-prueba";

function recoveryHtml(name: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>
body{margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#F4F4F5;line-height:1.7;-webkit-font-smoothing:antialiased}
.wrap{max-width:580px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
.hdr{background:#2E4D3A;padding:32px 28px;text-align:center}
.hdr h1{margin:0;color:#fff;font-size:22px;font-weight:700}
.body{padding:32px 28px;color:#2A2A2A;font-size:15px}
.body p{margin:0 0 16px}
.btn{display:inline-block;background:#2E4D3A;color:#fff!important;padding:14px 24px;border-radius:10px;text-decoration:none;font-weight:600;margin:6px 4px}
.btn-outline{background:#fff;color:#2E4D3A!important;border:2px solid #2E4D3A}
.cta-row{text-align:center;margin:24px 0 8px}
.footer{padding:20px;text-align:center;color:#9CA3AF;font-size:12px;border-top:1px solid #F0F0F0}
</style></head><body><div class="wrap">
<div class="hdr"><h1>Nave Studio</h1></div>
<div class="body">
<p>Hola <strong>${name}</strong>,</p>
<p>Notamos que empezaste a reservar tu plan de prueba en Nave Studio, pero no alcanzaste a completarlo. 🧊</p>
<p>Quedan solo dos pasos: elegir tu plan (7 o 15 días) y tu fecha de inicio. Te toma menos de un minuto:</p>
<div class="cta-row">
<a class="btn" href="${PLAN_PRUEBA_URL}">Completar mi plan de prueba</a>
</div>
<p>¿Tienes alguna duda antes de decidir? Escríbenos por WhatsApp y te ayudamos a elegir el plan que mejor se acomoda a ti:</p>
<div class="cta-row">
<a class="btn btn-outline" href="${WHATSAPP_URL}">Escribirnos por WhatsApp</a>
</div>
<p>Te esperamos en la Nave. 🛸</p>
<p style="margin-bottom:0">Un abrazo,<br><strong>Equipo Nave Studio</strong></p>
</div>
<div class="footer">Nave Studio · Antares 259, Las Condes</div>
</div></body></html>`;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Leads que completaron paso 1 hace más de 1 hora y menos de 7 días,
    // que no avanzaron (siguen en interesado_plan_prueba) y sin recovery email enviado.
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: leads, error } = await supabase
      .from("trial_bookings")
      .select("id, customer_name, customer_email")
      .eq("status", "interesado_plan_prueba")
      .is("recovery_email_sent_at", null)
      .lte("created_at", oneHourAgo)
      .gte("created_at", sevenDaysAgo);

    if (error) throw error;

    const RESEND = Deno.env.get("RESEND_API_KEY");
    if (!RESEND) throw new Error("RESEND_API_KEY missing");
    const resend = new Resend(RESEND);

    const results: Array<Record<string, unknown>> = [];
    for (const lead of leads || []) {
      try {
        await resend.emails.send({
          from: "Nave Studio <no-reply@studiolanave.com>",
          reply_to: "lanave@alaniceman.com",
          to: [lead.customer_email],
          subject: "¿Te quedó pendiente algo? Completa tu plan de prueba 🧊",
          html: recoveryHtml(lead.customer_name || "amigo/a"),
        });

        await supabase
          .from("trial_bookings")
          .update({ recovery_email_sent_at: new Date().toISOString() })
          .eq("id", lead.id);

        results.push({ leadId: lead.id, status: "sent" });
        await new Promise((r) => setTimeout(r, 550)); // Resend rate limit
      } catch (e: any) {
        console.error("[recovery]", lead.id, e);
        results.push({ leadId: lead.id, status: "error", error: String(e) });
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("send-plan-prueba-recovery error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
