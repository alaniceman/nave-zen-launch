
# Fix: Scroll en la Agenda al seleccionar fecha/horario

## Problema

Cada vez que seleccionas una fecha o un horario en `/agenda-nave-studio`, la pagina vuelve arriba. Esto ocurre porque ambas acciones (`handleDateSelect` y `handleTimeSlotSelect`) usan `navigate()` para actualizar la URL, lo que cambia el pathname y dispara el componente `ScrollToTop`.

## Solucion

### 1. Evitar scroll en seleccion de fecha

Reemplazar `navigate()` por `window.history.replaceState()` en `handleDateSelect` y `handleProfessionalChange`. Esto actualiza la URL sin disparar el scroll-to-top, ya que React Router no detecta un cambio de ruta.

### 2. Scroll suave al formulario al seleccionar horario

En `handleTimeSlotSelect`, despues de seleccionar un slot:
- Seguir usando `window.history.replaceState()` para la URL
- Hacer scroll suave hacia la seccion del formulario de reserva usando `scrollIntoView({ behavior: 'smooth' })`
- Agregar un `ref` al contenedor del formulario (`BookingForm`) para poder hacer scroll hacia el

### Detalle tecnico

**Archivo: `src/pages/AgendaNaveStudio.tsx`**

- `handleProfessionalChange`: cambiar `navigate()` por `window.history.replaceState(null, '', newPath)`
- `handleDateSelect`: cambiar `navigate()` por `window.history.replaceState(null, '', newPath)`
- `handleTimeSlotSelect`: cambiar `navigate()` por `window.history.replaceState()` + `setTimeout` con `ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })`
- `handleBackToSlots`: cambiar `navigate()` por `window.history.replaceState()`
- Agregar un `useRef` para el contenedor del formulario de booking

Esto no afecta la carga inicial por URL (cuando alguien entra directamente con `/agenda-nave-studio/prof/2025-02-11/08:00` sigue funcionando porque `useParams` ya lee esos valores al montar).
