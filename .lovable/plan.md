## Plan de Prueba: banner permanente como primer slide del Hero

**Archivo:** `src/components/HeroSection.tsx`

### Contexto
El slide `HeroSlidePlanPrueba` ya existe en el Hero pero está condicionado por una fecha de fin de promo (`PROMO_END_DATE`). El Plan de Prueba no es una promo temporal — es la oferta de entrada permanente del estudio.

### Cambios

1. **Eliminar la lógica de expiración del Plan de Prueba**
   - Quitar `PROMO_END_DATE` y el estado `showPromo` que dependía de la fecha.
   - El slide `HeroSlidePlanPrueba` siempre se renderiza.

2. **Garantizar que sea el primer slide**
   - Nuevo orden fijo del carrusel: `[plan-prueba, main, ...(dia-madre si aplica)]`.
   - El slide Día de la Madre mantiene su condicional por fecha (sigue siendo estacional) pero se mueve al final para que nunca desplace al Plan de Prueba.
   - Asegurar que el carrusel arranque en index 0 (Plan de Prueba).

### Fuera de alcance
No se modifica el diseño/copy del slide, el CTA, la imagen, ni otras secciones de Index.
