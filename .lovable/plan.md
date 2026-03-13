

## Plan: Eliminar HIIT de todo el proyecto

HIIT ya no tiene clases activas. Hay que removerlo del horario estático, del catálogo de experiencias, y de todas las referencias en páginas públicas.

### Archivos a modificar

**1. `src/data/schedule.ts`** — Eliminar la entrada de HIIT + Ice Bath del miércoles 08:00

**2. `src/pages/Experiencias.tsx`** — Eliminar la card de "HIIT + Ice Bath" (id: "biohacking"), quitar 'biohacking' del tracking, reemplazar el bloque simple de Ice Bath Prerequisite por la política completa de agua fría (4 puntos), agregar Power Yoga al título de Yoga

**3. `src/lib/experiences.ts`** — Eliminar la entrada `slug: "hiit"` del catálogo

**4. `src/hooks/useScheduleEntries.ts`** — Eliminar `'hiit'` del mapeo `colorTagToTags`

**5. `src/components/trial/TrialScheduleCards.tsx`** — Eliminar el case `'hiit'` del color mapping

**6. `src/pages/Planes.tsx`** — Cambiar "Biohacking (Breathwork + Hiit + Ice Bath)" por "Isométrica + Flexibilidad" en los 3 planes

**7. `src/pages/YogaLasCondes.tsx`** — Cambiar "Biohacking (Breathwork + HIIT + Ice Bath)" por "Isométrica + Flexibilidad" en los 3 planes

**8. `src/pages/Cyber2025.tsx`** — Cambiar referencia de HIIT/Biohacking

**9. `src/pages/CriomedicinAdsLanding.tsx`** — Cambiar menciones de "HIIT" por "isométrica" o remover

**10. `src/components/SocialProofSection.tsx`** — Actualizar quote del Dr. Neira: cambiar "HIIT" por algo más genérico como "el ejercicio funcional"

**11. Blog posts** (`BlogYinVinyasa.tsx`) — Son referencias contextuales genéricas a HIIT como tipo de ejercicio (no como clase de Nave), se dejan como están ya que hablan de HIIT en general

