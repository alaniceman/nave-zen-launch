import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = getCorsHeaders();

const bookingSchema = z.object({
  professionalId: z.string().uuid(),
  serviceId: z.string().uuid(),
  dateTimeStart: z.string(),
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email().max(255),
  customerPhone: z.string().min(8).max(20),
  customerComments: z.string().max(500).optional(),
});

serve(async (req) => {
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

    // Check if slot is still available
    const { data: existingBooking } = await supabase
      .from("bookings")
      .select("id")
      .eq("professional_id", validatedData.professionalId)
      .eq("date_time_start", validatedData.dateTimeStart)
      .eq("status", "CONFIRMED")
      .maybeSingle();

    if (existingBooking) {
      return new Response(
        JSON.stringify({ error: "Este horario ya no está disponible" }),
        {
          status: 409,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify availability rules
    const now = new Date();
    const hoursUntilBooking =
      (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    const requestDate = validatedData.dateTimeStart.split("T")[0];
    const dayOfWeek = startDate.getDay();

    const { data: rules } = await supabase
      .from("availability_rules")
      .select("*")
      .eq("professional_id", validatedData.professionalId)
      .eq("is_active", true);

    const hasValidRule = rules?.some((rule) => {
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

    if (!hasValidRule) {
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

    // Create booking with PENDING_PAYMENT status
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
        status: "PENDING_PAYMENT",
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Create Mercado Pago preference
    const mercadoPagoAccessToken = Deno.env.get("MERCADO_PAGO_ACCESS_TOKEN");
    if (!mercadoPagoAccessToken) {
      throw new Error("Mercado Pago not configured");
    }

    const professional = await supabase
      .from("professionals")
      .select("name")
      .eq("id", validatedData.professionalId)
      .single();

    const preferenceData = {
      items: [
        {
          title: `${service.name} - ${professional.data?.name}`,
          quantity: 1,
          unit_price: service.price_clp,
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
        success: `${Deno.env.get("SITE_URL")}/agenda-nave-studio/success`,
        failure: `${Deno.env.get("SITE_URL")}/agenda-nave-studio/failure`,
        pending: `${Deno.env.get("SITE_URL")}/agenda-nave-studio/pending`,
      },
      auto_return: "approved",
      notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mercadopago-webhook`,
      metadata: {
        booking_id: booking.id,
      },
    };

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

    if (!mpResponse.ok) {
      const errorText = await mpResponse.text();
      console.error("Mercado Pago error:", errorText);
      throw new Error("Error creating payment preference");
    }

    const preference = await mpResponse.json();

    // Update booking with preference ID
    await supabase
      .from("bookings")
      .update({ mercado_pago_preference_id: preference.id })
      .eq("id", booking.id);

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