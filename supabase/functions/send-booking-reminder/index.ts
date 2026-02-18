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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Running booking reminder job...");

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate time window: 24 hours from now (+/- 1 hour buffer)
    const now = new Date();
    const reminderTimeStart = addHours(now, 23); // 23 hours from now
    const reminderTimeEnd = addHours(now, 25);   // 25 hours from now

    console.log("Looking for bookings between:", reminderTimeStart, "and", reminderTimeEnd);

    // Fetch confirmed bookings in the next 24 hours
    const { data: bookings, error: fetchError } = await supabase
      .from("bookings")
      .select(`
        *,
        professional:professionals (name),
        service:services (name, description)
      `)
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
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const timezone = "America/Santiago";
    let sentCount = 0;
    let failedCount = 0;

    // Send reminder for each booking
    for (const booking of bookings) {
      try {
        const startDateTime = toZonedTime(new Date(booking.date_time_start), timezone);
        const endDateTime = toZonedTime(new Date(booking.date_time_end), timezone);
        
        const formattedDate = format(startDateTime, "EEEE d 'de' MMMM 'de' yyyy", { locale: { code: 'es' } });
        const formattedStartTime = format(startDateTime, "HH:mm");
        const formattedEndTime = format(endDateTime, "HH:mm");

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
                  background-color: #2196F3;
                  color: white;
                }
                .header h1 {
                  margin: 0;
                  font-size: 28px;
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
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>⏰ Recordatorio de Sesión</h1>
                </div>
                
                <div class="content">
                  <p style="font-size: 16px; color: #333; margin-top: 0;">
                    Hola <strong>${booking.customer_name}</strong>,
                  </p>
                  
                  <p style="font-size: 15px; color: #555; line-height: 1.6;">
                    Te recordamos que mañana tienes tu sesión agendada. Aquí están los detalles:
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
                    <h3>📋 Recuerda traer:</h3>
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
                  
                  <p style="font-size: 15px; color: #555; margin-top: 32px; line-height: 1.6;">
                    Si necesitas cancelar o tienes alguna pregunta, no dudes en contactarnos respondiendo a este email o a través de nuestro WhatsApp.
                  </p>
                  
                  <p style="font-size: 15px; color: #555; margin-top: 24px;">
                    ¡Nos vemos mañana!
                  </p>
                </div>
                
                <div class="footer">
                  <p>Nave Studio</p>
                </div>
              </div>
            </body>
          </html>
        `;

        await resend.emails.send({
          from: "Nave Studio <agenda@studiolanave.com>",
          reply_to: "lanave@alaniceman.com",
          to: [booking.customer_email],
          subject: "⏰ Recordatorio: Tu sesión es mañana - Nave Studio",
          html: emailHtml,
        });

        console.log(`Reminder sent to ${booking.customer_email} for booking ${booking.id}`);
        sentCount++;
      } catch (emailError) {
        console.error(`Failed to send reminder for booking ${booking.id}:`, emailError);
        failedCount++;
      }
    }

    console.log(`Reminder job completed: ${sentCount} sent, ${failedCount} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: sentCount,
        failed: failedCount,
        total: bookings.length 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-reminder:", error);
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
