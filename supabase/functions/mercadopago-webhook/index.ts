import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { syncOrderToMailerLite } from "../_shared/mailerlite.ts";
import { upsertCustomerAndLogEvent } from "../_shared/crm.ts";

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
    const parts = xSignature.split(',');
    const ts = parts.find(p => p.startsWith('ts='))?.split('=')[1];
    const hash = parts.find(p => p.startsWith('v1='))?.split('=')[1];

    if (!ts || !hash) {
      return false;
    }

    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
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

// Helper function to generate unique session codes
function generateSessionCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Check if a string is a valid UUID
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Handle session package/giftcard order payments using package_orders table
async function handlePackageOrderPayment(
  payment: any,
  orderId: string,
  supabase: any,
  corsHeaders: any
) {
  const paymentIdStr = payment.id.toString();
  console.log(`Processing package order payment: orderId=${orderId}, paymentId=${paymentIdStr}, status=${payment.status}`);

  // Load order from database
  const { data: order, error: orderError } = await supabase
    .from("package_orders")
    .select("*, session_packages(*)")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    console.error("Order not found:", orderId, orderError);
    return new Response(JSON.stringify({ status: "order_not_found" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  console.log(`Order found: ${order.id}, status=${order.status}, final_price=${order.final_price}`);

  // IDEMPOTENCY: Check if this order was already processed
  if (order.status === "paid") {
    console.log(`Order ${orderId} already paid - skipping duplicate webhook`);
    return new Response(JSON.stringify({ status: "already_processed" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Check if payment was already processed (by payment ID)
  if (order.mercado_pago_payment_id === paymentIdStr) {
    console.log(`Payment ${paymentIdStr} already recorded for order ${orderId}`);
    return new Response(JSON.stringify({ status: "already_processed" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Handle pending payments (e.g., bank transfer awaiting confirmation)
  if (payment.status === "pending") {
    console.log(`Payment pending: ${payment.status_detail}`);
    
    await supabase
      .from("package_orders")
      .update({
        status: "pending_payment",
        mercado_pago_payment_id: paymentIdStr,
        mercado_pago_status: payment.status,
        mercado_pago_status_detail: payment.status_detail || null,
        error_message: null, // Not an error, just pending
      })
      .eq("id", orderId);

    return new Response(JSON.stringify({ status: "payment_pending" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Handle non-approved payments (rejected, cancelled, etc.)
  if (payment.status !== "approved") {
    console.log(`Payment not approved: ${payment.status}, status_detail: ${payment.status_detail}`);
    
    await supabase
      .from("package_orders")
      .update({
        status: "failed",
        mercado_pago_payment_id: paymentIdStr,
        mercado_pago_status: payment.status,
        mercado_pago_status_detail: payment.status_detail || null,
        error_message: `Pago ${payment.status}: ${payment.status_detail || 'Sin detalle'}`,
      })
      .eq("id", orderId);

    return new Response(JSON.stringify({ status: "payment_not_approved" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // APPROVED payment - verify amount with tolerance (CLP has no decimals)
  const expectedAmount = order.final_price;
  const receivedAmount = payment.transaction_amount;
  const tolerance = 1; // 1 CLP tolerance for rounding

  if (Math.abs(receivedAmount - expectedAmount) > tolerance) {
    console.error(`Amount mismatch: expected ${expectedAmount}, received ${receivedAmount}`);
    
    await supabase
      .from("package_orders")
      .update({
        status: "failed",
        mercado_pago_payment_id: paymentIdStr,
        mercado_pago_status: payment.status,
        error_message: `Monto incorrecto: esperado ${expectedAmount}, recibido ${receivedAmount}`,
      })
      .eq("id", orderId);

    return new Response(JSON.stringify({ status: "amount_mismatch" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // ATOMIC UPDATE: Mark order as paid only if still in 'created' status
  const { data: updatedOrder, error: updateError } = await supabase
    .from("package_orders")
    .update({
      status: "paid",
      mercado_pago_payment_id: paymentIdStr,
      mercado_pago_status: payment.status,
      mercado_pago_status_detail: payment.status_detail || null,
    })
    .eq("id", orderId)
    .in("status", ["created", "pending_payment"])
    .select()
    .maybeSingle();

  if (updateError) {
    console.error("Error updating order:", updateError);
    throw updateError;
  }

  if (!updatedOrder) {
    console.log(`Order ${orderId} was already processed by another webhook`);
    return new Response(JSON.stringify({ status: "already_processed" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  console.log(`Order ${orderId} marked as paid`);

  // Get package details
  const package_ = order.session_packages;
  if (!package_) {
    console.error("Package not found in order");
    return new Response(JSON.stringify({ status: "package_not_found" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Generate session codes
  const codes = [];
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + package_.validity_days);

  // Generate giftcard access token if needed
  const isGiftCard = order.is_giftcard === true;
  let giftcardAccessToken: string | null = null;
  
  if (isGiftCard) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    giftcardAccessToken = token;
  }

  for (let i = 0; i < package_.sessions_quantity; i++) {
    let code = generateSessionCode();
    let isUnique = false;
    
    while (!isUnique) {
      const { data: existing } = await supabase
        .from("session_codes")
        .select("id")
        .eq("code", code)
        .maybeSingle();
      
      if (!existing) {
        isUnique = true;
      } else {
        code = generateSessionCode();
      }
    }

    codes.push({
      package_id: package_.id,
      code: code,
      applicable_service_ids: package_.applicable_service_ids,
      buyer_email: order.buyer_email,
      buyer_name: order.buyer_name,
      buyer_phone: order.buyer_phone,
      purchased_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      is_used: false,
      mercado_pago_payment_id: paymentIdStr,
      giftcard_access_token: giftcardAccessToken,
    });
  }

  // Insert codes
  const { error: insertError } = await supabase
    .from("session_codes")
    .insert(codes);

  if (insertError) {
    console.error("Error inserting codes:", insertError);
    // Mark order as failed
    await supabase
      .from("package_orders")
      .update({ 
        status: "failed", 
        error_message: "Error al generar códigos de sesión" 
      })
      .eq("id", orderId);
    throw insertError;
  }

  console.log(`Generated ${codes.length} session codes for order ${orderId}`);

  // Increment coupon usage if applicable
  if (order.coupon_id) {
    console.log("Incrementing coupon usage for:", order.coupon_id);
    
    const { data: currentCoupon } = await supabase
      .from("discount_coupons")
      .select("current_uses")
      .eq("id", order.coupon_id)
      .single();
    
    if (currentCoupon) {
      await supabase
        .from("discount_coupons")
        .update({ current_uses: (currentCoupon.current_uses || 0) + 1 })
        .eq("id", order.coupon_id);
      console.log("Coupon usage incremented");
    }
  }

  // Send confirmation email
  try {
    const siteUrl = (Deno.env.get("SITE_URL") || "https://studiolanave.com").replace(/\/$/, "");
    const giftcardLink = giftcardAccessToken ? `${siteUrl}/giftcard/${giftcardAccessToken}` : null;

    const emailResponse = await supabase.functions.invoke("send-session-codes-email", {
      body: {
        buyerEmail: order.buyer_email,
        buyerName: order.buyer_name,
        packageName: package_.name,
        codes: codes.map(c => c.code),
        expiresAt: expiresAt.toISOString(),
        isGiftCard: isGiftCard,
        giftcardLink: giftcardLink,
      },
    });

    if (emailResponse.error) {
      console.error("Error sending codes email:", emailResponse.error);
    } else {
      console.log("Codes email sent successfully");
    }
  } catch (emailError) {
    console.error("Failed to invoke send-session-codes-email:", emailError);
  }

  // Sync order to MailerLite for campaign attribution
  try {
    await syncOrderToMailerLite(supabase, {
      order_id: orderId,
      order_type: isGiftCard ? "giftcard" : "package_order",
      total: order.final_price,
      subtotal: order.original_price,
      customer_email: order.buyer_email,
      customer_name: order.buyer_name,
      items: [{
        product_id: package_.id,
        name: package_.name,
        quantity: package_.sessions_quantity,
        price: order.final_price,
      }],
    });
    console.log("MailerLite order synced for package order:", orderId);
  } catch (mlError) {
    console.error("Failed to sync to MailerLite (non-blocking):", mlError);
  }

  // CRM: upsert customer + log event
  const isGC = order.is_giftcard === true;
  await upsertCustomerAndLogEvent(supabase, {
    email: order.buyer_email,
    name: order.buyer_name,
    phone: order.buyer_phone,
    eventType: isGC ? "giftcard_purchased" : "package_purchased",
    eventTitle: isGC ? "Compró Gift Card" : "Compró Pack de Sesiones",
    eventDescription: package_.name,
    amount: order.final_price,
    metadata: { order_id: orderId, package_id: package_.id },
    statusIfNew: "purchased",
  });

  return new Response(JSON.stringify({ status: "codes_generated", count: codes.length }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Handle booking payments (legacy flow)
async function handleBookingPayment(
  payment: any,
  bookingId: string,
  supabase: any,
  corsHeaders: any,
  paymentId: string
) {
  console.log(`Processing booking payment: bookingId=${bookingId}, paymentId=${paymentId}`);

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

  if (payment.status === "approved") {
    const expectedAmount = booking.final_price || booking.services.price_clp;
    console.log("Payment amount:", payment.transaction_amount, "Expected:", expectedAmount);
    
    if (payment.transaction_amount !== expectedAmount) {
      console.error("Payment amount mismatch");
      return new Response(JSON.stringify({ status: "amount_mismatch" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check slot availability
    const { data: slot, error: slotError } = await supabase
      .from("generated_slots")
      .select("id, max_capacity, confirmed_bookings")
      .eq("professional_id", booking.professional_id)
      .eq("service_id", booking.service_id)
      .eq("date_time_start", booking.date_time_start)
      .eq("is_active", true)
      .maybeSingle();

    if (slotError || !slot) {
      console.error("No active slot found");
      await supabase
        .from("bookings")
        .update({ status: "CANCELLED", mercado_pago_payment_id: paymentId })
        .eq("id", bookingId);
      return new Response(JSON.stringify({ status: "slot_not_found" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (slot.confirmed_bookings >= slot.max_capacity) {
      console.error("Slot at max capacity");
      await supabase
        .from("bookings")
        .update({ status: "CANCELLED", mercado_pago_payment_id: paymentId })
        .eq("id", bookingId);
      return new Response(JSON.stringify({ status: "slot_unavailable" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ATOMIC UPDATE: Confirm booking
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

    if (!updatedBooking) {
      console.log("Booking already processed");
      return new Response(JSON.stringify({ status: "already_processed" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update slot count
    await supabase
      .from("generated_slots")
      .update({ confirmed_bookings: slot.confirmed_bookings + 1 })
      .eq("id", slot.id);

    console.log(`Booking confirmed: ${bookingId}`);

    // Send confirmation email
    try {
      await supabase.functions.invoke("send-booking-confirmation", {
        body: { bookingId },
      });
      console.log("Confirmation email sent");
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    // Sync booking to MailerLite for campaign attribution
    try {
      await syncOrderToMailerLite(supabase, {
        order_id: bookingId,
        order_type: "booking",
        total: booking.final_price || booking.services.price_clp,
        subtotal: booking.original_price || booking.services.price_clp,
        customer_email: booking.customer_email,
        customer_name: booking.customer_name,
        items: [{
          product_id: booking.service_id,
          name: booking.services.name,
          quantity: 1,
          price: booking.final_price || booking.services.price_clp,
        }],
      });
      console.log("MailerLite order synced for booking:", bookingId);
    } catch (mlError) {
      console.error("Failed to sync to MailerLite (non-blocking):", mlError);
    }

    // CRM: upsert customer + log event for booking
    await upsertCustomerAndLogEvent(supabase, {
      email: booking.customer_email,
      name: booking.customer_name,
      phone: booking.customer_phone,
      eventType: "booking_confirmed",
      eventTitle: "Reserva confirmada",
      eventDescription: booking.services?.name,
      amount: booking.final_price || booking.services?.price_clp,
      metadata: { booking_id: bookingId, service_id: booking.service_id },
      statusIfNew: "purchased",
    });

    return new Response(JSON.stringify({ status: "confirmed" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } else if (payment.status === "rejected" || payment.status === "cancelled") {
    await supabase
      .from("bookings")
      .update({ status: "CANCELLED", mercado_pago_payment_id: paymentId })
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
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Mercado Pago webhook received:", JSON.stringify(body));

    // Support both webhook formats
    const isWebhookFormat = body.type === "payment";
    const isIPNFormat = body.topic === "payment";
    
    if (!isWebhookFormat && !isIPNFormat) {
      console.log("Ignoring non-payment notification:", body.type || body.topic);
      return new Response(JSON.stringify({ status: "ignored" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    console.log(`Processing ${isWebhookFormat ? 'Webhook' : 'IPN'} format`);

    const mercadoPagoAccessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    const webhookSecret = Deno.env.get("MERCADO_PAGO_WEBHOOK_SECRET");
    
    if (!mercadoPagoAccessToken) {
      throw new Error("Mercado Pago not configured");
    }

    // Verify signature for webhook v2 format only.
    // IPN notifications (topic-based) don't reliably include x-signature headers,
    // so we skip signature verification for them. Security is maintained because
    // we always fetch the payment directly from Mercado Pago's API using our
    // access token, which validates the payment data independently.
    if (webhookSecret && isWebhookFormat) {
      const xSignature = req.headers.get('x-signature');
      const xRequestId = req.headers.get('x-request-id');
      
      const dataId = body.data?.id ? String(body.data.id) : undefined;
      
      if (dataId) {
        const isValid = await verifyMercadoPagoSignature(xSignature, xRequestId, dataId, webhookSecret);
        if (!isValid) {
          console.error('Invalid webhook signature (v2 format)');
          return new Response(
            JSON.stringify({ error: 'Invalid signature' }),
            { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        console.log('Webhook v2 signature verified');
      }
    } else if (isIPNFormat) {
      console.log('IPN format detected - skipping signature check (payment will be validated via API fetch)');
    }

    // Get payment ID
    const paymentId = isWebhookFormat ? body.data?.id : body.resource;
    if (!paymentId) {
      throw new Error("No payment ID in webhook");
    }

    // Fetch payment details from Mercado Pago
    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: { Authorization: `Bearer ${mercadoPagoAccessToken}` },
      }
    );

    if (!paymentResponse.ok) {
      throw new Error("Error fetching payment from Mercado Pago");
    }

    const payment = await paymentResponse.json();
    console.log("Payment details:", JSON.stringify({
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      external_reference: payment.external_reference,
      transaction_amount: payment.transaction_amount,
    }));

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const externalReference = payment.external_reference;
    if (!externalReference) {
      console.error("No external_reference in payment");
      return new Response(JSON.stringify({ status: "no_reference" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Determine the type of payment based on external_reference format
    // New format: UUID (package_orders table)
    // Legacy format: UUID (bookings table) or JSON string
    
    // First, check if it's a valid UUID
    if (isValidUUID(externalReference)) {
      // Check if it's a package_order (new flow)
      const { data: order } = await supabase
        .from("package_orders")
        .select("id")
        .eq("id", externalReference)
        .maybeSingle();

      if (order) {
        console.log("Processing as package order");
        return await handlePackageOrderPayment(payment, externalReference, supabase, corsHeaders);
      }

      // Otherwise, treat as booking (legacy flow)
      console.log("Processing as booking");
      return await handleBookingPayment(payment, externalReference, supabase, corsHeaders, paymentId);
    }

    // Try to parse as JSON (legacy session_package format)
    try {
      const packageData = JSON.parse(externalReference);
      if (packageData.type === "session_package") {
        console.warn("Legacy JSON external_reference detected - this should not happen with new flow");
        // For backwards compatibility, we could handle this, but it shouldn't occur
        return new Response(JSON.stringify({ status: "legacy_format_deprecated" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } catch {
      // Not JSON, unknown format
    }

    console.error("Unknown external_reference format:", externalReference);
    return new Response(JSON.stringify({ status: "unknown_reference_format" }), {
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
