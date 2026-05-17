# Landing Generativa `/generative` con Nave AI

Una landing en blanco con un solo input. El usuario escribe quién es o qué busca ("soy corredor con ansiedad", "regalo para mi pareja", "quiero empezar yoga"), y la página se reconstruye en vivo: hero, beneficios, prueba social, CTA — todo adaptado a su intención, usando la info real de Nave Studio.

## Experiencia (MVP)

1. Usuario entra a `/generative` → ve un input centrado tipo "Cuéntanos qué buscas" + ejemplos clickeables (chips).
2. Envía → la página hace fade-out del input y aparece un esqueleto animado mientras la IA genera.
3. La IA devuelve JSON estructurado (hero, 3 beneficios, recomendación de plan/experiencia, CTA). El frontend lo renderiza con los componentes ya existentes de Nave (tipografía, colores, botones).
4. CTA contextual: si pidió regalo → Gift Cards; si pidió probar → Plan de prueba; si pidió yoga → Yoga Las Condes; etc.
5. Botón "Generar otra versión" para reintentar.

## Por qué arrancar así

- **Una sola pantalla, un solo input**: máximo "wow", mínimo scope. Validamos si la gente realmente escribe.
- **Output estructurado (no markdown libre)**: garantiza que la marca se vea siempre bien y no rompa el diseño.
- **Streaming desde el primer día**: la magia de "ver la página armarse" es la mitad del valor.
- **Reusa data en vivo**: la edge function ya tiene `buildLiveDataSection()` con planes, bonos y promos reales — la reaprovechamos.

## Arquitectura técnica

```text
/generative (React page)
   │  POST { userInput }
   ▼
edge function: generate-landing
   │  - system prompt: "eres director creativo de Nave Studio…"
   │  - inyecta info en vivo (membresías, bonos, promos) reusando systemPrompt.ts
   │  - Lovable AI Gateway, modelo google/gemini-3-flash-preview
   │  - streamText con Output.object(schema Zod)
   ▼
JSON estructurado:
{
  hero:    { eyebrow, title, subtitle },
  pills:   [string, string, string],
  benefits:[{ icon, title, body } x3],
  recommendation: { type: "plan"|"bono"|"giftcard"|"trial"|"yoga",
                    title, reason, ctaLabel, ctaHref },
  social:  { quote, author },
  closing: { title, ctaLabel, ctaHref }
}
```

- Nuevo archivo: `supabase/functions/generate-landing/index.ts`
- Nuevo archivo: `src/pages/Generative.tsx`
- Ruta en `App.tsx`: `<Route path="/generative" element={<Generative />} />`
- Sin DB nueva. Sin auth. Rate-limit simple por IP en la edge function.

## Qué NO incluye este primer paso

- Guardar las landings generadas (se puede agregar después).
- Generar imágenes con IA (usamos las fotos existentes de Nave).
- Compartir por URL (`/generative/:slug`) — fase 2.
- A/B testing o analytics avanzados.

## Próximo paso si te gusta

Apruebo el plan y armo: ruta + página con input y skeleton + edge function `generate-landing` con schema Zod y data en vivo + un set de 4-5 ejemplos pre-cargados para que la primera impresión sea instantánea.
