import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, packageId, serviceId, purchaseAmount } = await req.json();

    if (!code || typeof code !== "string" || code.trim().length === 0) {
      return new Response(
        JSON.stringify({ valid: false, error: "Código requerido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role to bypass RLS
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: coupon, error } = await supabase
      .from("discount_coupons")
      .select("id, code, discount_type, discount_value, is_active, valid_from, valid_until, max_uses, current_uses, min_purchase_amount, applicable_package_ids")
      .eq("code", code.toUpperCase().trim())
      .eq("is_active", true)
      .maybeSingle();

    if (error || !coupon) {
      return new Response(
        JSON.stringify({ valid: false, error: "Cupón no encontrado" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate dates
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return new Response(
        JSON.stringify({ valid: false, error: "Este cupón aún no es válido" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return new Response(
        JSON.stringify({ valid: false, error: "Este cupón ha expirado" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate max uses
    if (coupon.max_uses && (coupon.current_uses ?? 0) >= coupon.max_uses) {
      return new Response(
        JSON.stringify({ valid: false, error: "Este cupón ya no tiene usos disponibles" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate applicable packages
    if (packageId && coupon.applicable_package_ids && coupon.applicable_package_ids.length > 0) {
      if (!coupon.applicable_package_ids.includes(packageId)) {
        return new Response(
          JSON.stringify({ valid: false, error: "Este cupón no aplica a este producto" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate minimum purchase
    if (purchaseAmount && coupon.min_purchase_amount && purchaseAmount < coupon.min_purchase_amount) {
      return new Response(
        JSON.stringify({
          valid: false,
          error: `Compra mínima requerida: $${coupon.min_purchase_amount.toLocaleString("es-CL")}`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return validated coupon data (only what the client needs)
    return new Response(
      JSON.stringify({
        valid: true,
        coupon: {
          id: coupon.id,
          code: coupon.code,
          discount_type: coupon.discount_type,
          discount_value: coupon.discount_value,
          applicable_package_ids: coupon.applicable_package_ids,
          min_purchase_amount: coupon.min_purchase_amount,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error validating coupon:", err);
    return new Response(
      JSON.stringify({ valid: false, error: "Error al validar cupón" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
