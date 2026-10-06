import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const schema = z.object({
  productId: z.string().uuid().optional(),
  items: z
    .array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).max(20) }))
    .min(1)
    .max(20)
    .optional(),
  buyerName: z.string().min(2).max(100),
  buyerEmail: z.string().email().max(255),
  buyerPhone: z.string().min(8).max(20).optional(),
  fbp: z.string().max(255).optional(),
  fbc: z.string().max(500).optional(),
  eventSourceUrl: z.string().max(2000).optional(),
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

    // Normalize input: single product or cart items
    const requested = data.items?.length
      ? data.items
      : data.productId
      ? [{ productId: data.productId, quantity: 1 }]
      : [];

    if (requested.length === 0) {
      return new Response(
        JSON.stringify({ error: "No hay productos en la compra" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Load products: tienda física + productos de campaña Cyber
    const ids = [...new Set(requested.map((i) => i.productId))];
    const { data: shopProducts, error: productError } = await supabase
      .from("shop_products")
      .select("*")
      .in("id", ids)
      .eq("is_active", true);
    const { data: cyberProducts, error: cyberError } = await supabase
      .from("cyber_products")
      .select("*")
      .in("id", ids)
      .eq("is_active", true);

    const products: any[] = [
      ...(shopProducts ?? []).map((p: any) => ({ ...p, _cyber: false })),
      ...(cyberProducts ?? []).map((p: any) => ({ ...p, _cyber: true })),
    ];

    if (productError || cyberError || products.length !== ids.length) {
      return new Response(
        JSON.stringify({ error: "Producto no encontrado" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Cyber: bloquear compras vencidas (también desde carritos antiguos)
    const nowMs = Date.now();
    const expired = products.find((p) => p._cyber && nowMs > Date.parse(p.ends_at));
    if (expired) {
      return new Response(
        JSON.stringify({ error: "La oferta Cyber finalizó. Quita los productos Cyber del carrito para continuar.", code: "cyber_expired" }),
        { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const hasCyber = products.some((p) => p._cyber);

    const lineItems = requested.map((i) => {
      const p = products.find((pr: any) => pr.id === i.productId);
      if (!p) throw new Error("Producto no encontrado");
      return { product: p, quantity: i.quantity };
    });

    const totalPrice = lineItems.reduce((s, li) => s + li.product.price * li.quantity, 0);
    const orderName =
      lineItems.length === 1 && lineItems[0].quantity === 1
        ? lineItems[0].product.name
        : lineItems.map((li) => `${li.product.name} x${li.quantity}`).join(" + ").slice(0, 300);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("shop_orders")
      .insert({
        // This FK belongs to shop_products only; Cyber products are linked
        // through cyber_purchases and retained in meta_context.items.
        product_id: lineItems.length === 1 && !lineItems[0].product._cyber ? lineItems[0].product.id : null,
        product_name: orderName,
        product_price: totalPrice,
        customer_name: data.buyerName,
        customer_email: data.buyerEmail.toLowerCase().trim(),
        customer_phone: data.buyerPhone || null,
        status: "pending",
        meta_context: {
          items: lineItems.map((li) => ({
            product_id: li.product.id,
            name: li.product.name,
            unit_price: li.product.price,
            quantity: li.quantity,
            cyber: li.product._cyber || undefined,
          })),
          campaign: hasCyber ? "cyber-2026-10" : undefined,
          fbp: data.fbp ?? null,
          fbc: data.fbc ?? null,
          event_source_url: data.eventSourceUrl ?? null,
          client_ip_address:
            req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("cf-connecting-ip") ||
            null,
          client_user_agent: req.headers.get("user-agent") || null,
        },
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

    // Registro accionable de cada producto Cyber (precio resuelto en servidor)
    if (hasCyber) {
      const rows = lineItems
        .filter((li) => li.product._cyber)
        .map((li) => {
          const p = li.product;
          return {
            shop_order_id: order.id,
            product_id: p.id,
            sku: p.sku,
            kind: p.kind,
            product_name: p.name,
            quantity: li.quantity,
            unit_price: p.price,
            total_amount: p.price * li.quantity,
            buyer_name: data.buyerName,
            buyer_email: data.buyerEmail.toLowerCase().trim(),
            buyer_phone: data.buyerPhone || null,
            plan_name: p.plan_name,
            months_paid: p.months_paid,
            months_free: p.months_free,
            months_total: p.months_total,
            payment_status: "pending",
            activation_status: p.kind === "membership" ? "pending_payment" : "not_applicable",
          };
        });
      const { error: cpErr } = await supabase.from("cyber_purchases").insert(rows);
      if (cpErr) {
        console.error("Error creating cyber purchases:", cpErr);
        await supabase.from("shop_orders").update({ status: "failed" }).eq("id", order.id);
        return new Response(
          JSON.stringify({ error: "Error al crear la orden" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    const mpToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    if (!mpToken) {
      await supabase.from("shop_orders").update({ status: "failed" }).eq("id", order.id);
      throw new Error("Mercado Pago no configurado");
    }

    const siteUrl = (Deno.env.get("SITE_URL") || "https://studiolanave.com").replace(/\/$/, "");

    const preferenceData = {
      items: lineItems.map((li) => ({
        title: li.product.name,
        quantity: li.quantity,
        unit_price: li.product.price,
        currency_id: "CLP",
      })),
      payer: {
        name: data.buyerName,
        email: data.buyerEmail,
        ...(data.buyerPhone && sanitizePhone(data.buyerPhone).length >= 8 && {
          phone: { number: sanitizePhone(data.buyerPhone) },
        }),
      },
      back_urls: {
        success: `${siteUrl}/tienda/success?order=${order.id}${hasCyber ? "&cyber=1" : ""}`,
        failure: `${siteUrl}/tienda/failure?order=${order.id}`,
        pending: `${siteUrl}/tienda/pending?order=${order.id}`,
      },
      auto_return: "approved",
      external_reference: order.id,
      // Hasta 3 cuotas para compras Cyber (las cuotas sin interés dependen de la configuración del comercio en Mercado Pago)
      ...(hasCyber && { payment_methods: { installments: 3 } }),
      ...(hasCyber && { expiration_date_to: new Date(Math.min(...products.filter((p) => p._cyber).map((p) => Date.parse(p.ends_at)))).toISOString(), expires: true }),
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
