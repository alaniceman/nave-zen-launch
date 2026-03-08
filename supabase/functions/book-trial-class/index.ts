import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { getCorsHeaders } from "../_shared/cors.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { upsertCustomerAndLogEvent } from "../_shared/crm.ts";

const bookingSchema = z.object({
  customerName: z.string().trim().min(1).max(100),
  customerEmail: z.string().trim().email().max(255),
  customerPhone: z.string().trim().min(8).max(20),
  classTitle: z.string().trim().min(1).max(200),
  dayKey: z.string().trim().min(1).max(20),
  time: z.string().trim().min(1).max(10),
  selectedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
});

/** Normalize Chilean phone to E.164 */
function normalizePhone(raw: string): string {
  let digits = raw.replace(/[^0-9]/g, "");
  // If starts with 56 and is 11 digits, already has country code
  if (digits.startsWith("56") && digits.length === 11) return `+${digits}`;
  // If 9 digits starting with 9, add +56
  if (digits.length === 9 && digits.startsWith("9")) return `+56${digits}`;
  // If 8 digits, assume mobile without leading 9
  if (digits.length === 8) return `+569${digits}`;
  // Fallback: return with + prefix
  return `+${digits}`;
}

const DAY_NAMES: Record<string, string> = {
  lunes: "Lunes", martes: "Martes", miercoles: "Miércoles",
  jueves: "Jueves", viernes: "Viernes", sabado: "Sábado", domingo: "Domingo"
};

interface TrialEmailParams {
  name: string;
  classTitle: string;
  formattedDate: string;
  time: string;
  mapsLink: string;
  naveWhatsapp: string;
  preheader: string;
  introText: string;
}

function buildTrialEmailHtml(p: TrialEmailParams): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5}
.wrap{max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden}
.hdr{background:#2E4D3A;padding:32px 24px;text-align:center}
.hdr h1{margin:0;color:#fff;font-size:22px;font-weight:600}
.body{padding:28px 24px}
.card{background:#F8F9FA;border-radius:10px;padding:20px;margin:20px 0}
.card p{margin:0 0 8px;color:#333;font-size:15px;line-height:1.5}
.card p:last-child{margin-bottom:0}
.directions{background:#FFF8E1;border-left:4px solid #FFC107;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0}
.directions p{margin:0;color:#333;font-size:14px;line-height:1.6}
.bring{background:#F0F7FF;border-left:4px solid #2E4D3A;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0}
.bring p{margin:0;color:#333;font-size:14px;line-height:1.6}
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
    <p style="font-size:15px;color:#555;line-height:1.6">${p.introText}</p>
    <div class="card">
      <p><strong>Clase:</strong> ${p.classTitle}</p>
      <p><strong>Fecha:</strong> <span style="text-transform:capitalize">${p.formattedDate}</span></p>
      <p><strong>Hora:</strong> ${p.time} hrs</p>
      <p><strong>Dirección:</strong> Antares 259, Las Condes</p>
    </div>
    <div class="directions">
      <p><strong>🗺️ Cómo llegar (importante):</strong></p>
      <p>Es el portón negro a mano derecha de donde sale la numeración. Van a ver un pequeño platillo volador. El portón se corre manual y luego subes al segundo piso.</p>
    </div>
    <div class="bring">
      <p><strong>🎒 Qué llevar:</strong></p>
      <p><strong>Yoga:</strong> ropa cómoda. Los implementos están acá (mats y todo).</p>
    </div>
    <div style="text-align:center;margin:28px 0">
      <a href="${p.mapsLink}" class="btn btn-green">📍 Abrir en Google Maps</a>
      <a href="${p.naveWhatsapp}" class="btn btn-outline">💬 WhatsApp directo</a>
    </div>
    <p style="font-size:15px;color:#555;margin-top:24px">Nos vemos pronto!<br><strong>Alan y equipo — Nave Studio</strong></p>
  </div>
  <div class="footer">Nave Studio · Antares 259, Las Condes</div>
</div></body></html>`;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const data = bookingSchema.parse(body);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Eligibility check
    const { data: existing } = await supabase
      .from("trial_bookings")
      .select("id, status")
      .eq("customer_email", data.customerEmail.toLowerCase())
      .in("status", ["booked", "attended"])
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(JSON.stringify({ alreadyAttended: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 2. Normalize phone
    const phone = normalizePhone(data.customerPhone);

    // 3. Create trial booking
    const { data: booking, error: bookingError } = await supabase
      .from("trial_bookings")
      .insert({
        customer_name: data.customerName,
        customer_email: data.customerEmail.toLowerCase(),
        customer_phone: phone,
        class_title: data.classTitle,
        class_day: data.dayKey,
        class_time: data.time,
        scheduled_date: data.selectedDate,
        status: "booked",
        source: "web",
        utm_source: data.utm_source || null,
        utm_medium: data.utm_medium || null,
        utm_campaign: data.utm_campaign || null,
      })
      .select("id")
      .single();

    if (bookingError) {
      console.error("Insert error:", bookingError);
      throw new Error("Failed to create booking");
    }

    // 4. Upsert email_subscribers
    const { data: existingSub } = await supabase
      .from("email_subscribers")
      .select("id")
      .eq("email", data.customerEmail.toLowerCase())
      .limit(1);

    if (existingSub && existingSub.length > 0) {
      await supabase
        .from("email_subscribers")
        .update({ whatsapp: phone, updated_at: new Date().toISOString() })
        .eq("id", existingSub[0].id);
    } else {
      await supabase.from("email_subscribers").insert({
        email: data.customerEmail.toLowerCase(),
        whatsapp: phone,
        source: "trial-class",
        tags: ["clase-de-prueba"],
        mailerlite_synced: false,
      });
    }

    // 5. MailerLite sync
    const MAILERLITE_API_KEY = Deno.env.get("MAILERLITE_API_KEY");
    const MAILERLITE_TRIAL_GROUP_ID = Deno.env.get("MAILERLITE_TRIAL_GROUP_ID");
    if (MAILERLITE_API_KEY) {
      try {
        const groups = MAILERLITE_TRIAL_GROUP_ID ? [MAILERLITE_TRIAL_GROUP_ID] : [];
        await fetch("https://connect.mailerlite.com/api/subscribers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${MAILERLITE_API_KEY}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: data.customerEmail.toLowerCase(),
            groups,
            fields: { phone, name: data.customerName, source: "trial-class" },
            tags: ["clase-de-prueba"],
            status: "active",
          }),
        });

        // Mark synced
        await supabase
          .from("trial_bookings")
          .update({ mailerlite_synced: true })
          .eq("id", booking.id);
      } catch (mlErr) {
        console.error("MailerLite sync error:", mlErr);
      }
    }

    // 6. Format date for emails
    const dateObj = new Date(data.selectedDate + "T12:00:00");
    const formattedDate = dateObj.toLocaleDateString("es-CL", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
    const dayName = DAY_NAMES[data.dayKey] || data.dayKey;
    const whatsappLink = `https://wa.me/${phone.replace("+", "")}`;
    const naveWhatsapp = "https://wa.me/56946120426";
    const mapsLink = "https://maps.app.goo.gl/YGMv9VjfZM6HPxEy8";

    // 7. Send confirmation email to user
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);

      await resend.emails.send({
        from: "Nave Studio <no-reply@studiolanave.com>",
        reply_to: "lanave@alaniceman.com",
        to: [data.customerEmail],
        bcc: ["flowithmaral@gmail.com"],
        subject: `Confirmación — tu clase de prueba en Nave Studio`,
        html: buildTrialEmailHtml({
          name: data.customerName,
          classTitle: data.classTitle,
          formattedDate,
          time: data.time,
          mapsLink,
          naveWhatsapp,
          preheader: "Listo, tu clase de prueba quedó agendada.",
          introText: "Listo, tu clase de prueba quedó agendada:",
        }),
      });

      // 8. Internal notification email
      await resend.emails.send({
        from: "Nave Studio <no-reply@studiolanave.com>",
        reply_to: "lanave@alaniceman.com",
        to: ["lanave@alaniceman.com"],
        subject: `Nueva clase de prueba: ${data.customerName} — ${data.classTitle}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
            <h1 style="color: #2E4D3A; font-size: 20px;">Nueva clase de prueba agendada</h1>
            
            <div style="background: #F8F9FA; border-radius: 12px; padding: 20px; margin: 16px 0;">
              <p style="margin: 0 0 8px;"><strong>Nombre:</strong> ${data.customerName}</p>
              <p style="margin: 0 0 8px;"><strong>Email:</strong> <a href="mailto:${data.customerEmail}">${data.customerEmail}</a></p>
              <p style="margin: 0 0 8px;"><strong>Celular:</strong> <a href="${whatsappLink}">${phone}</a> (WhatsApp)</p>
              <p style="margin: 0 0 8px;"><strong>Clase:</strong> ${data.classTitle}</p>
              <p style="margin: 0 0 8px;"><strong>Fecha:</strong> <span style="text-transform: capitalize;">${formattedDate}</span></p>
              <p style="margin: 0;"><strong>Hora:</strong> ${data.time} hrs</p>
            </div>

            ${data.utm_source ? `<p style="color: #999; font-size: 12px;">UTM: ${data.utm_source} / ${data.utm_medium || "-"} / ${data.utm_campaign || "-"}</p>` : ""}
          </div>
        `,
      });
    }

    // 9. CRM: upsert customer + log event
    await upsertCustomerAndLogEvent(supabase, {
      email: data.customerEmail,
      name: data.customerName,
      phone: phone,
      eventType: "trial_booked",
      eventTitle: "Agendó clase de prueba",
      eventDescription: `${data.classTitle} — ${DAY_NAMES[data.dayKey] || data.dayKey} ${data.time}`,
      metadata: { trial_booking_id: booking.id, scheduled_date: data.selectedDate },
      statusIfNew: "trial_booked",
    });

    return new Response(JSON.stringify({ success: true, bookingId: booking.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("book-trial-class error:", err);
    const message = err instanceof z.ZodError ? "Datos inválidos" : "Error interno";
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
