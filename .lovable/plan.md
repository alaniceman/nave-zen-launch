# Correcciones: Recordatorios diarios del Plan de Prueba

Actualiza la implementación existente (no la rehace). Los cambios se aplican sobre las Edge Functions `send-plan-prueba-activo`, la nueva `send-trial-daily-reminder` y la nueva `process-trial-reminders`, más la tabla `trial_reminder_logs` y el cron horario.

## 1. Links y CTAs de BoxMagic (aplica a todos los emails)

Reemplazar toda referencia a `https://cualesmi.boxmagic.app/members/` por `https://members.boxmagic.app/`.

Bloque estándar reusable, presente en:
- Email de activación (`send-plan-prueba-activo`)
- Cada recordatorio diario (`send-trial-daily-reminder`)

Contenido:
- CTA principal: **"Ver horarios y reservar"** → `https://members.boxmagic.app/`
- Texto breve: *"Entra a BoxMagic para revisar todos los horarios disponibles y reservar las clases que prefieras."*
- Enlaces secundarios (siempre visibles):
  - Ingresar por la web: `https://members.boxmagic.app/`
  - App Store: `https://apps.apple.com/cl/app/boxmagic-members/id6479632550`
  - Google Play: `https://play.google.com/store/apps/details?id=app.boxmagic.members`

Eliminar cualquier botón tipo "Reservar esta clase" o deep-link por clase. BoxMagic no soporta deep-links a clase específica.

## 2. Fechas y timezone (America/Santiago)

Todo formateo de fechas usa `Intl.DateTimeFormat("es-CL", { timeZone: "America/Santiago", ... })`. Nunca hardcodear nombres de día ni offsets.

Helper único en la función:
```ts
function formatChileDate(iso: string) {
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(new Date(iso));
}
function chileDateString(d: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago" }).format(d); // YYYY-MM-DD
}
function chileHour(d: Date) {
  return Number(new Intl.DateTimeFormat("en-GB", { timeZone: "America/Santiago", hour: "2-digit", hour12: false }).format(d));
}
```

Esto cubre automáticamente cambios de mes, año y horario de verano/invierno chileno.

## 3. Lógica de envío corregida

**Cron:** cada hora (`0 * * * *`). Dentro de `process-trial-reminders` se verifica `chileHour(now) === 20`; si no, retorna sin enviar. Esto neutraliza el DST.

**Selección de leads** en `process-trial-reminders`:
- `status = 'plan_prueba_activo'`
- `actual_start_date` y `actual_end_date` definidos
- El día de envío es la noche **anterior** a la fecha de la clase mostrada. Es decir, si hoy (Chile) es `D`, la clase mostrada es de `D+1`.
- Se envía siempre que `D+1 ∈ [actual_start_date, actual_end_date]`.
  - Primer recordatorio: `D = actual_start_date - 1` → muestra clases del día 1.
  - Último recordatorio: `D = actual_end_date - 1` → muestra clases del último día.
- Si `D+1 > actual_end_date`, no enviar (fuera de rango).

**Cálculo de `reminder_day`:**
```ts
reminder_day = (targetClassDate - actual_start_date) en días + 1
```
Se calcula sobre la fecha de la clase mostrada (`D+1`), no la fecha de envío. Rango: 1..totalDays.

**Deduplicación:** índice único `(lead_id, reminder_day)` en `trial_reminder_logs`. Antes de enviar, chequear que no exista fila para ese par.

## 4. Credenciales BoxMagic (primera mitad del plan)

Mostrar el bloque de credenciales (Email + Clave Nave7) sólo si:
- Plan 7 días: `reminder_day <= 4`
- Plan 15 días: `reminder_day <= 8`
- Generalizado: `reminder_day <= Math.ceil(totalDays / 2) + (totalDays === 7 ? 0 : 0)` → simplemente 4 y 8 por hardcode explícito según `plan_type`.

## 5. Clases del día siguiente

Buscar en `generated_slots` (o `schedule_entries` si es la fuente de verdad) las clases cuya fecha en Chile sea `D+1`:
- Ordenar por hora ascendente.
- Mostrar hasta 3 (título, hora Chile, instructor).
- Debajo, botón **"Ver todos los horarios y reservar"** → `https://members.boxmagic.app/`.
- Si NO hay clases: mostrar mensaje amable *"Mañana no vemos clases fijas en agenda todavía — te invitamos igualmente a entrar a BoxMagic para revisar posibles actualizaciones"* + el mismo CTA.

## 6. Asunto y preview

- **Asunto:** `Nave Studio — Tu día {{dayNumber}} comienza mañana`
- **Preview (preheader):** `Revisa las clases de mañana y reserva tu horario en BoxMagic.`

`{{dayNumber}}` = `reminder_day`.

## 7. Ejemplo del email

```text
Asunto: Nave Studio — Tu día 1 comienza mañana
Preview: Revisa las clases de mañana y reserva tu horario en BoxMagic.

Hola María,

Mañana comienza tu día 1 del plan de prueba de 7 días en Nave Studio.

CLASES DE MAÑANA (jueves 24 de julio)
• Vinyasa + Yin Yoga — 10:00 · Karim
• Método Wim Hof — 19:00 · Alan

[ Ver horarios y reservar ]
Entra a BoxMagic para revisar todos los horarios disponibles y reservar
las clases que prefieras.

Web: https://members.boxmagic.app/
App Store · Google Play

TUS DATOS DE ACCESO (si aún no cambiaste la clave)
Usuario: maria@email.com
Clave: Nave7

"El cuerpo alcanza lo que la mente cree." Llega 10 minutos antes,
trae ropa cómoda y una botella de agua.

Nos vemos en la Nave ❄️🛸
Equipo Nave Studio
```

## 8. Casos de prueba antes de terminar

Probar en la Edge Function con inputs simulados (o dry-run):

1. **Plan 7 días, inicio mañana** → hoy envía day 1 con clases de mañana; credenciales visibles.
2. **Plan 7 días, día 4 → 5** → last email con credenciales; day 5 ya sin credenciales.
3. **Plan 7 días, noche del día 6** → envía day 7 (última noche), sin credenciales.
4. **Plan 7 días, noche del día 7** → `D+1 > actual_end_date` → NO envía.
5. **Plan 15 días** → credenciales hasta day 8; day 9-15 sin credenciales; último envío la noche anterior a `actual_end_date`.
6. **Cambio de mes:** plan que arranca el 31 de un mes → nombre del día calculado por `Intl` en TZ Chile, sin off-by-one.
7. **Cambio de año:** plan que cruza 31/dic → 1/ene → mismo formateador cubre el año correcto.
8. **DST Chile (segundo sábado de abril y primer sábado de septiembre):** cron horario + verificación `chileHour(now)===20` asegura envío a las 20:00 locales antes y después del cambio.
9. **Día sin clases en agenda:** email igual sale, con mensaje alternativo y CTA a BoxMagic.
10. **Reintento del cron a las 21:00:** dedupe por `(lead_id, reminder_day)` impide duplicado.

## 9. Archivos afectados

- `supabase/functions/send-plan-prueba-activo/index.ts` — reemplazar link BoxMagic y bloque de CTAs por el nuevo estándar.
- `supabase/functions/send-trial-daily-reminder/index.ts` — implementar (o corregir si ya existe) según reglas 1–6.
- `supabase/functions/process-trial-reminders/index.ts` — chequeo de hora Chile, selección por rango `[start-1, end-1]`, cálculo de `reminder_day` sobre fecha de clase, dedupe.
- Migración: `trial_reminder_logs` (si aún no existe) con índice único.
- Cron `pg_cron`: `0 * * * *` invocando `process-trial-reminders`.
- `supabase/config.toml`: entradas `verify_jwt = false` para las dos nuevas functions.

## 10. Fuera de alcance

- No se cambia UI del admin más allá de lo ya planeado.
- No se agregan deep-links por clase (BoxMagic no los soporta).
- No se toca `send-trial-reminder` (recordatorios de clase de prueba única, sistema distinto).