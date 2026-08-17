import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default defineTool({
  name: "list_weekly_schedule",
  title: "Horario semanal",
  description:
    "Horario semanal recurrente publicado en /horarios: día, hora de inicio, clase e instructor. Opcionalmente filtra por día de la semana (0=Domingo).",
  inputSchema: {
    day_of_week: z
      .number()
      .int()
      .min(0)
      .max(6)
      .optional()
      .describe("Filtro opcional de día de la semana, 0=Domingo … 6=Sábado."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ day_of_week }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "No autenticado" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);

    let query = supabase
      .from("schedule_entries")
      .select("day_of_week, start_time, display_name, badges, professional_id, service_id, sort_order")
      .eq("is_active", true)
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });

    if (typeof day_of_week === "number") query = query.eq("day_of_week", day_of_week);

    const [{ data: entries, error }, { data: services }, { data: professionals }] = await Promise.all([
      query,
      supabase.from("services").select("id, name").eq("is_active", true),
      supabase.rpc("get_active_professionals"),
    ]);

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    const serviceName = new Map((services ?? []).map((s: { id: string; name: string }) => [s.id, s.name]));
    const proName = new Map(
      ((professionals ?? []) as Array<{ id: string; name: string }>).map((p) => [p.id, p.name]),
    );

    const schedule = (entries ?? []).map((e) => ({
      day: DAYS[e.day_of_week] ?? String(e.day_of_week),
      day_of_week: e.day_of_week,
      start_time: String(e.start_time).slice(0, 5),
      class_name: e.display_name ?? serviceName.get(e.service_id) ?? "Clase",
      instructor: e.professional_id ? proName.get(e.professional_id) ?? null : null,
      badges: e.badges ?? [],
    }));

    return {
      content: [{ type: "text", text: JSON.stringify(schedule, null, 2) }],
      structuredContent: { schedule },
    };
  },
});
