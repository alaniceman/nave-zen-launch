import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { format, addHours } from "https://esm.sh/date-fns@3.6.0";
import { toZonedTime } from "https://esm.sh/date-fns-tz@3.1.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAPS_LINK = "https://maps.app.goo.gl/oW6G58gLd5oYWmGn8";
const NAVE_WHATSAPP = "https://wa.me/56946120426";

function isWimHof(serviceName: string): boolean {
  const lower = serviceName.toLowerCase();
  return lower.includes("wim hof") || lower.includes("ice bath") || lower.includes("baño de hielo") || lower.includes("criomedicin");
}

function buildWhatToBringSection(serviceName: string): string {
  if (isWimHof(serviceName)) {
    return `
      <div style="background:#F0F7FF;border-left:4px solid #2E4D3A;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0">
        <p style="margin:0 0 12px;color:#333;font-size:14px;line-height:1.6"><strong>🎒 Recuerda llevar:</strong></p>
        <ul style="margin:0;padding-left:20px;color:#333;font-size:14px;line-height:1.8">
          <li>Traje de baño (ojalá ya puesto)</li>
          <li>Toalla</li>
          <li>Bolsa para ropa mojada</li>
          <li>¡Actitud!</li>
        </ul>
      </div>
      <div style="background:#F8F9FA;border-left:4px solid #2E4D3A;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0">
        <p style="margin:0 0 8px;color:#333;font-size:14px;line-height:1.6"><strong>🎬 Videos sugeridos para prepararte:</strong></p>
        <p style="margin:0 0 4px;font-size:14px;color:#555;line-height:1.6">1. <a href="https://youtu.be/6QfD1UY1weM?si=z6jt4dETdk93GjFd" style="color:#2E4D3A;font-weight:600">Cómo hacer la respiración Wim Hof en detalle</a></p>
        <p style="margin:0;font-size:14px;color:#555;line-height:1.6">2. <a href="https://youtu.be/OUCe2VjHyzg?si=s9v4Ft7MqS2_NjL5" style="color:#2E4D3A;font-weight:600">Respiración Wim Hof guiada</a></p>
      </div>
      <div style="background:#FFF8E1;border-left:4px solid #FFC107;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0">
        <p style="margin:0;color:#333;font-size:14px;line-height:1.6"><strong>Importante:</strong> Llega puntual y en ayunas ligeras para aprovechar al máximo tu experiencia.</p>
      </div>`;
  }

  return `
    <div style="background:#F0F7FF;border-left:4px solid #2E4D3A;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0">
      <p style="margin:0;color:#333;font-size:14px;line-height:1.6"><strong>🎒 Recuerda llevar:</strong><br><strong>Yoga:</strong> ropa cómoda. Los implementos están acá (mats y todo).</p>
    </div>
    <div style="background:#FFF3E0;border-left:4px solid #E65100;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0">
      <p style="margin:0 0 8px;color:#333;font-size:14px;line-height:1.6"><strong>🧊 Sobre la inmersión en agua fría después de Yoga:</strong></p>
      <ul style="margin:0;padding-left:20px;color:#333;font-size:14px;line-height:1.8">
        <li>Para entrar al agua fría tras Yoga, debes haber completado previamente una <strong>sesión guiada del Método Wim Hof</strong> en Nave Studio, independiente de si lo has hecho en otro lugar. Tu seguridad es nuestra prioridad.</li>
        <li><strong>Máximo 2 minutos</strong> en el agua. Esto es estricto. En sesiones del Método Wim Hof puedes estar más tiempo, siempre bajo la guía de tu instructor.</li>
        <li>Respeta el tiempo de tu instructora: la clase completa dura 1 hora, por lo que la inmersión es entrar y salir.</li>
      </ul>
    </div>`;
}

function buildReminderEmail(p: {
  customerName: string;
  serviceName: string;
  professionalName: string;
  formattedDate: string;
  startTime: string;
  endTime: string;
}): string {
  const whatToBring = buildWhatToBringSection(p.serviceName);

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
<span style="display:none;max-height:0;overflow:hidden">Mañana tienes tu sesión en Nave Studio — recordatorio rápido</span>
<div class="wrap">
  <div class="hdr"><h1>Nave Studio</h1></div>
  <div class="body">
    <p style="font-size:16px;color:#333;margin-top:0">Hola <strong>${p.customerName}</strong>!</p>
    <p style="font-size:15px;color:#555;line-height:1.6">Te recordamos que mañana tienes tu sesión agendada:</p>
    <div class="card">
      <p><strong>Sesión:</strong> ${p.serviceName}</p>
      <p><strong>Instructor:</strong> ${p.professionalName}</p>
      <p><strong>Fecha:</strong> <span style="text-transform:capitalize">${p.formattedDate}</span></p>
      <p><strong>Horario:</strong> ${p.startTime} - ${p.endTime} hrs</p>
      <p><strong>Dirección:</strong> Antares 259, Las Condes</p>
    </div>
    <div style="background:#FFF8E1;border-left:4px solid #FFC107;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0">
      <p style="margin:0;color:#333;font-size:14px;line-height:1.6"><strong>🗺️ Cómo llegar:</strong></p>
      <p style="margin:8px 0 0;color:#333;font-size:14px;line-height:1.6">Portón negro a la derecha de la numeración. Verás un pequeño platillo volador. Se corre manual y subes al segundo piso.</p>
    </div>
    ${whatToBring}
    <p style="font-size:14px;color:#555;margin-top:20px">Si necesitas mover tu hora o tienes alguna pregunta, escríbenos por WhatsApp:</p>
    <div style="text-align:center;margin:28px 0">
      <a href="${MAPS_LINK}" class="btn btn-green">📍 Abrir en Google Maps</a>
      <a href="${NAVE_WHATSAPP}" class="btn btn-outline">💬 WhatsApp directo</a>
    </div>
    <p style="font-size:15px;color:#555;margin-top:24px">Nos vemos mañana!<br><strong>Alan y equipo — Nave Studio</strong></p>
  </div>
  <div class="footer">Nave Studio · Antares 259, Las Condes</div>
</div></body></html>`;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Running booking reminder job...");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const now = new Date();
    const reminderTimeStart = addHours(now, 23);
    const reminderTimeEnd = addHours(now, 25);

    console.log("Looking for bookings between:", reminderTimeStart, "and", reminderTimeEnd);

    const { data: bookings, error: fetchError } = await supabase
      .from("bookings")
      .select(`*, professional:professionals (name), service:services (name, description)`)
      .eq("status", "CONFIRMED")
      .gte("date_time_start", reminderTimeStart.toISOString())
      .lte("date_time_start", reminderTimeEnd.toISOString());

    if (fetchError) {
      console.error("Error fetching bookings:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${bookings?.length || 0} bookings to send reminders for`);

    if (!bookings || bookings.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    const timezone = "America/Santiago";
    let sentCount = 0;
    let failedCount = 0;

    for (const booking of bookings) {
      try {
        const startDateTime = toZonedTime(new Date(booking.date_time_start), timezone);
        const endDateTime = toZonedTime(new Date(booking.date_time_end), timezone);

        const formattedDate = format(startDateTime, "EEEE d 'de' MMMM 'de' yyyy", { locale: { code: "es" } });
        const formattedStartTime = format(startDateTime, "HH:mm");
        const formattedEndTime = format(endDateTime, "HH:mm");

        const emailHtml = buildReminderEmail({
          customerName: booking.customer_name,
          serviceName: booking.service.name,
          professionalName: booking.professional.name,
          formattedDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
        });

        await resend.emails.send({
          from: "Nave Studio <agenda@studiolanave.com>",
          reply_to: "lanave@alaniceman.com",
          to: [booking.customer_email],
          subject: `Mañana es tu sesión — ${booking.service.name}`,
          html: emailHtml,
        });

        console.log(`Reminder sent to ${booking.customer_email} for booking ${booking.id}`);
        sentCount++;

        // Resend rate limit
        await new Promise((r) => setTimeout(r, 600));
      } catch (emailError) {
        console.error(`Failed to send reminder for booking ${booking.id}:`, emailError);
        failedCount++;
      }
    }

    console.log(`Reminder job completed: ${sentCount} sent, ${failedCount} failed`);

    return new Response(
      JSON.stringify({ success: true, sent: sentCount, failed: failedCount, total: bookings.length }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error: any) {
    console.error("Error in send-booking-reminder:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
};

serve(handler);
