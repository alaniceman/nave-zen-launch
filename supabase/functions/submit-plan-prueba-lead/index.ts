import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { getCorsHeaders } from "../_shared/cors.ts";
import { upsertCustomerAndLogEvent } from "../_shared/crm.ts";
import { appendToSheet } from "../_shared/googleSheets.ts";

const BOXMAGIC_URLS: Record<string, string> = {
  trial_7d: "https://boxmagic.cl/market/plan/Kp0M3Z7L8x",
  trial_15d: "https://boxmagic.cl/market/plan/XY0ljp3LkV",
};

const PLAN_LABELS: Record<string, string> = {
  trial_7d: "Plan de prueba 7 días",
  trial_15d: "Plan de prueba 15 días",
};

const leadSchema = z.object({
  step: z.literal("lead"),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(8).max(20),
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
});

const finalizeSchema = z.object({
  step: z.literal("finalize"),
  leadId: z.string().uuid(),
  planType: z.enum(["trial_7d", "trial_15d"]),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const bodySchema = z.discriminatedUnion("step", [leadSchema, finalizeSchema]);

function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.startsWith("56") && digits.length === 11) return `+${digits}`;
  if (digits.length === 9 && digits.startsWith("9")) return `+56${digits}`;
  if (digits.length === 8) return `+569${digits}`;
  return `+${digits}`;
}

function processingEmailHtml(name: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>
body{margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#F4F4F5;-webkit-font-smoothing:antialiased;line-height:1.7}
.wrap{max-width:580px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
.hdr{background:#2E4D3A;padding:32px 28px;text-align:center}
.hdr h1{margin:0;color:#fff;font-size:22px;font-weight:700}
.body{padding:32px 28px;color:#2A2A2A;font-size:15px}
.body p{margin:0 0 16px}
.box{background:#F7F9FB;border-left:4px solid #2E4D3A;padding:16px 20px;border-radius:8px;margin:18px 0}
.btn{display:inline-block;background:#2E4D3A;color:#fff!important;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:600;margin:6px 4px}
.btn-outline{background:#fff;color:#2E4D3A!important;border:2px solid #2E4D3A}
.cta-row{text-align:center;margin:22px 0 8px}
.footer{padding:20px;text-align:center;color:#9CA3AF;font-size:12px;border-top:1px solid #F0F0F0}
a{color:#2E4D3A}
</style></head><body><div class="wrap">
<div class="hdr"><h1>Nave Studio</h1></div>
<div class="body">
<p>Hola <strong>${name}</strong>!</p>
<p>Gracias por elegir tu plan de prueba en Nave Studio.</p>
<p>Maral, nuestra super profe de yoga, crioguía y asistente, está configurando tu cuenta y seteando el inicio de tu plan de prueba.</p>
<p>Como este proceso todavía lo hacemos manualmente, te dejamos estas instrucciones:</p>
<div class="box"><p style="margin:0">Si ya te llegó un mail de BoxMagic confirmando tu plan y quieres partir ahora, estamos listos! 🛸</p></div>
<div class="box"><p style="margin:0">Si ya te llegó el mail de BoxMagic, pero elegiste partir más adelante, danos un par de horas para setear manualmente tu fecha de inicio. Apenas esté listo, te enviaremos un nuevo correo para que puedas agendar.</p></div>
<div class="box"><p style="margin:0">Si todavía no te ha llegado ningún mail de BoxMagic, puede que haya ocurrido un error en el pago. Puedes intentarlo nuevamente con los botones de abajo.</p></div>
<div class="cta-row">
<a class="btn" href="${BOXMAGIC_URLS.trial_7d}">Reintentar Plan 7 días</a>
<a class="btn btn-outline" href="${BOXMAGIC_URLS.trial_15d}">Reintentar Plan 15 días</a>
</div>
<p>También puedes escribirnos por WhatsApp: <a href="https://wa.me/56946120426">+56 9 4612 0426</a></p>
<p>Muchas gracias por confiar en la Nave.</p>
<p style="margin-bottom:0">Nos vemos pronto!<br><strong>Equipo Nave Studio</strong></p>
</div>
<div class="footer">Nave Studio · Antares 259, Las Condes</div>
</div></body></html>`;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const json = await req.json();
    const data = bodySchema.parse(json);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (data.step === "lead") {
      const phone = normalizePhone(data.phone);
      const email = data.email.toLowerCase();
      const todayCL = new Date(
        new Date().toLocaleString("en-US", { timeZone: "America/Santiago" }),
      ).toISOString().split("T")[0];

      const { data: lead, error: insertError } = await supabase
        .from("trial_bookings")
        .insert({
          customer_name: data.name,
          customer_email: email,
          customer_phone: phone,
          class_title: "Plan de prueba",
          class_day: "",
          class_time: "",
          scheduled_date: todayCL,
          status: "interesado_plan_prueba",
          plan_type: null,
          source: "web-plan-prueba",
          utm_source: data.utm_source || null,
          utm_medium: data.utm_medium || null,
          utm_campaign: data.utm_campaign || null,
        })
        .select("id")
        .single();

      if (insertError || !lead) {
        console.error("Lead insert error:", insertError);
        throw new Error("Failed to create lead");
      }

      // ===== Background work — do NOT block the HTTP response =====
      const backgroundWork = async () => {
        try {
          // Google Sheets
          const now = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });
          appendToSheet([[now, data.name, email, phone, "PLAN_PRUEBA_LEAD", "", ""]])
            .catch((err) => console.error("[Sheets]", err));

          // email_subscribers upsert
          const { data: existingSub } = await supabase
            .from("email_subscribers")
            .select("id")
            .eq("email", email)
            .limit(1);
          if (existingSub && existingSub.length > 0) {
            await supabase
              .from("email_subscribers")
              .update({ whatsapp: phone, updated_at: new Date().toISOString() })
              .eq("id", existingSub[0].id);
          } else {
            await supabase.from("email_subscribers").insert({
              email, whatsapp: phone, source: "plan-de-prueba",
              tags: ["plan-de-prueba"], mailerlite_synced: false,
            });
          }

          // MailerLite
          const ML = Deno.env.get("MAILERLITE_API_KEY");
          if (ML) {
            fetch("https://connect.mailerlite.com/api/subscribers", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ML}`,
                Accept: "application/json",
              },
              body: JSON.stringify({
                email,
                fields: { phone, name: data.name, source: "plan-de-prueba" },
                tags: ["plan-de-prueba"],
                status: "active",
              }),
            }).catch((e) => console.error("[ML]", e));
          }

          // Resend emails
          const RESEND = Deno.env.get("RESEND_API_KEY");
          if (RESEND) {
            const resend = new Resend(RESEND);
            try {
              await resend.emails.send({
                from: "Nave Studio <no-reply@studiolanave.com>",
                reply_to: "lanave@alaniceman.com",
                to: [data.email],
                subject: "Estamos procesando tu plan de prueba en Nave Studio",
                html: processingEmailHtml(data.name),
              });
              await new Promise((r) => setTimeout(r, 550));
              await resend.emails.send({
                from: "Nave Studio <no-reply@studiolanave.com>",
                reply_to: "lanave@alaniceman.com",
                to: ["lanave@alaniceman.com"],
                bcc: ["flowithmaral@gmail.com"],
                subject: `Nuevo lead Plan de Prueba: ${data.name}`,
                html: `<div style="font-family:Helvetica Neue,Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px">
                  <h2 style="color:#2E4D3A">Nuevo lead — Plan de Prueba</h2>
                  <p><strong>Nombre:</strong> ${data.name}</p>
                  <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                  <p><strong>WhatsApp:</strong> <a href="https://wa.me/${phone.replace("+", "")}">${phone}</a></p>
                  ${data.utm_source ? `<p style="color:#999;font-size:12px">UTM: ${data.utm_source} / ${data.utm_medium || "-"} / ${data.utm_campaign || "-"}</p>` : ""}
                  <p style="color:#666;font-size:13px">Aún no eligió plan ni fecha de inicio.</p>
                </div>`,
              });
            } catch (e) {
              console.error("[Resend lead]", e);
            }
          }

          // CRM
          await upsertCustomerAndLogEvent(supabase, {
            email,
            name: data.name,
            phone,
            eventType: "plan_prueba_lead",
            eventTitle: "Interesado en Plan de Prueba",
            eventDescription: "Completó paso 1 del formulario",
            statusIfNew: "trial_booked",
          });
        } catch (e) {
          console.error("[plan-prueba background]", e);
        }
      };

      // @ts-ignore — Deno EdgeRuntime keeps the function alive after the response
      if (typeof EdgeRuntime !== "undefined" && EdgeRuntime.waitUntil) {
        // @ts-ignore
        EdgeRuntime.waitUntil(backgroundWork());
      } else {
        backgroundWork();
      }

      return new Response(JSON.stringify({ success: true, leadId: lead.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // step === "finalize"
    const { data: lead, error: leadErr } = await supabase
      .from("trial_bookings")
      .select("id, customer_email, customer_name, customer_phone")
      .eq("id", data.leadId)
      .single();
    if (leadErr || !lead) {
      return new Response(JSON.stringify({ error: "Lead no encontrado" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase
      .from("trial_bookings")
      .update({
        plan_type: data.planType,
        requested_start_date: data.startDate,
        status: "redirigido_a_boxmagic",
        redirected_to_boxmagic_at: new Date().toISOString(),
      })
      .eq("id", data.leadId);

    // CRM event for the redirect (background)
    const crmWork = upsertCustomerAndLogEvent(supabase, {
      email: lead.customer_email,
      name: lead.customer_name,
      phone: lead.customer_phone,
      eventType: "plan_prueba_redirect",
      eventTitle: `Redirigido a BoxMagic — ${PLAN_LABELS[data.planType]}`,
      eventDescription: `Fecha solicitada: ${data.startDate}`,
      metadata: { lead_id: data.leadId, plan_type: data.planType, requested_start_date: data.startDate },
      statusIfNew: "trial_booked",
    }).catch((e) => console.error("[CRM finalize]", e));
    // @ts-ignore
    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(crmWork);
    }

    return new Response(
      JSON.stringify({
        success: true,
        boxmagicUrl: BOXMAGIC_URLS[data.planType],
        planLabel: PLAN_LABELS[data.planType],
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("submit-plan-prueba-lead error:", err);
    const msg = err instanceof z.ZodError ? "Datos inválidos" : "Error interno";
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
