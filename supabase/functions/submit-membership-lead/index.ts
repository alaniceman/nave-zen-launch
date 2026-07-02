import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { getCorsHeaders } from "../_shared/cors.ts";
import { upsertCustomerAndLogEvent } from "../_shared/crm.ts";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(8).max(20),
  planCode: z.string().min(1).max(60),
  planLabel: z.string().min(1).max(120),
  planGroup: z.enum(["completa", "yoga"]),
  boxmagicUrl: z.string().url(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  utm_source: z.string().max(100).optional(),
  utm_medium: z.string().max(100).optional(),
  utm_campaign: z.string().max(100).optional(),
});

function normalizePhone(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.startsWith("56") && digits.length === 11) return `+${digits}`;
  if (digits.length === 9 && digits.startsWith("9")) return `+56${digits}`;
  if (digits.length === 8) return `+569${digits}`;
  return `+${digits}`;
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

    const phone = normalizePhone(data.phone);
    const email = data.email.toLowerCase();

    const { data: lead, error: insertError } = await supabase
      .from("membership_leads")
      .insert({
        customer_name: data.name,
        customer_email: email,
        customer_phone: phone,
        plan_code: data.planCode,
        plan_label: data.planLabel,
        plan_group: data.planGroup,
        boxmagic_url: data.boxmagicUrl,
        requested_start_date: data.startDate,
        status: "redirigido_a_boxmagic",
        redirected_at: new Date().toISOString(),
        utm_source: data.utm_source || null,
        utm_medium: data.utm_medium || null,
        utm_campaign: data.utm_campaign || null,
      })
      .select("id")
      .single();

    if (insertError || !lead) {
      console.error("membership lead insert error:", insertError);
      throw new Error("Failed to create lead");
    }

    const background = async () => {
      try {
        // CRM
        await upsertCustomerAndLogEvent(supabase, {
          email,
          name: data.name,
          phone,
          eventType: "membership_lead",
          eventTitle: `Interesado en membresía — ${data.planLabel}`,
          eventDescription: `Fecha solicitada: ${data.startDate}`,
          metadata: {
            lead_id: lead.id,
            plan_code: data.planCode,
            plan_group: data.planGroup,
            requested_start_date: data.startDate,
          },
          statusIfNew: "lead",
        });

        // Admin notification
        const RESEND = Deno.env.get("RESEND_API_KEY");
        if (RESEND) {
          const resend = new Resend(RESEND);
          const phoneClean = phone.replace("+", "");
          await resend.emails.send({
            from: "Nave Studio <no-reply@studiolanave.com>",
            reply_to: "lanave@alaniceman.com",
            to: ["lanave@alaniceman.com"],
            bcc: ["flowithmaral@gmail.com"],
            subject: `Nueva Membresía: ${data.name} — ${data.planLabel}`,
            html: `<div style="font-family:Helvetica Neue,Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px">
              <h2 style="color:#2E4D3A">Nueva Membresía — Redirigido a BoxMagic</h2>
              <p><strong>Nombre:</strong> ${data.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>WhatsApp:</strong> <a href="https://wa.me/${phoneClean}">${phone}</a></p>
              <p><strong>Plan:</strong> ${data.planLabel}</p>
              <p><strong>Fecha de inicio solicitada:</strong> ${data.startDate}</p>
              <p style="color:#666;font-size:13px;margin-top:18px">El cliente fue redirigido al checkout de BoxMagic. Confirmar pago y activar en la fecha indicada.</p>
            </div>`,
          });
        }
      } catch (e) {
        console.error("[membership-lead background]", e);
      }
    };

    // @ts-ignore
    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(background());
    } else {
      background();
    }

    return new Response(
      JSON.stringify({ success: true, leadId: lead.id, boxmagicUrl: data.boxmagicUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("submit-membership-lead error:", err);
    const msg = err instanceof z.ZodError ? "Datos inválidos" : "Error interno";
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
