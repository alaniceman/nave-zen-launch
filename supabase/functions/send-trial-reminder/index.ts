import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { getCorsHeaders } from "../_shared/cors.ts";

const MAPS_LINK = "https://maps.app.goo.gl/oW6G58gLd5oYWmGn8";
const NAVE_WHATSAPP = "https://wa.me/56946120426";
const TIMEZONE = "America/Santiago";

const DAY_NAMES: Record<string, string> = {
  lunes: "Lunes", martes: "Martes", miercoles: "Miércoles",
  jueves: "Jueves", viernes: "Viernes", sabado: "Sábado", domingo: "Domingo",
};

interface ReminderConfig {
  key: string;
  minHours: number;
  maxHours: number;
  subject: (time: string) => string;
  preheader: string;
  introText: string;
}

const REMINDERS: ReminderConfig[] = [
  {
    key: "3d",
    minHours: 71,
    maxHours: 73,
    subject: (_t) => "En 3 días es tu clase de prueba — deja todo listo",
    preheader: "Te escribo para recordarte que en 3 días es tu clase de prueba.",
    introText: "Te escribo para recordarte que en 3 días es tu clase de prueba en Nave Studio:",
  },
  {
    key: "1d",
    minHours: 23,
    maxHours: 25,
    subject: (_t) => "Mañana es tu clase de prueba — recordatorio rápido",
    preheader: "Mañana es tu clase de prueba en Nave Studio.",
    introText: "Mañana es tu clase de prueba:",
  },
  {
    key: "3h",
    minHours: 2.5,
    maxHours: 3.5,
    subject: (t) => `Hoy ${t} — tu clase de prueba (dirección rápida)`,
    preheader: "Recordatorio rápido: hoy tienes tu clase de prueba.",
    introText: "",
  },
];

function buildReminderHtml(p: {
  name: string;
  classTitle: string;
  formattedDate: string;
  time: string;
  preheader: string;
  introHtml: string;
  isUrgent: boolean;
}): string {
  const urgentTip = p.isUrgent
    ? `<div style="background:#F0F7FF;border-left:4px solid #2E4D3A;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0">
        <p style="margin:0;color:#333;font-size:14px;line-height:1.6"><strong>Tip para llegar en 10 segundos:</strong><br>Portón negro a la derecha de la numeración (verás un pequeño platillo volador). Se corre manual y subes al segundo piso.</p>
      </div>`
    : `<div style="background:#FFF8E1;border-left:4px solid #FFC107;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0">
        <p style="margin:0;color:#333;font-size:14px;line-height:1.6"><strong>🗺️ Cómo llegar:</strong><br>Portón negro a la derecha de la numeración. Verás un pequeño platillo volador. Se corre manual y subes al segundo piso.</p>
      </div>`;

  const bringSection = p.isUrgent
    ? ""
    : `<div style="background:#F0F7FF;border-left:4px solid #2E4D3A;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0">
        <p style="margin:0;color:#333;font-size:14px;line-height:1.6"><strong>🎒 Qué llevar:</strong><br><strong>Yoga:</strong> ropa cómoda (mats e implementos están acá).</p>
      </div>`;

  const whatsappCta = p.isUrgent
    ? "Si vas atrasado/a o necesitas ayuda, WhatsApp directo:"
    : "Si necesitas mover tu hora o tienes alguna pregunta, escríbenos por WhatsApp:";

  const closing = p.isUrgent ? "Nos vemos pronto!" : "Nos vemos pronto!";

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5}
.wrap{max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden}
.hdr{background:#2E4D3A;padding:32px 24px;text-align:center}
.hdr h1{margin:0;color:#fff;font-size:22px;font-weight:600}
.body{padding:28px 24px}
.card{background:#F8F9FA;border-radius:10px;padding:20px;margin:20px 0}
.card p{margin:0 0 8px;color:#333;font-size:15px;line-height:1.5}
.card p:last-child{margin-bottom:0}
.btn{display:inline-block;padding:14px 28px;border-radius:8px;font-size:15px;font-weight:600;text-decoration:none;text-align:center;margin:6px 8px 6px 0}
.btn-green{background:#2E4D3A;color:#fff!important}
.btn-outline{background:#fff;color:#2E4D3A!important;border:2px solid #2E4D3A}
.footer{padding:24px;text-align:center;color:#999;font-size:13px;border-top:1px solid #eee}
</style></head><body>
<span style="display:none;max-height:0;overflow:hidden">${p.preheader}</span>
<div class="wrap">
  <div class="hdr"><h1>Nave Studio</h1></div>
  <div class="body">
    <p style="font-size:16px;color:#333;margin-top:0">Hola <strong>${p.name}</strong>!</p>
    ${p.introHtml}
    <div class="card">
      <p><strong>Clase:</strong> ${p.classTitle}</p>
      <p><strong>Fecha:</strong> <span style="text-transform:capitalize">${p.formattedDate}</span></p>
      <p><strong>Hora:</strong> ${p.time} hrs</p>
      <p><strong>Dirección:</strong> Antares 259, Las Condes</p>
    </div>
    ${urgentTip}
    ${bringSection}
    <p style="font-size:14px;color:#555;margin-top:20px">${whatsappCta}</p>
    <div style="text-align:center;margin:28px 0">
      <a href="${MAPS_LINK}" class="btn btn-green">📍 Abrir en Google Maps</a>
      <a href="${NAVE_WHATSAPP}" class="btn btn-outline">💬 WhatsApp directo</a>
    </div>
    <p style="font-size:15px;color:#555;margin-top:24px">${closing}<br><strong>Alan y equipo — Nave Studio</strong></p>
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

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not set");
    const resend = new Resend(RESEND_API_KEY);

    // Fetch all booked trial classes
    const { data: bookings, error } = await supabase
      .from("trial_bookings")
      .select("*")
      .eq("status", "booked");

    if (error) throw error;
    if (!bookings || bookings.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    let totalSent = 0;

    for (const booking of bookings) {
      // Build class datetime from scheduled_date + class_time
      const classDateTimeStr = `${booking.scheduled_date}T${booking.class_time}:00`;
      // Parse in Santiago timezone (the date/time stored is local to Santiago)
      const classDateTime = new Date(classDateTimeStr + "-04:00"); // Chile standard offset; approximate
      // More robust: calculate diff in hours
      const diffMs = classDateTime.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 0) continue; // Class already passed

      const alreadySent: string[] = booking.reminder_sent || [];

      for (const reminder of REMINDERS) {
        if (alreadySent.includes(reminder.key)) continue;
        if (diffHours < reminder.minHours || diffHours > reminder.maxHours) continue;

        // Format date for email
        const dateObj = new Date(booking.scheduled_date + "T12:00:00");
        const formattedDate = dateObj.toLocaleDateString("es-CL", {
          weekday: "long", day: "numeric", month: "long", year: "numeric",
        });

        // Build intro HTML for 3h reminder (different format)
        let introHtml: string;
        if (reminder.key === "3h") {
          introHtml = `<p style="font-size:15px;color:#555;line-height:1.6">Recordatorio rápido: hoy a las <strong>${booking.class_time}</strong> tienes tu clase de prueba <strong>${booking.class_title}</strong>.</p>`;
        } else {
          introHtml = `<p style="font-size:15px;color:#555;line-height:1.6">${reminder.introText}</p>`;
        }

        const subject = reminder.subject(booking.class_time);

        try {
          await resend.emails.send({
            from: "Nave Studio <no-reply@studiolanave.com>",
            reply_to: "lanave@alaniceman.com",
            to: [booking.customer_email],
            subject,
            html: buildReminderHtml({
              name: booking.customer_name,
              classTitle: booking.class_title,
              formattedDate,
              time: booking.class_time,
              preheader: reminder.preheader,
              introHtml,
              isUrgent: reminder.key === "3h",
            }),
          });

          // Mark reminder as sent
          const newSent = [...alreadySent, reminder.key];
          await supabase
            .from("trial_bookings")
            .update({ reminder_sent: newSent })
            .eq("id", booking.id);

          alreadySent.push(reminder.key);
          totalSent++;
          console.log(`Sent ${reminder.key} reminder to ${booking.customer_email} for ${booking.id}`);

          // Resend rate limit: 600ms delay
          await new Promise((r) => setTimeout(r, 600));
        } catch (emailErr) {
          console.error(`Failed ${reminder.key} for ${booking.id}:`, emailErr);
        }
      }
    }

    console.log(`Trial reminder job done: ${totalSent} sent`);
    return new Response(JSON.stringify({ success: true, sent: totalSent }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-trial-reminder error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
