
# Landing Page: Yoga en Las Condes (`/yoga-las-condes`)

## Objetivo
Crear una landing page optimizada para SEO local ("yoga las condes") que agrupe toda la informacion de yoga del estudio: estilos, instructores, horarios, membresias, ubicacion y clase de prueba gratuita.

## Estructura de la pagina

### 1. Hero Section
- Imagen de fondo del estudio (reutilizar imagen existente del salon de yoga)
- H1: "Yoga en Las Condes | Nave Studio"
- Subtitulo con estilos disponibles: Yin, Yang, Vinyasa, Integral, Power
- CTA principal: "Agenda tu clase de prueba gratis"
- CTA secundario: "Ver horarios"

### 2. Estilos de Yoga
- Grid de cards con los 5 estilos (Yin, Yang, Vinyasa, Integral, Power Yoga)
- Cada card con icono, nombre, descripcion breve y beneficios
- Se reutilizan las descripciones ya definidas en `schedule.ts`

### 3. Instructores de Yoga
- Reutilizar `CoachesSection` filtrado por instructores de yoga: Maral, Sol, Rolo, Mar, Val, Amber
- Usando la prop `filterIds` que ya existe en el componente

### 4. Horarios de Yoga
- Tabla/cards con horarios de la semana filtrando solo clases de yoga
- Reutilizar la logica de `weeklyByExperience("yoga")` de `scheduleByExperience.ts`
- CTA a "/horarios" para ver todos

### 5. Membresías de Yoga
- Membresía Yin-Yang Yoga ($39.000/mes, 1 clase/sem)
- Yoga + Ice Bath ($15.000 sesion suelta)
- Boton de suscripcion con links a BoxMagic existentes
- Mencion de la clase de prueba gratis

### 6. Galeria de fotos
- Grid de imagenes del estudio (reutilizar uploads existentes)
- Aspecto visual atractivo con grid responsivo

### 7. Clase de prueba gratuita
- Reutilizar la seccion TrialYogaSection existente con CTA claro

### 8. Ubicacion
- Reutilizar LocationSection existente (mapa, direccion, contacto)

### 9. Footer
- Reutilizar Footer existente

## Archivos a crear/modificar

### Nuevo: `src/pages/YogaLasCondes.tsx`
- Pagina completa con todas las secciones
- Helmet con meta tags SEO optimizados para "yoga las condes"
- Schema.org structured data (LocalBusiness + YogaStudio)
- Facebook Pixel ViewContent tracking
- Todas las imagenes con `loading="lazy"`

### Modificar: `src/App.tsx`
- Agregar lazy import: `const YogaLasCondes = lazy(() => import("./pages/YogaLasCondes"))`
- Agregar ruta: `<Route path="/yoga-las-condes" element={<YogaLasCondes />} />`

### Modificar: `src/components/SEOHead.tsx`
- Agregar entrada SEO para `/yoga-las-condes` con:
  - Title: "Yoga en Las Condes | Yin, Vinyasa, Power Yoga | Nave Studio"
  - Description optimizada con keywords locales
  - Canonical URL
  - Open Graph tags

## Detalles tecnicos

### SEO
- H1 con keyword principal "Yoga en Las Condes"
- Meta description con keywords: yoga las condes, yin yoga, vinyasa, power yoga, santiago
- Schema.org: SportsActivityLocation + YogaStudio con geo, horarios y ofertas
- Canonical: `https://studiolanave.com/yoga-las-condes`
- Alt texts descriptivos en todas las imagenes

### Facebook Pixel
- `trackViewContent` al cargar la pagina con `content_name: "Yoga Las Condes"`
- `trackInitiateCheckout` en botones de suscripcion
- `trackLead` en CTA de clase de prueba

### Performance
- Lazy loading de la ruta via `React.lazy()`
- `loading="lazy"` en todas las imagenes no-hero
- Hero image con `fetchPriority="high"`

### Componentes reutilizados
- `CoachesSection` (con `filterIds` para yoga coaches)
- `LocationSection`
- `Footer`
- `TrialYogaSection`
- Logica de `weeklyByExperience("yoga")` para horarios
