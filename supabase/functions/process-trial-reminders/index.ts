import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { chileDateString, chileHour, addDaysISO } from "../_shared/chileTime.ts";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const force = url.searchParams.get("force") === "1";

    const now = new Date();
    const hourCL = chileHour(now);
    if (!force && hourCL !== 20) {
      return new Response(
        JSON.stringify({ skipped: true, reason: "not_20h_chile", hourCL }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const todayCL = chileDateString(now);
    const tomorrowCL = addDaysISO(todayCL, 1);

    // Send tonight to leads whose plan covers tomorrow (D+1 ∈ [start, end]).
    // That is: actual_start_date <= tomorrowCL <= actual_end_date.
    const { data: leads, error } = await supabase
      .from("trial_bookings")
      .select("id, actual_start_date, actual_end_date")
      .eq("status", "plan_prueba_activo")
      .not("actual_start_date", "is", null)
      .not("actual_end_date", "is", null)
      .lte("actual_start_date", tomorrowCL)
      .gte("actual_end_date", tomorrowCL);

    if (error) throw error;

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

    const results: Array<Record<string, unknown>> = [];
    for (const lead of leads || []) {
      try {
        const resp = await fetch(`${SUPABASE_URL}/functions/v1/send-trial-daily-reminder`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: ANON,
            Authorization: `Bearer ${ANON}`,
          },
          body: JSON.stringify({ leadId: lead.id }),
        });
        const json = await resp.json().catch(() => ({}));
        results.push({ leadId: lead.id, status: resp.status, ...json });
        // Resend rate limit: ~2 req/s → 550ms
        await new Promise((r) => setTimeout(r, 550));
      } catch (e: any) {
        results.push({ leadId: lead.id, error: String(e) });
      }
    }

    console.log(`process-trial-reminders: ${results.length} leads processed`);
    return new Response(
      JSON.stringify({ success: true, todayCL, tomorrowCL, processed: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("process-trial-reminders error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
