import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { subMinutes, subDays, format } from "https://esm.sh/date-fns@3.6.0";
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
    console.log("Running session feedback job...");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Search for sessions that ended at least 30 minutes ago (to give time for the session to wrap up)
    // and up to 7 days ago (to recover any missed emails)
    // This ensures reliability even if cron executions are missed
    const now = new Date();
    const minWaitTime = subMinutes(now, 30);  // Wait at least 30 min after session ends
    const maxAge = subDays(now, 7);           // Don't send to sessions older than 7 days

    console.log("Session feedback job started at:", now.toISOString());
    console.log("Looking for sessions that ended between:", maxAge.toISOString(), "and", minWaitTime.toISOString());

    const { data: bookings, error: fetchError } = await supabase
      .from("bookings")
      .select(`
        *,
        professional:professionals (name),
        service:services (name)
      `)
      .eq("status", "CONFIRMED")
      .eq("feedback_email_sent", false)
      .gte("date_time_end", maxAge.toISOString())
      .lte("date_time_end", minWaitTime.toISOString())
      .order("date_time_end", { ascending: true })
      .limit(50);

    if (fetchError) {
      console.error("Error fetching bookings:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${bookings?.length || 0} sessions to send feedback requests for`);

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

    for (const booking of bookings) {
      try {
        const startDateTime = toZonedTime(new Date(booking.date_time_start), timezone);
        // Use simple date formatting without locale to avoid esm.sh issues
        const day = startDateTime.getDate();
        const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const formattedDate = `${day} de ${monthNames[startDateTime.getMonth()]}`;

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
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  background-color: #f5f5f5;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                }
                .header {
                  padding: 44px 30px 36px;
                  text-align: center;
                  background: #2E4D3A;
                  color: white;
                }
                .header h1 {
                  margin: 0;
                  font-size: 26px;
                  font-weight: 700;
                  letter-spacing: -0.01em;
                }
                .header .stars {
                  font-size: 22px;
                  margin-bottom: 8px;
                  letter-spacing: 4px;
                }
                .content {
                  padding: 40px 30px;
                }
                .message {
                  font-size: 16px;
                  color: #333;
                  line-height: 1.7;
                  margin-bottom: 24px;
                }
                .highlight {
                  background-color: #EEF3F0;
                  border-radius: 10px;
                  padding: 20px;
                  margin: 24px 0;
                  text-align: center;
                }
                .highlight p {
                  margin: 0;
                  color: #2E4D3A;
                  font-size: 15px;
                }
                .cta-button {
                  display: inline-block;
                  background: #2E4D3A;
                  color: white !important;
                  text-decoration: none;
                  padding: 16px 40px;
                  border-radius: 10px;
                  font-size: 16px;
                  font-weight: 600;
                  margin: 8px 0;
                }
                .cta-button-google {
                  display: inline-block;
                  background: #4285F4;
                  color: white !important;
                  text-decoration: none;
                  padding: 18px 44px;
                  border-radius: 10px;
                  font-size: 17px;
                  font-weight: 700;
                  margin: 8px 0;
                }
                .cta-container {
                  text-align: center;
                  margin: 28px 0;
                }
                .note {
                  font-size: 14px;
                  color: #888;
                  text-align: center;
                  margin-top: 16px;
                }
                .section {
                  margin-top: 36px;
                  padding-top: 32px;
                  border-top: 1px solid #e0e0e0;
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
                  <div class="stars">⭐⭐⭐⭐⭐</div>
                  <h1>¿Cómo estuvo tu sesión?</h1>
                </div>

                <div class="content">
                  <p class="message">
                    Hola <strong>${booking.customer_name}</strong>,
                  </p>

                  <p class="message">
                    ¡Gracias por venir a tu sesión de <strong>${booking.service?.name || 'Nave Studio'}</strong>! Esperamos que haya sido una experiencia transformadora. 🙌
                  </p>

                  <p class="message">
                    Si te gustó la experiencia, <strong>la mejor forma de ayudarnos es dejando una reseña en Google</strong>. Tu opinión ayuda a que más personas descubran Nave Studio y se animen a sumergirse en el agua fría. ¡Nos encantaría leer tu experiencia!
                  </p>

                  <div class="highlight">
                    <p>⏱️ Solo te toma <strong>1 minuto</strong> y significa muchísimo para nosotros</p>
                  </div>

                  <div class="cta-container">
                    <a href="https://g.page/r/Cfv8WYiprWfvECE/review" class="cta-button-google">
                      ⭐ Dejar mi reseña en Google
                    </a>
                  </div>

                  <p class="note">
                    Cada reseña nos ayuda a seguir creciendo como comunidad 💜
                  </p>

                  <div class="section">
                    <p class="message" style="text-align: center;">
                      <strong>¿Tienes algo más que contarnos?</strong>
                    </p>
                    <p class="message" style="text-align: center; color: #666;">
                      Si quieres compartir feedback detallado (qué mejoró tu experiencia, qué sugerencias tienes), cuéntanos en este breve formulario.
                    </p>
                    <div class="cta-container">
                      <a href="https://tally.so/r/wa0RZW" class="cta-button">
                        Dar feedback interno
                      </a>
                    </div>
                  </div>

                  <div class="section">
                    <p class="message" style="text-align: center;">
                      <strong>🧊 ¡Únete a los Crionautas!</strong>
                    </p>
                    <p class="message" style="text-align: center; color: #666;">
                      Nuestra comunidad de WhatsApp donde compartimos tips, experiencias y nos motivamos mutuamente en el camino del hielo.
                    </p>
                    <div class="cta-container">
                      <a href="https://chat.whatsapp.com/HdTFY3RryAMA5e7GAleMHq?mode=gi_t" style="display: inline-block; background: #25D366; color: white !important; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 600;">
                        💬 Unirme a los Crionautas
                      </a>
                    </div>
                  </div>

                  <p class="message" style="margin-top: 32px;">
                    ¡Gracias por ser parte de Nave Studio!
                  </p>

                  <p class="message">
                    Con cariño,<br>
                    <strong>El equipo de Nave Studio</strong> 🛸
                  </p>
                </div>

                <div class="footer">
                  <p>Nave Studio - Transformando cuerpo y mente</p>
                </div>
              </div>
            </body>
          </html>
        `;

        await resend.emails.send({
          from: "Nave Studio <agenda@studiolanave.com>",
          reply_to: "lanave@alaniceman.com",
          to: [booking.customer_email],
          subject: "🛸 ¿Cómo estuvo tu sesión hoy? - Tu feedback nos ayuda mucho",
          html: emailHtml,
        });

        // Mark as sent
        await supabase
          .from("bookings")
          .update({ feedback_email_sent: true })
          .eq("id", booking.id);

        console.log(`Feedback request sent to ${booking.customer_email} for booking ${booking.id}`);
        sentCount++;
      } catch (emailError) {
        console.error(`Failed to send feedback request for booking ${booking.id}:`, emailError);
        failedCount++;
      }
    }

    console.log(`Feedback job completed: ${sentCount} sent, ${failedCount} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: sentCount,
        failed: failedCount,
        total: bookings.length 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-session-feedback:", error);
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
