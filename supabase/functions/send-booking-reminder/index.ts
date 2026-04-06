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

const MAPS_LINK = "https://maps.app.goo.gl/32Pp7nxM8XiohAna8";
const NAVE_WHATSAPP = "https://wa.me/56946120426";

function isWimHof(serviceName: string): boolean {
  const lower = serviceName.toLowerCase();
  return lower.includes("wim hof") || lower.includes("ice bath") || lower.includes("baño de hielo") || lower.includes("criomedicin");
}

function buildWhatToBringSection(serviceName: string): string {
  if (isWimHof(serviceName)) {
    return `
      <div class="info-box bring">
        <p><strong>🎒 Recuerda llevar:</strong></p>
        <ul style="margin:8px 0 0;padding-left:20px;font-size:14px;line-height:1.8">
          <li>Traje de baño (ojalá ya puesto)</li>
          <li>Toalla</li>
          <li>Bolsa para ropa mojada</li>
          <li>¡Actitud!</li>
        </ul>
      </div>
      <div class="info-box" style="background:#F8FAFB;border-left:4px solid #2E4D3A">
        <p><strong>🎬 Videos sugeridos para prepararte:</strong></p>
        <p style="margin:8px 0 4px">1. <a href="https://youtu.be/6QfD1UY1weM?si=z6jt4dETdk93GjFd" style="color:#2E4D3A;font-weight:600">Cómo hacer la respiración Wim Hof en detalle</a></p>
        <p style="margin:0">2. <a href="https://youtu.be/OUCe2VjHyzg?si=s9v4Ft7MqS2_NjL5" style="color:#2E4D3A;font-weight:600">Respiración Wim Hof guiada</a></p>
      </div>
      <div class="info-box directions">
        <p><strong>Importante:</strong> Llega puntual y en ayunas ligeras para aprovechar al máximo tu experiencia.</p>
      </div>`;
  }

  return `
    <div class="info-box bring">
      <p><strong>🎒 Recuerda llevar:</strong></p>
      <p style="margin-top:6px"><strong>Yoga:</strong> ropa cómoda. Los implementos están acá (mats y todo).</p>
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
.info-box ul{color:#2A2A2A}
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
<span style="display:none;max-height:0;overflow:hidden">Mañana tienes tu sesión en Nave Studio — recordatorio rápido</span>
<div class="wrap">
  <div class="hdr"><h1>Nave Studio</h1></div>
  <div class="body">
    <p class="greeting">Hola <strong>${p.customerName}</strong>!</p>
    <p class="intro">Te recordamos que mañana tienes tu sesión agendada:</p>
    <div class="card">
      <p><strong>Sesión:</strong> ${p.serviceName}</p>
      <p><strong>Instructor:</strong> ${p.professionalName}</p>
      <p><strong>Fecha:</strong> <span style="text-transform:capitalize">${p.formattedDate}</span></p>
      <p><strong>Horario:</strong> ${p.startTime} - ${p.endTime} hrs</p>
      <p><strong>Dirección:</strong> Antares 259, Las Condes</p>
    </div>
    <div class="info-box directions">
      <p><strong>🗺️ Cómo llegar:</strong></p>
      <p style="margin-top:8px">Portón negro a la derecha de la numeración. Verás un pequeño platillo volador. Se corre manual y subes al segundo piso.</p>
    </div>
    ${whatToBring}
    <div class="info-box" style="background:#FFF5F5;border-left:4px solid #C53030;margin:0 0 20px;padding:18px 22px;border-radius:10px">
      <p style="margin:0 0 10px;font-size:15px;font-weight:700;color:#C53030">📋 Condiciones de cancelación</p>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.7;color:#4A4A4A">Te pedimos cancelar o reagendar tu sesión con al menos <strong>24 horas de anticipación</strong>.</p>
      <p style="margin:0 0 6px;font-size:14px;line-height:1.7;color:#4A4A4A">En caso de no asistir o cancelar fuera de ese plazo:</p>
      <ul style="margin:4px 0 10px;padding-left:20px;font-size:14px;line-height:1.8;color:#4A4A4A">
        <li>La clase se considera realizada y se pierde</li>
        <li>Podrás agendar una nueva sesión con un <strong>50% de descuento</strong></li>
      </ul>
      <p style="margin:0;font-size:13px;line-height:1.6;color:#6B7280;font-style:italic">Esta política existe para cuidar la organización de nuestras instructoras, quienes reservan su tiempo especialmente para cada clase.</p>
    </div>
    <p style="font-size:14px;color:#4A4A4A;margin:0 0 4px">Si necesitas mover tu hora o tienes alguna pregunta, escríbenos por WhatsApp:</p>
    <div class="cta-row">
      <a href="${MAPS_LINK}" class="btn btn-green">📍 Abrir en Google Maps</a>
      <a href="${NAVE_WHATSAPP}" class="btn btn-outline">💬 WhatsApp directo</a>
    </div>
    <p class="closing">Nos vemos mañana!<br><strong>Alan y equipo — Nave Studio</strong></p>
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
