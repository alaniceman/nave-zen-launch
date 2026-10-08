import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { resendCyberOrderEmail } from "../_shared/cyberFulfillment.ts";

// Reenvía la confirmación Cyber solo al email ya guardado en la orden pagada.
serve(async (req) => {
  try {
    const { orderId } = await req.json();
    if (!/^[0-9a-f-]{36}$/i.test(String(orderId))) return new Response("bad id", { status: 400 });
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: order } = await supabase.from("shop_orders").select("*").eq("id", orderId).eq("status", "paid").maybeSingle();
    if (!order) return new Response("not found", { status: 404 });
    const r = await resendCyberOrderEmail(order, supabase);
    return new Response(JSON.stringify(r), { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(String(e), { status: 500 });
  }
});
