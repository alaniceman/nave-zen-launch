import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { generateSlotsFromRules } from "../_shared/slotGenerator.ts";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request (support both GET and POST)
    let date: string;
    let professionalId: string | null = null;

    if (req.method === "GET") {
      const url = new URL(req.url);
      date = url.searchParams.get("date") || "";
      professionalId = url.searchParams.get("professionalId");
    } else {
      const body = await req.json();
      date = body.date;
      professionalId = body.professionalId || null;
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

    console.log(`Fetching availability for date: ${date}, professionalId: ${professionalId}`);

    // Parse the date and create start/end of day in Chile timezone
    const startOfDay = new Date(date + "T00:00:00-03:00");
    const endOfDay = new Date(date + "T23:59:59-03:00");

    console.log(`Date range: ${startOfDay.toISOString()} to ${endOfDay.toISOString()}`);

    // Build query to fetch generated slots
    let query = supabase
      .from("generated_slots")
      .select(`
        *,
        professionals:professional_id(id, name, slug),
        services:service_id(id, name, duration_minutes, max_capacity)
      `)
      .eq("is_active", true)
      .gte("date_time_start", startOfDay.toISOString())
      .lte("date_time_start", endOfDay.toISOString())
      .order("date_time_start", { ascending: true });

    // Filter by professional if specified
    if (professionalId) {
      query = query.eq("professional_id", professionalId);
    }

    const { data: slots, error: slotsError } = await query;

    if (slotsError) {
      console.error("Error fetching slots:", slotsError);
      throw slotsError;
    }

    console.log(`Found ${slots?.length || 0} slots in generated_slots table`);

    // Create a Set of existing slots for quick lookup: "professionalId-serviceId-dateTimeStart"
    // Normalize timestamps to ISO format for consistent comparison
    const normalizeTimestamp = (ts: string) => new Date(ts).toISOString();
    
    const existingSlotsSet = new Set(
      (slots || []).map(slot => 
        `${slot.professional_id}-${slot.service_id}-${normalizeTimestamp(slot.date_time_start)}`
      )
    );

    console.log(`Existing slots in DB: ${existingSlotsSet.size}`, Array.from(existingSlotsSet));

    // Fetch availability rules for this date
    let rulesQuery = supabase
      .from("availability_rules")
      .select(`
        *,
        professionals:professional_id(id, name, slug),
        services:service_id(id, name, max_capacity)
      `)
      .eq("is_active", true);

    if (professionalId) {
      rulesQuery = rulesQuery.eq("professional_id", professionalId);
    }

    const { data: rules, error: rulesError } = await rulesQuery;

    if (rulesError) {
      console.error("Error fetching rules:", rulesError);
      throw rulesError;
    }

    console.log(`Found ${rules?.length || 0} active rules`);

    // Generate on-the-fly slots from ALL rules, then filter out those that already exist in DB
    let generatedSlots: any[] = [];
    
    if (rules && rules.length > 0) {
      // Extract services data from all rules
      const services = rules
        .map(r => r.services)
        .filter(Boolean)
        .map(s => ({ id: s.id, max_capacity: s.max_capacity }));

      // Generate slots from ALL rules
      const generatedSlotsRaw = generateSlotsFromRules(
        date,
        rules,
        services
      );

      console.log(`Generated ${generatedSlotsRaw.length} potential slots from rules`);

      // Filter out slots that already exist in DB and format for response
      generatedSlots = generatedSlotsRaw
        .filter(slot => {
          const key = `${slot.professional_id}-${slot.service_id}-${normalizeTimestamp(slot.date_time_start)}`;
          const exists = existingSlotsSet.has(key);
          if (exists) {
            console.log(`Skipping slot (already in DB): ${key}`);
          }
          return !exists;
        })
        .map(slot => {
          const rule = rules.find(r => 
            r.professional_id === slot.professional_id && 
            r.service_id === slot.service_id
          );
          return {
            id: null, // No DB id since it's not persisted
            professional_id: slot.professional_id,
            professionals: rule?.professionals,
            service_id: slot.service_id,
            services: rule?.services,
            date_time_start: slot.date_time_start,
            date_time_end: slot.date_time_end,
            max_capacity: slot.max_capacity,
            confirmed_bookings: 0,
          };
        });

      console.log(`${generatedSlots.length} new slots generated on-the-fly (not in DB)`);
    }

    // Combine DB slots with generated slots
    const allSlots = [...(slots || []), ...generatedSlots];
    console.log(`Total slots (DB + generated): ${allSlots.length}`);

    // Filter all slots to only show those with available capacity
    const availableSlots = allSlots
      .filter(slot => {
        const availableCapacity = slot.max_capacity - slot.confirmed_bookings;
        return availableCapacity > 0;
      })
      .map(slot => ({
        id: slot.id,
        professionalId: slot.professional_id,
        professionalName: slot.professionals?.name || "Unknown",
        serviceId: slot.service_id,
        serviceName: slot.services?.name || "Unknown",
        dateTimeStart: slot.date_time_start,
        dateTimeEnd: slot.date_time_end,
        maxCapacity: slot.max_capacity,
        confirmedBookings: slot.confirmed_bookings,
        availableCapacity: slot.max_capacity - slot.confirmed_bookings,
      }))
      .sort((a, b) => a.dateTimeStart.localeCompare(b.dateTimeStart));

    console.log(`Returning ${availableSlots.length} available slots (${slots?.length || 0} from DB, ${generatedSlots.length} generated)`);

    return new Response(
      JSON.stringify({ slots: availableSlots }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
