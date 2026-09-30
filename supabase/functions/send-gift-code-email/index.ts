import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { getCorsHeaders } from "../_shared/cors.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const corsHeaders = getCorsHeaders();

interface GiftCodeEmailRequest {
  to: string;
  code: string;
  serviceName: string;
  expiresAt: string;
  scheduleLines: string[];
  dryRun?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, code, serviceName, expiresAt, scheduleLines, dryRun }: GiftCodeEmailRequest = await req.json();

    if (!to || !code || !serviceName || !expiresAt || !Array.isArray(scheduleLines)) {
      return new Response(JSON.stringify({ error: "missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const scheduleText = scheduleLines.map((l) => `- ${l}`).join("\n");

    const text = `Hola,

Te regalo una sesión de ${serviceName} en Nave Studio.

Tu código: ${code}
(1 solo uso, válido hasta el ${expiresAt})

Horarios disponibles de ${serviceName}:
${scheduleText}

Cómo agendar gratis:
1. Entra a https://studiolanave.com/agenda-nave-studio
2. Elige la clase, fecha y hora que prefieras
3. En el formulario de reserva, ingresa tu código ${code}
4. Listo: tu sesión queda confirmada sin costo

Nos vemos en el estudio.

Alan Earle
Nave Studio
https://studiolanave.com`;

    if (dryRun) {
      return new Response(JSON.stringify({ ok: true, dryRun: true, text }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const emailResponse = await resend.emails.send({
      from: "Alan Earle <agenda@studiolanave.com>",
      reply_to: "lanave@alaniceman.com",
      to: [to],
      subject: `Te regalo una sesión de ${serviceName} en Nave Studio`,
      text,
    });

    return new Response(JSON.stringify({ ok: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-gift-code-email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
