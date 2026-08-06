import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { TALLERES, type TallerKey } from "../_shared/talleres.ts";

const schema = z.object({
  taller: z.enum(["fundamentos", "avanzado"]),
  nombre: z.string().min(2).max(100),
  apellido: z.string().min(1).max(100),
  email: z.string().email().max(255),
  celular: z.string().min(6).max(30),
});

function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const data = parsed.data;
    const t = TALLERES[data.taller as TallerKey];

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check availability before creating any preference
    const { data: cupo } = await supabase
      .from("event_cupos")
      .select("cupos_total, cupos_vendidos")
      .eq("event_id", t.eventId)
      .maybeSingle();

    if (!cupo || cupo.cupos_vendidos >= cupo.cupos_total) {
      return new Response(
        JSON.stringify({ error: "Cupos agotados", soldOut: true }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: inscripcion, error: insError } = await supabase
      .from("taller_inscripciones")
      .insert({
        event_id: t.eventId,
        nivel: data.taller,
        taller_nombre: t.nombre,
        nombre: data.nombre.trim(),
        apellido: data.apellido.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.celular.trim(),
        fecha_evento: t.fechaISO,
        horario: t.horario,
        amount: t.valor,
        status: "pending",
      })
      .select()
      .single();

    if (insError || !inscripcion) {
      console.error("Error creating taller inscripcion:", insError);
      return new Response(JSON.stringify({ error: "Error al crear la inscripción" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const mpToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    if (!mpToken) {
      await supabase.from("taller_inscripciones").update({ status: "failed" }).eq("id", inscripcion.id);
      throw new Error("Mercado Pago no configurado");
    }

    const siteUrl = (Deno.env.get("SITE_URL") || "https://studiolanave.com").replace(/\/$/, "");
    const landing = `${siteUrl}/taller-wim-hof-santiago-fundamentales-avanzado`;
    const phone = sanitizePhone(data.celular);

    const preferenceData = {
      items: [
        {
          title: `${t.nombre} — ${t.fechaLarga}`,
          quantity: 1,
          unit_price: t.valor,
          currency_id: "CLP",
        },
      ],
      payer: {
        name: data.nombre,
        surname: data.apellido,
        email: data.email,
        ...(phone.length >= 8 && { phone: { number: phone } }),
      },
      back_urls: {
        success: `${landing}?pago=approved&order=${inscripcion.id}`,
        failure: `${landing}?pago=rejected&order=${inscripcion.id}`,
        pending: `${landing}?pago=pending&order=${inscripcion.id}`,
      },
      auto_return: "approved",
      external_reference: inscripcion.id,
      notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mercadopago-webhook`,
    };

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${mpToken}` },
      body: JSON.stringify(preferenceData),
    });

    const responseText = await mpResponse.text();
    if (!mpResponse.ok) {
      console.error("Mercado Pago error:", responseText);
      await supabase.from("taller_inscripciones").update({ status: "failed" }).eq("id", inscripcion.id);
      return new Response(JSON.stringify({ error: "Error con Mercado Pago" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const preference = JSON.parse(responseText);
    await supabase
      .from("taller_inscripciones")
      .update({ mercado_pago_preference_id: preference.id })
      .eq("id", inscripcion.id);

    return new Response(
      JSON.stringify({ initPoint: preference.init_point, orderId: inscripcion.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in create-taller-preference:", error);
    return new Response(JSON.stringify({ error: "Error al procesar la compra" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
