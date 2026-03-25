import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { previewEmail } = await req.json();

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const buildEmail = (name: string, depleted: boolean) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.7; color: #4A4A4A; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f9ff;">
  <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0e7490 50%, #06b6d4 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
    <p style="color: rgba(255,255,255,0.8); margin: 0 0 8px 0; font-size: 14px; letter-spacing: 2px; text-transform: uppercase;">Studio La Nave presenta</p>
    <h1 style="color: white; margin: 0; font-size: 36px; letter-spacing: 2px;">🧊 ICEFEST</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 18px;">6 sesiones de Criomedicina por <strong>$60.000</strong></p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 16px 16px;">
    <h2 style="color: #1A1A1A; margin-top: 0; font-size: 22px;">Hola ${name} 👋</h2>
    
    ${depleted 
      ? `<p style="font-size: 16px;">¡Ya usaste todas tus sesiones de Criomedicina! Eso nos dice que te encantó la experiencia 💪</p>
         <p style="font-size: 16px;">Queremos que sigas con tu práctica, así que te extendemos nuestra promo exclusiva <strong>Icefest</strong>:</p>`
      : `<p style="font-size: 16px;">Vimos que te quedan muy pocas sesiones de Criomedicina. ¡No te quedes sin! 💪</p>
         <p style="font-size: 16px;">Te extendemos nuestra promo exclusiva <strong>Icefest</strong> para que sigas con tu práctica:</p>`
    }
    
    <!-- Pack Icefest -->
    <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0e7490 100%); border-radius: 16px; padding: 25px; margin: 25px 0; text-align: center; color: white;">
      <p style="margin: 0 0 5px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold; opacity: 0.9;">🧊 Icefest — 6 Sesiones</p>
      <p style="margin: 0; font-size: 42px; font-weight: bold;">$60.000</p>
      <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.9;">Solo <strong>$10.000</strong> por sesión</p>
    </div>
    
    <!-- Beneficios -->
    <div style="background: #F7F9FB; border-radius: 12px; padding: 20px; margin: 25px 0; border: 1px solid #e8ecf0;">
      <p style="margin: 0 0 14px 0; font-size: 17px; font-weight: bold; color: #0e7490;">¿Por qué aprovechar?</p>
      <p style="margin: 8px 0; font-size: 15px;">✅ Válidas por <strong>6 meses</strong> — úsalas a tu ritmo</p>
      <p style="margin: 8px 0; font-size: 15px;">🎁 <strong>Compártelas</strong> con amigos, familia o pareja</p>
      <p style="margin: 8px 0; font-size: 15px;">📅 Agenda cuando quieras desde la web</p>
      <p style="margin: 8px 0; font-size: 15px;">🧊 Sesiones guiadas de Criomedicina con inmersión en agua fría</p>
      <p style="margin: 8px 0; font-size: 15px;">💰 Ahorra un <strong>60%</strong> vs precio individual</p>
    </div>
    
    <!-- CTA -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://studiolanave.com/icefest" style="display: inline-block; background: linear-gradient(135deg, #0c4a6e 0%, #06b6d4 100%); color: white; text-decoration: none; padding: 16px 44px; border-radius: 10px; font-size: 18px; font-weight: bold;">
        🧊 Quiero mi pack Icefest
      </a>
    </div>
    
    <p style="font-size: 14px; text-align: center; color: #666;">
      Agenda tus sesiones en 
      <a href="https://studiolanave.com/agenda-nave-studio" style="color: #0e7490; font-weight: bold;">studiolanave.com/agenda-nave-studio</a>
    </p>
    
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
    
    <p style="font-size: 14px; color: #666;">
      ¿Tienes dudas? Escríbenos por 
      <a href="https://wa.me/56996706539" style="color: #0e7490;">WhatsApp</a>
    </p>
    
    <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
      <p style="font-size: 14px; color: #666; margin: 5px 0;">
        Studio La Nave 🧊<br>
        <a href="https://studiolanave.com" style="color: #0e7490; text-decoration: none;">studiolanave.com</a>
      </p>
    </div>
  </div>
  
  <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
    Recibiste este email porque compraste sesiones de Criomedicina en Studio La Nave.
  </p>
</body>
</html>`;

    const SUBJECT = "🧊 Icefest — 6 sesiones de Criomedicina por $60.000";

    // Preview mode
    if (previewEmail) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Studio La Nave <agenda@studiolanave.com>",
          reply_to: "lanave@alaniceman.com",
          to: [previewEmail],
          subject: SUBJECT,
          html: buildEmail("Alan", true),
        }),
      });
      const result = await res.json();
      console.log("Preview email sent:", result);
      return new Response(JSON.stringify({ success: true, preview: true, sent: 1, result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Production: find buyers with 0 or 1 remaining sessions
    const { data: codes, error: codesError } = await supabase
      .from("session_codes")
      .select("buyer_email, buyer_name, is_used, mercado_pago_payment_id")
      .not("mercado_pago_payment_id", "is", null);

    if (codesError) throw codesError;

    const buyerMap = new Map<string, { name: string; total: number; used: number }>();
    for (const code of codes || []) {
      const key = code.buyer_email;
      if (!buyerMap.has(key)) {
        buyerMap.set(key, { name: code.buyer_name, total: 0, used: 0 });
      }
      const entry = buyerMap.get(key)!;
      entry.total++;
      if (code.is_used) entry.used++;
    }

    // Filter: remaining <= 1
    const targetBuyers = Array.from(buyerMap.entries())
      .filter(([_, v]) => v.total > 0 && (v.total - v.used) <= 1)
      .map(([email, v]) => ({ email, name: v.name, depleted: v.used === v.total }));

    console.log(`Found ${targetBuyers.length} buyers with ≤1 remaining sessions`);

    let sent = 0;
    const errors: string[] = [];

    for (const buyer of targetBuyers) {
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Studio La Nave <agenda@studiolanave.com>",
            reply_to: "lanave@alaniceman.com",
            to: [buyer.email],
            subject: SUBJECT,
            html: buildEmail(buyer.name.split(" ")[0], buyer.depleted),
          }),
        });

        if (emailRes.ok) {
          sent++;
        } else {
          const err = await emailRes.text();
          errors.push(`${buyer.email}: ${err}`);
        }

        await new Promise(r => setTimeout(r, 600));
      } catch (e: any) {
        errors.push(`${buyer.email}: ${e.message}`);
      }
    }

    console.log(`Sent ${sent}/${targetBuyers.length} emails. Errors: ${errors.length}`);

    return new Response(JSON.stringify({ 
      success: true, 
      total: targetBuyers.length, 
      sent, 
      errors 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-icefest-promo:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
