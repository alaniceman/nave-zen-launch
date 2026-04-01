import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { buildSystemPrompt } from "./systemPrompt.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ── Singleton Supabase client ── */
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

/* ── Rate limiting (in-memory, resets on cold start) ── */
const ipHits = new Map<string, { count: number; resetAt: number }>();
const SESSION_LIMIT = 15;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  let entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + 3600_000 };
    ipHits.set(ip, entry);
  }
  entry.count++;
  return entry.count <= 30;
}

/* ── Save conversation via UPSERT ── */
async function saveConversation(
  sessionId: string,
  messages: Array<{ role: string; content: string }>,
  assistantContent: string,
  ip: string
) {
  try {
    const userMsg = messages[messages.length - 1];
    const allMsgs = [...messages, { role: "assistant", content: assistantContent }];

    await supabase
      .from("chat_conversations")
      .upsert(
        {
          session_id: sessionId,
          messages: allMsgs,
          message_count: allMsgs.length,
          ip_address: ip,
          first_user_message: userMsg?.content?.slice(0, 200) || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "session_id" }
      );
  } catch (e) {
    console.error("Failed to save conversation:", e);
  }
}

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
        JSON.stringify({
          error:
            "Has alcanzado el límite de mensajes por hora. Escríbenos por WhatsApp al +56 9 4612 0426.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, sessionMsgCount, sessionId } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (typeof sessionMsgCount === "number" && sessionMsgCount >= SESSION_LIMIT) {
      return new Response(
        JSON.stringify({
          error:
            "Has alcanzado el límite de mensajes de esta sesión. Para más ayuda, escríbenos por WhatsApp al +56 9 4612 0426 😊",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const trimmedMessages = messages.slice(-10);

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
            { role: "system", content: buildSystemPrompt() },
            ...trimmedMessages,
          ],
          stream: true,
          max_tokens: 500,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Servicio temporalmente ocupado, intenta en unos segundos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Servicio no disponible momentáneamente." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Error al procesar tu consulta." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const [streamForClient, streamForSave] = response.body!.tee();

    if (sessionId) {
      const reader = streamForSave.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      (async () => {
        try {
          let buf = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buf += decoder.decode(value, { stream: true });
            let nl: number;
            while ((nl = buf.indexOf("\n")) !== -1) {
              let line = buf.slice(0, nl);
              buf = buf.slice(nl + 1);
              if (line.endsWith("\r")) line = line.slice(0, -1);
              if (!line.startsWith("data: ")) continue;
              const jsonStr = line.slice(6).trim();
              if (jsonStr === "[DONE]") continue;
              try {
                const parsed = JSON.parse(jsonStr);
                const c = parsed.choices?.[0]?.delta?.content;
                if (c) fullContent += c;
              } catch { /* skip */ }
            }
          }
          await saveConversation(sessionId, messages, fullContent, ip);
        } catch (e) {
          console.error("Error saving conversation stream:", e);
        }
      })();
    } else {
      streamForSave.cancel();
    }

    return new Response(streamForClient, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat-nave error:", e);
    return new Response(
      JSON.stringify({
        error: e instanceof Error ? e.message : "Error desconocido",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
