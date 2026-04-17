

## Plan

Three small changes, no redesign.

### 1. Orden aleatorio (recomendación: por sesión)

Opciones evaluadas:
- **Cada carga de página**: muy fresco pero puede sentirse inestable si el usuario navega y vuelve.
- **Una vez al día (seed por fecha)**: estable durante el día, gratis, sin servidor. Bueno pero todos ven el mismo orden.
- **Por sesión del navegador (recomendado)**: shuffle al montar el componente con `useMemo`. Cero costo de servidor, cero peticiones, el orden se mantiene mientras el usuario navega entre secciones, y cada visitante ve un orden distinto. Es lo más liviano y lo que mejor cumple "que no se sienta repetitivo".

Implementación: Fisher–Yates dentro de un `useMemo(() => shuffle(reviews), [])` en `ReviewsTrustBar.tsx`. El array fuente queda intacto; el shuffle solo afecta el render. La navegación prev/next del modal usa el array ya barajado para mantener consistencia.

Si más adelante prefieres "una vez al día", se puede cambiar trivialmente usando `new Date().toDateString()` como seed.

### 2. Eliminar subtítulo

En `ReviewsTrustBar.tsx`, quitar el `<p>` con `+{reviews.length} reseñas reales de quienes ya vinieron`. Mantener el `<h3>` "Lo que dice la comunidad".

### 3. Agregar 43 nuevas reseñas a `src/data/reviews.ts`

- Append al array existente (IDs 35–77) preservando wording, emojis y "…" donde el original termina truncado.
- Mapear `category` del input al tipo existente:
  - `"Método Wim Hof / Ice Bath"` → `"Ice Bath"` (el tipo actual no tiene WHM separado en la categoría, e Ice Bath ya cubre el flujo de inmersión + breathwork; se mantiene la taxonomía actual sin tocar el `type ReviewCategory`).
  - `"General"` → `"Experiencia"`.
  - `"Yoga + Ice Bath"` → `"Ice Bath"` (la card es chip único; Ice Bath es el diferenciador más fuerte).
- Omitir reseñas sin texto (no hay ninguna vacía en el input, todas pasan).
- No agregar campo `rating` (el modelo actual asume 5★ por defecto y los renderiza fijos).
- No tocar el `type ReviewCategory` ni el componente más allá del shuffle + remoción del subtítulo.

### Archivos tocados
- `src/components/ReviewsTrustBar.tsx` — añadir `useMemo` con shuffle, eliminar subtítulo.
- `src/data/reviews.ts` — append de 43 entradas.

### Lo que NO se toca
- Layout, tarjetas, modal/sheet, swipe, estilos, spacing, motion, navegación.
- `SocialProofSection.tsx`.

