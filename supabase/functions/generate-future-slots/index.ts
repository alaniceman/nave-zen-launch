import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";
import { toZonedTime } from "https://esm.sh/date-fns-tz@3.1.3";
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

    const body = await req.json().catch(() => ({}));
    console.log("Starting slot generation...");

    // Get parameters from request
    const daysAhead = body.daysAhead || 60;
    const dateFrom = body.dateFrom; // YYYY-MM-DD format
    const dateTo = body.dateTo;     // YYYY-MM-DD format
    const professionalId = body.professionalId;
    const serviceId = body.serviceId;

    // Fetch all active availability rules with related data
    let rulesQuery = supabase
      .from("availability_rules")
      .select(`
        *,
        professionals:professional_id(id, name),
        services:service_id(id, name, max_capacity)
      `)
      .eq("is_active", true);

    // Apply filters if provided
    if (professionalId) {
      rulesQuery = rulesQuery.eq("professional_id", professionalId);
    }
    if (serviceId) {
      rulesQuery = rulesQuery.eq("service_id", serviceId);
    }

    const { data: rules, error: rulesError } = await rulesQuery;

    if (rulesError) {
      console.error("Error fetching rules:", rulesError);
      throw rulesError;
    }

    if (!rules || rules.length === 0) {
      console.log("No active rules found");
      return new Response(
        JSON.stringify({ message: "No active rules found", slotsCreated: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found ${rules.length} active rules`);

    const slotsToInsert = [];
    const timezone = "America/Santiago";
    
    // Determine date range
    let startDate: Date;
    let endDate: Date;

    if (dateFrom && dateTo) {
      // Use specific date range from request
      startDate = toZonedTime(new Date(dateFrom + "T00:00:00-03:00"), timezone);
      endDate = toZonedTime(new Date(dateTo + "T00:00:00-03:00"), timezone);
      console.log(`Generating slots from ${dateFrom} to ${dateTo}`);
    } else {
      // Use daysAhead from today
      startDate = toZonedTime(new Date(), timezone);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + daysAhead);
      console.log(`Generating slots for next ${daysAhead} days`);
    }

    // Extract services data
    const services = rules
      .map(r => r.services)
      .filter(Boolean)
      .map(s => ({ id: s.id, max_capacity: s.max_capacity }));

    // Generate slots for each day in range
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      // Use shared helper function to generate slots
      const daySlots = generateSlotsFromRules(dateStr, rules, services);
      slotsToInsert.push(...daySlots);

      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log(`Generated ${slotsToInsert.length} potential slots`);

    if (slotsToInsert.length === 0) {
      return new Response(
        JSON.stringify({ message: "No slots to generate", slotsCreated: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check which slots already exist to avoid duplicates
    const existingSlots = new Set();
    
    const { data: existing } = await supabase
      .from("generated_slots")
      .select("professional_id, service_id, date_time_start")
      .gte("date_time_start", startDate.toISOString())
      .lte("date_time_start", endDate.toISOString());

    if (existing) {
      for (const slot of existing) {
        const key = `${slot.professional_id}_${slot.service_id}_${slot.date_time_start}`;
        existingSlots.add(key);
      }
    }

    // Filter out existing slots
    const newSlots = slotsToInsert.filter(slot => {
      const key = `${slot.professional_id}_${slot.service_id}_${slot.date_time_start}`;
      return !existingSlots.has(key);
    });

    console.log(`${newSlots.length} new slots to insert (${slotsToInsert.length - newSlots.length} already exist)`);

    if (newSlots.length === 0) {
      return new Response(
        JSON.stringify({ message: "All slots already exist", slotsCreated: 0, slotsChecked: slotsToInsert.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert new slots in batches to avoid timeout
    const batchSize = 500;
    let totalInserted = 0;

    for (let i = 0; i < newSlots.length; i += batchSize) {
      const batch = newSlots.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from("generated_slots")
        .insert(batch);

      if (insertError) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, insertError);
        throw insertError;
      }

      totalInserted += batch.length;
      console.log(`Inserted batch ${i / batchSize + 1}: ${batch.length} slots`);
    }

    console.log(`Successfully inserted ${totalInserted} new slots`);

    return new Response(
      JSON.stringify({
        message: "Slots generated successfully",
        slotsCreated: totalInserted,
        slotsChecked: slotsToInsert.length,
        slotsAlreadyExisted: slotsToInsert.length - newSlots.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-future-slots:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
