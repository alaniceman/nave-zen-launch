

## Plan: Corregir slots con horario incorrecto y fix del bug de timezone

### Problema
El `slotGenerator.ts` tiene un bug: la función `getChileOffsetMinutes` retorna horas (ej: -3) pero el código lo divide por 60 como si fueran minutos (`offsetHours = chileOffsetMinutes / 60` = -0.05). Esto hace que los slots se guarden practicamente sin conversión a UTC, quedando 3 horas antes del horario real de Chile.

### Datos del problema
- **12 slots incorrectos** creados el 29/Mar 18:45 UTC y 30/Mar 20:52-20:54 UTC
- **8 sin reservas** → se eliminan
- **4 con `confirmed_bookings > 0`**, pero solo **1 reserva real confirmada** (Quirino Ríos, Apr 3 15:00 UTC). Las otras 3 son de Jens Meyer con status CANCELLED.

### Pasos

**1. Fix del bug en `slotGenerator.ts`**
- Cambiar `const offsetHours = chileOffsetMinutes / 60` a `const offsetHours = chileOffsetMinutes` (ya retorna horas, no minutos)
- Renombrar la función a `getChileOffsetHours` para claridad

**2. Eliminar los 12 slots incorrectos**
- DELETE de `generated_slots` donde el id está en la lista de los 12 slots identificados

**3. Corregir la reserva confirmada de Quirino Ríos**
- UPDATE booking `8a39426a`: date_time_start de `15:00 UTC` → `18:00 UTC`, date_time_end de `16:00 UTC` → `19:00 UTC`

**4. Re-deploy y regenerar slots correctos**
- Deploy de `generate-future-slots` con el fix
- Invocar la función para regenerar los slots con horarios correctos

### Archivos a modificar
- `supabase/functions/_shared/slotGenerator.ts` — fix division bug

