import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { getCorsHeaders } from "../_shared/cors.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = getCorsHeaders();

interface SessionCodesEmailRequest {
  buyerEmail: string;
  buyerName: string;
  packageName: string;
  codes: string[];
  expiresAt: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { buyerEmail, buyerName, packageName, codes, expiresAt }: SessionCodesEmailRequest = await req.json();

    const expiryDate = new Date(expiresAt).toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const codesHtml = codes.map(code => 
      `<div style="background: #f5f5f5; border: 2px dashed #333; padding: 15px; margin: 10px 0; text-align: center; font-family: monospace; font-size: 24px; font-weight: bold; letter-spacing: 3px;">${code}</div>`
    ).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 ¡Gracias por tu compra!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hola ${buyerName},</h2>
            
            <p style="font-size: 16px;">
              Has comprado exitosamente el paquete <strong>${packageName}</strong> de Studio La Nave.
            </p>
            
            <p style="font-size: 16px;">
              Aquí están tus códigos de sesión:
            </p>
            
            ${codesHtml}
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px;">
                <strong>⏰ Importante:</strong> Estos códigos son válidos hasta el <strong>${expiryDate}</strong>
              </p>
            </div>
            
            <h3 style="color: #333; margin-top: 30px;">¿Cómo usar tus códigos?</h3>
            <ol style="font-size: 15px; padding-left: 20px;">
              <li>Ve a <a href="https://studiolanave.com/agenda-nave-studio" style="color: #667eea;">studiolanave.com/agenda-nave-studio</a></li>
              <li>Selecciona el profesional, fecha y hora</li>
              <li>Ingresa uno de tus códigos en el formulario de reserva</li>
              <li>¡Listo! Tu sesión quedará confirmada sin costo adicional</li>
            </ol>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              Cada código puede usarse una sola vez. Guarda este email para tener tus códigos siempre a mano.
            </p>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="font-size: 14px; color: #666; margin: 5px 0;">
                Studio La Nave<br>
                <a href="https://studiolanave.com" style="color: #667eea; text-decoration: none;">studiolanave.com</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Studio La Nave <onboarding@resend.dev>",
      to: [buyerEmail],
      subject: `Tus códigos de sesión - ${packageName}`,
      html: emailHtml,
    });

    console.log("Session codes email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-session-codes-email:", error);
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