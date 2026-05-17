import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

/* ── Rate limit ── */
const ipHits = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  let entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + 3600_000 };
    ipHits.set(ip, entry);
  }
  entry.count++;
  return entry.count <= 20;
}

/* ── Knowledge base editable desde /admin/ai-knowledge ── */
async function buildKnowledgeContext(): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("ai_knowledge")
      .select("content, priority")
      .eq("is_active", true)
      .order("priority", { ascending: false });
    if (error) {
      console.error("ai_knowledge query error:", error);
      return "";
    }
    if (!data || data.length === 0) return "";
    return data.map((r: any) => r.content).join("\n\n");
  } catch (e) {
    console.error("buildKnowledgeContext error:", e);
    return "";
  }
}

/* ── Live data from DB (planes, bonos) ── */
async function buildLiveContext(): Promise<string> {
  const parts: string[] = [];
  try {
    const { data: plans } = await supabase
      .from("membership_plans")
      .select("name, description, price_clp, plan_type, classes_included, duration_days")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (plans?.length) {
      parts.push(
        "MEMBRESÍAS / PLANES:\n" +
          plans
            .map(
              (p: any) =>
                `- ${p.name} (${p.plan_type}) — $${p.price_clp.toLocaleString("es-CL")} CLP. ${p.description || ""}`
            )
            .join("\n")
      );
    }

    const { data: packages } = await supabase
      .from("session_packages")
      .select("name, sessions_quantity, price_clp, validity_days")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (packages?.length) {
      parts.push(
        "BONOS DE SESIONES:\n" +
          packages
            .map(
              (p: any) =>
                `- ${p.name}: ${p.sessions_quantity} sesiones por $${p.price_clp.toLocaleString("es-CL")} CLP (válido ${p.validity_days} días)`
            )
            .join("\n")
      );
    }
  } catch (e) {
    console.error("buildLiveContext error:", e);
  }
  return parts.join("\n\n");
}

const SYSTEM_PROMPT = `Eres director creativo de Nave Studio, un centro de bienestar en Las Condes, Santiago de Chile.
Metodología: Ice Bath (3°C, 2 min máx), Método Wim Hof (breathwork + frío), y Yoga. NO usamos sauna, biohacking ni HIIT.
Ubicación: Antares 259, Las Condes. WhatsApp +56 9 4612 0426.

Tu tarea: dado lo que un usuario escribe sobre sí mismo o lo que busca, GENERAR una landing page completamente personalizada para esa persona en español de Chile, cálida, directa, sin clichés. Tono inspirador pero aterrizado, basado en ciencia.

RUTAS DISPONIBLES para el CTA (elige la más relevante):
- "/plan-de-prueba" → quien quiere probar por primera vez (plan pagado 7 o 15 días)
- "/bonos" → quien busca sesiones sueltas de Criomedicina/Wim Hof
- "/giftcards" → quien busca un regalo
- "/planes-precios" → quien busca membresía mensual o ver todo
- "/yoga-las-condes" → quien busca específicamente yoga
- "/bautizo-hielo" → quien nunca ha hecho ice bath y quiere su primera vez ($15.000)
- "/anual" → quien busca compromiso anual / mejor precio
- "/agenda-nave-studio" → quien quiere reservar directamente

TIPOS DE RECOMMENDATION:
- "trial" | "bono" | "giftcard" | "plan" | "yoga" | "bautizo" | "anual" | "agenda"

REGLAS:
- Usa "tú" (no usted).
- Conecta lo que la persona dijo con beneficios reales (sistema nervioso, energía, claridad, sueño, recuperación, ansiedad, etc.).
- Si menciona regalo → recommendation.type = "giftcard".
- Si menciona "primera vez", "nunca he hecho", "probar frío" → "bautizo" o "trial".
- Si menciona yoga sin frío → "yoga".
- NO inventes precios. Si necesitas dar precio, usa SOLO los del contexto en vivo.
- Los emojis para benefits.icon: una sola emoji por beneficio (ej: "❄️", "🧘", "🌬️", "⚡", "🌙", "🧠", "💪", "🔥").

Devuelve EXCLUSIVAMENTE JSON válido con esta forma EXACTA, sin texto extra ni markdown:

{
  "hero": {
    "eyebrow": "string corta, max 40 chars",
    "title": "string potente, max 80 chars, conecta directo con lo que dijo el usuario",
    "subtitle": "string max 180 chars, explica qué va a encontrar acá"
  },
  "pills": ["3 etiquetas cortas, max 24 chars cada una"],
  "benefits": [
    { "icon": "emoji", "title": "string max 32 chars", "body": "string max 140 chars" },
    { "icon": "emoji", "title": "string max 32 chars", "body": "string max 140 chars" },
    { "icon": "emoji", "title": "string max 32 chars", "body": "string max 140 chars" }
  ],
  "recommendation": {
    "type": "trial|bono|giftcard|plan|yoga|bautizo|anual|agenda",
    "title": "string max 60 chars",
    "reason": "string max 220 chars, por qué esto le calza específicamente a esta persona",
    "ctaLabel": "string max 28 chars",
    "ctaHref": "/ruta-de-arriba"
  },
  "social": {
    "quote": "testimonio creíble en 1-2 frases, max 200 chars",
    "author": "Nombre, contexto corto"
  },
  "closing": {
    "title": "string max 70 chars, invitación final personalizada",
    "ctaLabel": "string max 24 chars",
    "ctaHref": "/ruta"
  }
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: "Demasiadas generaciones. Intenta de nuevo en una hora." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { userInput } = await req.json();
    if (typeof userInput !== "string" || userInput.trim().length < 2) {
      return new Response(JSON.stringify({ error: "userInput requerido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleanInput = userInput.trim().slice(0, 500);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const [knowledgeContext, liveContext] = await Promise.all([
      buildKnowledgeContext(),
      buildLiveContext(),
    ]);

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...(knowledgeContext
              ? [{
                  role: "system" as const,
                  content: `BASE DE CONOCIMIENTO DE NAVE STUDIO (fuente de verdad sobre tono, servicios, reglas y FAQs — úsala para informarte, pero respeta SIEMPRE el formato JSON pedido arriba):\n${knowledgeContext}`,
                }]
              : []),
            {
              role: "system",
              content: `CONTEXTO EN VIVO (úsalo si necesitas mencionar precios o productos):\n${liveContext}`,
            },
            {
              role: "user",
              content: `Lo que escribió el visitante:\n"""${cleanInput}"""\n\nGenera la landing personalizada en JSON.`,
            },
          ],
          response_format: { type: "json_object" },
          max_tokens: 1500,
        }),
      }
    );

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Servicio ocupado, intenta en unos segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Sin créditos de IA disponibles." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      return new Response(JSON.stringify({ error: "Error generando la landing." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || "{}";
    let landing: any;
    try {
      landing = JSON.parse(raw);
    } catch {
      console.error("Failed JSON parse:", raw);
      return new Response(JSON.stringify({ error: "Respuesta inválida de la IA." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ landing, input: cleanInput }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-landing error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
