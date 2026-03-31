import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    entry = { count: 0, resetAt: now + 3600_000 }; // 1 h window
    ipHits.set(ip, entry);
  }
  entry.count++;
  return entry.count <= 30; // max 30 msgs / hour / IP
}

/* ── System prompt ── */
const SYSTEM_PROMPT = `Eres el asistente virtual de **Studio La Nave**, un centro de bienestar en Las Condes, Santiago de Chile.
Tu nombre es "Nave AI". Responde SOLO preguntas relacionadas con Studio La Nave: horarios, experiencias, precios, reservas, ubicación y FAQ.
Si alguien pregunta algo que NO tenga que ver con La Nave (programación, recetas, política, etc.), responde EXACTAMENTE:
"Solo puedo ayudarte con temas de Studio La Nave 🧘 Si necesitas algo más, escríbenos por WhatsApp al +56 9 4612 0426."

Sé amable, breve y directo. Usa emojis con moderación. Responde en español.

### Ubicación
Nave Studio, Las Condes, Santiago de Chile.
WhatsApp: +56 9 4612 0426

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

### Precios y paquetes
- Los paquetes de sesiones se compran en studiolanave.com/bonos
- Para ver precios actualizados visitar studiolanave.com/planes-precios
- Clase de prueba: GRATIS (solo 1 por persona). Se agenda en studiolanave.com/clase-de-prueba
- La clase de prueba NO incluye inmersión en agua fría.

### Promo actual: Icefest 🧊
6 sesiones de Criomedicina por $60.000. Info en studiolanave.com/icefest

### FAQ
1. ¿Es seguro el Ice Bath? Sí, bajo supervisión de coaches certificados. Contraindicaciones: embarazo, problemas cardíacos graves, presión arterial descontrolada.
2. ¿Puedo tomar una clase de prueba? Sí, son gratuitas. Agendar en studiolanave.com/clase-de-prueba
3. ¿La clase de prueba incluye agua fría? No, nunca.
4. ¿Puedo acceder al agua fría después de yoga? Solo si ya hiciste una sesión guiada del Método Wim Hof previamente. Máx 2 minutos.
5. ¿Qué llevar? Ice Bath/Wim Hof: traje de baño, toalla, bolsa ropa mojada. Yoga: ropa cómoda. Nosotros damos mats.
6. ¿Duración de sesiones? 60-90 minutos según la clase.
7. ¿Puedo cancelar? Hasta 2 horas antes sin penalización. Contactar por WhatsApp para reprogramar.
8. ¿Necesito experiencia previa? No, clases para todos los niveles.
9. ¿Temperatura del agua? 8-12°C.
10. ¿Clases privadas? Sí, contactar por WhatsApp para tarifas.
11. ¿Tengo lesión? Informar al agendar. Los coaches adaptan la práctica.

### Links útiles
- Clase de prueba gratis: studiolanave.com/clase-de-prueba
- Horarios: studiolanave.com/horarios
- Precios: studiolanave.com/planes-precios
- Paquetes/Bonos: studiolanave.com/bonos
- Icefest promo: studiolanave.com/icefest
- Agenda sesiones: studiolanave.com/agenda-nave-studio
- WhatsApp: wa.me/56946120426

REGLAS ESTRICTAS:
- NUNCA respondas preguntas que no sean sobre Studio La Nave.
- NUNCA inventes precios que no estén en este prompt. Si no sabes el precio exacto, redirige a studiolanave.com/planes-precios o WhatsApp.
- NUNCA des consejos médicos específicos.
- Mantén respuestas cortas (máx 3-4 párrafos).`;

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

    const { messages, sessionMsgCount } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Session limit
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

    // Keep only last 6 messages for context
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
            { role: "system", content: SYSTEM_PROMPT },
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

    return new Response(response.body, {
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
