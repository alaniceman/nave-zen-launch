## Objetivo
Agregar el nombre del profesor/instructor en cada tarjeta de clase de la página `/horarios` (vista "Por Día").

## Contexto
- El hook `useScheduleEntries` ya carga `professional_name` desde la BD y lo expone como `instructor` en cada `ScheduleClassItem`.
- En la vista "Por Experiencia" ya se muestra ("con {instructor}").
- En la vista "Por Día" (las tarjetas de colores), el instructor NO se está mostrando actualmente.

## Cambio
Editar `src/components/ScheduleDayCards.tsx`, función `renderCard`:

- Agregar debajo del título (`<h3>`) una línea con el nombre del instructor cuando exista, usando un ícono `User` de `lucide-react` y estilo sutil sobre el fondo de color.
- Ejemplo de estilo: `text-white/85 text-sm flex items-center gap-1.5 mb-3` con ícono pequeño.
- Si no hay instructor asignado a la entrada, no se renderiza nada (sin "con —").

## Notas
- Solo afecta UI de `/horarios`. No cambia BD ni hooks.
- Las entradas sin profesor en `schedule_entries` seguirán mostrándose igual que antes.
- Si quieres que también se asignen profesores faltantes, eso se hace desde `/admin/horarios` (schedule_entries), no es parte de este cambio.
