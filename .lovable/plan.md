

## Plan: Cancelar Reserva y Liberar Código de Sesión

### Resumen
Implementaremos un botón en el panel de reservas que permite cancelar una reserva y automáticamente liberar el código de sesión asociado para que pueda ser reutilizado.

---

### Cambios a realizar

#### 1. Edge Function - Agregar acción de cancelación con liberación de código
**Archivo:** `supabase/functions/admin-bookings/index.ts`

Modificar la función para que cuando se cancele una reserva con un código de sesión asociado:
1. Cambiar el status de la reserva a `CANCELLED`
2. Si tiene `session_code_id`, actualizar el código:
   - `is_used` → `false`
   - `used_at` → `null`
   - `used_in_booking_id` → `null`

#### 2. Frontend - Agregar botón de cancelación
**Archivo:** `src/pages/admin/AdminBookings.tsx`

Agregar un nuevo botón "Cancelar y Liberar Código" que:
- Aparece para reservas en estado `CONFIRMED` o `PENDING_PAYMENT`
- Muestra un diálogo de confirmación antes de proceder
- Indica visualmente si la reserva tiene un código de sesión asociado

---

### Flujo de usuario

```text
Admin ve reserva confirmada con código K5LRFK7M
            ↓
Hace clic en "Cancelar y Liberar Código"
            ↓
Aparece diálogo: "¿Cancelar reserva y liberar código K5LRFK7M?"
            ↓
Admin confirma
            ↓
Edge function:
  1. booking.status → CANCELLED
  2. session_code.is_used → false
  3. session_code.used_at → null
  4. session_code.used_in_booking_id → null
            ↓
El cliente puede usar el código nuevamente
```

---

### Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `supabase/functions/admin-bookings/index.ts` | Agregar lógica para liberar session_code al cancelar |
| `src/pages/admin/AdminBookings.tsx` | Agregar botón "Cancelar y Liberar Código" con confirmación |

---

### Detalles técnicos

**Edge Function - Nueva acción `cancel_and_release`:**

```text
POST /admin-bookings
Body: { 
  id: "booking-uuid", 
  action: "cancel_and_release" 
}

Lógica:
1. Obtener booking con session_code_id
2. UPDATE bookings SET status = 'CANCELLED' WHERE id = ?
3. Si session_code_id existe:
   UPDATE session_codes 
   SET is_used = false, used_at = null, used_in_booking_id = null
   WHERE id = session_code_id
4. Retornar { success: true, code_released: "K5LRFK7M" }
```

**Frontend - Nuevo botón y diálogo:**

- Agregar `AlertDialog` de shadcn/ui para confirmación
- Nuevo mutation `cancelAndReleaseMutation`
- Botón aparece en columna "Acciones" junto al botón de confirmar
- Estilo destructivo (rojo) para indicar acción irreversible

---

### Resultado esperado

- Los admins podrán cancelar reservas directamente desde el panel
- Si la reserva usó un código de sesión, este se liberará automáticamente
- El cliente recibirá su código disponible para agendar nuevamente
- No se requiere intervención manual en la base de datos

