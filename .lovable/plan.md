

## Plan: Replace Val Medina with Amanda Moutel

### Changes

1. **Copy uploaded image** to `public/lovable-uploads/` as `amanda-moutel.webp`

2. **Update `src/components/CoachesSection.tsx`** — Replace the Val Medina coach entry:
   - `id: "val"` → `id: "amanda"`
   - `name: "Amanda Moutel"`
   - `role: "Bailarina y Profesora de Yoga y Danza"`
   - `credentials: "Facilitadora de Breathwork y Prácticas Somáticas · Terapeuta de Respiración Consciente Informada en Trauma"`
   - `purpose: "Te acompaño a que conectes con tu soberanía interior; con paciencia, compasión, cuidado y amor."`
   - `image:` → new uploaded image path

3. **Update `src/pages/YogaLasCondes.tsx`** — Change filterIds from `["maral", "val", "mar"]` to `["maral", "amanda", "mar"]`

