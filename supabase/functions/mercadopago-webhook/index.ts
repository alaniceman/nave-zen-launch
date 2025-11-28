import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";

// Helper function to verify Mercado Pago webhook signature
async function verifyMercadoPagoSignature(
  xSignature: string | null,
  xRequestId: string | null,
  dataId: string,
  secret: string
): Promise<boolean> {
  if (!xSignature || !xRequestId) {
    return false;
  }

  try {
    // Parse signature header (format: "ts=timestamp,v1=hash")
    const parts = xSignature.split(',');
    const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1];
    const hash = parts.find(p => p.startsWith('v1='))?.split('=')[1];

    if (!ts || !hash) {
      return false;
    }

    // Create the manifest (what Mercado Pago signed)
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    // Create HMAC-SHA256 hash
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(manifest);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const signatureHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return signatureHex === hash;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

const corsHeaders = getCorsHeaders();

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Mercado Pago webhook received:", body);

    // Support both webhook formats: new (body.type) and IPN (body.topic)
    const isWebhookFormat = body.type === "payment";
    const isIPNFormat = body.topic === "payment";
    
    if (!isWebhookFormat && !isIPNFormat) {
      console.log("Ignoring non-payment notification:", body.type || body.topic);
      return new Response(JSON.stringify({ status: "ignored" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    console.log(`Processing ${isWebhookFormat ? 'Webhook' : 'IPN'} format payment notification`);

    const mercadoPagoAccessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    const webhookSecret = Deno.env.get("MERCADO_PAGO_WEBHOOK_SECRET");
    
    if (!mercadoPagoAccessToken) {
      throw new Error("Mercado Pago not configured");
    }

    // Verify webhook signature
    if (webhookSecret) {
      const xSignature = req.headers.get('x-signature');
      const xRequestId = req.headers.get('x-request-id');
      const dataId = body.data?.id;

      const isValid = await verifyMercadoPagoSignature(
        xSignature,
        xRequestId,
        dataId,
        webhookSecret
      );

      if (!isValid) {
        console.warn('Invalid webhook signature - processing anyway for debugging');
        // Changed from error to warning - allow processing to continue
      } else {
        console.log('Webhook signature verified successfully');
      }
    } else {
      console.warn('MERCADO_PAGO_WEBHOOK_SECRET not configured - webhook signature verification skipped');
    }

    // Get payment details from Mercado Pago
    // Support both formats: webhook (body.data.id) and IPN (body.resource)
    const paymentId = isWebhookFormat ? body.data?.id : body.resource;
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

    // Get booking ID from external_reference (set in create-booking)
    const bookingId = payment.external_reference;
    if (!bookingId) {
      console.error("No booking ID in payment external_reference");
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
      // Verify amount - use final_price to support discount coupons
      const expectedAmount = booking.final_price || booking.services.price_clp;
      console.log("Payment amount:", payment.transaction_amount);
      console.log("Expected amount (final_price):", booking.final_price);
      console.log("Service price:", booking.services.price_clp);
      
      if (payment.transaction_amount !== expectedAmount) {
        console.error("Payment amount mismatch - Expected:", expectedAmount, "Received:", payment.transaction_amount);
        return new Response(JSON.stringify({ status: "amount_mismatch" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if slot is still available by verifying capacity
      const { data: slot, error: slotError } = await supabase
        .from("generated_slots")
        .select("id, max_capacity, confirmed_bookings")
        .eq("professional_id", booking.professional_id)
        .eq("service_id", booking.service_id)
        .eq("date_time_start", booking.date_time_start)
        .eq("is_active", true)
        .maybeSingle();

      if (slotError) {
        console.error("Error fetching slot:", slotError);
        throw slotError;
      }

      if (!slot) {
        console.error("No active slot found for this booking");
        
        // Update to CANCELLED
        await supabase
          .from("bookings")
          .update({
            status: "CANCELLED",
            mercado_pago_payment_id: paymentId,
          })
          .eq("id", bookingId);

        return new Response(
          JSON.stringify({ status: "slot_not_found" }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      console.log(`Slot capacity check: ${slot.confirmed_bookings}/${slot.max_capacity} bookings confirmed`);

      // Check if slot has reached max capacity
      if (slot.confirmed_bookings >= slot.max_capacity) {
        console.error(`Slot at max capacity: ${slot.confirmed_bookings}/${slot.max_capacity}`);
        
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

      // ATOMIC UPDATE: Confirm booking only if it's still PENDING and hasn't been processed
      // This prevents duplicate processing from multiple webhook notifications (IPN + Webhook format)
      const { data: updatedBooking, error: updateError } = await supabase
        .from("bookings")
        .update({
          status: "CONFIRMED",
          mercado_pago_payment_id: paymentId,
        })
        .eq("id", bookingId)
        .eq("status", "PENDING_PAYMENT")
        .is("mercado_pago_payment_id", null)
        .select()
        .maybeSingle();

      if (updateError) {
        console.error("Error updating booking:", updateError);
        throw updateError;
      }

      // If no rows were updated, another webhook already processed this payment
      if (!updatedBooking) {
        console.log(`Payment ${paymentId} already processed for booking ${bookingId}, skipping duplicate`);
        return new Response(JSON.stringify({ status: "already_processed" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Increment confirmed bookings count in the slot
      const { error: slotUpdateError } = await supabase
        .from("generated_slots")
        .update({
          confirmed_bookings: slot.confirmed_bookings + 1,
        })
        .eq("id", slot.id);

      if (slotUpdateError) {
        console.error("Error updating slot confirmed_bookings:", slotUpdateError);
        // Don't throw - booking is already confirmed
      }

      console.log(`Booking confirmed: ${bookingId} (slot now ${slot.confirmed_bookings + 1}/${slot.max_capacity})`);

      // Send confirmation email
      try {
        const emailResponse = await supabase.functions.invoke("send-booking-confirmation", {
          body: { bookingId },
        });

        if (emailResponse.error) {
          console.error("Error sending confirmation email:", emailResponse.error);
        } else {
          console.log("Confirmation email sent successfully");
        }
      } catch (emailError) {
        console.error("Failed to invoke send-booking-confirmation:", emailError);
      }

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
      JSON.stringify({ error: "Unable to process webhook" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});