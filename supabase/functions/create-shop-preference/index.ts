import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const schema = z.object({
  productId: z.string().uuid(),
  buyerName: z.string().min(2).max(100),
  buyerEmail: z.string().email().max(255),
  buyerPhone: z.string().min(8).max(20).optional(),
});

function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const data = parsed.data;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Load product
    const { data: product, error: productError } = await supabase
      .from("shop_products")
      .select("*")
      .eq("id", data.productId)
      .eq("is_active", true)
      .maybeSingle();

    if (productError || !product) {
      return new Response(
        JSON.stringify({ error: "Producto no encontrado" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("shop_orders")
      .insert({
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        customer_name: data.buyerName,
        customer_email: data.buyerEmail.toLowerCase().trim(),
        customer_phone: data.buyerPhone || null,
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creating shop order:", orderError);
      return new Response(
        JSON.stringify({ error: "Error al crear la orden" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const mpToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    if (!mpToken) {
      await supabase.from("shop_orders").update({ status: "failed" }).eq("id", order.id);
      throw new Error("Mercado Pago no configurado");
    }

    const siteUrl = (Deno.env.get("SITE_URL") || "https://studiolanave.com").replace(/\/$/, "");

    const preferenceData = {
      items: [
        {
          title: product.name,
          quantity: 1,
          unit_price: product.price,
          currency_id: "CLP",
        },
      ],
      payer: {
        name: data.buyerName,
        email: data.buyerEmail,
        ...(data.buyerPhone && sanitizePhone(data.buyerPhone).length >= 8 && {
          phone: { number: sanitizePhone(data.buyerPhone) },
        }),
      },
      back_urls: {
        success: `${siteUrl}/tienda/success?order=${order.id}`,
        failure: `${siteUrl}/tienda/failure?order=${order.id}`,
        pending: `${siteUrl}/tienda/pending?order=${order.id}`,
      },
      auto_return: "approved",
      external_reference: order.id,
      notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mercadopago-webhook`,
    };

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mpToken}`,
      },
      body: JSON.stringify(preferenceData),
    });

    const responseText = await mpResponse.text();
    if (!mpResponse.ok) {
      console.error("Mercado Pago error:", responseText);
      await supabase.from("shop_orders").update({ status: "failed" }).eq("id", order.id);
      return new Response(
        JSON.stringify({ error: "Error con Mercado Pago" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const preference = JSON.parse(responseText);
    await supabase
      .from("shop_orders")
      .update({ mercado_pago_preference_id: preference.id })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({ initPoint: preference.init_point, orderId: order.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in create-shop-preference:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error al procesar la compra" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
