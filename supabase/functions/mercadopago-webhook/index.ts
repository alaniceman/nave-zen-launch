import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";

const corsHeaders = getCorsHeaders();

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Mercado Pago webhook received:", body);

    // Mercado Pago sends notifications with type "payment"
    if (body.type !== "payment") {
      return new Response(JSON.stringify({ status: "ignored" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const mercadoPagoAccessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    if (!mercadoPagoAccessToken) {
      throw new Error("Mercado Pago not configured");
    }

    // Get payment details from Mercado Pago
    const paymentId = body.data?.id;
    if (!paymentId) {
      throw new Error("No payment ID in webhook");
    }

    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${mercadoPagoAccessToken}`,
        },
      }
    );

    if (!paymentResponse.ok) {
      throw new Error("Error fetching payment from Mercado Pago");
    }

    const payment = await paymentResponse.json();
    console.log("Payment details:", payment);

    const bookingId = payment.metadata?.booking_id;
    if (!bookingId) {
      console.error("No booking_id in payment metadata");
      return new Response(JSON.stringify({ status: "no_booking_id" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*, professionals(name, email), services(name, price_clp)")
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) {
      console.error("Booking not found:", bookingId);
      return new Response(JSON.stringify({ status: "booking_not_found" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update booking based on payment status
    if (payment.status === "approved") {
      // Verify amount
      if (payment.transaction_amount !== booking.services.price_clp) {
        console.error("Payment amount mismatch");
        return new Response(JSON.stringify({ status: "amount_mismatch" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if slot is still available
      const { data: existingConfirmed } = await supabase
        .from("bookings")
        .select("id")
        .eq("professional_id", booking.professional_id)
        .eq("date_time_start", booking.date_time_start)
        .eq("status", "CONFIRMED")
        .neq("id", bookingId)
        .maybeSingle();

      if (existingConfirmed) {
        console.error("Slot already confirmed by another booking");
        
        // Update to CANCELLED
        await supabase
          .from("bookings")
          .update({
            status: "CANCELLED",
            mercado_pago_payment_id: paymentId,
          })
          .eq("id", bookingId);

        // TODO: Trigger refund process
        return new Response(
          JSON.stringify({ status: "slot_unavailable" }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Confirm booking
      const { error: updateError } = await supabase
        .from("bookings")
        .update({
          status: "CONFIRMED",
          mercado_pago_payment_id: paymentId,
        })
        .eq("id", bookingId);

      if (updateError) {
        console.error("Error updating booking:", updateError);
        throw updateError;
      }

      console.log("Booking confirmed:", bookingId);

      // TODO: Send confirmation emails
      // You can implement email sending here using Resend
      // For now, we'll just log it
      console.log("Should send confirmation email to:", booking.customer_email);
      console.log("Should send notification to:", booking.professionals.email);

      return new Response(JSON.stringify({ status: "confirmed" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else if (
      payment.status === "rejected" ||
      payment.status === "cancelled"
    ) {
      await supabase
        .from("bookings")
        .update({
          status: "CANCELLED",
          mercado_pago_payment_id: paymentId,
        })
        .eq("id", bookingId);

      return new Response(JSON.stringify({ status: "cancelled" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ status: "processed" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in mercadopago-webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});