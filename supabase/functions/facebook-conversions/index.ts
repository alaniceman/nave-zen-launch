import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";

const FACEBOOK_API_VERSION = "v18.0";
const FACEBOOK_GRAPH_URL = `https://graph.facebook.com/${FACEBOOK_API_VERSION}`;

interface ConversionEvent {
  event_name: string;
  event_time: number;
  event_id: string;
  event_source_url?: string;
  action_source: "website";
  user_data: {
    em?: string[]; // hashed email
    ph?: string[]; // hashed phone
    fn?: string[]; // hashed first name
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string; // Facebook click ID
    fbp?: string; // Facebook browser ID
  };
  custom_data?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_type?: string;
    content_ids?: string[];
    order_id?: string;
  };
}

interface RequestBody {
  event_name: string;
  event_id: string;
  event_source_url?: string;
  user_email?: string;
  user_phone?: string;
  user_name?: string;
  value?: number;
  currency?: string;
  content_name?: string;
  content_type?: string;
  content_ids?: string[];
  order_id?: string;
  fbc?: string;
  fbp?: string;
}

// SHA-256 hash function for PII
async function hashData(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PIXEL_ID = Deno.env.get("FACEBOOK_PIXEL_ID");
    const ACCESS_TOKEN = Deno.env.get("FACEBOOK_ACCESS_TOKEN");

    if (!PIXEL_ID || !ACCESS_TOKEN) {
      console.error("Missing Facebook credentials");
      return new Response(
        JSON.stringify({ error: "Facebook credentials not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body: RequestBody = await req.json();
    console.log("Received conversion event:", body.event_name, "event_id:", body.event_id);

    // Build user_data with hashed PII
    const userData: ConversionEvent["user_data"] = {
      client_ip_address: req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || undefined,
      client_user_agent: req.headers.get("user-agent") || undefined,
    };

    if (body.user_email) {
      userData.em = [await hashData(body.user_email)];
    }

    if (body.user_phone) {
      // Remove all non-numeric characters and hash
      const cleanPhone = body.user_phone.replace(/\D/g, "");
      userData.ph = [await hashData(cleanPhone)];
    }

    if (body.user_name) {
      // Hash first name only (first word)
      const firstName = body.user_name.split(" ")[0];
      userData.fn = [await hashData(firstName)];
    }

    if (body.fbc) {
      userData.fbc = body.fbc;
    }

    if (body.fbp) {
      userData.fbp = body.fbp;
    }

    // Build the event
    const event: ConversionEvent = {
      event_name: body.event_name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: body.event_id,
      event_source_url: body.event_source_url,
      action_source: "website",
      user_data: userData,
    };

    // Add custom data for purchase events
    if (body.value !== undefined || body.content_name || body.content_ids) {
      event.custom_data = {};
      
      if (body.value !== undefined) {
        event.custom_data.value = body.value;
        event.custom_data.currency = body.currency || "CLP";
      }
      
      if (body.content_name) {
        event.custom_data.content_name = body.content_name;
      }
      
      if (body.content_type) {
        event.custom_data.content_type = body.content_type;
      }
      
      if (body.content_ids) {
        event.custom_data.content_ids = body.content_ids;
      }
      
      if (body.order_id) {
        event.custom_data.order_id = body.order_id;
      }
    }

    // Send to Facebook Conversions API
    const fbResponse = await fetch(
      `${FACEBOOK_GRAPH_URL}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [event],
        }),
      }
    );

    const fbResult = await fbResponse.json();
    console.log("Facebook API response:", fbResult);

    if (!fbResponse.ok) {
      console.error("Facebook API error:", fbResult);
      return new Response(
        JSON.stringify({ error: "Facebook API error", details: fbResult }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, ...fbResult }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in facebook-conversions:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
