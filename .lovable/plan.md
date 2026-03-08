

## Plan: Emails de clase de prueba (confirmación + 3 recordatorios)

### Diagnóstico actual

- **Confirmación**: `book-trial-class` envía un email básico sin instrucciones de llegada, qué llevar, ni botones de mapa/WhatsApp.
- **Recordatorios**: No existen. `send-booking-reminder` solo cubre sesiones pagadas (`bookings` table), no clases de prueba (`trial_bookings` table).

### Cambios

**1. Mejorar email de confirmación en `book-trial-class/index.ts`**

Reemplazar el HTML actual (líneas 168-186) con el template completo que proporcionaste: instrucciones de llegada (portón negro, platillo volador, segundo piso), qué llevar según la clase, botones de "Abrir mapa" y "WhatsApp", firma de Alan y equipo.

**2. Crear `send-trial-reminder/index.ts`** (nueva edge function)

Una sola función que maneja los 3 tipos de recordatorio. Se ejecuta cada hora vía pg_cron y busca trial bookings con `status = 'booked'` cuya `scheduled_date + class_time` cae en las ventanas:
- **3 días antes** (71-73h): "En 3 días es tu clase..."
- **1 día antes** (23-25h): "Mañana es tu clase..."
- **3 horas antes** (2.5-3.5h): "Hoy a las {{hora}}..."

Cada tipo usa el template correspondiente con HTML con botones (mapa + WhatsApp). Se marca con un campo `reminder_sent` (nuevo campo en `trial_bookings`) para no enviar duplicados. El campo será un array de text: `'{}'::text[]` y se le appendea `'3d'`, `'1d'`, `'3h'` según corresponda.

**3. Migración de base de datos**

Agregar columna `reminder_sent text[] NOT NULL DEFAULT '{}'` a `trial_bookings` para trackear qué recordatorios ya se enviaron.

**4. Configuración**

- Agregar `[functions.send-trial-reminder] verify_jwt = false` en config.toml
- Crear pg_cron job que ejecute la función cada hora

### Archivos

| Archivo | Cambio |
|---------|--------|
| `supabase/functions/book-trial-class/index.ts` | Nuevo HTML de confirmación con instrucciones completas |
| `supabase/functions/send-trial-reminder/index.ts` | **Nuevo** — 3 recordatorios |
| `supabase/config.toml` | Agregar entry para nueva función |
| DB migration | Agregar `reminder_sent` a `trial_bookings` + pg_cron |

### Templates HTML

Los 4 emails tendrán diseño consistente con botones verdes (#2E4D3A), usando el contenido exacto que proporcionaste. Incluirán:
- Botón "Abrir en Google Maps" 
- Botón "WhatsApp directo"
- Sección "Cómo llegar" con las instrucciones del portón
- Sección "Qué llevar" según la clase
- Firma "Alan y equipo — Nave Studio"

