import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const token = typeof body?.token === "string" ? body.token.trim() : "";
    if (!token || token.length < 8 || token.length > 100) {
      return new Response(JSON.stringify({ error: "Token inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { data: row, error } = await supabase
      .from("email_optouts")
      .select("id, email, opted_out_at")
      .eq("token", token)
      .maybeSingle();
    if (error) throw error;

    if (!row) {
      return new Response(JSON.stringify({ error: "not_found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const maskedEmail = row.email.replace(/^(.).*(@.*)$/, "$1***$2");

    if (!row.opted_out_at) {
      const { error: updErr } = await supabase
        .from("email_optouts")
        .update({ opted_out_at: new Date().toISOString() })
        .eq("id", row.id);
      if (updErr) throw updErr;
    }

    return new Response(JSON.stringify({ success: true, email: maskedEmail }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in weekly-reminder-optout:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
