
# Agregar 3 Membresias de Yoga

## Resumen
Actualizar la seccion "Solo Yoga" en la pagina de planes y agregar una seccion equivalente en la pagina de Yoga en Las Condes con las 3 nuevas membresias de yoga.

## Cambios en detalle

### 1. Pagina de Planes (`src/pages/Planes.tsx`) — Seccion "Solo Yoga"

Reemplazar las 2 tarjetas actuales (Membresia Yin-Yang Yoga $39.000 y Yoga + Ice Bath $15.000) por 3 nuevas tarjetas:

| Plan | Sesiones | Precio | Link BoxMagic |
|------|----------|--------|---------------|
| Yoga Esencial | 1/sem | $49.000 | `https://boxmagic.cl/market/plan/oGDPzoy4b5` |
| Yoga Continuo | 2/sem | $69.000 | `https://boxmagic.cl/market/plan/XY0llrA0kV` |
| Yoga Libre | Ilimitadas | $85.000 | `https://boxmagic.cl/market/plan/rq4mapE4JZ` |

- Cambiar el grid de 2 columnas a 3 columnas (`md:grid-cols-3`)
- Marcar "Yoga Continuo" como "Mas popular" (badge warm, borde destacado)
- Marcar "Yoga Libre" con borde accent (similar a Universo)
- Cada tarjeta incluye: nombre, badge con frecuencia, descripcion breve, precio, boton "Suscribirme" con `data-checkout-url` y `data-plan`

### 2. Pagina Yoga Las Condes (`src/pages/YogaLasCondes.tsx`) — Seccion de Membresias

Agregar una nueva seccion **antes** de las membresias generales (Eclipse/Orbita/Universo) con las 3 membresias de solo yoga:

- Titulo: "Membresias Solo Yoga"
- Subtitulo: "Planes exclusivos para tu practica de Yoga"
- Mismas 3 tarjetas (Yoga Esencial, Yoga Continuo, Yoga Libre) con el mismo estilo visual de la pagina
- Mantener la seccion existente de membresias generales debajo, con un separador tipo "Quieres acceso a todas las experiencias?" para diferenciar

### Detalles tecnicos

**Planes.tsx** (lineas 382-423):
- Reemplazar el contenido del `section#solo-yoga` con 3 Cards en grid de 3 columnas
- Cada Card usa `data-checkout-url` con el link de BoxMagic correspondiente
- Cambiar `max-w-4xl` a `max-w-6xl` para acomodar 3 columnas

**YogaLasCondes.tsx** (lineas 52-101 y 303-388):
- Agregar array `yogaMembershipPlans` con los 3 planes de yoga
- Insertar nueva seccion entre horarios y membresias generales
- Renombrar seccion de membresias generales a "Todas las experiencias" para diferenciar

No se crean archivos nuevos ni se modifican tablas de base de datos.
