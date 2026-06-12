
## Nueva landing: Taller Wim Hof Santiago (Fundamentos + Avanzado)

Ruta: `/taller-wim-hof-santiago-fundamentales-avanzado`

Réplica 1:1 de la landing del proyecto Alan Iceman, pero usando los tokens de diseño, tipografías y componentes UI de Nave Studio (primary verde #2E4D3A, Helvetica Neue / fuentes del sitio, Cards/Buttons/Accordion ya existentes).

### 1. Base de datos (backend completo)

Migración que crea:

- `taller_santiago_fundamentos` y `taller_santiago_avanzado` — leads por taller con `name`, `email`, `phone`, `consent`, `paid`, `created_at`. RLS: insert público, select/update solo admin. Índice por email.
- Filas en `event_cupos` (si la tabla no existe, se crea con `event_id` UNIQUE, `cupos_total`, `cupos_vendidos`) precargadas con 15 cupos para `santiago_fundamentos_2026_06_27` y `santiago_avanzado_2026_06_28`.
- GRANTs correspondientes (`anon` insert en tablas de lead, `authenticated` select via admin, `service_role` ALL).

### 2. Edge function `send-santiago-confirmation`

Envía email transaccional vía Resend al cliente con confirmación de inscripción al taller elegido. Usa diseño Helvetica Neue, color #2E4D3A, BCC a `flowithmaral@gmail.com`. Respeta el rate limit de 2 req/sec.

### 3. Página `src/pages/TallerSantiago.tsx`

Reutiliza componentes shadcn del sitio (Button, Card, Badge, Accordion, Progress, Dialog, Input, Label) y los tokens de `index.css` / `tailwind.config.ts`. Sin clases de color hardcoded.

Secciones (idénticas al original):
1. **Hero** — Badge "Santiago · 27 y 28 de junio", título "Dos talleres Wim Hof. Dos niveles de profundidad.", dos CTAs (Fundamentos / Avanzado), foto cuadrada con badge "Presencial · Nave Studio, Las Condes".
2. **¿Cuál taller es para ti?** — 2 Cards comparativas con incluye, fecha, hora, precio, cupos disponibles en vivo, Progress bar, CTA reservar.
3. **Detalle Fundamentos** — texto largo + CTA.
4. **Detalle Avanzado** — texto largo + CTA (variant "dark" con fondo sutil del primary).
5. **Quién te guía** — foto de Alan, bio completa, 4 credenciales con íconos, link a perfil oficial Wim Hof Method.
6. **Respiración, hielo y presencia** — 3 cards (Wind / Snowflake / Heart).
7. **Para quién es** — lista de 5 ítems con check.
8. **Importante antes de reservar** — callout ámbar con explicación de prerequisitos + botón WhatsApp.
9. **Cupos y reserva** — 2 cards con resumen + CTA, badge "Cupos limitados".
10. **FAQ** — Accordion con 7 preguntas.
11. **CTA final** — dos botones.
12. **Footer** — usa el Footer del sitio Nave Studio.

Lógica:
- `useEffect` setea `<title>` y meta description.
- Fetch a `event_cupos` para ambos eventos al montar; calcula cupos disponibles y % ocupado; deshabilita botones si está sold out.
- Dialog de reserva con form (nombre, apellido, email, celular) → inserta en la tabla respectiva → invoca `send-santiago-confirmation` (best-effort) → redirige a Mercado Pago.
- JSON-LD `Event` para ambos talleres (precios, ubicación Antares 259, organizer Nave Studio).
- WhatsApp: `+56 9 4612 0426` (E.164 del sitio Nave Studio).
- Lugar: **Nave Studio · Antares 259, Las Condes** con link a Google Maps.

Datos fijos:
- Fundamentos: sábado 27 jun 2026, 11:30–15:00, $50.000, MP `https://mpago.la/2c9NhLM`.
- Avanzado: domingo 28 jun 2026, 11:30–15:00, $60.000, MP `https://mpago.la/1edQqad`.
- Cupos: 15 por taller.

### 4. Assets

Copiar desde el proyecto Alan Iceman:
- `src/assets/alan-ice-bath-smile.webp` (hero)
- `src/assets/alan-wim-hof.webp` (sección instructor)

Subidos via `lovable-assets` para no inflar el repo.

### 5. Rutas y nav

- Registrar `<Route path="/taller-wim-hof-santiago-fundamentales-avanzado" element={<TallerSantiago />} />` en `src/App.tsx` (lazy import), encima del catch-all.
- No se añade al menú principal (es landing standalone para campañas).

### 6. Memoria

Crear `mem://features/wim-hof-santiago-landing` documentando: ruta, tablas, MP links, fechas, cupos y que el evento es presencial en Nave Studio.

---

### Archivos a crear/modificar

- `supabase/migrations/<timestamp>_santiago_tables.sql` (tablas + grants + RLS + event_cupos)
- `supabase/functions/send-santiago-confirmation/index.ts`
- `src/pages/TallerSantiago.tsx`
- `src/assets/alan-ice-bath-smile.webp.asset.json` (+ `alan-wim-hof.webp.asset.json`)
- `src/App.tsx` (nueva ruta)
- `mem://features/wim-hof-santiago-landing` + actualizar `mem://index.md`
