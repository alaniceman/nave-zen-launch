

## Plan: Promo Icefest ❄️

### Resumen
Crear una promoción "Icefest" de 6 sesiones de Criomedicina por $60.000, compartibles, válida por 10 días, con landing page propia en `/icefest`.

### Pasos

**1. Crear el paquete en la base de datos**
- Insertar un nuevo `session_package` con: name "Icefest — 6 Sesiones", 6 sesiones, $60.000, validity_days 180 (6 meses para usarlas), `is_active = true`, `show_in_criomedicina = false`, `available_as_giftcard = true`.

**2. Crear la landing page `src/pages/Icefest.tsx`**
- Basada en el patrón de `MarzoReset.tsx`: hero con estética ice/frost, formulario de compra, beneficios de Criomedicina.
- Datos clave: 6 sesiones por $60.000 ($10.000/sesión), compartibles, 6 meses de validez.
- Badge de urgencia: "Solo por 10 días" con fecha de expiración automática.
- SEO con Helmet.
- Checkout vía `purchase-session-package` edge function con `isGiftCard: true`.

**3. Registrar la ruta en `src/App.tsx`**
- Lazy import de `Icefest` y ruta `/icefest`.

### Archivos
- `src/pages/Icefest.tsx` — nueva landing
- `src/App.tsx` — agregar ruta
- Base de datos — insertar paquete en `session_packages`

### Detalle técnico
- La expiración de 10 días se calcula desde la fecha de deploy (hoy 22 marzo → expira 1 abril 2026).
- La página muestra un countdown o se auto-oculta después de la fecha límite, redirigiendo a `/bonos`.
- Precio por sesión: $10.000 vs precio normal ~$30.000 (67% descuento).

