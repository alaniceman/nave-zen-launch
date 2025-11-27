import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { format } from "https://esm.sh/date-fns@3.6.0";
import { es } from "https://esm.sh/date-fns@3.6.0/locale";
import { toZonedTime } from "https://esm.sh/date-fns-tz@3.1.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingConfirmationRequest {
  bookingId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { bookingId }: BookingConfirmationRequest = await req.json();

    console.log("Sending confirmation email for booking:", bookingId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch booking details with professional and service info
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(`
        *,
        professional:professionals (name, email),
        service:services (name, description)
      `)
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      console.error("Error fetching booking:", bookingError);
      return new Response(
        JSON.stringify({ error: "Booking not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Format date and time for Chile timezone
    const timezone = "America/Santiago";
    const startDateTime = toZonedTime(new Date(booking.date_time_start), timezone);
    const endDateTime = toZonedTime(new Date(booking.date_time_end), timezone);
    
    const formattedDate = format(startDateTime, "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
    const formattedStartTime = format(startDateTime, "HH:mm");
    const formattedEndTime = format(endDateTime, "HH:mm");

    // Build email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            .header {
              padding: 40px 30px;
              text-align: center;
              border-bottom: 1px solid #e0e0e0;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              color: #1a1a1a;
              font-weight: 600;
            }
            .content {
              padding: 40px 30px;
            }
            .booking-details {
              background-color: #f9f9f9;
              border-radius: 8px;
              padding: 24px;
              margin: 24px 0;
            }
            .detail-row {
              display: table;
              width: 100%;
              margin-bottom: 16px;
            }
            .detail-row:last-child {
              margin-bottom: 0;
            }
            .detail-label {
              display: table-cell;
              font-weight: 600;
              color: #666;
              font-size: 14px;
              padding-right: 16px;
              width: 120px;
            }
            .detail-value {
              display: table-cell;
              color: #1a1a1a;
              font-size: 16px;
            }
            .what-to-bring {
              background-color: #f0f7ff;
              border-left: 4px solid #2196F3;
              padding: 20px;
              margin: 24px 0;
            }
            .what-to-bring h3 {
              margin: 0 0 16px 0;
              font-size: 16px;
              color: #1a1a1a;
              font-weight: 600;
            }
            .what-to-bring ul {
              margin: 0;
              padding-left: 20px;
              color: #333;
              font-size: 15px;
              line-height: 1.8;
            }
            .what-to-bring li {
              margin-bottom: 8px;
            }
            .important-note {
              background-color: #fff8e1;
              border-left: 4px solid #ffc107;
              padding: 16px;
              margin: 24px 0;
              color: #333;
              font-size: 15px;
              line-height: 1.6;
            }
            .footer {
              padding: 30px;
              text-align: center;
              color: #999;
              font-size: 13px;
              border-top: 1px solid #e0e0e0;
            }
            .footer p {
              margin: 0 0 8px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Reserva Confirmada</h1>
            </div>
            
            <div class="content">
              <p style="font-size: 16px; color: #333; margin-top: 0;">
                Hola <strong>${booking.customer_name}</strong>,
              </p>
              
              <p style="font-size: 15px; color: #555; line-height: 1.6;">
                Tu pago ha sido procesado correctamente. Aquí están los detalles de tu sesión:
              </p>
              
              <div class="booking-details">
                <div class="detail-row">
                  <div class="detail-label">Sesión:</div>
                  <div class="detail-value">${booking.service.name}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Instructor:</div>
                  <div class="detail-value">${booking.professional.name}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Fecha:</div>
                  <div class="detail-value">${formattedDate}</div>
                </div>
                <div class="detail-row">
                  <div class="detail-label">Horario:</div>
                  <div class="detail-value">${formattedStartTime} - ${formattedEndTime}</div>
                </div>
              </div>
              
              <div class="what-to-bring">
                <h3>📋 Qué traer:</h3>
                <ul>
                  <li>Traje de baño</li>
                  <li>Toalla grande</li>
                  <li>Bolsa para ropa mojada</li>
                  <li>Actitud positiva y disposición para la experiencia</li>
                </ul>
              </div>
              
              <div class="important-note">
                <strong>Importante:</strong> Por favor llega puntual y en ayunas ligeras para aprovechar al máximo tu experiencia.
              </div>
              
              <div style="background-color: #f0f7ff; border-left: 4px solid #2196F3; padding: 20px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1a1a1a; font-weight: 600;">📍 Dirección:</h3>
                <p style="margin: 0 0 8px 0; font-size: 15px; color: #333;">
                  <strong>Antares 259, Las Condes</strong>
                </p>
                <p style="margin: 0 0 12px 0; font-size: 15px; color: #555;">
                  <a href="https://maps.app.goo.gl/oW6G58gLd5oYWmGn8" style="color: #2196F3; text-decoration: none;">
                    📍 Ver en Google Maps
                  </a>
                </p>
                <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.6;">
                  <strong>Indicaciones:</strong> Portón negro de mano derecha. Tiene un cartel de un 🛸 en el borde del portón.
                </p>
              </div>
              
              <p style="font-size: 14px; color: #777; margin-top: 32px; line-height: 1.6;">
                ¿Tienes preguntas? No dudes en contactarnos respondiendo a este email o a través de nuestro WhatsApp.
              </p>
            </div>
            
            <div class="footer">
              <p>Gracias por confiar en nosotros</p>
              <p>Nave Studio</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to customer with BCC to La Nave and instructor
    const bccRecipients = [
      "lanave@alaniceman.com",
      booking.professional.email
    ];

    const { error: emailError } = await resend.emails.send({
      from: "Nave Studio <agenda@studiolanave.com>",
      to: [booking.customer_email],
      bcc: bccRecipients,
      subject: "✓ Confirmación de tu Reserva - Nave Studio",
      html: emailHtml,
    });

    if (emailError) {
      console.error("Error sending email:", emailError);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: emailError }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Confirmation email sent successfully to:", booking.customer_email, "with BCC to:", bccRecipients.join(", "));

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-confirmation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
