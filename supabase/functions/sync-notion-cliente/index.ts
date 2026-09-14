import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { getCorsHeaders } from "../_shared/cors.ts";
import { syncTrialClientToNotion, type NotionPaymentMethod } from "../_shared/notionClientes.ts";

const bodySchema = z.object({
  leadId: z.string().uuid(),
  paymentMethod: z.enum(["Pago online", "Transferencia"]).optional(),
});

function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = bodySchema.parse(await req.json());

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: lead, error } = await supabase
      .from("trial_bookings")
      .select(
        "customer_name, customer_email, customer_phone, plan_type, status, paid_at, requested_start_date, actual_start_date, actual_end_date",
      )
      .eq("id", body.leadId)
      .single();

    if (error || !lead) {
      return new Response(JSON.stringify({ error: "Lead no encontrado" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const paid = Boolean(lead.paid_at) ||
      ["pagado_plan_prueba", "plan_prueba_activo", "plan_prueba_finalizado", "convertido_a_membresia"]
        .includes(lead.status);

    const startDate = lead.actual_start_date || lead.requested_start_date || null;
    const days = lead.plan_type === "trial_15d" ? 15 : 7;
    const endDate = lead.actual_end_date || (startDate ? addDays(startDate, days) : null);

    const result = await syncTrialClientToNotion({
      name: lead.customer_name,
      email: lead.customer_email,
      phone: lead.customer_phone,
      planType: lead.plan_type,
      startDate,
      endDate,
      paid,
      paymentMethod: (body.paymentMethod as NotionPaymentMethod | undefined) ??
        (paid ? "Pago online" : null),
    });

    return new Response(JSON.stringify(result), {
      status: result.ok ? 200 : 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("sync-notion-cliente error:", err);
    const msg = err instanceof z.ZodError ? "Datos inválidos" : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
