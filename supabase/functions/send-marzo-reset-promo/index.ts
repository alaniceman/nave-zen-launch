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

    // Build the email HTML
    const buildEmail = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f9ff;">
  <div style="background: linear-gradient(135deg, #0e7490 0%, #0891b2 50%, #06b6d4 100%); padding: 35px 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 1px;">🧊 MARZO RESET</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 16px;">Vuelve a sentir el frío</p>
  </div>
  
  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
    <h2 style="color: #0e7490; margin-top: 0;">Hola ${name} 👋</h2>
    
    <p style="font-size: 16px;">
      Vimos que ya usaste todas tus sesiones de Criomedicina. ¡Eso nos encanta! 💪
    </p>
    
    <p style="font-size: 16px;">
      Como parte de nuestro <strong>Marzo Reset</strong>, tenemos packs especiales para que sigas con tu práctica:
    </p>
    
    <!-- Pack 2 sesiones -->
    <div style="background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); border: 2px solid #06b6d4; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 5px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #0e7490; font-weight: bold;">Pack 2 Sesiones</p>
      <p style="margin: 0; font-size: 36px; font-weight: bold; color: #0e7490;">$40.000</p>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Ahorra $10.000 vs precio individual</p>
    </div>
    
    <!-- Pack 3 sesiones -->
    <div style="background: linear-gradient(135deg, #0e7490 0%, #0891b2 100%); border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center; color: white;">
      <p style="margin: 0 0 5px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">⭐ Pack 3 Sesiones</p>
      <p style="margin: 0; font-size: 36px; font-weight: bold;">$50.000</p>
      <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Ahorra $25.000 vs precio individual</p>
    </div>
    
    <!-- Beneficios -->
    <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 25px 0;">
      <p style="margin: 0 0 12px 0; font-size: 16px; font-weight: bold; color: #0e7490;">¿Por qué aprovechar?</p>
      <p style="margin: 6px 0; font-size: 15px;">✅ Válidos por <strong>6 meses</strong> — sin presión de tiempo</p>
      <p style="margin: 6px 0; font-size: 15px;">🎁 <strong>Compártelo con quien quieras</strong> — amigos, familia, pareja</p>
      <p style="margin: 6px 0; font-size: 15px;">📅 Agenda cuando quieras desde la web</p>
      <p style="margin: 6px 0; font-size: 15px;">🧊 Sesiones guiadas de Criomedicina con inmersión en agua fría</p>
    </div>
    
    <!-- CTA -->
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://studiolanave.com/marzo-reset" style="display: inline-block; background: linear-gradient(135deg, #0e7490 0%, #06b6d4 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 18px; font-weight: bold;">
        🧊 Quiero mi pack Marzo Reset
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

    // If preview mode, send only to the preview email
    if (previewEmail) {
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Studio La Nave <agenda@studiolanave.com>",
          reply_to: "lanave@alaniceman.com",
          to: [previewEmail],
          subject: "🧊 Marzo Reset — Packs especiales de Criomedicina para ti",
          html: buildEmail("Alan"),
        }),
      });

      const result = await emailResponse.json();
      console.log("Preview email sent:", result);

      return new Response(JSON.stringify({ success: true, preview: true, sent: 1, result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Production mode: find all depleted package buyers
    // Get all session codes grouped by buyer, find those with 0 remaining
    const { data: codes, error: codesError } = await supabase
      .from("session_codes")
      .select("buyer_email, buyer_name, is_used, mercado_pago_payment_id")
      .not("mercado_pago_payment_id", "is", null);

    if (codesError) throw codesError;

    // Group by buyer email + payment
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

    // Filter to fully depleted buyers
    const depletedBuyers = Array.from(buyerMap.entries())
      .filter(([_, v]) => v.total > 0 && v.used === v.total)
      .map(([email, v]) => ({ email, name: v.name }));

    console.log(`Found ${depletedBuyers.length} depleted buyers`);

    let sent = 0;
    const errors: string[] = [];

    for (const buyer of depletedBuyers) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Studio La Nave <agenda@studiolanave.com>",
            reply_to: "lanave@alaniceman.com",
            to: [buyer.email],
            subject: "🧊 Marzo Reset — Packs especiales de Criomedicina para ti",
            html: buildEmail(buyer.name.split(" ")[0]),
          }),
        });

        if (emailResponse.ok) {
          sent++;
        } else {
          const err = await emailResponse.text();
          errors.push(`${buyer.email}: ${err}`);
        }

        // Rate limit: 100ms between emails
        await new Promise(r => setTimeout(r, 100));
      } catch (e: any) {
        errors.push(`${buyer.email}: ${e.message}`);
      }
    }

    console.log(`Sent ${sent}/${depletedBuyers.length} emails. Errors: ${errors.length}`);

    return new Response(JSON.stringify({ 
      success: true, 
      total: depletedBuyers.length, 
      sent, 
      errors 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-marzo-reset-promo:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
