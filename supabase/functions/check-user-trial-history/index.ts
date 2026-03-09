import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'Email inválido' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase
      .from('trial_bookings')
      .select('id, class_title, class_day, class_time, scheduled_date, created_at, status')
      .eq('customer_email', normalizedEmail)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error checking trial history:', error);
      return new Response(JSON.stringify({ error: 'No se pudo consultar el historial' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const trialBookings = data ?? [];

    return new Response(
      JSON.stringify({
        hasTrialHistory: trialBookings.length > 0,
        lastTrial: trialBookings[0] ?? null,
        totalTrials: trialBookings.length,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Unexpected error in check-user-trial-history:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
