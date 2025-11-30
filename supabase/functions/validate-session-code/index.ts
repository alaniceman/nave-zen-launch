import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const validateSchema = z.object({
  code: z.string().min(6),
  serviceId: z.string().uuid(),
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
      validatedData = validateSchema.parse(requestData);
    } catch (validationError) {
      console.error("Validation error:", validationError);
      return new Response(
        JSON.stringify({ valid: false, error: "Datos inválidos" }),
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

    // Find the code
    const { data: sessionCode, error: codeError } = await supabase
      .from("session_codes")
      .select("*")
      .eq("code", validatedData.code.toUpperCase())
      .single();

    if (codeError || !sessionCode) {
      return new Response(
        JSON.stringify({ valid: false, error: "Código no encontrado" }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if already used
    if (sessionCode.is_used) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Este código ya fue utilizado",
          usedAt: sessionCode.used_at,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if expired
    const now = new Date();
    const expiresAt = new Date(sessionCode.expires_at);
    if (now > expiresAt) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Este código ha expirado",
          expiresAt: sessionCode.expires_at,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if service is applicable
    const isServiceApplicable = sessionCode.applicable_service_ids.includes(validatedData.serviceId);
    if (!isServiceApplicable) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: "Este código no es válido para este servicio",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Code is valid
    return new Response(
      JSON.stringify({ 
        valid: true,
        code: sessionCode.code,
        buyerName: sessionCode.buyer_name,
        buyerEmail: sessionCode.buyer_email,
        expiresAt: sessionCode.expires_at,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in validate-session-code:", error);
    return new Response(
      JSON.stringify({ valid: false, error: "Error al validar el código" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});