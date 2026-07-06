# Plan: Páginas SEO para Estilos de Yoga

## Objetivo

Captar tráfico cualificado que busca clases de yoga específicas en Las Condes, con doble estrategia: landing pages de conversión + artículos de blog educativos para los 4 estilos principales.

## 1. Arquitectura de URLs

```
LANDING PAGES (conversión)
/yoga/yin-yoga-las-condes
/yoga/vinyasa-yoga-las-condes
/yoga/power-yoga-las-condes
/yoga/integral-yoga-las-condes

ARTÍCULOS DE BLOG (SEO informativo)
/blog/yin-yoga-beneficios-movilidad-flexibilidad
/blog/vinyasa-yoga-flujo-respiracion-las-condes
/blog/power-yoga-fuerza-resistencia
/blog/integral-yoga-equilibrio-meditacion
```

## 2. Landing Pages de Conversión (4 páginas)

Cada landing sigue la estructura de `/yoga-las-condes` pero focalizada en un solo estilo:

- **Hero**: Imagen del estudio + H1 con keyword ("Yin Yoga en Las Condes | Nave Studio")
- **Qué es este estilo**: Descripción expandida del estilo (reutilizando y enriqueciendo copia existente)
- **Beneficios**: 3-4 bullets con iconos
- **Instructor(es)**: Tarjeta(s) del coach que dicta este estilo con link a su perfil
- **Horarios**: Grid de días/horarios filtrados SOLO para este estilo
- **Para quién es**: Público objetivo del estilo
- **CTA primario**: "Activa tu plan de prueba" → /plan-de-prueba
- **CTA secundario**: "Ver membresías solo yoga" → /planes-precios
- **SEO**: Helmet (title, description, canonical, og:*), JSON-LD `SportsActivityLocation`

### Contenido sugerido por landing


| Estilo        | Instructor principal | H1 sugerido                                       |
| ------------- | -------------------- | ------------------------------------------------- |
| Yin Yoga      | Amanda Moutel        | Yin Yoga en Las Condes — Flexibilidad y Calma     |
| Vinyasa Yoga  | Mar Carrasco         | Vinyasa Yoga en Las Condes — Flujo y Respiración  |
| Power Yoga    | (según horario)      | Power Yoga en Las Condes — Fuerza y Desafío       |
| Integral Yoga | Maral Hekmat         | Integral Yoga en Las Condes — Equilibrio Completo |


## 3. Artículos de Blog (4 páginas)

Cada artículo sigue el patrón de `BlogWimHof.tsx` (Helmet + JSON-LD Article + hero + contenido largo + CTA final):

- **Longitud**: 800-1200 palabras
- **Estructura**: Intro, qué es, beneficios científicos, para quién, cómo empezar, diferencias con otros estilos, CTA
- **SEO**: Schema `Article` con author, datePublished, keywords
- **Cross-linking**: Links a la landing page del mismo estilo + a `/yoga-las-condes`

### Títulos sugeridos


| Estilo        | Título del artículo                                                            |
| ------------- | ------------------------------------------------------------------------------ |
| Yin Yoga      | Yin Yoga: qué es, beneficios y por qué cambia tu cuerpo desde la primera clase |
| Vinyasa Yoga  | Vinyasa Yoga: el arte de moverte con la respiración en Las Condes              |
| Power Yoga    | Power Yoga: fuerza, resistencia y foco en una sola práctica                    |
| Integral Yoga | Integral Yoga: el equilibrio perfecto entre fuerza, flexibilidad y meditación  |


## 4. Archivos a Crear / Modificar

### Nuevos archivos (8 páginas)

- `src/pages/yoga/YinYogaPage.tsx`
- `src/pages/yoga/VinyasaYogaPage.tsx`
- `src/pages/yoga/PowerYogaPage.tsx`
- `src/pages/yoga/IntegralYogaPage.tsx`
- `src/pages/blog/BlogYinYoga.tsx`
- `src/pages/blog/BlogVinyasaYoga.tsx`
- `src/pages/blog/BlogPowerYoga.tsx`
- `src/pages/blog/BlogIntegralYoga.tsx`

### Archivos a editar

- `src/App.tsx` — agregar 8 rutas lazy-loaded
- `src/pages/Blog.tsx` — agregar 4 tarjetas de nuevos artículos al grid
- `src/pages/YogaLasCondes.tsx` — convertir las cards de estilos en links a sus landings
- `public/sitemap.xml` — agregar 8 URLs nuevas

### Assets opcionales

- Hero images para cada landing (reutilizar fotos del estudio o generar/imagen optimizada)

## 5. SEO Técnico

- **Helmet** en cada una de las 8 páginas (title < 60 chars, description < 160 chars)
- **Canonical** y **og:url** apuntando a sí mismas
- **JSON-LD**: `SportsActivityLocation` en landings, `Article` en blogs
- **BreadcrumbList** schema en todas
- **Meta keywords** en Article schema (no en HTML meta, obsoleto)

## 6. Cross-Linking Estratégico

```
Blog (informativo) → Landing (conversión) → Plan de Prueba (checkout)
YogaLasCondes (hub) → Cada landing específica
Cada landing → Horarios filtrados + Instructor + Membresías
```

## 7. Estimación


| Fase                                | Páginas | Complejidad                                                       |
| ----------------------------------- | ------- | ----------------------------------------------------------------- |
| Landing pages                       | 4       | Media — reutiliza componentes existentes (horarios, coaches, CTA) |
| Artículos de blog                   | 4       | Media — patrón de blog existente, requiere redacción de contenido |
| Integración (rutas, sitemap, links) | —       | Baja                                                              |


## Preguntas para confirmar

1. ¿Te parece bien la estructura de URLs `/yoga/estilo-las-condes` y `/blog/titulo-seo`?  
si
2. ¿Prefieres que redacte el contenido de los 8 textos yo, o me envías borradores?  
redacta tu los textos
3. ¿Las imágenes hero pueden ser reutilizadas del estudio o quieres una imagen específica por estilo?  
reutiliza imagenes del studio  
  
preocupate del seo, bien estructurado para aparecer en las búsquedas
4. &nbsp;