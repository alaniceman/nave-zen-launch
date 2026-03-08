

## Plan: Bugs, SEO, Header SPA nav y CTA sticky mobile

### 1. Corregir bugs

**Footer.tsx**
- Cambiar `© 2025` a `© {new Date().getFullYear()}` (dinámico)
- Cambiar link `/planes` a `/planes-precios`

**ClaseDePrueba.tsx**
- Corregir canonical de `navestudio.cl` a `studiolanave.com`

**NotFound.tsx**
- Traducir a español con branding Nave Studio (colores, tipografía consistente)

**App.css**
- Vaciar el archivo (son estilos legacy de Vite que no se usan)

### 2. CTA sticky en mobile

Crear un nuevo componente `StickyMobileCTA.tsx`:
- Botón fijo en la parte inferior de la pantalla, solo visible en mobile (`md:hidden`)
- Texto: "Clase de prueba gratis" con link a `/clase-de-prueba/agendar`
- Se oculta cuando el usuario está cerca del footer (con IntersectionObserver)
- Se usa en páginas largas: `Experiencias`, `Planes`, `CriomedicinAdsLanding`, `Index`, `YogaLasCondes`

### 3. SEO — ya cubierto por SEOHead.tsx

`SEOHead.tsx` ya maneja meta tags dinámicos para `/`, `/experiencias`, `/contacto`, `/faq` y más. No se necesitan `<Helmet>` adicionales en esas páginas. La única corrección SEO pendiente es el canonical de `ClaseDePrueba.tsx` (incluido en punto 1).

### 4. Header: migrar a React Router

**Header.tsx**
- Importar `useNavigate` de `react-router-dom`
- Reemplazar `window.location.href = href` por `navigate(href)` en la función `navigateTo`
- Reemplazar `window.location.href = '/'` del logo por `navigate('/')`
- Los links externos (`boxmagic.cl`, `members.boxmagic.app`) se mantienen como `<a>` con `target="_blank"`

### Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `src/components/Footer.tsx` | Año dinámico + fix link `/planes-precios` |
| `src/pages/ClaseDePrueba.tsx` | Canonical → studiolanave.com |
| `src/pages/NotFound.tsx` | Traducir a español + branding |
| `src/App.css` | Vaciar contenido legacy |
| `src/components/Header.tsx` | `useNavigate` en vez de `window.location.href` |
| `src/components/StickyMobileCTA.tsx` | **Nuevo** — botón sticky mobile |
| `src/pages/Index.tsx` | Agregar StickyMobileCTA |
| `src/pages/Experiencias.tsx` | Agregar StickyMobileCTA |
| `src/pages/CriomedicinAdsLanding.tsx` | Agregar StickyMobileCTA |
| `src/pages/YogaLasCondes.tsx` | Agregar StickyMobileCTA |

