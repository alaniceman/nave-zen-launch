import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { upsertCustomerAndLogEvent } from "../_shared/crm.ts";

const purchaseSchema = z.object({
  packageId: z.string().uuid(),
  buyerName: z.string().min(2).max(100),
  buyerEmail: z.string().email().max(255),
  buyerPhone: z.string().min(8).max(20),
  couponCode: z.string().optional(),
  isGiftCard: z.boolean().optional().default(false),
  promoType: z.string().optional(),
});

// Sanitize phone number - keep only digits
function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    console.log("Purchase request received:", { ...requestData, buyerPhone: "[REDACTED]" });

    // Validate input
    let validatedData;
    try {
      validatedData = purchaseSchema.parse(requestData);
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return new Response(
        JSON.stringify({ error: "Datos inválidos" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get package details
    const { data: package_, error: packageError } = await supabase
      .from("session_packages")
      .select("*")
      .eq("id", validatedData.packageId)
      .eq("is_active", true)
      .single();

    if (packageError || !package_) {
      console.error("Package not found:", validatedData.packageId);
      return new Response(
        JSON.stringify({ error: "Paquete no encontrado" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Package found:", package_.id, package_.name);

    // Validate coupon if provided
    let coupon = null;
    let finalPrice = package_.price_clp;
    let discountAmount = 0;

    if (validatedData.couponCode) {
      console.log("Validating coupon:", validatedData.couponCode);

      const { data: couponData, error: couponError } = await supabase
        .from("discount_coupons")
        .select("*")
        .eq("code", validatedData.couponCode.toUpperCase())
        .eq("is_active", true)
        .maybeSingle();

      if (couponError || !couponData) {
        return new Response(
          JSON.stringify({ error: "Cupón no encontrado" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Validate coupon is applicable to this package
      if (couponData.applicable_package_ids && 
          !couponData.applicable_package_ids.includes(validatedData.packageId)) {
        return new Response(
          JSON.stringify({ error: "Este cupón no aplica a este bono" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Check if coupon is valid by date
      const now = new Date();
      if (couponData.valid_from && new Date(couponData.valid_from) > now) {
        return new Response(
          JSON.stringify({ error: "Este cupón aún no es válido" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (couponData.valid_until && new Date(couponData.valid_until) < now) {
        return new Response(
          JSON.stringify({ error: "Este cupón ha expirado" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Check if coupon has uses left
      if (couponData.max_uses && couponData.current_uses >= couponData.max_uses) {
        return new Response(
          JSON.stringify({ error: "Este cupón ha alcanzado su límite de usos" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Check minimum purchase amount
      if (couponData.min_purchase_amount && package_.price_clp < couponData.min_purchase_amount) {
        return new Response(
          JSON.stringify({ error: `Compra mínima requerida: $${couponData.min_purchase_amount.toLocaleString('es-CL')}` }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Calculate discount
      if (couponData.discount_type === "percentage") {
        discountAmount = Math.floor(package_.price_clp * (couponData.discount_value / 100));
      } else {
        discountAmount = couponData.discount_value;
      }

      finalPrice = Math.max(0, package_.price_clp - discountAmount);
      coupon = couponData;

      console.log(`Coupon applied: ${coupon.code}, discount: $${discountAmount}, final price: $${finalPrice}`);
    }

    // Determine order type
    const orderType = validatedData.isGiftCard ? "giftcard" : "session_package";

    // Create order in database FIRST
    const { data: order, error: orderError } = await supabase
      .from("package_orders")
      .insert({
        order_type: orderType,
        package_id: package_.id,
        buyer_name: validatedData.buyerName,
        buyer_email: validatedData.buyerEmail,
        buyer_phone: validatedData.buyerPhone,
        coupon_id: coupon?.id || null,
        coupon_code: coupon?.code || null,
        original_price: package_.price_clp,
        discount_amount: discountAmount,
        final_price: finalPrice,
        is_giftcard: validatedData.isGiftCard,
        status: "created",
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      return new Response(
        JSON.stringify({ error: "Error al crear la orden" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Order created:", order.id);

    const siteUrl = Deno.env.get("SITE_URL")?.replace(/\/$/, "") || "https://studiolanave.com";
    
    // Determine return URLs based on order type
    const successUrl = validatedData.isGiftCard 
      ? `${siteUrl}/giftcards/success?order=${order.id}`
      : `${siteUrl}/bonos/success?order=${order.id}`;
    const failureUrl = validatedData.isGiftCard 
      ? `${siteUrl}/giftcards/failure?order=${order.id}`
      : `${siteUrl}/bonos/failure?order=${order.id}`;
    const pendingUrl = validatedData.isGiftCard 
      ? `${siteUrl}/giftcards/pending?order=${order.id}`
      : `${siteUrl}/bonos/pending?order=${order.id}`;

    // If final price is 0 (100% discount), complete purchase directly without payment
    if (finalPrice === 0) {
      console.log("Final price is 0, completing purchase directly without Mercado Pago");
      
      // Increment coupon usage if applicable
      if (coupon) {
        await supabase
          .from("discount_coupons")
          .update({ current_uses: (coupon.current_uses || 0) + 1 })
          .eq("id", coupon.id);
      }

      // Generate session codes directly
      const codes = [];
      for (let i = 0; i < package_.sessions_quantity; i++) {
        let code: string;
        let isUnique = false;
        
        while (!isUnique) {
          code = Math.random().toString(36).substring(2, 10).toUpperCase();
          const { data: existing } = await supabase
            .from("session_codes")
            .select("id")
            .eq("code", code)
            .maybeSingle();
          isUnique = !existing;
        }
        codes.push(code!);
      }

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + package_.validity_days);

      // Generate giftcard access token if needed
      const giftcardAccessToken = validatedData.isGiftCard ? crypto.randomUUID() : null;

      // Insert all session codes
      const sessionCodesData = codes.map((code) => ({
        code,
        package_id: package_.id,
        buyer_email: validatedData.buyerEmail,
        buyer_name: validatedData.buyerName,
        buyer_phone: validatedData.buyerPhone,
        applicable_service_ids: package_.applicable_service_ids,
        expires_at: expiresAt.toISOString(),
        mercado_pago_payment_id: `FREE_ORDER_${order.id}`,
        giftcard_access_token: giftcardAccessToken,
      }));

      const { error: codesError } = await supabase
        .from("session_codes")
        .insert(sessionCodesData);

      if (codesError) {
        console.error("Error inserting session codes:", codesError);
        // Update order status to failed
        await supabase
          .from("package_orders")
          .update({ status: "failed", error_message: "Error al crear códigos" })
          .eq("id", order.id);
        return new Response(
          JSON.stringify({ error: "Error al crear los códigos de sesión" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Update order status to paid
      await supabase
        .from("package_orders")
        .update({ 
          status: "paid",
          mercado_pago_payment_id: `FREE_ORDER_${order.id}`,
        })
        .eq("id", order.id);

      console.log(`Created ${codes.length} session codes for free purchase:`, codes);

      // Send confirmation email
      try {
      const giftcardLink = giftcardAccessToken ? `${siteUrl}/giftcard/${giftcardAccessToken}` : null;
        
        await supabase.functions.invoke("send-session-codes-email", {
          body: {
            buyerEmail: validatedData.buyerEmail,
            buyerName: validatedData.buyerName,
            packageName: package_.name,
            sessionsQuantity: package_.sessions_quantity,
            codes: codes,
            expiresAt: expiresAt.toISOString(),
            isGiftCard: validatedData.isGiftCard,
            giftcardLink: giftcardLink,
            promoType: validatedData.promoType,
          },
        });
        console.log("Confirmation email sent for free purchase");
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }

      // CRM: upsert customer + log event for free purchase
      await upsertCustomerAndLogEvent(supabase, {
        email: validatedData.buyerEmail,
        name: validatedData.buyerName,
        phone: validatedData.buyerPhone,
        eventType: validatedData.isGiftCard ? "giftcard_purchased" : "package_purchased",
        eventTitle: validatedData.isGiftCard ? "Compró Gift Card" : "Compró Pack de Sesiones",
        eventDescription: `${package_.name} (100% descuento)`,
        amount: 0,
        metadata: { order_id: order.id, package_id: package_.id, free_order: true },
        statusIfNew: "purchased",
      });

      return new Response(
        JSON.stringify({
          success: true,
          freeOrder: true,
          orderId: order.id,
          message: "Compra completada con cupón de descuento 100%",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Normal flow: create Mercado Pago preference
    const mercadoPagoAccessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    if (!mercadoPagoAccessToken) {
      await supabase
        .from("package_orders")
        .update({ status: "failed", error_message: "Mercado Pago no configurado" })
        .eq("id", order.id);
      throw new Error("Mercado Pago not configured");
    }

    // Simple, clean preference data - only what Mercado Pago needs
    const preferenceData = {
      items: [
        {
          title: `${package_.name} - ${package_.sessions_quantity} sesiones`,
          quantity: 1,
          unit_price: finalPrice,
          currency_id: "CLP",
        },
      ],
      payer: {
        name: validatedData.buyerName,
        email: validatedData.buyerEmail,
        // Only include phone if it has digits
        ...(sanitizePhone(validatedData.buyerPhone).length >= 8 && {
          phone: {
            number: sanitizePhone(validatedData.buyerPhone),
          },
        }),
      },
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl,
      },
      auto_return: "approved",
      // SIMPLE external_reference - just the order UUID
      external_reference: order.id,
      notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mercadopago-webhook`,
    };

    console.log("Creating Mercado Pago preference with external_reference:", order.id);

    const mpResponse = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mercadoPagoAccessToken}`,
        },
        body: JSON.stringify(preferenceData),
      }
    );

    const responseText = await mpResponse.text();
    console.log("Mercado Pago response status:", mpResponse.status);

    if (!mpResponse.ok) {
      console.error("Mercado Pago error:", responseText);
      await supabase
        .from("package_orders")
        .update({ status: "failed", error_message: `MP Error: ${mpResponse.status}` })
        .eq("id", order.id);
      throw new Error(`Mercado Pago API error: ${responseText}`);
    }

    const preference = JSON.parse(responseText);
    console.log("Payment preference created:", preference.id);

    // Update order with preference ID
    await supabase
      .from("package_orders")
      .update({ mercado_pago_preference_id: preference.id })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({
        initPoint: preference.init_point,
        orderId: order.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in purchase-session-package:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error al procesar la compra" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
