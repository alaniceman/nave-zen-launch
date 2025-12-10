import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const purchaseSchema = z.object({
  packageId: z.string().uuid(),
  buyerName: z.string().min(2).max(100),
  buyerEmail: z.string().email().max(255),
  buyerPhone: z.string().min(8).max(20),
  couponCode: z.string().optional(),
  isGiftCard: z.boolean().optional().default(false),
});

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();

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
      throw new Error("Paquete no encontrado");
    }

    console.log("Creating Mercado Pago preference for package:", package_.id);

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

    const mercadoPagoAccessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    if (!mercadoPagoAccessToken) {
      throw new Error("Mercado Pago not configured");
    }

    const siteUrl = Deno.env.get("SITE_URL")?.replace(/\/$/, "") || "https://studiolanave.com";
    console.log("Using SITE_URL:", siteUrl);

    // Create external reference with package info
    const externalReference = JSON.stringify({
      type: "session_package",
      packageId: package_.id,
      buyerEmail: validatedData.buyerEmail,
      buyerName: validatedData.buyerName,
      buyerPhone: validatedData.buyerPhone,
      couponId: coupon?.id || null,
      originalPrice: package_.price_clp,
      finalPrice: finalPrice,
      isGiftCard: validatedData.isGiftCard,
    });

    const preferenceData = {
      items: [
        {
          title: `${package_.name} - ${package_.sessions_quantity} sesiones`,
          description: coupon ? `Cupón ${coupon.code} aplicado (-$${discountAmount.toLocaleString('es-CL')})` : (package_.description || ""),
          quantity: 1,
          unit_price: finalPrice,
          currency_id: "CLP",
        },
      ],
      payer: {
        name: validatedData.buyerName,
        email: validatedData.buyerEmail,
        phone: {
          number: validatedData.buyerPhone,
        },
      },
      back_urls: {
        success: `${siteUrl}/bonos/success`,
        failure: `${siteUrl}/bonos/failure`,
        pending: `${siteUrl}/bonos/pending`,
      },
      auto_return: "approved",
      external_reference: externalReference,
      notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mercadopago-webhook`,
    };

    console.log("Preference data:", JSON.stringify(preferenceData, null, 2));

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
    console.log("Mercado Pago response:", responseText);

    if (!mpResponse.ok) {
      console.error("Mercado Pago error:", responseText);
      throw new Error(`Mercado Pago API error: ${responseText}`);
    }

    const preference = JSON.parse(responseText);
    console.log("Payment preference created successfully:", preference.id);

    return new Response(
      JSON.stringify({
        initPoint: preference.init_point,
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