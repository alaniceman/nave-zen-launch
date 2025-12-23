import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "orderId es requerido" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(orderId)) {
      return new Response(
        JSON.stringify({ error: "orderId inválido" }),
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

    // Get order with limited information (don't expose sensitive data)
    const { data: order, error } = await supabase
      .from("package_orders")
      .select(`
        id,
        status,
        order_type,
        is_giftcard,
        original_price,
        discount_amount,
        final_price,
        mercado_pago_status,
        mercado_pago_status_detail,
        created_at,
        session_packages (
          name,
          sessions_quantity
        )
      `)
      .eq("id", orderId)
      .single();

    if (error || !order) {
      console.error("Order not found:", orderId, error);
      return new Response(
        JSON.stringify({ error: "Orden no encontrada" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Build user-friendly status message
    let statusMessage = "";
    let statusType: "success" | "pending" | "error" = "pending";

    switch (order.status) {
      case "paid":
        statusMessage = "¡Pago completado! Revisa tu email para obtener tus códigos.";
        statusType = "success";
        break;
      case "created":
        statusMessage = "Esperando confirmación del pago...";
        statusType = "pending";
        break;
      case "failed":
        // Provide helpful message based on Mercado Pago status
        if (order.mercado_pago_status_detail) {
          const detailMessages: Record<string, string> = {
            "cc_rejected_bad_filled_card_number": "El número de tarjeta es incorrecto.",
            "cc_rejected_bad_filled_date": "La fecha de vencimiento es incorrecta.",
            "cc_rejected_bad_filled_other": "Revisa los datos de la tarjeta.",
            "cc_rejected_bad_filled_security_code": "El código de seguridad es incorrecto.",
            "cc_rejected_blacklist": "No pudimos procesar tu pago con esta tarjeta.",
            "cc_rejected_call_for_authorize": "Debes autorizar el pago ante tu banco.",
            "cc_rejected_card_disabled": "La tarjeta está deshabilitada. Llama a tu banco.",
            "cc_rejected_card_error": "No pudimos procesar tu pago con esta tarjeta.",
            "cc_rejected_duplicated_payment": "Ya realizaste un pago por ese valor.",
            "cc_rejected_high_risk": "Tu pago fue rechazado por seguridad.",
            "cc_rejected_insufficient_amount": "Fondos insuficientes.",
            "cc_rejected_invalid_installments": "La tarjeta no procesa pagos en cuotas.",
            "cc_rejected_max_attempts": "Llegaste al límite de intentos. Usa otra tarjeta.",
            "cc_rejected_other_reason": "La tarjeta rechazó el pago. Intenta con otra.",
          };
          statusMessage = detailMessages[order.mercado_pago_status_detail] || 
            `El pago fue rechazado: ${order.mercado_pago_status_detail}`;
        } else {
          statusMessage = "El pago no pudo ser procesado. Intenta nuevamente.";
        }
        statusType = "error";
        break;
      case "cancelled":
        statusMessage = "El pago fue cancelado.";
        statusType = "error";
        break;
      default:
        statusMessage = "Estado desconocido";
        statusType = "pending";
    }

    return new Response(
      JSON.stringify({
        orderId: order.id,
        status: order.status,
        statusType,
        statusMessage,
        orderType: order.order_type,
        isGiftCard: order.is_giftcard,
        packageName: order.session_packages?.name || "Paquete",
        sessionsQuantity: order.session_packages?.sessions_quantity || 0,
        originalPrice: order.original_price,
        discountAmount: order.discount_amount,
        finalPrice: order.final_price,
        mercadoPagoStatus: order.mercado_pago_status,
        createdAt: order.created_at,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in get-order-status:", error);
    return new Response(
      JSON.stringify({ error: "Error al obtener estado de la orden" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
