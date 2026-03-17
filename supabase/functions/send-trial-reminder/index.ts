import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { getCorsHeaders } from "../_shared/cors.ts";

const MAPS_LINK = "https://maps.app.goo.gl/32Pp7nxM8XiohAna8";
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
    ? `<div class="info-box" style="background:#F0F7F2;border-left:4px solid #2E4D3A">
        <p style="color:#2E4D3A"><strong>Tip para llegar en 10 segundos:</strong><br>Portón negro a la derecha de la numeración (verás un pequeño platillo volador). Se corre manual y subes al segundo piso.</p>
      </div>`
    : `<div class="info-box directions">
        <p><strong>🗺️ Cómo llegar:</strong><br>Portón negro a la derecha de la numeración. Verás un pequeño platillo volador. Se corre manual y subes al segundo piso.</p>
      </div>`;

  const bringSection = p.isUrgent
    ? ""
    : `<div class="info-box bring">
        <p><strong>🎒 Qué llevar:</strong><br><strong>Yoga:</strong> ropa cómoda (mats e implementos están acá).</p>
      </div>
      <div class="ice-policy">
        <p class="ice-title">🧊 Información importante sobre el uso del agua fría</p>
        <p class="ice-intro">En Nave Studio combinamos yoga con inmersión en agua fría. Para que la experiencia sea segura y fluida para todos, te pedimos tener en cuenta lo siguiente:</p>
        <p class="ice-heading">1. Clases de prueba de yoga</p>
        <p class="ice-text">Las clases de prueba <strong>no incluyen inmersión en hielo</strong> al final, independiente de si ya has hecho baños de hielo antes o no.</p>
        <p class="ice-note">Esto es parte del proceso para que primero conozcas el espacio, la práctica y cómo trabajamos.</p>
        <p class="ice-heading">2. Clases de yoga pagadas o con membresía</p>
        <p class="ice-text">Para poder terminar una clase de yoga en el agua fría debes haber realizado previamente una <strong>sesión guiada del Método Wim Hof con nosotros</strong>. Esto aplica aunque ya hayas hecho baños de hielo en otro lugar, ya que necesitamos asegurarnos de que conozcas nuestra forma de trabajar y que sea una experiencia segura para ti.</p>
        <p class="ice-heading">3. Tiempo máximo en el agua</p>
        <p class="ice-text">Después de yoga, el tiempo máximo de inmersión es de <strong>2 minutos</strong>. Esto es estricto. En sesiones completas del Método Wim Hof es posible permanecer más tiempo, siempre siguiendo las instrucciones del instructor.</p>
        <p class="ice-heading">4. Respeto por el tiempo de la clase</p>
        <p class="ice-text">Las clases de yoga duran 1 hora completa. Por eso, cuando termina la práctica y entras al agua fría, la dinámica es entrar y salir, para respetar el tiempo de la instructora y el flujo de la clase.</p>
      </div>`;

  const whatsappCta = p.isUrgent
    ? "Si vas atrasado/a o necesitas ayuda, WhatsApp directo:"
    : "Si necesitas mover tu hora o tienes alguna pregunta, escríbenos por WhatsApp:";

  const closing = p.isUrgent ? "Nos vemos pronto!" : "Nos vemos pronto!";

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
body{margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#F4F4F5;-webkit-font-smoothing:antialiased}
.wrap{max-width:580px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
.hdr{background:#2E4D3A;padding:36px 28px;text-align:center}
.hdr h1{margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:0.3px}
.body{padding:32px 28px}
.greeting{font-size:17px;color:#1A1A1A;margin:0 0 6px;line-height:1.5}
.intro{font-size:15px;color:#4A4A4A;line-height:1.7;margin:0 0 24px}
.card{background:#F8FAFB;border-radius:12px;padding:22px 24px;margin:0 0 24px;border:1px solid #E8ECF0}
.card p{margin:0 0 10px;color:#2A2A2A;font-size:15px;line-height:1.6}
.card p:last-child{margin-bottom:0}
.card strong{color:#1A1A1A}
.info-box{padding:18px 22px;margin:0 0 20px;border-radius:10px}
.info-box p{margin:0;font-size:14px;line-height:1.7}
.directions{background:#FFFBF0;border-left:4px solid #E8A800}
.directions p{color:#5C4800}
.bring{background:#F0F7F2;border-left:4px solid #2E4D3A}
.bring p{color:#2E4D3A}
.ice-policy{background:#F7F9FB;border-radius:12px;padding:26px 24px;margin:0 0 24px;border:1px solid #E2E8F0}
.ice-title{margin:0 0 14px;color:#2E4D3A;font-size:17px;font-weight:700;line-height:1.4}
.ice-intro{margin:0 0 20px;color:#4A4A4A;font-size:14px;line-height:1.7}
.ice-heading{margin:0 0 8px;color:#2E4D3A;font-size:14px;font-weight:700;line-height:1.5}
.ice-text{margin:0 0 18px;color:#4A4A4A;font-size:14px;line-height:1.7}
.ice-text:last-child{margin-bottom:0}
.ice-note{margin:0 0 18px;color:#6B7280;font-size:13px;line-height:1.6;font-style:italic}
.cta-row{text-align:center;margin:28px 0}
.btn{display:inline-block;padding:14px 28px;border-radius:10px;font-size:15px;font-weight:600;text-decoration:none;text-align:center;margin:6px 6px}
.btn-green{background:#2E4D3A;color:#ffffff!important}
.btn-outline{background:#ffffff;color:#2E4D3A!important;border:2px solid #2E4D3A}
.closing{font-size:15px;color:#4A4A4A;margin:28px 0 0;line-height:1.6}
.footer{padding:24px 28px;text-align:center;color:#9CA3AF;font-size:12px;border-top:1px solid #F0F0F0;letter-spacing:0.2px}
</style></head><body>
<span style="display:none;max-height:0;overflow:hidden">${p.preheader}</span>
<div class="wrap">
  <div class="hdr"><h1>Nave Studio</h1></div>
  <div class="body">
    <p class="greeting">Hola <strong>${p.name}</strong>!</p>
    ${p.introHtml}
    <div class="card">
      <p><strong>Clase:</strong> ${p.classTitle}</p>
      <p><strong>Fecha:</strong> <span style="text-transform:capitalize">${p.formattedDate}</span></p>
      <p><strong>Hora:</strong> ${p.time} hrs</p>
      <p><strong>Dirección:</strong> Antares 259, Las Condes</p>
    </div>
    ${urgentTip}
    ${bringSection}
    <p style="font-size:14px;color:#4A4A4A;margin:0 0 4px">${whatsappCta}</p>
    <div class="cta-row">
      <a href="${MAPS_LINK}" class="btn btn-green">📍 Abrir en Google Maps</a>
      <a href="${NAVE_WHATSAPP}" class="btn btn-outline">💬 WhatsApp directo</a>
    </div>
    <p class="closing">${closing}<br><strong>Alan y equipo — Nave Studio</strong></p>
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
