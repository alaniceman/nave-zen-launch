

## Plan: Contar canceladas como venta + botón de Devolución

### Resumen
Dos cambios: (1) las reservas CANCELLED cuentan como ingreso en el dashboard (ya aprobado), y (2) agregar un nuevo status `REFUNDED` con un botón "Devolución" en la gestión de reservas. Las reservas con status REFUNDED NO se contabilizan como ingreso.

### Paso 1 — Dashboard: incluir CANCELLED como venta

**`src/pages/admin/AdminDashboard.tsx`**
- Línea 282: cambiar `confirmedBookings` por filtro que incluya CONFIRMED + CANCELLED
- Excluir explícitamente REFUNDED del cálculo de ingresos
- Actualizar `bookingsByService` para incluir CONFIRMED + CANCELLED (no REFUNDED)

### Paso 2 — Agregar status REFUNDED al sistema

**`src/pages/admin/AdminBookings.tsx`**
- Agregar a `statusColors`: `REFUNDED: 'bg-purple-500'`
- Agregar a `statusLabels`: `REFUNDED: 'Devuelta'`
- Agregar opción "Devuelta" en el filtro de estados
- Agregar botón "Devolución" (con AlertDialog de confirmación) para reservas CONFIRMED o CANCELLED
- Nueva mutation que llama a `admin-bookings` con `action: 'refund'`

### Paso 3 — Edge function: manejar acción refund

**`supabase/functions/admin-bookings/index.ts`**
- Agregar handler para `action === 'refund'`:
  - Cambiar status de la reserva a `REFUNDED`
  - Si tenía session_code_id, liberar el código (igual que cancel)
  - No generar código de recuperación (es una devolución real)

### Lógica de negocio

```text
Estado         | ¿Cuenta como ingreso? | ¿Genera código?
───────────────┼───────────────────────┼────────────────
CONFIRMED      | Sí                    | N/A
CANCELLED      | Sí (no hay devolución)| Sí (recuperación)
REFUNDED       | No                    | No
PENDING_PAYMENT| No                    | N/A
```

### Archivos a modificar
- `src/pages/admin/AdminDashboard.tsx` — incluir CANCELLED en revenue, excluir REFUNDED
- `src/pages/admin/AdminBookings.tsx` — nuevo status, botón devolución
- `supabase/functions/admin-bookings/index.ts` — handler refund

