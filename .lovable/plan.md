

## Plan: Redesign /experiencias page with updated info and conversion CTAs

### Current Issues
1. The page lacks strong CTAs -- all buttons point to a generic `#planes` anchor that doesn't exist on this page
2. No trial class CTA (the most accessible entry point for new users)
3. Outdated layout: triple responsive breakpoints (desktop/tablet/mobile) with duplicated markup
4. Missing Header integration (page renders `<main>` directly without the global header context)
5. No link to agenda or schedule per experience
6. Val Medina still referenced in `Coaches.tsx` and `schedule.ts` (separate from CoachesSection fix already done)

### Changes

#### 1. Update `schedule.ts` -- Replace Val Medina with Amanda Moutel
- Lines 93 and 221: change `instructor: "Val Medina"` to `instructor: "Amanda Moutel"`

#### 2. Update `Coaches.tsx` -- Replace Val Medina entry with Amanda Moutel
- Replace the coach entry (id 6) with Amanda Moutel's info, same data as already in CoachesSection

#### 3. Full redesign of `src/pages/Experiencias.tsx`

**Hero**: Keep full-bleed background image hero but add two CTAs:
- Primary: "Prueba una clase gratis" (opens trial modal via `useTrialModal`)
- Secondary: "Ver planes y precios" (navigates to `/planes-precios`)

**Experience Cards Section**: Single responsive grid (no triple breakpoint duplication). Use a clean 1-col mobile / 2-col desktop grid with cards. Each card includes:
- Image, title, duration badge, description, benefits list
- **Per-card CTA button**: links to the relevant action
  - Wim Hof -> `/agenda-nave-studio` (Agendar sesion)
  - Yoga -> `/clase-de-prueba` (Clase de prueba gratis)
  - Breathwork -> `/horarios` (Ver horarios)
  - Biohacking -> `/agenda-nave-studio` (Reservar spot)
  - Add `Isometrica + Flexibilidad` as a 5th experience card (exists in schedule but missing from page)

**Ice Bath Prerequisite Banner**: Keep but restyle as a more visually integrated callout

**Social Proof Stats**: Keep the 3 stat counters

**CTA Final Section**: Redesign with stronger conversion focus:
- Primary: "Clase de prueba gratis" (trial modal)
- Secondary: "Ver planes desde $39.990/mes" (link to `/planes-precios`)
- Tertiary: "Hablar por WhatsApp" (wa.link)

**Trial Mini Bar**: Add `TrialMiniBar` component at the top of the page (already used on other pages)

#### 4. Technical details
- Import and use `useTrialModal` hook for trial class CTAs
- Use `Link` from react-router-dom instead of `window.location.href` for internal navigation
- Use `CheckoutRedirectButton` for any payment CTAs
- Remove the triple-breakpoint duplication (desktop/tablet/mobile) in favor of a single responsive layout using Tailwind grid breakpoints
- Keep IntersectionObserver scroll-reveal animation
- Keep Facebook pixel tracking

