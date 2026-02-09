

# Calendario de Clases de Prueba -- /clase-de-prueba/agendar

## Resumen

Crear un sistema completo de agendamiento de clases de prueba con 3 pantallas (calendario, detalle con fechas, formulario), validacion backend de elegibilidad, emails transaccionales, integracion con MailerLite, y un campo `is_trial_enabled` en el schedule para distinguir sesiones que permiten prueba.

---

## Pantalla 1: Calendario con cards (ruta: /clase-de-prueba/agendar)

Reutiliza el look & feel de `/horarios` (mismo componente `ScheduleDayCards` como base):

- Toggle "Por Dia" / "Por Experiencia" + selector de dia de semana
- Cada card de sesion muestra hora, titulo, descripcion breve, instructor
- Nuevo campo `is_trial_enabled` en cada `ClassItem` de `schedule.ts`:
  - **true** (Yoga, HIIT, Breathwork sin ice bath): tag verde "Clase de prueba disponible" + boton "Agendar clase de prueba"
  - **false** (Metodo Wim Hof completo, Personalizados): tag gris "No permite clase de prueba" + boton "Agendar" que redirige a `/agenda-nave-studio`
- Breve descripcion por tipo de clase (1--2 lineas, hardcoded en schedule data o en un mapa de descripciones por tag)

## Pantalla 2: Detalle + seleccion de fecha

Al hacer click en "Agendar clase de prueba":

- Boton "Volver" arriba para regresar a Pantalla 1
- Titulo de la experiencia seleccionada (ej: "Yin Yoga + Ice Bath (opcional)")
- Bloque con titulo, dia de semana, horario, descripcion breve
- Lista de fechas concretas para esa clase, maximo 14 dias hacia adelante:
  - Ej: si selecciono Yin Yoga lunes 18:30, muestra: "Lunes 10 Feb", "Lunes 17 Feb", "Lunes 24 Feb" (cap 14 dias)
  - Cada fecha es un boton seleccionable
- Boton "Ver dia siguiente" para ver la misma clase en otros dias si aplica
- CTA: "Continuar" (habilitado al seleccionar fecha)

## Pantalla 3: Formulario

- Campos: Nombre, Email, Celular (todos obligatorios, validados con zod)
- CTA: "Confirmar clase de prueba"
- Al confirmar, llama a una nueva edge function `book-trial-class`

---

## Backend: Edge Function `book-trial-class`

### Logica:

1. **Validar input** (nombre, email, celular, classTitle, dayKey, time, selectedDate)
2. **Chequeo de elegibilidad**: Buscar en tabla `trial_bookings` si existe un registro con ese email y status `attended`
   - Si ya asistio: devolver `{ alreadyAttended: true }` -> frontend muestra pantalla de bloqueo
   - Si no: continuar
3. **Normalizar telefono** a formato E.164 (+56...)
4. **Crear registro** en nueva tabla `trial_bookings` con status `booked`
5. **Upsert lead** en `email_subscribers` (por email, actualizar celular si cambio)
6. **Sync a MailerLite**: agregar suscriptor al grupo de clase de prueba (usando `MAILERLITE_API_KEY`)
7. **Enviar email al usuario** via Resend con:
   - Fecha, hora, clase, direccion (Antares 259, Las Condes)
   - Link a Google Maps
   - Link clickeable a WhatsApp de Nave (+56 9 4612 0426)
8. **Enviar email interno** a `lanave@alaniceman.com` con:
   - Nombre, email (mailto:), celular (link WhatsApp), clase, fecha/hora
9. **Devolver** `{ success: true, bookingId }`

### Pantalla de bloqueo (si ya asistio):

- Mensaje: "Veo que ya hiciste tu clase de prueba"
- CTA 1: "Ver planes" -> `/planes-precios`
- CTA 2: "Agendar sesion normal" -> `/agenda-nave-studio`

---

## Base de datos

### Nueva tabla: `trial_bookings`

| Columna | Tipo | Default |
|---|---|---|
| id | uuid | gen_random_uuid() |
| customer_name | text | NOT NULL |
| customer_email | text | NOT NULL |
| customer_phone | text | NOT NULL |
| class_title | text | NOT NULL |
| class_day | text | NOT NULL |
| class_time | text | NOT NULL |
| scheduled_date | date | NOT NULL |
| status | text | 'booked' |
| source | text | 'web' |
| utm_source | text | nullable |
| utm_medium | text | nullable |
| utm_campaign | text | nullable |
| mailerlite_synced | boolean | false |
| created_at | timestamptz | now() |
| updated_at | timestamptz | now() |

### RLS:
- SELECT: admins only
- INSERT: service role (via edge function)
- UPDATE: admins + service role

---

## Cambios al schedule data

En `src/data/schedule.ts`, agregar campo `is_trial_enabled` a `ClassItem` y a cada entrada:

- **true**: Yoga (Yin, Yang, Vinyasa, Integral, Power, Isometrica), HIIT + Ice Bath, Breathwork Wim Hof (sin ice bath)
- **false**: Metodo Wim Hof (Breathwork + Ice Bath), Personalizado Metodo Wim Hof

Tambien agregar campo `description` opcional para las clases (1--2 lineas descriptivas).

---

## Archivos a crear

| Archivo | Descripcion |
|---|---|
| `src/pages/TrialClassSchedule.tsx` | Pagina principal con las 3 pantallas (estado interno con step) |
| `src/components/trial/TrialScheduleCards.tsx` | Calendario reutilizando estilo de ScheduleDayCards |
| `src/components/trial/TrialClassDetail.tsx` | Pantalla 2: detalle + fechas |
| `src/components/trial/TrialBookingForm.tsx` | Pantalla 3: formulario |
| `src/components/trial/TrialAlreadyAttended.tsx` | Pantalla de bloqueo |
| `supabase/functions/book-trial-class/index.ts` | Edge function para booking + emails + MailerLite |

## Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/data/schedule.ts` | Agregar `is_trial_enabled` y `description` a ClassItem e instancias |
| `src/App.tsx` | Agregar ruta `/clase-de-prueba/agendar` |
| `supabase/config.toml` | Agregar config para `book-trial-class` con `verify_jwt = false` |

---

## Detalles tecnicos

- Timezone: America/Santiago para calculo de fechas (14 dias cap)
- Telefono normalizado a E.164 antes de guardar
- Validacion zod en frontend y backend
- Emails via Resend (secret `RESEND_API_KEY` ya existe)
- MailerLite sync usando `MAILERLITE_API_KEY` (el de suscriptores, no el de ecommerce)
- WhatsApp links: `https://wa.me/56946120426`
- Email interno a: `lanave@alaniceman.com`
- Grupo MailerLite: **pendiente -- se ingresara cuando lo proveas**

---

## Pendiente del usuario

- **ID del grupo de MailerLite** para clases de prueba (se puede agregar despues como constante en la edge function)

