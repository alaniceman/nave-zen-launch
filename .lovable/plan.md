

# CRM: Historial Unificado de Clientes

## Resumen

Crear un sistema CRM ligero que unifique la informacion de cada persona (identificada por email) en una ficha con linea de tiempo. El historial se alimenta automaticamente de las tablas existentes (trial_bookings, bookings, package_orders) y permite asignar membresías manualmente.

---

## 1. Nuevas tablas en la base de datos

### 1a. `customers` -- Ficha del cliente/lead

| Columna | Tipo | Default | Descripcion |
|---|---|---|---|
| `id` | uuid | gen_random_uuid() | PK |
| `email` | text | NOT NULL, UNIQUE | Llave principal de unificacion |
| `name` | text | NOT NULL | Nombre del cliente |
| `phone` | text | nullable | Celular normalizado E.164 |
| `status` | text | 'new' | Estado del funnel: new, trial_booked, trial_attended, purchased, member |
| `notes` | text | nullable | Notas internas libres |
| `created_at` | timestamptz | now() | |
| `updated_at` | timestamptz | now() | |

RLS:
- SELECT / INSERT / UPDATE / DELETE: admins only

### 1b. `customer_events` -- Linea de tiempo / historial

| Columna | Tipo | Default | Descripcion |
|---|---|---|---|
| `id` | uuid | gen_random_uuid() | PK |
| `customer_id` | uuid FK -> customers | NOT NULL | |
| `event_type` | text | NOT NULL | trial_booked, trial_attended, trial_cancelled, booking_confirmed, package_purchased, giftcard_purchased, membership_assigned, membership_updated, note |
| `title` | text | NOT NULL | Titulo descriptivo del evento |
| `description` | text | nullable | Detalle extra (nombre pack, monto, clase, etc.) |
| `amount` | integer | nullable | Monto en CLP si aplica |
| `metadata` | jsonb | '{}' | Datos adicionales (booking_id, order_id, membership_plan_id, etc.) |
| `event_date` | timestamptz | now() | Fecha del evento |
| `created_at` | timestamptz | now() | |

RLS:
- SELECT / INSERT / UPDATE / DELETE: admins only

### 1c. `membership_plans` -- Planes de membresia (definiciones)

| Columna | Tipo | Default | Descripcion |
|---|---|---|---|
| `id` | uuid | gen_random_uuid() | PK |
| `name` | text | NOT NULL | Ej: Universo, Orbita, Eclipse |
| `frequency` | text | NOT NULL | 'weekly' o 'monthly' |
| `classes_included` | integer | NOT NULL | Cantidad de clases |
| `price_clp` | integer | NOT NULL | Valor en CLP |
| `description` | text | nullable | Beneficios / notas |
| `is_active` | boolean | true | |
| `created_at` | timestamptz | now() | |
| `updated_at` | timestamptz | now() | |

RLS:
- SELECT / INSERT / UPDATE / DELETE: admins only

### 1d. `customer_memberships` -- Asignacion de membresia a un cliente

| Columna | Tipo | Default | Descripcion |
|---|---|---|---|
| `id` | uuid | gen_random_uuid() | PK |
| `customer_id` | uuid FK -> customers | NOT NULL | |
| `membership_plan_id` | uuid FK -> membership_plans | NOT NULL | |
| `status` | text | 'active' | active, paused, cancelled |
| `start_date` | date | CURRENT_DATE | |
| `end_date` | date | nullable | Fecha fin si aplica |
| `notes` | text | nullable | Notas internas |
| `created_at` | timestamptz | now() | |
| `updated_at` | timestamptz | now() | |

RLS:
- SELECT / INSERT / UPDATE / DELETE: admins only

---

## 2. Sincronizacion automatica de datos existentes

### 2a. Migracion inicial: poblar `customers` desde datos existentes

Un script SQL que:
1. Inserta clientes unicos desde `trial_bookings` (customer_email, customer_name, customer_phone)
2. Inserta/actualiza desde `bookings` (customer_email, customer_name, customer_phone)
3. Inserta/actualiza desde `package_orders` (buyer_email, buyer_name, buyer_phone)
4. Usa `ON CONFLICT (email) DO UPDATE` para unificar y tomar el nombre/telefono mas reciente
5. Calcula el `status` inicial segun los datos (si tiene membresia = member, si compro = purchased, si asistio prueba = trial_attended, etc.)

### 2b. Migracion inicial: poblar `customer_events` desde datos existentes

Insertar eventos historicos:
- Desde `trial_bookings`: evento por cada booking (trial_booked, trial_attended, etc.)
- Desde `bookings` con status CONFIRMED: evento booking_confirmed
- Desde `package_orders` con status paid: evento package_purchased o giftcard_purchased

### 2c. Registro automatico en tiempo real (Edge Functions)

Modificar las siguientes Edge Functions para crear/actualizar clientes y agregar eventos:

**`book-trial-class`**: despues de crear el trial booking:
- Upsert en `customers` (email, name, phone)
- Insertar evento `trial_booked` en `customer_events`
- Actualizar `status` del customer a `trial_booked` (si era `new`)

**`mercadopago-webhook`**: al confirmar un pago:
- En `handleBookingPayment` (pago aprobado): upsert customer + evento `booking_confirmed`
- En `handlePackageOrderPayment` (pago aprobado): upsert customer + evento `package_purchased` o `giftcard_purchased`
- Actualizar `status` del customer a `purchased` (si no es `member`)

**`purchase-session-package`** (caso 100% descuento): al completar compra gratis:
- Upsert customer + evento correspondiente

---

## 3. Admin: Paginas nuevas

### 3a. Lista de Clientes (`/admin/clientes`)

- Tabla con: nombre, email, telefono (con link WhatsApp), estado, fecha creacion
- Busqueda por nombre/email/telefono
- Filtro por estado (new, trial_booked, trial_attended, purchased, member)
- Click en fila abre la ficha del cliente

### 3b. Ficha del Cliente (`/admin/clientes/:id`)

Layout de ficha con dos secciones:

**Panel superior**: datos basicos
- Nombre, email, celular (con icono WhatsApp clickeable)
- Estado (badge de color)
- Membresia activa (si tiene): nombre del plan + estado + fecha inicio
- Botones: "Asignar Membresia", "Agregar Nota"

**Panel inferior**: linea de tiempo
- Lista cronologica descendente de `customer_events`
- Cada evento muestra: icono segun tipo, titulo, descripcion, monto (si aplica), fecha
- Iconos por tipo:
  - trial_booked: GraduationCap
  - trial_attended: CheckCircle (verde)
  - booking_confirmed: Calendar
  - package_purchased: Package
  - giftcard_purchased: Gift
  - membership_assigned: Crown
  - note: StickyNote

### 3c. Planes de Membresia (`/admin/membresias`)

- Tabla CRUD con: nombre, frecuencia, clases incluidas, precio, activo
- Formulario modal para crear/editar plan

### 3d. Asignar Membresia (modal en la ficha del cliente)

- Select con planes activos
- Fecha inicio (default hoy)
- Notas (opcional)
- Al guardar:
  - Insertar en `customer_memberships`
  - Insertar evento `membership_assigned` en `customer_events`
  - Actualizar `status` del customer a `member`

---

## 4. Admin: Sidebar actualizado

Nuevos items en la seccion de gestion:
- "Clientes" (icono Users) -> `/admin/clientes`
- "Membresías" (icono Crown) -> `/admin/membresias`

---

## 5. Archivos a crear

| Archivo | Descripcion |
|---|---|
| `src/pages/admin/AdminCustomers.tsx` | Lista de clientes con busqueda y filtros |
| `src/pages/admin/AdminCustomerDetail.tsx` | Ficha del cliente con timeline |
| `src/pages/admin/AdminMembershipPlans.tsx` | CRUD de planes de membresia |
| `src/components/admin/MembershipPlanForm.tsx` | Formulario modal para planes |
| `src/components/admin/AssignMembershipModal.tsx` | Modal para asignar membresia a un cliente |
| `src/components/admin/AddCustomerNoteModal.tsx` | Modal para agregar nota manual |

## 6. Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/App.tsx` | Agregar rutas `/admin/clientes`, `/admin/clientes/:id`, `/admin/membresias` |
| `src/components/admin/AdminSidebar.tsx` | Agregar items "Clientes" y "Membresías" |
| `supabase/functions/book-trial-class/index.ts` | Agregar upsert de customer + evento |
| `supabase/functions/mercadopago-webhook/index.ts` | Agregar upsert de customer + evento al confirmar pago |
| `supabase/functions/purchase-session-package/index.ts` | Agregar upsert de customer + evento en compra con 100% descuento |

---

## 7. Secuencia de implementacion

1. Migracion DB: crear tablas customers, customer_events, membership_plans, customer_memberships
2. Migracion de datos: poblar customers y customer_events desde datos historicos
3. Edge Functions: agregar logica de upsert + eventos en book-trial-class, mercadopago-webhook, purchase-session-package
4. Admin: lista de clientes + ficha con timeline
5. Admin: CRUD de planes de membresia
6. Admin: asignacion de membresia + notas manuales
7. Sidebar + rutas

