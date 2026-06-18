## Plan

### Objetivo

En la página `/planes-precios`, en las tarjetas de los planes **Eclipse** y **Órbita**, modificar la fila "Sesiones presenciales" para que:

1. El texto se vea **subrayado sutilmente** (indicando que es interactivo).
2. Aparezca un **ícono (i)** de información al final del texto.
3. Al hacer clic, se abra un **tooltip** con el mensaje:
  > "No pierdes tu sesión si una semana no puedes venir. Puedes usarla en otra semana dentro de tu ciclo actual de membresía, antes de la próxima renovación."

### Archivo a modificar

- `src/pages/Planes.tsx`

### Cambios técnicos

1. Importar los componentes `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` desde `@/components/ui/tooltip`.
2. Importar el ícono `Info` de `lucide-react`.
3. En la fila "Sesiones presenciales" de los planes **Eclipse** (línea ~142) y **Órbita** (línea ~190), reemplazar el `<span>` simple por un `<Tooltip>` con:
  - Un `<TooltipTrigger>` que contenga el texto "Sesiones presenciales" con estilo `underline underline-offset-2 decoration-dotted` para el subrayado sutil, más el ícono `<Info size={14} className="ml-1 inline" />`.
  - Un `<TooltipContent>` con el texto del tooltip.
4. El `<TooltipProvider>` puede envolver todo el componente o solo las filas afectadas.

### Alcance

- Solo cambios de presentación (UI) en el frontend.
- No afecta el plan **Universo** (tiene "Ilimitadas" y no aplica la misma lógica de recuperación de sesiones).