import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { DB_SCHEMA } from "./schema.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function getSystemPrompt() {
  const now = new Date();
  const santiagoDate = now.toLocaleDateString('es-CL', { timeZone: 'America/Santiago', year: 'numeric', month: 'long', day: 'numeric' });
  const santiagoYear = now.toLocaleDateString('es-CL', { timeZone: 'America/Santiago', year: 'numeric' }).match(/\d{4}/)?.[0] || now.getFullYear().toString();
  
  return `Eres "Nave Brain", el asistente de inteligencia de negocios de Nave Studio.
Tu rol es responder preguntas sobre el negocio consultando la base de datos.

## Fecha actual
Hoy es ${santiagoDate}. El año actual es ${santiagoYear}. Usa SIEMPRE el año correcto en las queries.

## Schema de la base de datos
${DB_SCHEMA}

## Instrucciones para generar SQL

Cuando el usuario haga una pregunta sobre datos del negocio:
1. Genera UNA query SQL SELECT que responda la pregunta.
2. Usa SOLO SELECT — nunca INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, TRUNCATE.
3. Siempre agrega LIMIT 500 al final.
4. Usa las tablas y columnas exactas del schema.
5. Para fechas, usa timezone 'America/Santiago'.
6. Para el mes actual: date_trunc('month', now() AT TIME ZONE 'America/Santiago')
7. Para ingresos de bookings: incluye status IN ('CONFIRMED', 'CANCELLED'), excluye 'REFUNDED'.
8. Para ingresos de package_orders: usa status = 'paid'.
9. Responde SIEMPRE en español.
10. Para unir bookings con customers, usa el email: bookings.customer_email = customers.email (NO uses customer_id ni customer_phone).

## Formato de respuesta SQL
Cuando necesites hacer una query, responde EXACTAMENTE con este formato (sin markdown, sin explicación, sin backticks):
SQL_QUERY: <tu query aquí>

Si la pregunta no requiere consultar datos (es una pregunta general), responde directamente sin SQL.
Si no puedes responder con los datos disponibles, explica por qué.`;
}

async function verifyAdmin(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const userId = user.id;
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  return roleData ? userId : null;
}

function validateSQL(sql: string): boolean {
  const upper = sql.toUpperCase().trim();
  // Must start with SELECT or WITH
  if (!upper.startsWith("SELECT") && !upper.startsWith("WITH")) return false;
  // Block dangerous keywords
  const blocked = [
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "ALTER",
    "CREATE",
    "TRUNCATE",
    "GRANT",
    "REVOKE",
    "EXECUTE",
    "EXEC",
  ];
  // Check for blocked keywords not inside quotes
  for (const kw of blocked) {
    const regex = new RegExp(`\\b${kw}\\b`, "i");
    if (regex.test(sql)) return false;
  }
  // Block access to system schemas
  const blockedSchemas = ["auth.", "storage.", "realtime.", "supabase_functions.", "vault.", "pg_"];
  for (const schema of blockedSchemas) {
    if (upper.includes(schema.toUpperCase())) return false;
  }
  return true;
}

function ensureLimit(sql: string): string {
  // Remove trailing semicolons
  sql = sql.replace(/;\s*$/, "").trim();
  const upper = sql.toUpperCase();
  if (!upper.includes("LIMIT")) {
    return sql + " LIMIT 500";
  }
  return sql;
}

async function callAI(
  messages: Array<{ role: string; content: string }>,
  stream: boolean = false
) {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

  const res = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        stream,
        max_tokens: 4096,
      }),
    }
  );

  if (!res.ok) {
    if (res.status === 429 || res.status === 402) {
      return { error: res.status, body: null };
    }
    const t = await res.text();
    console.error("AI error:", res.status, t);
    throw new Error(`AI gateway error: ${res.status}`);
  }

  return { error: null, body: res };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminId = await verifyAdmin(req);
    if (!adminId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages: chatHistory } = await req.json();
    if (!Array.isArray(chatHistory) || chatHistory.length === 0) {
      return new Response(JSON.stringify({ error: "No messages" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = getSystemPrompt();

    // Step 1: Ask AI to generate SQL (non-streaming)
    const step1Messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory,
    ];

    const step1 = await callAI(step1Messages, false);
    if (step1.error) {
      const msg =
        step1.error === 429
          ? "Demasiadas solicitudes, intenta en unos segundos."
          : "Créditos agotados, contacta al administrador.";
      return new Response(JSON.stringify({ error: msg }), {
        status: step1.error,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const step1Json = await step1.body!.json();
    const aiResponse =
      step1Json.choices?.[0]?.message?.content || "";

    console.log("Step 1 AI response:", aiResponse.substring(0, 200));

    // Check if AI wants to run a SQL query
    const sqlMatch = aiResponse.match(/SQL_QUERY:\s*(.+)/s);
    if (!sqlMatch) {
      // No SQL needed — return step1 content directly as SSE
      const sseData = `data: ${JSON.stringify({
        id: "direct",
        object: "chat.completion.chunk",
        choices: [{ index: 0, delta: { content: aiResponse, role: "assistant" }, finish_reason: "stop" }],
      })}\n\ndata: [DONE]\n\n`;
      return new Response(sseData, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // We have SQL to execute
    let sql = sqlMatch[1].trim().replace(/```sql\s*/gi, "").replace(/```/g, "").trim();
    
    if (!validateSQL(sql)) {
      return new Response(
        JSON.stringify({
          error: "Query no permitida. Solo se permiten consultas SELECT.",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    sql = ensureLimit(sql);
    console.log("Executing SQL:", sql);

    // Execute SQL using service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: queryData, error: queryError } = await supabaseAdmin.rpc(
      "execute_readonly_query",
      { query_text: sql }
    );

    let queryResultText: string;
    if (queryError) {
      console.error("SQL error:", queryError);
      queryResultText = `Error ejecutando la query: ${queryError.message}. Query: ${sql}`;
    } else {
      const rows = queryData || [];
      queryResultText =
        rows.length === 0
          ? "La consulta no devolvió resultados."
          : `Resultados (${rows.length} filas):\n${JSON.stringify(rows, null, 2)}`;
    }

    // Step 2: Stream interpretation of results
    const step2Messages = [
      {
        role: "system",
        content: `Eres Nave Brain, asistente BI de Nave Studio. El usuario hizo una pregunta y se ejecutó una query SQL. Interpreta los resultados y responde de forma clara, amigable y en español. Usa formato markdown con tablas si es apropiado. Incluye insights útiles. No muestres la query SQL al usuario. Los montos son en CLP (pesos chilenos), formatea con separador de miles (ej: $150.000). La zona horaria es America/Santiago.`,
      },
      ...chatHistory,
      {
        role: "assistant",
        content: `Ejecuté esta consulta: ${sql}`,
      },
      {
        role: "user",
        content: `Aquí están los resultados de la consulta:\n${queryResultText}\n\nInterpreta estos resultados y responde la pregunta original del usuario de forma clara y completa.`,
      },
    ];

    const step2 = await callAI(step2Messages, true);
    if (step2.error) {
      return new Response(
        JSON.stringify({ error: "Error interpretando resultados" }),
        {
          status: step2.error,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(step2.body!.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("admin-brain error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
