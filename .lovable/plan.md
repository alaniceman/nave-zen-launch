

# Generar codigo de sesion al cancelar reserva directa

## Problema
Cuando un cliente agenda directo (sin paquete ni gift card) y el admin cancela la reserva, no existe un codigo de sesion para reagendar. El boton "Cancelar y Liberar Codigo" solo funciona si la reserva ya tenia un `session_code_id`.

## Solucion
Modificar la logica de `cancel_and_release` en la edge function `admin-bookings` para que, cuando la reserva **no tenga** `session_code_id`, se cree automaticamente un codigo de sesion nuevo y se envie al correo del cliente.

## Flujo propuesto

```text
Admin presiona "Cancelar y Liberar Codigo"
         |
    Reserva tiene session_code_id?
       /           \
     SI             NO
      |              |
  Liberar codigo   Crear nuevo codigo
  (flujo actual)   con el servicio de la reserva
                     |
                   Enviar email al cliente
                   con el codigo nuevo
                     |
                   Mostrar toast con codigo generado
```

## Cambios tecnicos

### 1. Edge function `supabase/functions/admin-bookings/index.ts`

En el bloque `cancel_and_release`, despues de cancelar la reserva:

- Si `booking.session_code_id` es null:
  - Obtener datos completos de la reserva (customer_name, customer_email, customer_phone, service_id, final_price)
  - Generar un codigo aleatorio de 8 caracteres (ej: `RECUP-XXXX`)
  - Calcular fecha de expiracion (90 dias desde hoy)
  - Insertar en tabla `session_codes` con:
    - `code`: codigo generado
    - `buyer_email`: email del cliente
    - `buyer_name`: nombre del cliente
    - `buyer_phone`: telefono del cliente
    - `applicable_service_ids`: array con el service_id de la reserva original
    - `expires_at`: 90 dias desde hoy
    - `is_used`: false
  - Invocar `send-session-codes-email` con el codigo generado
  - Retornar `code_created` en la respuesta

- Si `booking.session_code_id` existe: flujo actual sin cambios (liberar codigo)

### 2. Frontend `src/pages/admin/AdminBookings.tsx`

- En el `onSuccess` de `cancelAndReleaseMutation`, manejar el nuevo campo `code_created`:
  - Si `data.code_created`: mostrar toast "Reserva cancelada y codigo [CODIGO] creado y enviado al cliente"
  - Si `data.code_released`: toast actual sin cambios
  - Si ninguno: toast generico actual

- Actualizar el texto del boton para reservas sin codigo de sesion: mostrar "Cancelar y Generar Codigo" en vez de "Cancelar Reserva"
- Actualizar el texto del dialogo de confirmacion para explicar que se generara un codigo nuevo

### 3. Sin cambios en base de datos
La tabla `session_codes` ya soporta insertar codigos sin `package_id` (campo nullable) y el trigger `ensure_uppercase_code` se encargara de normalizar el codigo.

