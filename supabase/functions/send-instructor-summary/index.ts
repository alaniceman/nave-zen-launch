import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { format, addHours, addMinutes } from "https://esm.sh/date-fns@3.6.0";
import { toZonedTime } from "https://esm.sh/date-fns-tz@3.1.3";
import { es } from "https://esm.sh/date-fns@3.6.0/locale";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  date_time_start: string;
  date_time_end: string;
  professional_id: string;
  service_id: string;
  professional: { name: string; email: string };
  service: { name: string };
}

interface GroupedSession {
  professional: { name: string; email: string };
  service: { name: string };
  date_time_start: string;
  date_time_end: string;
  participants: Array<{
    name: string;
    email: string;
    phone: string;
  }>;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body for test mode
    let testMode = false;
    let testEmail = "";
    try {
      const body = await req.json();
      testMode = body.test === true;
      testEmail = body.testEmail || "";
    } catch {
      // No body or invalid JSON, continue normally
    }

    console.log("Running instructor summary job...", testMode ? "(TEST MODE)" : "");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate time window: 1.5 to 2.5 hours from now (1 hour window to run hourly)
    const now = new Date();
    const reminderTimeStart = addMinutes(now, 90);  // 1.5 hours from now
    const reminderTimeEnd = addMinutes(now, 150);   // 2.5 hours from now

    console.log("Looking for sessions between:", reminderTimeStart.toISOString(), "and", reminderTimeEnd.toISOString());

    // Build query
    let query = supabase
      .from("bookings")
      .select(`
        id,
        customer_name,
        customer_email,
        customer_phone,
        date_time_start,
        date_time_end,
        professional_id,
        service_id,
        professional:professionals (name, email),
        service:services (name)
      `)
      .eq("status", "CONFIRMED");

    // In test mode, get the most recent confirmed bookings instead of time-filtered
    if (testMode) {
      query = query.order("date_time_start", { ascending: false }).limit(3);
      console.log("TEST MODE: Fetching 3 most recent confirmed bookings");
    } else {
      query = query
        .gte("date_time_start", reminderTimeStart.toISOString())
        .lte("date_time_start", reminderTimeEnd.toISOString());
    }

    const { data: bookings, error: fetchError } = await query;

    if (fetchError) {
      console.error("Error fetching bookings:", fetchError);
      throw fetchError;
    }

    console.log(`Found ${bookings?.length || 0} bookings to process`);

    if (!bookings || bookings.length === 0) {
      return new Response(
        JSON.stringify({ success: true, emailsSent: 0, message: "No sessions in the next 2 hours" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Group bookings by professional + date_time_start (for group sessions)
    const groupedSessions = new Map<string, GroupedSession>();

    for (const booking of bookings as Booking[]) {
      const key = `${booking.professional_id}_${booking.date_time_start}`;
      
      if (!groupedSessions.has(key)) {
        groupedSessions.set(key, {
          professional: booking.professional,
          service: booking.service,
          date_time_start: booking.date_time_start,
          date_time_end: booking.date_time_end,
          participants: [],
        });
      }

      groupedSessions.get(key)!.participants.push({
        name: booking.customer_name,
        email: booking.customer_email,
        phone: booking.customer_phone,
      });
    }

    console.log(`Grouped into ${groupedSessions.size} unique sessions`);

    const timezone = "America/Santiago";
    let sentCount = 0;
    let failedCount = 0;

    // Helper function to add delay between emails (avoid Resend rate limit: 2 req/sec)
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Send email for each grouped session
    let isFirstEmail = true;
    for (const [key, session] of groupedSessions) {
      try {
        // Add delay before sending (except for first email) to avoid rate limiting
        if (!isFirstEmail) {
          console.log("Waiting 600ms before next email to avoid rate limit...");
          await delay(600);
        }
        isFirstEmail = false;

        const startDateTime = toZonedTime(new Date(session.date_time_start), timezone);
        const endDateTime = toZonedTime(new Date(session.date_time_end), timezone);

        // Format date in Spanish
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        
        const dayName = dayNames[startDateTime.getDay()];
        const dayNumber = startDateTime.getDate();
        const monthName = monthNames[startDateTime.getMonth()];
        const year = startDateTime.getFullYear();
        const formattedDate = `${dayName} ${dayNumber} de ${monthName} de ${year}`;
        
        const formattedStartTime = format(startDateTime, "HH:mm");
        const formattedEndTime = format(endDateTime, "HH:mm");

        // Build participants table rows
        const participantRows = session.participants
          .map((p, index) => `
            <tr style="border-bottom: 1px solid #e0e0e0;">
              <td style="padding: 12px 8px; text-align: center; color: #666;">${index + 1}</td>
              <td style="padding: 12px 8px;"><strong>${p.name}</strong></td>
              <td style="padding: 12px 8px;">
                <a href="mailto:${p.email}" style="color: #2196F3; text-decoration: none;">${p.email}</a>
              </td>
              <td style="padding: 12px 8px;">
                <a href="tel:${p.phone}" style="color: #2196F3; text-decoration: none;">${p.phone}</a>
              </td>
            </tr>
          `)
          .join("");

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
                  max-width: 700px;
                  margin: 0 auto;
                  background-color: #ffffff;
                }
                .header {
                  padding: 40px 30px;
                  text-align: center;
                  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                  color: white;
                }
                .header h1 {
                  margin: 0;
                  font-size: 24px;
                  font-weight: 600;
                }
                .header p {
                  margin: 8px 0 0 0;
                  opacity: 0.9;
                  font-size: 14px;
                }
                .content {
                  padding: 40px 30px;
                }
                .session-info {
                  background-color: #f8f9fa;
                  border-radius: 12px;
                  padding: 24px;
                  margin: 24px 0;
                  border-left: 4px solid #2196F3;
                }
                .session-info-row {
                  display: flex;
                  align-items: center;
                  margin-bottom: 12px;
                }
                .session-info-row:last-child {
                  margin-bottom: 0;
                }
                .session-info-icon {
                  font-size: 18px;
                  margin-right: 12px;
                  width: 24px;
                }
                .session-info-text {
                  font-size: 16px;
                  color: #333;
                }
                .participants-section {
                  margin-top: 32px;
                }
                .participants-header {
                  display: flex;
                  align-items: center;
                  margin-bottom: 16px;
                }
                .participants-header h2 {
                  margin: 0;
                  font-size: 18px;
                  color: #333;
                }
                .participants-count {
                  background-color: #2196F3;
                  color: white;
                  padding: 4px 12px;
                  border-radius: 20px;
                  font-size: 14px;
                  margin-left: 12px;
                }
                .participants-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 16px;
                  font-size: 14px;
                }
                .participants-table th {
                  background-color: #f0f0f0;
                  padding: 12px 8px;
                  text-align: left;
                  font-weight: 600;
                  color: #555;
                  border-bottom: 2px solid #ddd;
                }
                .participants-table th:first-child {
                  text-align: center;
                  width: 40px;
                }
                .footer {
                  padding: 24px 30px;
                  text-align: center;
                  color: #999;
                  font-size: 13px;
                  border-top: 1px solid #e0e0e0;
                  background-color: #fafafa;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>📋 Resumen de tu sesión</h1>
                  <p>Nave Studio</p>
                </div>
                
                <div class="content">
                  <p style="font-size: 16px; color: #333; margin-top: 0;">
                    Hola <strong>${session.professional.name}</strong>,
                  </p>
                  
                  <p style="font-size: 15px; color: #555; line-height: 1.6;">
                    Tienes una sesión en aproximadamente <strong>2 horas</strong>. Aquí está el detalle de los participantes:
                  </p>
                  
                  <div class="session-info">
                    <div class="session-info-row">
                      <span class="session-info-icon">📅</span>
                      <span class="session-info-text"><strong>Sesión:</strong> ${session.service.name}</span>
                    </div>
                    <div class="session-info-row">
                      <span class="session-info-icon">🕐</span>
                      <span class="session-info-text"><strong>Horario:</strong> ${formattedStartTime} - ${formattedEndTime}</span>
                    </div>
                    <div class="session-info-row">
                      <span class="session-info-icon">📍</span>
                      <span class="session-info-text"><strong>Fecha:</strong> ${formattedDate}</span>
                    </div>
                  </div>
                  
                  <div class="participants-section">
                    <div class="participants-header">
                      <h2>👥 Participantes</h2>
                      <span class="participants-count">${session.participants.length}</span>
                    </div>
                    
                    <table class="participants-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Nombre</th>
                          <th>Email</th>
                          <th>Teléfono</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${participantRows}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div class="footer">
                  <p>Este es un email automático generado por el sistema de Nave Studio</p>
                </div>
              </div>
            </body>
          </html>
        `;

        // In test mode, override recipient if testEmail provided
        const toEmail = testMode && testEmail ? testEmail : session.professional.email;
        
        const emailResult = await resend.emails.send({
          from: "Nave Studio <agenda@studiolanave.com>",
          reply_to: "lanave@alaniceman.com",
          to: [toEmail],
          cc: ["agenda@alaniceman.com"],
          subject: `${testMode ? "[TEST] " : ""}📋 Tu sesión de ${session.service.name} en 2 horas - ${session.participants.length} participante(s)`,
          html: emailHtml,
        });

        // Properly check for Resend API errors
        if (emailResult.error) {
          console.error(`Resend API error for ${toEmail}:`, emailResult.error);
          failedCount++;
        } else {
          console.log(`Summary email sent successfully to ${toEmail} for session at ${session.date_time_start}`, emailResult.data);
          sentCount++;
        }
      } catch (emailError) {
        console.error(`Failed to send summary for session ${key}:`, emailError);
        failedCount++;
      }
    }

    console.log(`Instructor summary job completed: ${sentCount} sent, ${failedCount} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailsSent: sentCount,
        emailsFailed: failedCount,
        totalSessions: groupedSessions.size,
        totalParticipants: bookings.length
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-instructor-summary:", error);
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
