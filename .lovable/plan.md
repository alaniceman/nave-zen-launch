
# Plan de Prueba Pagado — Reemplazo del flujo de Clase de Prueba

## Resumen
- Nueva landing `/plan-de-prueba` (alias `/prueba-nave-studio`) con planes 7d ($9.900) y 15d ($19.900).
- Form de 2 pasos → guarda lead → modal de redirección → BoxMagic (links placeholder por ahora).
- Las rutas legacy `/clase-de-prueba*` redirigen al nuevo flujo. Se quitan CTAs gratuitos de Header/Hero/StickyCTA/etc.
- CRM: extender `trial_bookings` con campos del plan; nueva sección `/admin/planes-prueba` + acción "Marcar como pagado" en el perfil del cliente.
- Tracking solo de eventos de funnel (Pixel + CAPI). El pago real lo trackea BoxMagic / Meta fuera de la web.

## 1. Base de datos (migración)

Extender `trial_bookings` (compatible con datos actuales):

```sql
ALTER TABLE public.trial_bookings
  ADD COLUMN plan_type text,                 -- 'free_class' | 'trial_7d' | 'trial_15d'
  ADD COLUMN requested_start_date date,      -- fecha solicitada por el usuario
  ADD COLUMN actual_start_date date,         -- fecha real seteada por admin
  ADD COLUMN actual_end_date date,           -- calculada start + (7|15) días
  ADD COLUMN paid_at timestamptz,            -- cuándo se marcó pagado
  ADD COLUMN paid_marked_by uuid,            -- admin que marcó
  ADD COLUMN admin_notes text,
  ADD COLUMN redirected_to_boxmagic_at timestamptz;

-- Backfill de los registros existentes (clases gratuitas)
UPDATE public.trial_bookings SET plan_type = 'free_class' WHERE plan_type IS NULL;
```

Nuevos `status` permitidos (string, sin CHECK): `interesado_plan_prueba`, `redirigido_a_boxmagic`, `pagado_plan_prueba`, `plan_prueba_activo`, `plan_prueba_finalizado`, `convertido_a_membresia`. Los antiguos (`booked`, `attended`…) siguen funcionando para clases gratuitas históricas.

Sin cambios en RLS (el patrón actual ya cubre admin + service role).

## 2. Landing pública

**Nuevo archivo `src/pages/PlanDePrueba.tsx`** (rutas `/plan-de-prueba` y alias `/prueba-nave-studio`):
- **Hero**: título, subtítulo, CTA principal "Comprar plan de prueba" (scroll a sección precios).
- **Info corta**: 4 bullets.
- **Cajas de precio** (2): tarjetas con precio normal tachado, precio oferta destacado, lista de incluidos, botón que abre el formulario con `planType` preseleccionado.
- **Info larga**: qué es Nave, qué clases, cómo funciona el plan, qué pasa después de comprar, cómo se agenda en BoxMagic, reglas de seguridad de Criomedicina (reutilizar memoria `logic/ice-bath-safety-policy`).
- **Reseñas**: reusar `<ReviewsTrustBar />` o `<SocialProofSection />`.
- **Horarios**: reusar `<ScheduleDayCards />` (mismo componente que `Horarios.tsx`).
- **Footer**: reusar `<Footer />`.

Usa estética existente (verde `#2E4D3A`, fondos claros, mobile-first). Sin nuevas dependencias.

## 3. Modal de formulario (2 pasos)

**Nuevo `src/components/plan-prueba/PlanPruebaFormModal.tsx`** (basado en `Dialog` shadcn):

- **Paso 1 — Datos**: Nombre, Email, WhatsApp (validación zod + react-hook-form, igual a `TrialBookingForm`).
  - Al continuar: invoca edge function `submit-plan-prueba-lead` (crea lead `interesado_plan_prueba` + sync Sheets + MailerLite + email interno + email al usuario "estamos procesando"). Devuelve `leadId`.
  - Dispara `trackEvent('plan_trial_form_started')`.
- **Paso 2 — Plan + fecha**: 
  - Selector de plan (preseleccionado por la caja clickeada, editable).
  - Date picker (shadcn Calendar) limitado: hoy a hoy+30 días, en zona Chile.
  - Botón "Confirmar y pagar" → invoca `submit-plan-prueba-lead` con `step: 'finalize'` para actualizar el lead con `plan_type` y `requested_start_date`, marcar `redirected_to_boxmagic_at`, y devolver `boxmagicUrl`.
  - Dispara `trackEvent('plan_trial_form_completed')`.
- **Paso 3 — Redirección**: modal de confirmación reutilizando estilo de `RedirectModal.tsx` con título y texto del prompt; botón "Continuar al pago" abre `boxmagicUrl` en nueva pestaña y dispara `trackEvent('plan_trial_redirect_payment')` + CAPI.

Tracking page view: en `useEffect` del landing → `plan_trial_page_view`.

## 4. Edge function `submit-plan-prueba-lead`

Nuevo `supabase/functions/submit-plan-prueba-lead/index.ts`:
- Schema zod: `step` ('lead' | 'finalize'), `name`, `email`, `phone`, `planType?`, `startDate?`, `leadId?`, `utm_*?`.
- **step=lead**: 
  - Inserta en `trial_bookings` con `status='interesado_plan_prueba'`, `class_title='Plan de prueba'`, `class_day=''`, `class_time=''`, `scheduled_date=hoy` (NOT NULL constraints), guarda phone normalizado E.164.
  - Sync Google Sheets (reutilizar `appendToSheet`, fila con marca "PLAN_PRUEBA").
  - Sync MailerLite (mismo patrón que `book-trial-class`, tags `['plan-de-prueba']`).
  - Email interno a `lanave@alaniceman.com` (BCC `flowithmaral@gmail.com`).
  - Email al usuario con asunto y cuerpo exactos del prompt (HTML estilo Helvetica Neue / `#2E4D3A`).
  - CRM `upsertCustomerAndLogEvent` con `eventType='plan_prueba_lead'`, `statusIfNew='trial_booked'`.
- **step=finalize**: actualiza `plan_type`, `requested_start_date`, `redirected_to_boxmagic_at`, `status='redirigido_a_boxmagic'`, agrega `customer_events` con detalles del plan, devuelve `boxmagicUrl` desde constantes server-side.

Constantes (placeholders TODO):
```ts
const BOXMAGIC_URLS = {
  trial_7d: "https://cualesmi.boxmagic.app/checkout/PLACEHOLDER_PLAN_7D",
  trial_15d: "https://cualesmi.boxmagic.app/checkout/PLACEHOLDER_PLAN_15D",
};
```

`supabase/config.toml`: agregar bloque `[functions.submit-plan-prueba-lead] verify_jwt = false`.

## 5. Tracking

- Pixel: usar `useFacebookPixel().trackEvent` con eventos custom (`plan_trial_*`).
- CAPI: usar `useFacebookConversionsAPI().trackServerEvent` solo en `plan_trial_form_completed` y `plan_trial_redirect_payment` con `eventId` compartido para dedupe.
- No se trackea Purchase desde la web.

## 6. Quitar/Redirigir flujo gratuito

- `App.tsx`:
  - `/clase-de-prueba` → `Navigate to="/plan-de-prueba" replace`.
  - `/clase-de-prueba/agendar` → `Navigate to="/plan-de-prueba" replace`.
  - Nuevas rutas `/plan-de-prueba` y `/prueba-nave-studio` (esta última `Navigate` a la principal).
- `TrialModalProvider`: cambiar `navigate('/clase-de-prueba/agendar')` por `navigate('/plan-de-prueba')` (mantiene compatibilidad con todos los `OpenTrialModalButton` y delegación existente).
- Auditar y reemplazar copy "Clase de prueba" → "Plan de prueba" en CTAs visibles: `Header`, `HeroSection`, `StickyMobileCTA`, `PricingTrialMiniBar`, `TrialMiniBar`, `PricingTrialYogaSection`, `TrialYogaSection`, `YogaLasCondes`, `Index`, etc. (búsqueda con `rg "clase de prueba|Clase de Prueba|TrialClass"`).
- No borramos `TrialClassSchedule.tsx` ni `book-trial-class` (ya no son alcanzables desde UI, pero se conservan para histórico y como fallback hasta confirmar).

## 7. Admin

### 7a. Nueva página `/admin/planes-prueba`
`src/pages/admin/AdminPlanesPrueba.tsx` + ruta en `App.tsx` + entrada en `AdminSidebar`.
- Tabla: nombre, email, WhatsApp (clickable `wa.me/56...`), plan, fecha solicitada, estado, fecha creación.
- Filtros por estado (los 6 nuevos).
- Acción por fila: "Ver cliente" (link a `/admin/clientes/:id`) y "Marcar como pagado" (abre modal).

### 7b. Acción "Marcar como pagado plan de prueba"
Componente compartido `MarkPlanPruebaPaidModal.tsx`, montable desde la lista y desde `AdminCustomerDetail`:
- Campos: plan (7/15), `actual_start_date` (datepicker), `actual_end_date` (auto = inicio + 7 o 15 días en zona Chile, mostrado y editable solo lectura), notas internas.
- Al confirmar:
  - UPDATE `trial_bookings`: `plan_type`, `actual_start_date`, `actual_end_date`, `paid_at=now()`, `paid_marked_by=auth.uid()`, `admin_notes`, `status='plan_prueba_activo'`.
  - INSERT `customer_events` (`event_type='plan_prueba_paid'`, título "Plan de prueba activado", description con plan + fechas).
  - Llama nueva edge function `send-plan-prueba-activo` con asunto y contenido exactos del prompt (incluye email/`Nave7`).
- Refetch lista.

### 7c. Edge function `send-plan-prueba-activo`
Recibe `{ leadId }`, lee fila, manda email vía Resend (Helvetica Neue, primary `#2E4D3A`, plantilla similar a las existentes), respetando 2 req/s.

## 8. Memoria

Crear `mem://features/plan-de-prueba-pagado` describiendo: rutas, plan_type values, que la web no marca pagado (manual), constantes BoxMagic placeholder, y agregarlo al `mem://index.md`.

## Archivos creados
- `src/pages/PlanDePrueba.tsx`
- `src/components/plan-prueba/PlanPruebaFormModal.tsx`
- `src/pages/admin/AdminPlanesPrueba.tsx`
- `src/components/admin/MarkPlanPruebaPaidModal.tsx`
- `supabase/functions/submit-plan-prueba-lead/index.ts`
- `supabase/functions/send-plan-prueba-activo/index.ts`

## Archivos modificados
- `src/App.tsx` (rutas)
- `src/context/TrialModalProvider.tsx` (target route)
- `src/components/admin/AdminSidebar.tsx` (nueva entrada)
- `src/pages/admin/AdminCustomerDetail.tsx` (botón "Marcar pagado plan de prueba")
- Migración SQL en `supabase/migrations/`
- `supabase/config.toml` (verify_jwt para nuevas functions)
- Componentes con copy "Clase de prueba" → "Plan de prueba"

## Notas
- BoxMagic URLs quedan como `PLACEHOLDER_PLAN_7D/15D` con `// TODO` claro; reemplazables en un solo archivo.
- Se respeta zona horaria `America/Santiago` para todos los cálculos de fecha (date-fns-tz ya está disponible si hace falta; usar `toLocaleString` con `timeZone` como en el resto del proyecto).
- WhatsApp Nave en emails y admin: `https://wa.me/56946120426`.
