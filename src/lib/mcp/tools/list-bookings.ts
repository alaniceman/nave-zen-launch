import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_bookings",
  title: "Listar reservas",
  description:
    "Lista reservas en un rango de fechas con cliente, clase, estado y monto pagado. Solo devuelve datos si la cuenta conectada tiene permisos de administrador.",
  inputSchema: {
    date_from: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .describe("Fecha inicial YYYY-MM-DD."),
    date_to: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .describe("Fecha final YYYY-MM-DD (inclusive)."),
    status: z
      .string()
      .optional()
      .describe("Filtro opcional de estado, por ejemplo 'confirmed' o 'cancelled'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ date_from, date_to, status }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "No autenticado" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);

    let query = supabase
      .from("bookings")
      .select(
        "id, customer_name, customer_email, customer_phone, status, date_time_start, date_time_end, final_price, service_id, professional_id",
      )
      .gte("date_time_start", `${date_from}T00:00:00`)
      .lte("date_time_start", `${date_to}T23:59:59`)
      .order("date_time_start", { ascending: true })
      .limit(500);

    if (status) query = query.eq("status", status);

    const [{ data: bookings, error }, { data: services }] = await Promise.all([
      query,
      supabase.from("services").select("id, name").eq("is_active", true),
    ]);

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const serviceName = new Map((services ?? []).map((s: { id: string; name: string }) => [s.id, s.name]));
    const rows = (bookings ?? []).map((b) => ({
      id: b.id,
      customer_name: b.customer_name,
      customer_email: b.customer_email,
      customer_phone: b.customer_phone,
      status: b.status,
      starts_at: b.date_time_start,
      ends_at: b.date_time_end,
      paid_clp: b.final_price,
      class_name: serviceName.get(b.service_id) ?? null,
    }));

    if (rows.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "Sin reservas en el rango. Si esperabas resultados, la cuenta conectada puede no tener permisos de administrador.",
          },
        ],
        structuredContent: { bookings: [], count: 0 },
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { bookings: rows, count: rows.length },
    };
  },
});
