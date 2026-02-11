import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { generateSlotsFromRules } from "../_shared/slotGenerator.ts";

const bookingSchema = z.object({
  professionalId: z.string().uuid(),
  serviceId: z.string().uuid(),
  dateTimeStart: z.string(),
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email().max(255),
  customerPhone: z.string().min(8).max(20),
  customerComments: z.string().max(500).optional(),
  couponCode: z.string().optional().nullable(),
  sessionCode: z.string().optional().nullable(),
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
      validatedData = bookingSchema.parse(requestData);
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return new Response(
        JSON.stringify({ error: "Invalid input data" }),
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

    // Get service details (NEVER trust price from client)
    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("*")
      .eq("id", validatedData.serviceId)
      .eq("is_active", true)
      .single();

    if (serviceError || !service) {
      throw new Error("Service not found");
    }

    // Calculate end time
    const startDate = new Date(validatedData.dateTimeStart);
    const endDate = new Date(
      startDate.getTime() + service.duration_minutes * 60000
    );

    // Check if using session code (prepaid)
    let sessionCodeId = null;
    let isPrepaid = false;

    if (validatedData.sessionCode) {
      console.log("Validating session code:", validatedData.sessionCode);
      
      const { data: sessionCode, error: codeError } = await supabase
        .from("session_codes")
        .select("*")
        .eq("code", validatedData.sessionCode.toUpperCase())
        .single();

      if (codeError || !sessionCode) {
        return new Response(
          JSON.stringify({ error: "Código de sesión no válido" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Check if already used
      if (sessionCode.is_used) {
        return new Response(
          JSON.stringify({ error: "Este código ya fue utilizado" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Check if expired
      const now = new Date();
      const expiresAt = new Date(sessionCode.expires_at);
      if (now > expiresAt) {
        return new Response(
          JSON.stringify({ error: "Este código ha expirado" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Check if service is applicable
      const isServiceApplicable = sessionCode.applicable_service_ids.includes(validatedData.serviceId);
      if (!isServiceApplicable) {
        return new Response(
          JSON.stringify({ error: "Este código no es válido para este servicio" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      sessionCodeId = sessionCode.id;
      isPrepaid = true;
      console.log("Session code validated, booking will be prepaid");
    }

    // Validate and apply coupon if provided (only if not using session code)
    let couponId = null;
    let discountAmount = 0;
    let originalPrice = service.price_clp;
    let finalPrice = isPrepaid ? 0 : service.price_clp;

    if (validatedData.couponCode && !isPrepaid) {
      console.log("Validating coupon:", validatedData.couponCode);
      
      const { data: coupon, error: couponError } = await supabase
        .from("discount_coupons")
        .select("*")
        .eq("code", validatedData.couponCode.toUpperCase())
        .eq("is_active", true)
        .single();

      if (couponError || !coupon) {
        return new Response(
          JSON.stringify({ error: "Cupón no válido" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Validate coupon dates
      const now = new Date();
      const validFrom = new Date(coupon.valid_from);
      const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

      if (now < validFrom) {
        return new Response(
          JSON.stringify({ error: "Este cupón aún no es válido" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      if (validUntil && now > validUntil) {
        return new Response(
          JSON.stringify({ error: "Este cupón ha expirado" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Validate max uses
      if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
        return new Response(
          JSON.stringify({ error: "Este cupón ya no tiene usos disponibles" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Validate minimum purchase
      if (coupon.min_purchase_amount > service.price_clp) {
        return new Response(
          JSON.stringify({ 
            error: `Este cupón requiere una compra mínima de $${coupon.min_purchase_amount.toLocaleString('es-CL')}` 
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Calculate discount
      if (coupon.discount_type === "percentage") {
        discountAmount = Math.floor((service.price_clp * coupon.discount_value) / 100);
      } else {
        discountAmount = coupon.discount_value;
      }

      // Ensure discount doesn't exceed price
      discountAmount = Math.min(discountAmount, service.price_clp);
      finalPrice = service.price_clp - discountAmount;
      couponId = coupon.id;

      console.log(`Coupon applied: ${coupon.code}, discount: ${discountAmount}, final price: ${finalPrice}`);

      // Increment coupon usage
      const { error: updateCouponError } = await supabase
        .from("discount_coupons")
        .update({ current_uses: coupon.current_uses + 1 })
        .eq("id", coupon.id);

      if (updateCouponError) {
        console.error("Error updating coupon usage:", updateCouponError);
        // Don't fail the booking, but log the error
      }
    }

    // Find or create the generated slot for this booking
    let slot = null;
    let slotId = null;

    // Try to find existing slot
    const { data: existingSlot, error: slotError } = await supabase
      .from('generated_slots')
      .select('*')
      .eq('professional_id', validatedData.professionalId)
      .eq('service_id', validatedData.serviceId)
      .eq('date_time_start', validatedData.dateTimeStart)
      .eq('is_active', true)
      .maybeSingle();

    if (slotError) {
      console.error("Error fetching slot:", slotError);
      throw slotError;
    }

    if (existingSlot) {
      console.log("Found existing slot:", existingSlot.id);
      slot = existingSlot;
      slotId = existingSlot.id;

      // Check if there's available capacity
      const availableCapacity = slot.max_capacity - slot.confirmed_bookings;
      if (availableCapacity <= 0) {
        return new Response(
          JSON.stringify({ 
            error: 'No hay cupos disponibles para este horario',
            availableCapacity: 0,
            maxCapacity: slot.max_capacity 
          }),
          {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } else {
      console.log("No slot found, will create just-in-time...");
      
      // Verify availability rules before creating slot
      const now = new Date();
      const hoursUntilBooking =
        (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      const requestDate = validatedData.dateTimeStart.split("T")[0];
      const dayOfWeek = startDate.getDay();

      const { data: rules } = await supabase
        .from("availability_rules")
        .select(`
          *,
          services:service_id(id, max_capacity)
        `)
        .eq("professional_id", validatedData.professionalId)
        .eq("is_active", true);

      const validRule = rules?.find((rule) => {
        const applies =
          (rule.recurrence_type === "WEEKLY" && rule.day_of_week === dayOfWeek) ||
          (rule.recurrence_type === "ONCE" && rule.specific_date === requestDate);

        if (!applies) return false;

        const daysDiff = Math.floor(
          (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        return (
          hoursUntilBooking >= rule.min_hours_before_booking &&
          daysDiff <= rule.max_days_in_future
        );
      });

      if (!validRule) {
        return new Response(
          JSON.stringify({
            error: "Este horario no cumple con las reglas de disponibilidad",
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // Create the slot just-in-time
      console.log("Creating slot just-in-time for booking");
      const maxCapacity = service.max_capacity || 1;

      const { data: newSlot, error: createSlotError } = await supabase
        .from('generated_slots')
        .insert({
          professional_id: validatedData.professionalId,
          service_id: validatedData.serviceId,
          date_time_start: validatedData.dateTimeStart,
          date_time_end: endDate.toISOString(),
          max_capacity: maxCapacity,
          confirmed_bookings: 0,
          is_active: true,
        })
        .select()
        .single();

      if (createSlotError) {
        console.error("Error creating slot:", createSlotError);
        throw createSlotError;
      }

      console.log("Created new slot:", newSlot.id);
      slot = newSlot;
      slotId = newSlot.id;
    }


    // Create booking with appropriate status
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        professional_id: validatedData.professionalId,
        service_id: validatedData.serviceId,
        customer_name: validatedData.customerName,
        customer_email: validatedData.customerEmail,
        customer_phone: validatedData.customerPhone,
        customer_comments: validatedData.customerComments || null,
        date_time_start: validatedData.dateTimeStart,
        date_time_end: endDate.toISOString(),
        status: isPrepaid ? "CONFIRMED" : "PENDING_PAYMENT",
        coupon_id: couponId,
        discount_amount: discountAmount,
        original_price: originalPrice,
        final_price: finalPrice,
        session_code_id: sessionCodeId,
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // If prepaid with session code, mark code as used and confirm booking
    if (isPrepaid && sessionCodeId) {
      console.log("Marking session code as used and confirming booking");

      // Mark code as used
      await supabase
        .from("session_codes")
        .update({
          is_used: true,
          used_in_booking_id: booking.id,
          used_at: new Date().toISOString(),
        })
        .eq("id", sessionCodeId);

      // Check package depletion and send alert if needed
      try {
        // Get the session code details we validated earlier (line ~74)
        const { data: usedSessionCode } = await supabase
          .from("session_codes")
          .select("mercado_pago_payment_id, buyer_email, buyer_name, buyer_phone, code, package_id")
          .eq("id", sessionCodeId)
          .single();

        if (usedSessionCode?.mercado_pago_payment_id) {
          // Find all sibling codes from the same purchase
          const { data: siblingCodes } = await supabase
            .from("session_codes")
            .select("id, is_used")
            .eq("mercado_pago_payment_id", usedSessionCode.mercado_pago_payment_id);

          if (siblingCodes) {
            const totalCodes = siblingCodes.length;
            const remainingCodes = siblingCodes.filter(c => !c.is_used).length;

            console.log(`Package depletion check: ${remainingCodes}/${totalCodes} remaining`);

            if (remainingCodes <= 1) {
              // Get package name
              let packageName = "Paquete desconocido";
              if (usedSessionCode.package_id) {
                const { data: pkg } = await supabase
                  .from("session_packages")
                  .select("name")
                  .eq("id", usedSessionCode.package_id)
                  .single();
                if (pkg) packageName = pkg.name;
              }

              console.log(`Sending depletion alert for ${usedSessionCode.buyer_name}, ${remainingCodes} remaining`);
              await supabase.functions.invoke("send-package-depletion-alert", {
                body: {
                  buyerName: usedSessionCode.buyer_name,
                  buyerEmail: usedSessionCode.buyer_email,
                  buyerPhone: usedSessionCode.buyer_phone,
                  packageName,
                  totalCodes,
                  remainingCodes,
                  usedCode: usedSessionCode.code,
                },
              });
            }
          }
        }
      } catch (depletionError) {
        console.error("Error checking package depletion:", depletionError);
        // Don't fail the booking for this
      }

      // Increment confirmed bookings in slot
      if (slot) {
        await supabase
          .from("generated_slots")
          .update({
            confirmed_bookings: slot.confirmed_bookings + 1,
          })
          .eq("id", slot.id);
      }

      // Send confirmation email
      try {
        const emailResponse = await supabase.functions.invoke("send-booking-confirmation", {
          body: { bookingId: booking.id },
        });

        if (emailResponse.error) {
          console.error("Error sending confirmation email:", emailResponse.error);
        } else {
          console.log("Confirmation email sent successfully");
        }
      } catch (emailError) {
        console.error("Failed to invoke send-booking-confirmation:", emailError);
      }

      // Return success without payment link
      return new Response(
        JSON.stringify({
          bookingId: booking.id,
          confirmed: true,
          message: "Sesión confirmada con código prepagado",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Mercado Pago preference
    const mercadoPagoAccessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    if (!mercadoPagoAccessToken) {
      throw new Error("Mercado Pago not configured");
    }

    console.log("Creating Mercado Pago preference for booking:", booking.id);

    const professional = await supabase
      .from("professionals")
      .select("name")
      .eq("id", validatedData.professionalId)
      .single();

    const siteUrl = Deno.env.get("SITE_URL")?.replace(/\/$/, "") || "https://studiolanave.com";
    console.log("Using SITE_URL:", siteUrl);

    const preferenceData = {
      items: [
        {
          title: `${service.name} - ${professional.data?.name}`,
          quantity: 1,
          unit_price: finalPrice,
          currency_id: "CLP",
        },
      ],
      payer: {
        name: validatedData.customerName,
        email: validatedData.customerEmail,
        phone: {
          number: validatedData.customerPhone,
        },
      },
      back_urls: {
        success: `${siteUrl}/agenda-nave-studio/success`,
        failure: `${siteUrl}/agenda-nave-studio/failure`,
        pending: `${siteUrl}/agenda-nave-studio/pending`,
      },
      auto_return: "approved",
      external_reference: booking.id,
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

    // Update booking with preference ID
    await supabase
      .from("bookings")
      .update({ mercado_pago_preference_id: preference.id })
      .eq("id", booking.id);

    console.log("Payment preference created successfully:", preference.id);


    return new Response(
      JSON.stringify({
        bookingId: booking.id,
        initPoint: preference.init_point,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in create-booking:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Error creating booking" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});