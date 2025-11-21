import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCorsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Starting slot generation...");

    // Get all active availability rules
    const { data: rules, error: rulesError } = await supabase
      .from("availability_rules")
      .select("*, professionals!inner(name, is_active), services!inner(name, max_capacity, is_active)")
      .eq("is_active", true)
      .eq("professionals.is_active", true)
      .eq("services.is_active", true);

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

    // Get request body for custom days ahead (default 60)
    const body = await req.json().catch(() => ({}));
    const daysAhead = body.daysAhead || 60;

    const slotsToInsert = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate slots for next X days
    for (let dayOffset = 0; dayOffset <= daysAhead; dayOffset++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + dayOffset);
      const dayOfWeek = currentDate.getDay();

      // Format date as YYYY-MM-DD for specific_date comparison
      const dateStr = currentDate.toISOString().split("T")[0];

      for (const rule of rules) {
        let shouldGenerateSlot = false;

        // Check if rule applies to this date
        if (rule.recurrence_type.toLowerCase() === "weekly" && rule.day_of_week === dayOfWeek) {
          shouldGenerateSlot = true;
        } else if (rule.recurrence_type.toLowerCase() === "specific" && rule.specific_date === dateStr) {
          shouldGenerateSlot = true;
        }

        if (!shouldGenerateSlot) continue;

        // Check max_days_in_future limit
        const daysFromToday = Math.floor((currentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysFromToday > rule.max_days_in_future) {
          continue;
        }

        // Parse start and end times
        const [startHour, startMinute] = rule.start_time.split(":").map(Number);
        const [endHour, endMinute] = rule.end_time.split(":").map(Number);

        // Generate slots based on duration
        let currentSlotStart = new Date(currentDate);
        currentSlotStart.setHours(startHour, startMinute, 0, 0);

        const ruleEndTime = new Date(currentDate);
        ruleEndTime.setHours(endHour, endMinute, 0, 0);

        while (currentSlotStart < ruleEndTime) {
          const slotEnd = new Date(currentSlotStart.getTime() + rule.duration_minutes * 60 * 1000);

          if (slotEnd > ruleEndTime) break;

          // Check min_hours_before_booking
          const now = new Date();
          const hoursUntilSlot = (currentSlotStart.getTime() - now.getTime()) / (1000 * 60 * 60);
          
          if (hoursUntilSlot >= rule.min_hours_before_booking) {
            // Use service max_capacity as default
            const maxCapacity = rule.services.max_capacity;

            slotsToInsert.push({
              professional_id: rule.professional_id,
              service_id: rule.service_id,
              date_time_start: currentSlotStart.toISOString(),
              date_time_end: slotEnd.toISOString(),
              max_capacity: maxCapacity,
              confirmed_bookings: 0,
              is_active: true,
            });
          }

          // Move to next slot
          currentSlotStart = new Date(slotEnd);
        }
      }
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
      .gte("date_time_start", today.toISOString())
      .lte("date_time_start", new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000).toISOString());

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
