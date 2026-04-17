## Plan: Reemplazar testimoniales celebrity por `ReviewsTrustBar`

### Qué se reemplaza exactamente

Dentro de `SocialProofSection.tsx` se elimina:

- El array `testimonials` (Kika, Pancho, Dr. Neira, Nico).
- El grid desktop (líneas 46-63).
- El slider mobile (líneas 66-93).

Se mantiene intacto: título "+2,000 personas…", certificaciones (Wim Hof / Yoga Alliance); y las dos tarjetas de métricas (9.8/10 y 97%) cambiar por (5.0 ⭐⭐⭐⭐⭐ +200 reseñas)

En su lugar se monta `<ReviewsTrustBar />`.

### Archivos nuevos

**1. `src/data/reviews.ts**` — array tipado con las 34 reviews. Estructura:

```ts
export type Review = { id: number; text: string; author: string; category?: "Yoga" | "Método Wim Hof" | "Ice Bath" }
```

Autores: cuando la review menciona explícitamente al instructor (Maral, Amanda, Sol, Val, Mariela, Gastón) se atribuye a "Alumna/o de [instructor]"; si no, "Comunidad Nave". Categoría se infiere por contenido (yoga / agua fría / experiencia general).

**2. `src/components/ReviewsTrustBar.tsx**` — componente principal.

### Diseño (alineado al sistema existente)

Reutiliza tokens ya presentes en el proyecto:

- Card: `bg-background rounded-[var(--radius)] shadow-light border border-primary/10` (mismo lenguaje que las cards de métricas).
- Tipografía: `font-space-grotesk` para nombre, `font-inter` para texto e itálica para la cita (como los testimoniales actuales).
- Color de acento para estrellas: `text-warm` (Cedar Wood #C49A6C ya en theme) — funciona como dorado sin introducir paleta nueva.
- Container: `container mx-auto px-6` consistente con el resto de la sección.
- Edge mask: gradient suave usando `from-neutral-light` (color de fondo de la sección) para sugerir scroll horizontal.

### Estructura del componente

```text
┌─ section (sin py extra: vive dentro de SocialProofSection) ─┐
│  Título corto: "Lo que dice la comunidad" + sub: "+34 reseñas reales" │
│                                                              │
│  ┌─ strip horizontal con scroll-snap ──────────────────────┐ │
│  │ [card][card][card][card]…  →                            │ │
│  └──────────────────────────────────────────────────────────┘ │
│  Botones prev/next (desktop, esquinas) + dots opcionales    │
└──────────────────────────────────────────────────────────────┘
```

Cada card (mobile ~85% viewport, desktop ~320px):

- 5 estrellas (`lucide-react` Star, fill warm)
- Texto truncado a ~4 líneas con `line-clamp-4`
- Autor + categoría chip pequeña
- "Ver más" sutil cuando el texto excede el clamp
- Click/tap → abre dialog/sheet

### Vista expandida

Reusa primitivos ya instalados:

- **Mobile (<768px)**: `Sheet` con `side="bottom"` (ya en `src/components/ui/sheet.tsx`).
- **Desktop**: `Dialog` (ya en `src/components/ui/dialog.tsx`).

Usa `useIsMobile()` (ya existe) para elegir.

Dentro:

- Estrellas, texto completo, autor, categoría.
- Botones Prev/Next (lucide ChevronLeft/Right) con `aria-label`.
- Soporte teclado: ArrowLeft/Right, Escape (Escape ya lo maneja Radix).
- Swipe horizontal: handlers `onTouchStart/Move/End` con threshold de 50px.

### Comportamiento del strip

- `overflow-x-auto snap-x snap-mandatory scroll-smooth`.
- Scrollbar oculta vía utilidad inline (`scrollbar-width: none` + `::-webkit-scrollbar { display:none }` en un `<style>` scoped o clase tailwind arbitraria).
- Cada card: `snap-start shrink-0 w-[85%] sm:w-[340px]`.
- Edge fade: dos divs absolutos con `bg-gradient-to-r from-neutral-light` en los bordes laterales (pointer-events-none).
- Botones prev/next desktop-only (`hidden md:flex`) que hacen `scrollBy({ left: ±340, behavior: 'smooth' })`.
- Sin auto-scroll (manual preferido, según el brief).

### Accesibilidad

- Strip: `role="region"` + `aria-label="Reseñas de la comunidad Nave Studio"`.
- Cards: `<button>` semántico (no div con onClick) → focus visible nativo del theme.
- Botones nav: `aria-label="Reseña anterior/siguiente"`.
- Dialog/Sheet: `DialogTitle` y `DialogDescription` (sr-only si hace falta) para Radix a11y.

### Edición en `SocialProofSection.tsx`

```tsx
import { ReviewsTrustBar } from "@/components/ReviewsTrustBar";
// elimina array testimonials, grid desktop, slider mobile
// inserta <ReviewsTrustBar /> en su lugar (después del título, antes de certificaciones)
```

Se mantiene `mb-16` de spacing entre bloques.

### Resultado

- Banda horizontal compacta, premium, mobile-first.
- 34 reseñas reales reemplazan 4 testimoniales celebrity.
- Cero estilos nuevos: solo tokens y componentes ya existentes.
- Lightbox con swipe + teclado + botones.

### Archivos tocados

- `src/components/SocialProofSection.tsx` (editar)
- `src/components/ReviewsTrustBar.tsx` (nuevo)
- `src/data/reviews.ts` (nuevo)