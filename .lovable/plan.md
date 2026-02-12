

# Agregar eventos ViewContent e InitiateCheckout al flujo de clase de prueba

## Cambios

Se agregaran dos eventos adicionales del Facebook Pixel al flujo de agendar clase de prueba:

1. **ViewContent**: se dispara al cargar la pagina `/clase-de-prueba/agendar`, para medir cuantas personas entran al flujo.
2. **InitiateCheckout**: se dispara cuando el usuario avanza al paso del formulario de datos (step "form"), es decir, ya selecciono clase y fecha.

Junto con el evento `TrialClass` que ya esta implementado en el exito, esto permite medir el embudo completo:
- ViewContent (entra al flujo) → InitiateCheckout (llega al formulario) → TrialClass (completa la reserva)

## Detalle tecnico

**Archivo: `src/pages/TrialClassSchedule.tsx`**

- Importar `useFacebookPixel` desde `@/hooks/useFacebookPixel`
- Disparar `trackEvent('ViewContent', { content_name: 'Clase de prueba', content_category: 'Trial' })` en un `useEffect` al montar el componente
- Modificar la transicion al step `"form"` (cuando se llama `setStep("form")` desde el boton "Continuar" en `TrialClassDetail`) para disparar `trackEvent('InitiateCheckout', { content_name: classItem.title, currency: 'CLP', value: 0 })` justo antes de cambiar al paso del formulario

Esto se implementa creando un wrapper `goToForm` que dispara el evento y luego cambia el step, y pasandolo como `onContinue` al componente `TrialClassDetail`.

| Archivo | Accion |
|---|---|
| `src/pages/TrialClassSchedule.tsx` | Importar `useFacebookPixel`, agregar `ViewContent` en mount y `InitiateCheckout` al avanzar al formulario |

