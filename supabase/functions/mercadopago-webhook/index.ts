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

    // Mercado Pago sends notifications with type "payment"
    if (body.type !== "payment") {
      return new Response(JSON.stringify({ status: "ignored" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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
        console.error('Invalid webhook signature');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      console.log('Webhook signature verified successfully');
    } else {
      console.warn('MERCADO_PAGO_WEBHOOK_SECRET not configured - webhook signature verification skipped');
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