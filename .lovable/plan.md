## Objetivo
Eliminar el fondo blanco visible en los laterales de la barra flotante "Pregúntale a Nave AI", haciendo que ese espacio coincida con el color de la sección siguiente (`bg-neutral-light`), sin alterar el color de la caja de búsqueda en sí.

## Cambio propuesto
- En `src/components/AskNaveBar.tsx`, añadir la clase `bg-neutral-light` al contenedor exterior del componente cuando `overlap === true`.
- El contenedor interior (`max-w-2xl`) conserva su `bg-background` blanco, su borde, sombra y bordes redondeados.
- Esto hará que los padding laterales (`px-4 sm:px-6`) y cualquier espacio fuera del ancho máximo adopten el color gris claro de la sección de SocialProof, logrando una transición visual limpia.

## Nota técnica
Dado que el contenedor tiene posicionamiento absoluto y `translate-y-1/2`, la mitad superior de la franja `bg-neutral-light` quedará superpuesta sobre el final del hero. Se verificará que este cambio no genere choque visual con el fondo del hero (azul oscuro).