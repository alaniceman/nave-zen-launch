import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_available_slots",
  title: "Cupos disponibles",
  description:
    "Lista los horarios reservables con cupo disponible en un rango de fechas (máx. 30 días), con clase, instructor y cupos restantes.",
  inputSchema: {
    date_from: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .describe("Fecha inicial YYYY-MM-DD."),
    date_to: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .describe("Fecha final YYYY-MM-DD (inclusive)."),
    service_id: z.string().uuid().optional().describe("Filtro opcional por servicio."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ date_from, date_to, service_id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "No autenticado" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);

    let query = supabase
      .from("generated_slots")
      .select("id, date_time_start, date_time_end, max_capacity, confirmed_bookings, service_id, professional_id")
      .eq("is_active", true)
      .gte("date_time_start", `${date_from}T00:00:00`)
      .lte("date_time_start", `${date_to}T23:59:59`)
      .order("date_time_start", { ascending: true })
      .limit(500);

    if (service_id) query = query.eq("service_id", service_id);

    const [{ data: slots, error }, { data: services }, { data: professionals }] = await Promise.all([
      query,
      supabase.from("services").select("id, name, price_clp").eq("is_active", true),
      supabase.rpc("get_active_professionals"),
    ]);

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const svc = new Map(
      (services ?? []).map((s: { id: string; name: string; price_clp: number }) => [s.id, s]),
    );
    const proName = new Map(
      ((professionals ?? []) as Array<{ id: string; name: string }>).map((p) => [p.id, p.name]),
    );

    const available = (slots ?? [])
      .filter((s) => s.confirmed_bookings < s.max_capacity)
      .map((s) => ({
        slot_id: s.id,
        starts_at: s.date_time_start,
        ends_at: s.date_time_end,
        class_name: svc.get(s.service_id)?.name ?? null,
        price_clp: svc.get(s.service_id)?.price_clp ?? null,
        instructor: proName.get(s.professional_id) ?? null,
        spots_left: s.max_capacity - s.confirmed_bookings,
      }));

    return {
      content: [{ type: "text", text: JSON.stringify(available, null, 2) }],
      structuredContent: { slots: available, count: available.length },
    };
  },
});
