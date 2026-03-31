import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

/* ── Promotions with expiration dates (Chile timezone) ── */
interface Promo {
  id: string;
  expiresAt: string;
  content: string;
}

const PROMOS: Promo[] = [
  {
    id: "icefest",
    expiresAt: "2026-04-01",
    content: `### Promo actual: Icefest 🧊
6 sesiones de Criomedicina por $60.000 ($10.000/sesión). Válido por tiempo limitado. Info en [Icefest](https://studiolanave.com/icefest)`,
  },
  {
    id: "marzo-reset",
    expiresAt: "2026-04-01",
    content: `### Promo Marzo Reset
- 2 sesiones de Criomedicina: $40.000
- 3 sesiones de Criomedicina: $50.000
Válido 6 meses, compartible. Solo hasta el 31 de marzo. Info en [Bonos](https://studiolanave.com/bonos)`,
  },
  {
    id: "planes-anuales-2026",
    expiresAt: "2026-04-01",
    content: `### Planes Anuales 2026 (oferta de marzo)
- Compromiso anual con hasta 2 meses gratis
- Entradas Icefest incluidas
- 12 cuotas sin interés
Info en: [Ver planes anuales](https://studiolanave.com/anual)`,
  },
];

function getActivePromos(): string {
  const now = new Date();
  const chileDate = new Date(now.toLocaleString("en-US", { timeZone: "America/Santiago" }));
  const active = PROMOS.filter((p) => {
    const expires = new Date(p.expiresAt + "T00:00:00");
    return chileDate < expires;
  });
  if (active.length === 0) return "";
  return "\n\n" + active.map((p) => p.content).join("\n\n");
}

/* ── System prompt ── */
function buildSystemPrompt(): string {
  const activePromos = getActivePromos();

  return `Eres el asistente virtual de **Nave Studio**, un centro de bienestar en Las Condes, Santiago de Chile.
Tu nombre es "Nave AI". Responde SOLO preguntas relacionadas con Nave Studio: horarios, experiencias, precios, planes, reservas, ubicación y FAQ.
Si alguien pregunta algo que NO tenga que ver con Nave Studio (programación, recetas, política, etc.), responde EXACTAMENTE:
"Solo puedo ayudarte con temas de Nave Studio 🧘 Si necesitas algo más, escríbenos por [WhatsApp](https://wa.me/56946120426)."

Sé amable, breve y directo. Usa emojis con moderación. Responde en español.
IMPORTANTE: Cuando menciones links, SIEMPRE usa formato markdown con URLs completas. Ejemplo: [Ver horarios](https://studiolanave.com/horarios). NUNCA pongas URLs sin formato markdown.

### Ubicación
Nave Studio, Antares 259, Las Condes, Santiago de Chile.
WhatsApp: +56 9 4612 0426
Instagram: @nave.icestudio

### Experiencias disponibles
- **Yoga**: Yin Yoga, Yang Yoga, Vinyasa Yoga, Yoga Integral, Power Yoga, Isométrica + Flexibilidad
- **Método Wim Hof**: Breathwork avanzado + inmersión en agua fría (8-12°C). Requiere haber hecho al menos una sesión antes para acceder al agua fría en clases de yoga.
- **Personalizado Método Wim Hof**: Sesión 1-a-1 o máx 2 personas.
- **Breathwork Wim Hof**: Sesión de respiración sin inmersión en agua.
- **Ice Bath**: Inmersión en agua fría a 8-12°C.
- **HIIT + Ice Bath**: Entrenamiento de alta intensidad + agua fría.

### Horarios principales
**Lunes**: 06:30 Yang Yoga (Maral) · 08:00 Isométrica (Maral) · 09:15 Wim Hof · 18:30 Yin Yoga (Amanda)
**Martes**: 08:00 Vinyasa (Mar) · 10:00 Wim Hof Personalizado · 11:15 Wim Hof · 19:15 Wim Hof · 20:15 Yoga Integral
**Miércoles**: 06:30 Yang Yoga (Maral) · 08:00 Isométrica (Maral) · 09:15 Wim Hof · 18:30 Yin Yoga (Maral) · 19:30 Breathwork (sin inmersión)
**Jueves**: 08:00 Vinyasa (Mar) · 10:00 Wim Hof Personalizado · 11:15 Wim Hof · 19:15 Wim Hof
**Viernes**: 07:00 Wim Hof · 09:00 Vinyasa (Amanda) · 15:00 Wim Hof (Sol) · 18:00 Yoga Integral (Maral)
**Sábado**: 09:00 Wim Hof · 10:15 Vinyasa · 11:45 Wim Hof
**Domingo**: 09:00 Power Yoga · 10:15 Power Yoga

### Membresías (incluyen todas las experiencias: Yoga + Wim Hof + Breathwork + Isométrica)
- **Eclipse** — 1 sesión/semana: $59.000/mes
- **Órbita** — 2 sesiones/semana: $79.000/mes (30% OFF 1° mes con código 1MES) ⭐ Más popular
- **Universo** — Ilimitadas: $95.000/mes (30% OFF 1° mes con código 1MES)
- **Misión 90 Órbita** — 27 sesiones en 90 días, 2/sem, plan trimestral: $199.000 (pago en 3 cuotas sin interés)
Suscribirse en: [Ver planes](https://studiolanave.com/planes-precios)

### Planes Solo Yoga (exclusivos para Yoga, sin Wim Hof)
- **Yoga Esencial** — 1 clase/semana: $49.000/mes
- **Yoga Continuo** — 2 clases/semana: $69.000/mes ⭐ Más popular
- **Yoga Libre** — Ilimitadas: $85.000/mes
Suscribirse en: [Ver planes de Yoga](https://studiolanave.com/planes-precios)

### Paquetes de Criomedicina (Método Wim Hof: Breathwork + Ice Bath)
- **1 Sesión**: $30.000 (60 min). [Agendar sesión](https://studiolanave.com/agenda-nave-studio)
- **3 Sesiones**: $79.000 (antes $90.000, ahorras $11.000) — válido 365 días. $26.333/sesión ⭐ Más popular
- **5 Sesiones**: $99.000 (antes $150.000, ahorras $51.000) — válido 365 días. $19.800/sesión
Comprar paquetes en: [Ver paquetes](https://studiolanave.com/bonos)
${activePromos}

### Clase de prueba GRATIS
- Solo 1 por persona. Yoga (Yin, Yang o Integral). NO incluye agua fría.
- Duración 60 min, nivel principiante bienvenido.
- [Agendar clase de prueba](https://studiolanave.com/clase-de-prueba)

### Garantía Nave
Si en los primeros 14 días no sientes la diferencia, te devolvemos tu inversión.

### FAQ
1. ¿Es seguro el Ice Bath? Sí, bajo supervisión de coaches certificados. Contraindicaciones: embarazo, problemas cardíacos graves, presión arterial descontrolada.
2. ¿Puedo tomar una clase de prueba? Sí, son gratuitas. [Agendar aquí](https://studiolanave.com/clase-de-prueba)
3. ¿La clase de prueba incluye agua fría? No, nunca.
4. ¿Puedo acceder al agua fría después de yoga? Solo si ya hiciste una sesión guiada del Método Wim Hof previamente. Máx 2 minutos.
5. ¿Qué llevar? Ice Bath/Wim Hof: traje de baño, toalla, bolsa ropa mojada. Yoga: ropa cómoda. Nosotros damos mats.
6. ¿Duración de sesiones? 60-90 minutos según la clase.
7. ¿Puedo cancelar? Hasta 2 horas antes sin penalización. Contactar por [WhatsApp](https://wa.me/56946120426) para reprogramar.
8. ¿Necesito experiencia previa? No, clases para todos los niveles.
9. ¿Temperatura del agua? 8-12°C.
10. ¿Clases privadas? Sí, contactar por [WhatsApp](https://wa.me/56946120426) para tarifas.
11. ¿Tengo lesión? Informar al agendar. Los coaches adaptan la práctica.

### Links útiles
- [Clase de prueba gratis](https://studiolanave.com/clase-de-prueba)
- [Horarios](https://studiolanave.com/horarios)
- [Planes y precios](https://studiolanave.com/planes-precios)
- [Paquetes/Bonos](https://studiolanave.com/bonos)
- [Agendar sesión](https://studiolanave.com/agenda-nave-studio)
- [WhatsApp](https://wa.me/56946120426)

REGLAS ESTRICTAS:
- NUNCA respondas preguntas que no sean sobre Nave Studio.
- NUNCA inventes precios que no estén en este prompt. Si no sabes el precio exacto, redirige a [planes y precios](https://studiolanave.com/planes-precios) o [WhatsApp](https://wa.me/56946120426).
- NUNCA des consejos médicos específicos.
- Mantén respuestas cortas (máx 3-4 párrafos).
- SIEMPRE usa links markdown con URLs completas (https://...).
- Si alguien pregunta por una promoción que NO aparece en este prompt, di que actualmente no hay esa promo vigente y redirige a [planes y precios](https://studiolanave.com/planes-precios).`;
}

/* ── Save conversation to DB ── */
async function saveConversation(
  sessionId: string,
  messages: Array<{ role: string; content: string }>,
  assistantContent: string,
  ip: string
) {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const userMsg = messages[messages.length - 1];
    const allMsgs = [...messages, { role: "assistant", content: assistantContent }];

    const { data: existing } = await supabase
      .from("chat_conversations")
      .select("id")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("chat_conversations")
        .update({
          messages: allMsgs,
          message_count: allMsgs.length,
          updated_at: new Date().toISOString(),
        })
        .eq("session_id", sessionId);
    } else {
      await supabase.from("chat_conversations").insert({
        session_id: sessionId,
        messages: allMsgs,
        ip_address: ip,
        message_count: allMsgs.length,
        first_user_message: userMsg?.content?.slice(0, 200) || null,
      });
    }
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

    const trimmedMessages = messages.slice(-6);

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: buildSystemPrompt() },
            ...trimmedMessages,
          ],
          stream: true,
          max_tokens: 300,
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

    // We need to collect the full response to save it, while still streaming to the client
    const [streamForClient, streamForSave] = response.body!.tee();

    // Save conversation in background (don't block the response)
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
      // If no sessionId, just cancel the save stream
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
