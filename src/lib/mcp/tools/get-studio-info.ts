import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_studio_info",
  title: "Información del estudio",
  description:
    "Devuelve la base de conocimiento de Nave Studio (metodología, planes, membresías, reglas, ubicación). Opcionalmente filtra por categoría.",
  inputSchema: {
    category: z.string().trim().min(1).optional().describe("Categoría opcional, por ejemplo 'planes' o 'reglas'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "No autenticado" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);

    let query = supabase
      .from("ai_knowledge")
      .select("category, title, content, priority")
      .eq("is_active", true)
      .order("priority", { ascending: false });

    if (category) query = query.eq("category", category);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };

    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { knowledge: data ?? [] },
    };
  },
});
