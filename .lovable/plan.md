

## Plan: Limitar capacidad de clases de prueba (3 L-V, 2 S-D)

### Resumen
Agregar validacion de capacidad maxima por sesion en la edge function `book-trial-class`. Maximo 3 personas en clases de prueba de lunes a viernes, maximo 2 sabado y domingo.

### Cambios

**1. Modificar `supabase/functions/book-trial-class/index.ts`**

Despues del check de elegibilidad (linea 142-153), agregar un segundo check:

- Contar cuantas `trial_bookings` existen con el mismo `scheduled_date`, `class_time` y `status = 'booked'`
- Determinar el dia de la semana del `selectedDate`: si es lunes-viernes → max 3, sabado-domingo → max 2
- Si el conteo >= max, retornar error `{ capacityFull: true }` con mensaje "Esta clase ya esta llena"

**2. Actualizar el frontend `src/components/trial/TrialBookingForm.tsx`**

- Manejar la respuesta `capacityFull: true` mostrando un toast de error indicando que la clase esta llena

### Archivos
- `supabase/functions/book-trial-class/index.ts` — agregar check de capacidad
- `src/components/trial/TrialBookingForm.tsx` — manejar respuesta de capacidad llena

