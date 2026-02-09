

# Horarios Configurables desde el Admin

## Resumen

Migrar los horarios de un archivo hardcoded (`schedule.ts`) a la base de datos, gestionados desde el admin. Agregar campos de visibilidad a los servicios (`is_trial_enabled`, `show_in_agenda`). Mostrar clases de prueba en el dashboard. Crear todas las clases faltantes como servicios.

---

## 1. Cambios en la base de datos

### 1a. Nuevas columnas en `services`

| Columna | Tipo | Default | Descripcion |
|---|---|---|---|
| `is_trial_enabled` | boolean | false | Permite agendar clase de prueba |
| `show_in_agenda` | boolean | true | Aparece en el calendario de `/agenda-nave-studio` |
| `color_tag` | text | 'default' | Categoria de color para las cards del horario (yoga, wim-hof, hiit, breathwork, personalizado) |

### 1b. Nueva tabla: `schedule_entries`

Reemplaza `scheduleData` de `schedule.ts`. Cada fila es un horario recurrente semanal.

| Columna | Tipo | Default |
|---|---|---|
| `id` | uuid | gen_random_uuid() |
| `service_id` | uuid FK -> services | NOT NULL |
| `professional_id` | uuid FK -> professionals | nullable |
| `day_of_week` | integer (0=lunes...6=domingo) | NOT NULL |
| `start_time` | time | NOT NULL |
| `display_name` | text | nullable (override del nombre del servicio para mostrar en horario) |
| `badges` | text[] | '{}' |
| `is_active` | boolean | true |
| `sort_order` | integer | 0 |
| `created_at` | timestamptz | now() |
| `updated_at` | timestamptz | now() |

RLS:
- SELECT: publico (is_active = true)
- INSERT/UPDATE/DELETE: admins only

### 1c. Insertar servicios faltantes

Basandose en `schedule.ts`, crear los servicios que faltan en la sucursal default "Nave Studio (Santiago, Las Condes)". Servicios actuales: Sesion Criomedicina / Metodo Wim Hof, Yoga Integral, Sesion Criomedicina (Algarrobo). Faltan:

- Yang Yoga + Ice Bath (opcional) -- is_trial_enabled: true, show_in_agenda: false
- Isometrica + Flexibilidad -- is_trial_enabled: true, show_in_agenda: false
- Yin Yoga + Ice Bath (opcional) -- is_trial_enabled: true, show_in_agenda: false
- Vinyasa Yoga + Ice Bath (opcional) -- is_trial_enabled: true, show_in_agenda: false
- Power Yoga + Ice Bath (opcional) -- is_trial_enabled: true, show_in_agenda: false
- HIIT + Ice Bath -- is_trial_enabled: true, show_in_agenda: false
- Breathwork Wim Hof -- is_trial_enabled: true, show_in_agenda: false
- Metodo Wim Hof (Breathwork + Ice Bath) -- is_trial_enabled: false, show_in_agenda: false (ya existe pero se actualizara)
- Personalizado Metodo Wim Hof -- is_trial_enabled: false, show_in_agenda: false
- Yoga Integral + Ice Bath (opcional) -- is_trial_enabled: true, show_in_agenda: false (ya existe pero se renombrara/actualizara)

Nota: `show_in_agenda` comienza en false para los servicios nuevos para no romper el flujo actual de `/agenda-nave-studio`. El admin los activa manualmente cuando quiera.

Los servicios existentes que ya aparecen en agenda (`Sesion Criomedicina`, `Yoga Integral`) mantendran `show_in_agenda: true`.

### 1d. Insertar schedule_entries

Migrar cada entrada de `scheduleData` a la tabla `schedule_entries`, vinculando con el `service_id` correspondiente y el `professional_id` cuando el instructor existe en la tabla `professionals`.

---

## 2. Cambios en el Admin

### 2a. ServiceForm -- Nuevos checkboxes

Agregar 2 checkboxes al formulario de servicios:
- "Disponible como clase de prueba" (`is_trial_enabled`)
- "Mostrar en calendario de agenda" (`show_in_agenda`)

Y un select para `color_tag` con opciones: Yoga, Metodo Wim Hof, HIIT / Biohacking, Breathwork, Personalizado, Default.

### 2b. AdminServices -- Mostrar nuevas columnas

En la tabla, agregar columnas visibles:
- "Prueba" (check/x icon)
- "Agenda" (check/x icon)

### 2c. Nueva pagina: Admin Horarios (`/admin/horarios`)

CRUD para `schedule_entries`:
- Tabla con: dia, hora, servicio (nombre), profesional, badges, activo
- Filtro por dia de la semana
- Formulario modal para crear/editar: dia, hora, servicio (select), profesional (select, opcional), display_name (opcional), badges (input separado por comas), activo
- Ordenable por dia + hora

### 2d. Dashboard -- Seccion de Clases de Prueba

Agregar al dashboard:
- KPI card: "Clases de Prueba" con total de bookings del periodo
- Mini tabla con las ultimas 5 clases de prueba (nombre, email, clase, fecha, status)

### 2e. Sidebar -- Nuevo item

Agregar "Horarios" al menu del admin (icono Clock) apuntando a `/admin/horarios`.

---

## 3. Frontend publico -- Leer desde la BD

### 3a. Nuevo hook: `useScheduleEntries`

Hook con react-query que hace:
```
SELECT se.*, s.name as service_name, s.is_trial_enabled, s.color_tag, s.description,
       p.name as professional_name
FROM schedule_entries se
JOIN services s ON se.service_id = s.id
LEFT JOIN professionals p ON se.professional_id = p.id
WHERE se.is_active = true AND s.is_active = true
ORDER BY se.day_of_week, se.start_time
```

Transforma el resultado en el mismo formato `Record<string, ClassItem[]>` que usa `scheduleData` actualmente, para minimizar cambios en componentes existentes.

### 3b. `ScheduleDayCards` (pagina /horarios)

- Reemplazar import de `scheduleData` por el hook `useScheduleEntries`
- Agregar estado de loading con skeleton
- El resto del componente no cambia (misma estructura de cards)

### 3c. `TrialScheduleCards` (pagina /clase-de-prueba/agendar)

- Reemplazar import de `scheduleData` por `useScheduleEntries`
- Filtrar solo clases con `is_trial_enabled = true` (ya viene del join)
- Agregar loading state

### 3d. `TrialClassDetail` y `TrialBookingForm`

- Reciben `ClassItem` como prop, no cambian significativamente
- Solo ajustar tipos si es necesario

### 3e. `/agenda-nave-studio`

- Filtrar servicios por `show_in_agenda = true` en la query existente (agregar `.eq('show_in_agenda', true)`)

### 3f. `scheduleByExperience.ts` y `experiences.ts`

- Actualizar `weeklyByExperience` para recibir datos como parametro en vez de importar `scheduleData`
- O mantener la misma logica pero alimentada desde el hook

---

## 4. Archivos a crear

| Archivo | Descripcion |
|---|---|
| `src/pages/admin/AdminScheduleEntries.tsx` | CRUD de horarios semanales |
| `src/components/admin/ScheduleEntryForm.tsx` | Formulario modal para crear/editar entradas |
| `src/hooks/useScheduleEntries.ts` | Hook para cargar horarios desde la BD |

## 5. Archivos a modificar

| Archivo | Cambio |
|---|---|
| `src/components/admin/ServiceForm.tsx` | Agregar checkboxes is_trial_enabled, show_in_agenda, select color_tag |
| `src/pages/admin/AdminServices.tsx` | Columnas Prueba y Agenda en la tabla |
| `src/components/admin/AdminSidebar.tsx` | Agregar item "Horarios" |
| `src/App.tsx` | Agregar ruta `/admin/horarios` |
| `src/components/ScheduleDayCards.tsx` | Usar hook en vez de import estatico |
| `src/components/trial/TrialScheduleCards.tsx` | Usar hook en vez de import estatico |
| `src/lib/scheduleByExperience.ts` | Recibir datos como parametro |
| `src/pages/AgendaNaveStudio.tsx` | Filtrar por show_in_agenda |
| `src/pages/admin/AdminDashboard.tsx` | Agregar seccion de clases de prueba |

## 6. Archivos que se mantienen pero dejan de ser la fuente primaria

- `src/data/schedule.ts` -- Se mantiene como fallback/referencia pero ya no se importa en componentes publicos. La fuente de verdad sera la BD.

---

## Secuencia de implementacion

1. Migracion DB: columnas en services + tabla schedule_entries + seed de servicios y horarios
2. Admin: ServiceForm con nuevos campos + AdminScheduleEntries
3. Hook useScheduleEntries
4. Frontend: ScheduleDayCards y TrialScheduleCards usan el hook
5. AgendaNaveStudio filtra por show_in_agenda
6. Dashboard con trial bookings

