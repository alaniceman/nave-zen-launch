

## Plan: Banner Promo Marzo Reset justo debajo del Hero en Criomedicina

### Qué se hará

Insertar una sección compacta de la promo "Marzo Reset" entre el Hero (línea 249) y la sección "¿Qué es Criomedicina?" (línea 251) en `src/pages/CriomedicinAdsLanding.tsx`.

La sección se renderiza condicionalmente: solo si `new Date() <= new Date('2026-04-01T02:59:59Z')` (31 de marzo 23:59 hora Chile).

### Diseño

- Fondo gradiente cyan/sky coherente con el estilo Marzo Reset
- Contenido compacto: título "❄️ Promo Marzo Reset", precios (2×$40.000 / 3×$50.000), y botón CTA hacia `/marzo-reset`
- Padding reducido (`py-8`) para que sea una sección "chica"

### Archivo a modificar

- `src/pages/CriomedicinAdsLanding.tsx` — insertar bloque condicional en línea 250 (entre `</section>` del Hero y `{/* Qué es Criomedicina */}`)

