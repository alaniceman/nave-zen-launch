
# Agregar tracking "TrialClass" al flujo de clase de prueba

## Cambios

Se agregara el evento personalizado `TrialClass` del Facebook Pixel cuando el formulario de clase de prueba se completa exitosamente.

## Detalle tecnico

**Archivo: `src/components/trial/TrialBookingForm.tsx`**

- Importar `useFacebookPixel` desde `@/hooks/useFacebookPixel`
- En el bloque de exito del `onSubmit` (justo antes de llamar `onSuccess()`), disparar:
  ```
  trackEvent('TrialClass', {
    content_name: classItem.title,
    value: 0,
    currency: 'CLP'
  })
  ```
- Tambien se puede agregar tracking server-side con `useFacebookConversionsAPI` para deduplicacion, enviando el email y nombre del usuario

**Archivo: `src/pages/TrialClassSchedule.tsx`**

- Opcionalmente, agregar `ViewContent` al cargar la pagina para medir cuanta gente entra al flujo vs cuanta completa

| Archivo | Accion |
|---|---|
| `src/components/trial/TrialBookingForm.tsx` | Agregar `useFacebookPixel` + evento `TrialClass` en exito |
