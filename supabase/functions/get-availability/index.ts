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
    
    // Support both GET (with query params) and POST (with body)
    let date: string | null = null;
    let professionalId: string | null = null;
    
    if (req.method === "GET") {
      date = url.searchParams.get("date");
      professionalId = url.searchParams.get("professionalId");
    } else if (req.method === "POST") {
      const body = await req.json();
      date = body.date;
      professionalId = body.professionalId;
    }

    if (!date) {
      return new Response(
        JSON.stringify({ error: "Date parameter is required" }),
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

    // Get the day of week (0 = Sunday, 1 = Monday, etc.)
    // Force Chile timezone (UTC-3)
    const requestDate = new Date(date + "T00:00:00-03:00");
    const dayOfWeek = requestDate.getDay();

    // Get availability rules
    let rulesQuery = supabase
      .from("availability_rules")
      .select("*, professionals(id, name, slug)")
      .eq("is_active", true);

    if (professionalId) {
      rulesQuery = rulesQuery.eq("professional_id", professionalId);
    }

    const { data: rules, error: rulesError } = await rulesQuery;

    if (rulesError) throw rulesError;

    // Generate time slots
    const slots: any[] = [];
    const now = new Date();
    const requestDateTime = new Date(date + "T00:00:00-03:00");

    for (const rule of rules || []) {
      // Check if rule applies to this date
      const applies =
        (rule.recurrence_type === "WEEKLY" && rule.day_of_week === dayOfWeek) ||
        (rule.recurrence_type === "ONCE" && rule.specific_date === date);

      if (!applies) continue;

      // Check max_days_in_future
      const daysDiff = Math.floor(
        (requestDateTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff > rule.max_days_in_future) continue;

    // Generate slots for this rule
    const startTime = rule.start_time;
    const endTime = rule.end_time;
    const duration = rule.duration_minutes;

    let currentTime = startTime;
    while (currentTime < endTime) {
      // Force Chile timezone for slot creation
      const slotStart = new Date(`${date}T${currentTime}-03:00`);
      const slotEnd = new Date(slotStart.getTime() + duration * 60000);

      // Check min_hours_before_booking
      const hoursUntilSlot =
        (slotStart.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (hoursUntilSlot >= rule.min_hours_before_booking) {
        slots.push({
          dateTimeStart: slotStart.toISOString(),
          dateTimeEnd: slotEnd.toISOString(),
          professionalId: rule.professional_id,
          professionalName: rule.professionals.name,
          serviceId: rule.service_id,
          ruleId: rule.id,
        });
      }

      // Move to next slot
      const [hours, minutes] = currentTime.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes + duration;
      const newHours = Math.floor(totalMinutes / 60);
      const newMinutes = totalMinutes % 60;
      // Add seconds to fix string comparison bug
      currentTime = `${String(newHours).padStart(2, "0")}:${String(
        newMinutes
      ).padStart(2, "0")}:00`;
    }
  }

  // Fetch capacity overrides for this date
  const { data: overrides } = await supabase
    .from('capacity_overrides')
    .select('*')
    .eq('date', date);

  const overridesMap = new Map();
  if (overrides) {
    for (const override of overrides) {
      // Normalize time format to HH:mm (without seconds) for consistent comparison
      const normalizedTime = override.start_time.substring(0, 5);
      const key = `${override.professional_id}_${override.service_id}_${normalizedTime}`;
      overridesMap.set(key, override.max_capacity);
    }
  }

  // Fetch services to get default capacities
  const serviceIds = [...new Set(rules?.map(r => r.service_id).filter(Boolean))];
  const { data: services } = await supabase
    .from('services')
    .select('id, max_capacity')
    .in('id', serviceIds);

  const servicesMap = new Map();
  if (services) {
    for (const service of services) {
      servicesMap.set(service.id, service.max_capacity);
    }
  }

  // Count confirmed bookings per slot
  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("professional_id, service_id, date_time_start")
    .gte("date_time_start", `${date}T00:00:00`)
    .lte("date_time_start", `${date}T23:59:59`)
    .eq("status", "CONFIRMED");

  if (bookingsError) throw bookingsError;

  // Create a map of booking counts per slot
  const bookingCounts = new Map();
  for (const booking of bookings || []) {
    const key = `${booking.professional_id}_${booking.service_id}_${booking.date_time_start}`;
    bookingCounts.set(key, (bookingCounts.get(key) || 0) + 1);
  }

  // Filter slots and add available capacity
  const availableSlots = slots
    .map(slot => {
      // Get the time portion
      const startTime = slot.dateTimeStart.split('T')[1].substring(0, 5);
      
      // Check for capacity override
      const overrideKey = `${slot.professionalId}_${slot.serviceId}_${startTime}`;
      const serviceMaxCapacity = servicesMap.get(slot.serviceId) || 1;
      const maxCapacity = overridesMap.get(overrideKey) ?? serviceMaxCapacity;
      
      // Count confirmed bookings for this slot
      const bookingKey = `${slot.professionalId}_${slot.serviceId}_${slot.dateTimeStart}`;
      const confirmedBookings = bookingCounts.get(bookingKey) || 0;
      
      const availableCapacity = maxCapacity - confirmedBookings;
      
      return {
        ...slot,
        maxCapacity,
        confirmedBookings,
        availableCapacity
      };
    })
    .filter(slot => slot.availableCapacity > 0);

  return new Response(
    JSON.stringify({ slots: availableSlots }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in get-availability:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});