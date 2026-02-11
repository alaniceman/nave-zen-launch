import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      buyerName,
      buyerEmail,
      buyerPhone,
      packageName,
      totalCodes,
      remainingCodes,
      usedCode,
    } = await req.json();

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const isExhausted = remainingCodes === 0;
    const subject = isExhausted
      ? `🔴 ${buyerName} agotó su paquete "${packageName}"`
      : `🟡 ${buyerName} tiene ${remainingCodes} código(s) restante(s) - "${packageName}"`;

    const whatsappLink = buyerPhone
      ? `https://wa.me/${buyerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
          `Hola ${buyerName}! Vi que ${isExhausted ? "usaste todos los códigos" : "te queda poco"} de tu paquete "${packageName}". ¿Te gustaría renovar?`
        )}`
      : null;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: ${isExhausted ? "#dc2626" : "#ca8a04"};">
          ${isExhausted ? "🔴 Paquete Agotado" : "🟡 Paquete por Agotarse"}
        </h2>
        
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h3 style="margin: 0 0 12px 0;">Datos del comprador</h3>
          <p style="margin: 4px 0;"><strong>Nombre:</strong> ${buyerName}</p>
          <p style="margin: 4px 0;"><strong>Email:</strong> ${buyerEmail}</p>
          <p style="margin: 4px 0;"><strong>Teléfono:</strong> ${buyerPhone || "No registrado"}</p>
        </div>

        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <h3 style="margin: 0 0 12px 0;">Detalle del paquete</h3>
          <p style="margin: 4px 0;"><strong>Paquete:</strong> ${packageName}</p>
          <p style="margin: 4px 0;"><strong>Códigos totales:</strong> ${totalCodes}</p>
          <p style="margin: 4px 0;"><strong>Códigos usados:</strong> ${totalCodes - remainingCodes}</p>
          <p style="margin: 4px 0;"><strong>Códigos restantes:</strong> <span style="color: ${isExhausted ? "#dc2626" : "#ca8a04"}; font-weight: bold;">${remainingCodes}</span></p>
          <p style="margin: 4px 0;"><strong>Último código usado:</strong> ${usedCode}</p>
        </div>

        ${whatsappLink ? `
          <div style="text-align: center; margin: 24px 0;">
            <a href="${whatsappLink}" style="background: #25D366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
              💬 Contactar por WhatsApp
            </a>
          </div>
        ` : ""}

        <p style="color: #6b7280; font-size: 12px; margin-top: 24px;">
          Este es un email automático enviado por el sistema de Nave Studio.
        </p>
      </div>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "Nave Studio <agenda@studiolanave.com>",
        to: ["lanve@alaniceman.com"],
        subject,
        html,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Depletion alert email sent:", emailResult);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error sending depletion alert:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
