---
name: Sincronización Google Sheet "Reservas Wim Hof"
description: Actualiza la pestaña Reservas Wim Hof el 1 y 15 de cada mes con columnas Sesión y Categoría (Wim Hof / Yoga)
type: feature
---

- Spreadsheet: `1XNS1pVsnEY5XZbSdP_8IMJdsbOIFgUMB3M2VAFT80Fg`, pestaña `Reservas Wim Hof`.
- Edge function `sync-reservas-sheet`: reescribe la pestaña completa desde `bookings` (paginado 1000), orden `created_at` desc. `?dryRun=1` solo lee.
- Cabeceras: las 20 originales + `Sesión` (nombre de la clase) y `Categoría` justo después de `Servicio`.
- Categoría: `color_tag` yoga → "Yoga"; wim-hof / breathwork / agua-fria / hiit → "Wim Hof"; fallback por nombre.
- Crons `sync-reservas-sheet-1-15-utc8` (`0 8 1,15 * *`) y `sync-reservas-sheet-1-15-utc9` (`0 9 1,15 * *`). La función lleva guarda `?cron=1`: solo escribe si hora Chile == 05 y día ∈ {1,15}; los dos disparos cubren DST (UTC-3 verano → 08:00 UTC, UTC-4 invierno → 09:00 UTC) y el disparo que no coincide se salta sin escribir.
- Requiere que `navestudio@robust-doodad-322422.iam.gserviceaccount.com` tenga permiso de **Editor** en el spreadsheet (con solo lectura la escritura falla 403).
- Helper `replaceSheetValues` en `supabase/functions/_shared/googleSheets.ts` (clear + values.update).
