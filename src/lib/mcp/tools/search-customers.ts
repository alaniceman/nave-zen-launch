import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_customers",
  title: "Buscar clientes",
  description:
    "Busca clientes del CRM por nombre, email o teléfono. Solo devuelve datos si la cuenta conectada tiene permisos de administrador.",
  inputSchema: {
    query: z.string().trim().min(2).describe("Texto a buscar en nombre, email o teléfono."),
    limit: z.number().int().min(1).max(50).optional().describe("Máximo de resultados (por defecto 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "No autenticado" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const term = query.replace(/[%,()]/g, " ").trim();

    const { data, error } = await supabase
      .from("customers")
      .select("id, name, email, phone, status, created_at")
      .or(`name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%`)
      .order("created_at", { ascending: false })
      .limit(limit ?? 10);

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    if ((data ?? []).length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "Sin resultados. Si esperabas clientes, la cuenta conectada puede no tener permisos de administrador.",
          },
        ],
        structuredContent: { customers: [] },
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { customers: data },
    };
  },
});
