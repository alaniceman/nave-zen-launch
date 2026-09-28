import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { TALLERES } from "../_shared/talleres.ts";

const SUBJECT = "Eres parte de la comunidad Nave: 50% para el taller del 3 y 4 de octubre";
const CODE = "PODER";
const CHECKOUT_FUNDAMENTOS = "https://studiolanave.com/checkout?producto=fundamentos";
const CHECKOUT_AVANZADO = "https://studiolanave.com/checkout?producto=avanzado";

const clp = (n: number) => `$${n.toLocaleString("es-CL")}`;

const buildText = (nombre: string) => {
  const saludo = nombre ? `Hola ${nombre},` : "Hola,";
  const f = TALLERES.fundamentos;
  const a = TALLERES.avanzado;
  return `${saludo}

Te escribo directo. Por haber asistido a un taller del Método Wim Hof con nosotros, ya eres parte de la comunidad Nave. Por eso quiero darte la oportunidad de volver con un 50% de descuento.

Este fin de semana hacemos la nueva edición en el estudio, en Antares 259, Las Condes:

- Fundamentales: ${f.fechaLarga}, ${f.horario}. ${clp(f.valor)} → ${clp(Math.round(f.valor / 2))} con tu descuento.
- Avanzado: ${a.fechaLarga}, ${a.horario}. ${clp(a.valor)} → ${clp(Math.round(a.valor / 2))} con tu descuento.

Puedes ir al que quieras, Fundamentales o Avanzado.

Tu código es: ${CODE}

Lo escribes en el campo de cupón al momento de inscribirte:

Fundamentales: ${CHECKOUT_FUNDAMENTOS}
Avanzado: ${CHECKOUT_AVANZADO}

Son 15 cupos por taller y se van rápido. Si tienes dudas de cuál te conviene, respóndeme este correo o escríbeme por WhatsApp al +56 9 4612 0426.

Nos vemos en el hielo.

Alan Earle
Nave Studio
studiolanave.com`;
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const previewEmail: string | undefined = body?.previewEmail;
    const dryRun: boolean = body?.dryRun === true;

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const send = async (to: string, nombre: string) => {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
          "Idempotency-Key": `taller-poder-${to}`,
        },
        body: JSON.stringify({
          from: "Alan Earle <agenda@studiolanave.com>",
          reply_to: "lanave@alaniceman.com",
          to: [to],
          subject: SUBJECT,
          text: buildText(nombre),
        }),
      });
      if (!res.ok) throw new Error(await res.text());
    };

    if (previewEmail) {
      if (!dryRun) await send(previewEmail, "Alan");
      return new Response(JSON.stringify({ success: true, preview: true, text: buildText("Alan") }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Solo asistentes de talleres YA realizados (fecha del evento anterior a hoy)
    const today = new Date().toISOString().slice(0, 10);
    const { data: rows, error } = await supabase
      .from("taller_inscripciones")
      .select("email, nombre, fecha_evento")
      .eq("status", "paid")
      .lt("fecha_evento", today);
    if (error) throw error;

    const recipients = new Map<string, string>();
    for (const r of rows ?? []) {
      const email = (r.email || "").trim().toLowerCase();
      if (!email) continue;
      if (!recipients.has(email)) recipients.set(email, (r.nombre || "").split(" ")[0] || "");
    }

    if (dryRun) {
      return new Response(
        JSON.stringify({
          success: true,
          dryRun: true,
          total: recipients.size,
          recipients: [...recipients.entries()].map(([email, nombre]) => ({ email, nombre })),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let sent = 0;
    const errors: string[] = [];
    for (const [email, nombre] of recipients) {
      try {
        await send(email, nombre);
        sent++;
      } catch (e) {
        errors.push(`${email}: ${(e as Error).message}`);
      }
      await new Promise((r) => setTimeout(r, 600));
    }

    return new Response(JSON.stringify({ success: true, total: recipients.size, sent, errors }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("send-taller-poder error:", (error as Error).message);
    return new Response(JSON.stringify({ error: "No se pudo procesar el envío" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
