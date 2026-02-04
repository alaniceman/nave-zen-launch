import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { getCorsHeaders } from "../_shared/cors.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface AbandonmentEmailRequest {
  orderId: string;
  buyerEmail: string;
  buyerName: string;
  packageName: string;
  finalPrice: number;
  isGiftCard?: boolean;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      orderId,
      buyerEmail, 
      buyerName, 
      packageName, 
      finalPrice,
      isGiftCard,
    }: AbandonmentEmailRequest = await req.json();

    console.log(`Sending abandonment email to ${buyerEmail} for order ${orderId}`);

    const siteUrl = Deno.env.get("SITE_URL")?.replace(/\/$/, "") || "https://studiolanave.com";
    
    // Determine the purchase URL based on type
    const purchaseUrl = isGiftCard 
      ? `${siteUrl}/giftcards`
      : `${siteUrl}/bonos`;

    const formattedPrice = new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(finalPrice);

    // Calculate discounted price (10% off)
    const discountedPrice = Math.floor(finalPrice * 0.9);
    const formattedDiscountedPrice = new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(discountedPrice);

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🧊 ¿Olvidaste algo?</h1>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hola ${buyerName},</h2>
            
            <p style="font-size: 16px;">
              Notamos que dejaste tu compra de <strong>${packageName}</strong> sin completar.
            </p>
            
            <p style="font-size: 16px;">
              Sabemos que a veces las cosas pasan, por eso queremos darte un <strong>10% de descuento</strong> para que no te quedes sin tu experiencia.
            </p>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; color: white;">
              <p style="margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Tu código de descuento</p>
              <div style="background: white; color: #667eea; padding: 15px 25px; border-radius: 8px; font-family: monospace; font-size: 28px; font-weight: bold; letter-spacing: 3px; display: inline-block;">
                ICE10
              </div>
              <p style="margin: 15px 0 0 0; font-size: 14px;">10% de descuento en tu próxima compra</p>
            </div>
            
            <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #666;">
                <strong>📋 Tu pedido:</strong>
              </p>
              <p style="margin: 0; font-size: 16px;">
                <strong>${packageName}</strong>
              </p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">
                Precio: <span style="text-decoration: line-through;">${formattedPrice}</span> 
                <strong style="color: #667eea; font-size: 16px;"> → ${formattedDiscountedPrice}</strong> con ICE10
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${purchaseUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-size: 18px; font-weight: bold;">
                Completar mi compra
              </a>
            </div>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <p style="margin: 0; font-size: 14px;">
                <strong>⏰ Importante:</strong> Este código tiene tiempo limitado. ¡No te quedes sin tu experiencia!
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="font-size: 14px; color: #666;">
              ¿Tienes alguna pregunta? Escríbenos por WhatsApp al <a href="https://wa.me/56912345678" style="color: #667eea;">+56 9 1234 5678</a>
            </p>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="font-size: 14px; color: #666; margin: 5px 0;">
                Studio La Nave<br>
                <a href="${siteUrl}" style="color: #667eea; text-decoration: none;">studiolanave.com</a>
              </p>
            </div>
          </div>
          
          <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
            Si no deseas recibir estos emails, simplemente ignóralo.
          </p>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Studio La Nave <agenda@studiolanave.com>",
      to: [buyerEmail],
      subject: "🧊 ¡No te quedes sin tu experiencia! 10% OFF con código ICE10",
      html: emailHtml,
    });

    console.log("Abandonment email sent successfully:", emailResponse);

    // Update the order to mark that the abandonment email was sent
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await supabase
      .from("package_orders")
      .update({ abandonment_email_sent_at: new Date().toISOString() })
      .eq("id", orderId);

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-abandonment-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
