import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { syncOrderToMailerLite, addSubscriberToGroups } from "../_shared/mailerlite.ts";
import { upsertCustomerAndLogEvent } from "../_shared/crm.ts";
import { sendMetaEvent } from "../_shared/metaCapi.ts";

/**
 * Contexto de navegador capturado al crear la orden (fbp/fbc/IP/UA/url).
 * Mejora la atribución de los eventos CAPI emitidos desde el webhook,
 * donde el request viene de Mercado Pago y no del usuario.
 */
function metaCtx(raw: any) {
  const c = (raw && typeof raw === "object") ? raw : {};
  return {
    fbp: c.fbp ?? undefined,
    fbc: c.fbc ?? undefined,
    clientIpAddress: c.client_ip_address ?? undefined,
    clientUserAgent: c.client_user_agent ?? undefined,
    eventSourceUrl: (typeof c.event_source_url === "string" && c.event_source_url) || undefined,
  };
}


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


/**
 * event_time estable entre reintentos: usa la fecha de aprobación del pago
 * (idéntica en cada reenvío de Mercado Pago) y no el "ahora" del webhook.
 */
function stableEventTime(payment: any): number | undefined {
  const raw = payment?.date_approved || payment?.date_created;
  if (!raw) return undefined;
  const ms = Date.parse(raw);
  if (!Number.isFinite(ms)) return undefined;
  return Math.floor(ms / 1000);
}

/** True sólo si el pago está realmente aprobado. Nunca enviar Purchase si no. */
function isApproved(payment: any): boolean {
  return payment?.status === "approved";
}

/**
 * Purchase de tienda. Idempotente: el outbox deduplica por (event_name,event_id),
 * así un delivery `sent` se salta y uno `failed/pending` se reintenta.
 */
async function sendShopPurchaseCapi(order: any, payment: any, orderId: string, supabase: any) {
  if (!isApproved(payment)) return;
  try {
    const siteUrl = (Deno.env.get("SITE_URL") || "https://studiolanave.com").replace(/\/$/, "");
    const shopCtx = metaCtx(order.meta_context);
    await sendMetaEvent({
      eventName: "Purchase",
      eventId: `purchase-shop-${orderId}`,
      eventTime: stableEventTime(payment),
      eventSourceUrl: shopCtx.eventSourceUrl || `${siteUrl}/tienda/success?external_reference=${orderId}`,
      funnel: "shop",
      entityType: "shop_order",
      entityId: orderId,
      user: {
        email: order.customer_email,
        phone: order.customer_phone || undefined,
        fullName: order.customer_name,
        externalId: order.customer_email,
        fbp: shopCtx.fbp,
        fbc: shopCtx.fbc,
        clientIpAddress: shopCtx.clientIpAddress,
        clientUserAgent: shopCtx.clientUserAgent,
      },
      custom: {
        value: Number(payment.transaction_amount) || order.product_price,
        currency: "CLP",
        contentName: order.product_name,
        contentType: "product",
        contentCategory: "shop",
        contentIds: [order.product_id ?? orderId],
        numItems: 1,
        orderId,
        extra: { product_type: "shop_product" },
      },
      supabase,
    });
  } catch (fbError) {
    console.error("Shop Meta CAPI event failed (non-blocking):", (fbError as Error).message);
  }
}

// Handle shop product order payments (physical store)
async function handleShopOrderPayment(
  payment: any,
  orderId: string,
  supabase: any,
  corsHeaders: any
) {
  const paymentIdStr = payment.id.toString();
  console.log(`Processing shop order payment: orderId=${orderId}, paymentId=${paymentIdStr}, status=${payment.status}`);

  const { data: order, error: orderError } = await supabase
    .from("shop_orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    return new Response(JSON.stringify({ status: "order_not_found" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (order.status === "paid" || order.mercado_pago_payment_id === paymentIdStr) {
    // Reconciliación CAPI: sin re-ejecutar efectos de negocio.
    if (order.status === "paid" && isApproved(payment)) {
      await sendShopPurchaseCapi(order, payment, orderId, supabase);
    }
    return new Response(JSON.stringify({ status: "already_processed" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (payment.status === "pending") {
    await supabase
      .from("shop_orders")
      .update({ status: "pending", mercado_pago_payment_id: paymentIdStr })
      .eq("id", orderId);
    return new Response(JSON.stringify({ status: "payment_pending" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (payment.status !== "approved") {
    await supabase
      .from("shop_orders")
      .update({ status: "failed", mercado_pago_payment_id: paymentIdStr })
      .eq("id", orderId);
    return new Response(JSON.stringify({ status: "payment_not_approved" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Approved — verify amount
  if (Math.abs(payment.transaction_amount - order.product_price) > 1) {
    await supabase
      .from("shop_orders")
      .update({ status: "failed", mercado_pago_payment_id: paymentIdStr })
      .eq("id", orderId);
    return new Response(JSON.stringify({ status: "amount_mismatch" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  await supabase
    .from("shop_orders")
    .update({
      status: "paid",
      mercado_pago_payment_id: paymentIdStr,
      paid_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .in("status", ["pending", "failed"]);

  console.log(`Shop order ${orderId} marked as paid`);

  await sendShopPurchaseCapi(order, payment, orderId, supabase);

  return new Response(JSON.stringify({ status: "shop_order_paid" }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Handle Wim Hof workshop inscriptions (taller_inscripciones)
async function handleTallerPayment(
  payment: any,
  orderId: string,
  supabase: any,
  corsHeaders: any
) {
  const paymentIdStr = payment.id.toString();
  const json = (status: string) =>
    new Response(JSON.stringify({ status }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  const { data: insc } = await supabase
    .from("taller_inscripciones")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (!insc) return json("inscripcion_not_found");

  // Idempotency: already processed
  if (insc.status === "paid" || insc.cupo_reserved) return json("already_processed");

  if (payment.status === "pending" || payment.status === "in_process") {
    await supabase
      .from("taller_inscripciones")
      .update({ status: "pending", mercado_pago_payment_id: paymentIdStr, mercado_pago_status: payment.status })
      .eq("id", orderId);
    return json("payment_pending");
  }

  if (payment.status !== "approved") {
    await supabase
      .from("taller_inscripciones")
      .update({
        status: payment.status === "cancelled" ? "cancelled" : "failed",
        mercado_pago_payment_id: paymentIdStr,
        mercado_pago_status: payment.status,
      })
      .eq("id", orderId);
    return json("payment_not_approved");
  }

  if (Math.abs(payment.transaction_amount - insc.amount) > 1) {
    await supabase
      .from("taller_inscripciones")
      .update({ status: "failed", mercado_pago_payment_id: paymentIdStr, mercado_pago_status: payment.status })
      .eq("id", orderId);
    return json("amount_mismatch");
  }

  // Atomic claim: only one webhook run can flip pending -> paid
  const { data: claimed } = await supabase
    .from("taller_inscripciones")
    .update({
      status: "paid",
      mercado_pago_payment_id: paymentIdStr,
      mercado_pago_status: payment.status,
      paid_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .in("status", ["pending", "failed", "cancelled"])
    .select()
    .maybeSingle();

  if (!claimed) return json("already_processed");

  // Reserve the cupo atomically
  let remaining: number | null = null;
  const { data: reserved, error: reserveError } = await supabase.rpc("reserve_event_cupo", {
    _event_id: insc.event_id,
  });
  if (reserveError) {
    console.error("Error reserving cupo:", reserveError);
  } else {
    remaining = reserved as number;
    await supabase
      .from("taller_inscripciones")
      .update({ cupo_reserved: remaining >= 0 })
      .eq("id", orderId);
  }

  // Admin notification — Talleres Wim Hof solo a lanave@alaniceman.com
  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const adminEmail = "lanave@alaniceman.com";
    if (resendKey) {
      const nivelTxt = insc.nivel === "avanzado" ? "Avanzado" : "Fundamentos";
      const html = `
        <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1A1A1A;line-height:1.7">
          <h2 style="color:#2E4D3A;margin:0 0 12px">Nueva inscripción Taller Wim Hof — ${nivelTxt}</h2>
          <p><strong>Participante:</strong> ${insc.nombre} ${insc.apellido}</p>
          <p><strong>Email:</strong> ${insc.email}</p>
          <p><strong>Teléfono:</strong> ${insc.phone}</p>
          <p><strong>Taller:</strong> ${insc.taller_nombre}</p>
          <p><strong>Fecha:</strong> ${insc.fecha_evento}</p>
          <p><strong>Horario:</strong> ${insc.horario}</p>
          <p><strong>Valor pagado:</strong> $${Number(payment.transaction_amount).toLocaleString("es-CL")} CLP</p>
          <p><strong>Payment ID:</strong> ${paymentIdStr}</p>
          <p><strong>Cupos restantes:</strong> ${remaining === null || remaining < 0 ? "revisar" : remaining}</p>
          <p><strong>Fecha de compra:</strong> ${new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" })}</p>
        </div>`;
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Nave Studio <agenda@studiolanave.com>",
          to: [adminEmail],
          subject: `Nueva inscripción Taller Wim Hof — ${nivelTxt}`,
          html,
        }),
      });
      if (!r.ok) {
        const errTxt = await r.text();
        console.error("Resend error (taller):", errTxt);
        await supabase.from("taller_inscripciones").update({ notification_error: errTxt.slice(0, 500) }).eq("id", orderId);
      }
    }
  } catch (err) {
    console.error("Taller notification failed:", err);
    await supabase
      .from("taller_inscripciones")
      .update({ notification_error: String(err).slice(0, 500) })
      .eq("id", orderId);
  }

  // Participant confirmation email (never blocks the inscription)
  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      // Resend rate limit: max 2 req/sec
      await new Promise((r) => setTimeout(r, 600));

      const nivelTxt = insc.nivel === "avanzado" ? "Avanzado" : "Fundamentos";
      const fechaLarga = insc.nivel === "avanzado"
        ? "Domingo 23 de agosto de 2026"
        : "Domingo 23 de agosto de 2026";
      const mapsUrl = "https://maps.app.goo.gl/4BvC7kC3JpVdQVkFA";
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:24px 12px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#F4F4F5;line-height:1.7">
  <div style="max-width:580px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden">
    <div style="background:#2E4D3A;padding:36px 28px;text-align:center;color:#ffffff">
      <h1 style="margin:0;font-size:22px;font-weight:600">¡Tu cupo está confirmado!</h1>
      <p style="margin:6px 0 0;font-size:14px;opacity:.85">Taller ${nivelTxt} · Método Wim Hof</p>
    </div>
    <div style="padding:28px">
      <h2 style="font-size:18px;color:#1A1A1A;margin:0 0 12px">Hola ${insc.nombre} 👋</h2>
      <p style="color:#3F3F46;font-size:15px;margin:0 0 14px">Recibimos tu pago y tu lugar en el <strong>${insc.taller_nombre}</strong> quedó reservado. Prepárate para respirar, entrar al hielo y conectar con tu poder.</p>
      <div style="background:#F8FAFB;border-left:4px solid #2E4D3A;padding:16px 18px;border-radius:8px;margin:18px 0">
        <p style="margin:4px 0;font-size:14px;color:#1A1A1A"><strong>📅 Fecha:</strong> ${fechaLarga}</p>
        <p style="margin:4px 0;font-size:14px;color:#1A1A1A"><strong>⏰ Horario:</strong> ${insc.horario}</p>
        <p style="margin:4px 0;font-size:14px;color:#1A1A1A"><strong>📍 Lugar:</strong> Nave Studio, Antares 259, Las Condes — <a href="${mapsUrl}" style="color:#2E4D3A">ver mapa</a></p>
        <p style="margin:4px 0;font-size:14px;color:#1A1A1A"><strong>💸 Pagado:</strong> $${Number(payment.transaction_amount).toLocaleString("es-CL")} CLP</p>
      </div>
      <p style="color:#3F3F46;font-size:15px;margin:0 0 8px"><strong>Qué traer:</strong></p>
      <ul style="color:#3F3F46;font-size:15px;margin:0 0 14px;padding-left:20px">
        <li>Traje de baño y toalla grande</li>
        <li>Bolsa para ropa mojada</li>
        <li>Ropa cómoda y abrigada para después</li>
        <li>Botella de agua</li>
      </ul>
      <p style="color:#3F3F46;font-size:15px;margin:0 0 14px">Te recomendamos llegar 15 minutos antes y venir con una comida ligera (idealmente 2 horas antes).</p>
      <p style="color:#71717A;font-size:13px;margin:0">¿Dudas? Escríbenos por <a href="https://wa.me/56946120426" style="color:#2E4D3A">WhatsApp +56 9 4612 0426</a>.</p>
    </div>
    <div style="padding:20px 28px;text-align:center;background:#FAFAFA;color:#71717A;font-size:12px">Nave Studio · studiolanave.com</div>
  </div>
</body></html>`;

      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Nave Studio <agenda@studiolanave.com>",
          to: [insc.email],
          subject: `Cupo confirmado · Taller ${nivelTxt} Método Wim Hof · 23 de agosto`,
          html,
        }),
      });
      if (!r.ok) console.error("Resend error (taller participante):", await r.text());
    }
  } catch (err) {
    console.error("Taller participant email failed:", err);
  }

  // Meta Conversions API (server-side, autoritativo) — deduped con el pixel
  // vía event_id determinista. Sólo se llega aquí con pago approved y monto validado.
  try {
    const siteUrl = (Deno.env.get("SITE_URL") || "https://studiolanave.com").replace(/\/$/, "");
    const tallerCtx = metaCtx(insc.meta_context);
    await sendMetaEvent({
      eventName: "Purchase",
      eventId: `purchase-taller-${orderId}`,
      eventSourceUrl: tallerCtx.eventSourceUrl || `${siteUrl}/taller-wim-hof-santiago-fundamentales-avanzado?pago=approved&order=${orderId}`,
      funnel: "workshop",
      entityType: "taller_inscripcion",
      entityId: orderId,
      user: {
        email: insc.email,
        phone: insc.phone || undefined,
        firstName: insc.nombre,
        lastName: insc.apellido,
        externalId: insc.email,
        fbp: tallerCtx.fbp,
        fbc: tallerCtx.fbc,
        clientIpAddress: tallerCtx.clientIpAddress,
        clientUserAgent: tallerCtx.clientUserAgent,
      },
      custom: {
        value: Number(payment.transaction_amount) || insc.amount,
        currency: "CLP",
        contentName: insc.taller_nombre,
        contentType: "product",
        contentCategory: "workshop",
        // id estable del taller, no de la orden
        contentIds: [`taller-whm-santiago-${insc.nivel}`],
        numItems: 1,
        orderId,
      },
      supabase,
    });
  } catch (fbError) {
    console.error("Taller Meta CAPI event failed (non-blocking):", (fbError as Error).message);
  }

  return json("taller_inscripcion_paid");
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
    .in("status", ["created", "pending_payment", "failed"])
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

  // Add buyer to MailerLite groups (non-blocking)
  await addSubscriberToGroups(order.buyer_email, order.buyer_name, [
    "168517368312498017",
    "180841311274796302",
  ]);

  // Meta CAPI Purchase (server-side, autoritativo) tras pago confirmado.
  // En gift cards se usan los datos del COMPRADOR para matching.
  try {
    const siteUrl = (Deno.env.get("SITE_URL") || "https://studiolanave.com").replace(/\/$/, "");
    const successPath = isGiftCard ? "/giftcards/success" : "/bonos/success";
    const pkgCtx = metaCtx(order.meta_context);
    await sendMetaEvent({
      eventName: "Purchase",
      eventId: `purchase-${orderId}`,
      eventSourceUrl: pkgCtx.eventSourceUrl || `${siteUrl}${successPath}?order=${orderId}`,
      funnel: isGiftCard ? "gift_card" : "package",
      entityType: "package_order",
      entityId: orderId,
      user: {
        email: order.buyer_email,
        phone: order.buyer_phone || undefined,
        fullName: order.buyer_name,
        externalId: order.buyer_email,
        fbp: pkgCtx.fbp,
        fbc: pkgCtx.fbc,
        clientIpAddress: pkgCtx.clientIpAddress,
        clientUserAgent: pkgCtx.clientUserAgent,
      },
      custom: {
        value: order.final_price,
        currency: "CLP",
        contentName: package_.name,
        contentType: "product",
        contentCategory: isGiftCard ? "gift_card" : "package",
        // id estable del paquete, no de la orden
        contentIds: [package_.id],
        numItems: 1,
        orderId,
        extra: { product_type: isGiftCard ? "gift_card" : "package" },
      },
      supabase,
    });
  } catch (fbError) {
    console.error("Package Meta CAPI event failed (non-blocking):", (fbError as Error).message);
  }

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

    // Consume coupon usage only after successful payment confirmation
    if (booking.coupon_id) {
      try {
        const { data: coupon } = await supabase
          .from("discount_coupons")
          .select("id, current_uses")
          .eq("id", booking.coupon_id)
          .maybeSingle();

        if (coupon) {
          const currentUses = coupon.current_uses ?? 0;
          const { error: couponUpdateError } = await supabase
            .from("discount_coupons")
            .update({ current_uses: currentUses + 1 })
            .eq("id", coupon.id);

          if (couponUpdateError) {
            console.error("Error incrementing coupon usage for booking:", couponUpdateError);
          }
        }
      } catch (couponError) {
        console.error("Failed to consume coupon usage for booking:", couponError);
      }
    }

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

    // Add buyer to MailerLite groups (non-blocking)
    await addSubscriberToGroups(booking.customer_email, booking.customer_name, [
      "168517368312498017",
      "180841311274796302",
    ]);

    // Meta CAPI (autoritativo): reserva pagada => Purchase + Schedule.
    // event_id determinista, igual al del pixel en /agenda/success.
    try {
      const siteUrl = (Deno.env.get("SITE_URL") || "https://studiolanave.com").replace(/\/$/, "");
      const bookingValue = booking.final_price ?? booking.services?.price_clp ?? 0;
      const bookingCtx = metaCtx(booking.meta_context);
      const metaUser = {
        email: booking.customer_email,
        phone: booking.customer_phone || undefined,
        fullName: booking.customer_name,
        externalId: booking.customer_email,
        fbp: bookingCtx.fbp,
        fbc: bookingCtx.fbc,
        clientIpAddress: bookingCtx.clientIpAddress,
        clientUserAgent: bookingCtx.clientUserAgent,
      };
      if (bookingValue > 0) {
        await sendMetaEvent({
          eventName: "Purchase",
          eventId: `purchase-booking-${bookingId}`,
          eventSourceUrl: bookingCtx.eventSourceUrl || `${siteUrl}/agenda/success?external_reference=${bookingId}`,
          funnel: "booking",
          entityType: "booking",
          entityId: bookingId,
          user: metaUser,
          custom: {
            value: bookingValue,
            currency: "CLP",
            contentName: booking.services?.name,
            contentType: "product",
            contentCategory: "booking",
            contentIds: [booking.service_id],
            numItems: 1,
            orderId: bookingId,
          },
          supabase,
        });
      }
      await sendMetaEvent({
        eventName: "Schedule",
        eventId: `schedule-booking-${bookingId}`,
        eventSourceUrl: bookingCtx.eventSourceUrl || `${siteUrl}/agenda/success?external_reference=${bookingId}`,
        funnel: "booking",
        entityType: "booking",
        entityId: bookingId,
        user: metaUser,
        custom: {
          contentName: booking.services?.name,
          contentCategory: "booking",
          contentIds: [booking.service_id],
        },
        supabase,
      });
    } catch (fbError) {
      console.error("Booking Meta CAPI event failed (non-blocking):", (fbError as Error).message);
    }

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
      // Check shop_orders first
      const { data: shopOrder } = await supabase
        .from("shop_orders")
        .select("id")
        .eq("id", externalReference)
        .maybeSingle();

      if (shopOrder) {
        console.log("Processing as shop order");
        return await handleShopOrderPayment(payment, externalReference, supabase, corsHeaders);
      }

      // Check if it's a Wim Hof workshop inscription
      const { data: tallerInsc } = await supabase
        .from("taller_inscripciones")
        .select("id")
        .eq("id", externalReference)
        .maybeSingle();

      if (tallerInsc) {
        console.log("Processing as taller inscripcion");
        return await handleTallerPayment(payment, externalReference, supabase, corsHeaders);
      }



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
