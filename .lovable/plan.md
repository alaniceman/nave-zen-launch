# Mejorar la experiencia de destino de /yoga-las-condes y /yoga/*

Objetivo: subir el nivel de calidad en Google Ads para búsquedas genéricas de yoga, acelerar el móvil y aumentar conversión, sin rediseñar nada y reutilizando componentes existentes.

## Lo que verifiqué antes de planificar

- **No existe ninguna referencia a AlbertSans ni a capcut en el código.** Esa fuente la inyecta un script de terceros en tiempo de ejecución (el candidato más probable es el pixel de Meta con su módulo "smart setup", que también es el que llama a `mpc-prod-...run.app/events/...`). Diagnóstico no confirmado: el primer paso será reproducirlo en el navegador y ver qué script inserta el `<link>`/`@font-face` antes de tocar nada.
- **Sí hay peticiones de fuentes a terceros propias del sitio**: `index.html` carga Inter y Space Grotesk desde `fonts.googleapis.com` / `fonts.gstatic.com` (preconnect + preload + stylesheet). Se auto-alojarán.
- **Las 4 páginas de estilo actuales sí tienen `<title>`, description y canonical propios vía `react-helmet-async`** (verificado en Yin, Vinyasa, Power e Integral). El título genérico que viste corresponde al HTML estático: Helmet actualiza el head recién en el cliente, así que los rastreadores que no ejecutan JS ven el título del `index.html`. Se corrige extendiendo el script de pre-hidratación que ya existe en `index.html` (hoy cubre `/instructor/*` y `/blog/*`) para incluir las 7 rutas `/yoga/*`.
- Typo confirmado: "fluego" en `VinyasaYogaPage.tsx` y "Regulá tu sistema nervioso" en `YogaLasCondes.tsx`.
- Solo existen 4 rutas `/yoga/*`; faltan Yang, Vinyasa Somático y Power Vinyasa.
- Ya existen los componentes a reutilizar: `ReviewsTrustBar` (muro de reseñas, acepta `items`/`filters`), `CoachesSection` (`filterIds`), `LocationSection`, `StickyMobileCTA`, `Accordion`, `useScheduleEntries` + `coachSync`.

## Parte 1 — Transversal

**Velocidad**
- Auto-alojar Inter y Space Grotesk (woff2 en `public/fonts`) con `@font-face` + `font-display: swap` en `src/index.css`; eliminar preconnect/preload/stylesheet a Google Fonts de `index.html`. Cero peticiones de fuentes a terceros.
- Auditar imágenes de instructoras, galería y reseñas: `loading="lazy"` + `width`/`height` explícitos. Hero de cada landing: `loading="eager"` + `fetchPriority="high"`.
- Carruseles de instructoras: generar la duplicación del loop en runtime (no en el HTML inicial) para no renderizar tarjetas repetidas.

**Tracking — fuera de esta tanda (solo diagnóstico)**
- No se toca el pixel de Meta ni la configuración de gtag / `AW-18275451491`, y no se elimina nada que dispare `rmkt/collect`: la llamada principal del tag responde 200, así que el tag mide bien y ese 503 es de un endpoint secundario. Se revisa aparte, con verificación.
- Si se confirma que la fuente AlbertSans desde `lf16-web-buz.capcut.com` la inyecta el módulo de Meta, solo se reporta el hallazgo; no se desactiva nada en este trabajo. Por eso el objetivo de fuentes en esta tanda es: cero peticiones de fuentes a terceros originadas por el código del sitio (Google Fonts auto-alojadas).


**CTA fijo móvil**
- Extender `StickyMobileCTA` a dos botones: "Plan de prueba $9.900" (primario, `/plan-de-prueba`) y "Escríbenos por WhatsApp" (secundario, `wa.me/56946120426`), con `padding-bottom` en el documento y oculto en desktop.

**Franja de prueba social (componente nuevo)**
- `src/components/SocialProofStrip.tsx`: estático, sin carrusel ni JS, "5,0" + 5 estrellas + "+200 reseñas reales en Google" y 3 citas cortas (≤90 caracteres) con atribución, recibidas por props. No reemplaza el muro de `ReviewsTrustBar`.

## Parte 2 — /yoga-las-condes

- Reordenar secciones: hero → franja de prueba social → horarios → planes y precios → sección nueva "Un centro de yoga presencial en Las Condes" → 7 estilos → FAQ → muro de reseñas → instructoras → Ice Bath opcional → ubicación. Sin cambiar el contenido ni el diseño de cada sección.
- Hero: línea de datos compactos bajo el H1 (Antares 259 · Metro Los Dominicos · desde $49.000/mes · 60 min de lunes a domingo), manteniendo los dos CTA actuales.
- Sección nueva de 150–200 palabras en prosa, con el estilo visual actual, cubriendo presencialidad, sin experiencia previa, qué llevar (ropa cómoda y botella; mats, cojines, mantas y bloques sin costo), 60 min y 2 veces por semana, y reserva por BoxMagic o WhatsApp.
- Corregir "Regulá" → "Regula".

## Parte 3 — Template de las 7 páginas de estilo

Se extrae un template compartido para no repetir 7 veces la misma estructura; cada página aporta solo sus datos (nombre, beneficios, texto, filtros de horario y reseñas).

- **Metadata**: title `"[Estilo] en Las Condes — Clases Presenciales | Nave Studio"`, description con el beneficio del estilo + "Plan de prueba 7 días $9.900. Antares 259.", canonical propio y Open Graph. Además, entrada por ruta en el script de pre-hidratación de `index.html` para que el título correcto exista también sin JS.
- **Hero**: H1 actual + línea de datos desde la parrilla real ("Próxima clase: [día] [hora] con [instructora] · Antares 259 · 60 min · desde $49.000/mes"). Un solo CTA primario; "Ver horarios" como link de texto.
- **Prueba social**: franja 1.4 bajo el hero, con reseñas reales filtradas por la instructora del estilo según el mapeo indicado; fallback a reseñas "Yoga" de Comunidad Nave. Texto de reseñas sin editar.
- **Unificación de identidad previa al filtro**: Mariela Carrasco y Mar Carrasco son la misma persona. Antes de aplicar el filtro de reseñas se unifica el nombre en todo el sitio a **Mar Carrasco** (reseñas con autora "Alumna de Mariela" pasan a "Alumna de Mar", alias en `coachSync`, y cualquier otra mención en páginas o datos), sin editar el texto de las reseñas.

- **Horarios**: formato hora · nombre de clase · instructora; primero coincidencias exactas del estilo y debajo un subgrupo "También con [estilo] en la clase" con las clases relacionadas. Botón "Reservar" por bloque que abre WhatsApp con mensaje prellenado.
- **Nuevas secciones**: "Tu primera clase de [Estilo]" (4 datos), precios Solo Yoga ($49.000 / $69.000 "Más popular" / $85.000 con la nota del Plan de Prueba, reutilizando el bloque de /yoga-las-condes), FAQ del estilo en el mismo acordeón (4 preguntas, incluida la del Ice Bath opcional con el requisito de una sesión guiada previa de Método Wim Hof) y ubicación con Antares 259, Metro Los Dominicos, estacionamiento y link a Google Maps.
- **Instructoras**: encabezado "Quién guía tu clase de [Estilo]" con subtítulo basado en las credenciales reales de su ficha.
- **Orden final** según el punto 3.11.
- **Typos**: "fluego" → "fluir" y revisión del resto de páginas.
- **Páginas nuevas** con el mismo template: `/yoga/yang-yoga-las-condes`, `/yoga/vinyasa-somatico-las-condes`, `/yoga/power-vinyasa-las-condes`, enlazadas desde las tarjetas de estilo y agregadas a `sitemap.xml`.

## Parte 4 — JSON-LD

En /yoga-las-condes y en cada página de estilo: `LocalBusiness`/`HealthClub` (Nave Studio, Antares 259, +56946120426, priceRange, `openingHoursSpecification` derivado de la parrilla real), `FAQPage` con las preguntas visibles palabra por palabra, `AggregateRating` 5,0 solo donde las reseñas estén visibles, y `Course`/`Event` por bloque horario solo si los datos calzan sin forzarlos.

## Verificación antes de entregar

- Navegar en el navegador entre las 7 páginas de estilo y confirmar que el título de la pestaña y la meta description cambian.
- Confirmar en la pestaña de red que no queda ninguna petición de fuentes a dominios de terceros.
- Reportar qué eran los dos endpoints con 503 y qué se hizo con cada uno.

## Nota honesta

La metadata por ruta seguirá aplicándose en el cliente (más el pre-render del script de `index.html`). Para que cada página entregue su head y su contenido ya renderizados en el servidor, la app puede pasarse a la plantilla más nueva de Lovable con SSR — [lo que gana con ese cambio](https://lovable.dev/blog/building-apps-using-tanstack-start). No es obligatorio para este trabajo.
