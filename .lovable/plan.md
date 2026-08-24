# Landing /promo-talleres — Pack exclusivo 6 sesiones

Landing privada (solo por link) para los asistentes del Taller Wim Hof del 23 de agosto, con un pack de 6 sesiones que no aparece en ninguna otra parte del sitio.

## La oferta

- 6 sesiones por $60.000 ($10.000 por sesión, vs. $30.000 normal)
- Válidas 3 meses (90 días) desde la compra
- Se pueden usar en Criomedicina / Wim Hof **y** Yoga
- Compartibles: cada sesión llega como un código independiente al correo, y se puede regalar o usar con quien quiera

## La página

Ruta nueva `/promo-talleres`, con el mismo estilo visual de las landings de promo existentes (Marzo Reset / Promo Invierno) y mobile-first:

1. Hero post-taller: "Ya sentiste el frío. Ahora hazlo hábito." + badge "Exclusivo asistentes Taller Wim Hof · 23 agosto"
2. Tarjeta única del pack: precio tachado $180.000 → $60.000, ahorro, 6 sesiones, 3 meses, "compártelas con quien quieras"
3. Bloque de beneficios de continuidad (sistema nervioso, energía, sueño, comunidad)
4. Formulario de compra (nombre, email, teléfono) + campo de cupón, igual al de /bonos
5. Testimonios (`ReviewsTrustBar`) y FAQ de compra (`PurchaseFAQ`)
6. Footer estándar

No se agrega al menú, ni al footer, ni al sitemap; se excluye de indexación (`noindex`) para que sea solo por link.

## Cómo se mantiene oculto el pack

El pack tiene que estar activo para poder cobrarse, pero no debe aparecer en /bonos, en la sección de Criomedicina, en las giftcards ni en el modal de upsell. Para eso se agrega una marca de "pack privado" que esas vistas respetan, y el resto del sitio sigue igual.

## Detalles técnicos

- Migración: `ALTER TABLE public.session_packages ADD COLUMN is_private boolean NOT NULL DEFAULT false;` (sin cambios de RLS/GRANTs).
- Data (`run_sql`): reutilizar el paquete existente `577d13fc-590e-4e9f-a99e-18cc1e62e414` (ya es 6 sesiones / $60.000 / 90 días): renombrar a "Pack Post Taller · 6 Sesiones", `is_active = true`, `is_private = true`, flags `show_in_criomedicina/available_as_giftcard/show_in_upsell_modal = false`, y `applicable_service_ids` con los servicios de Criomedicina/WHM + Yoga activos.
- `src/pages/Bonos.tsx`: agregar `.eq("is_private", false)` al query de paquetes. Mismo filtro donde se listen packs en Criomedicina y en `UpsellModal.tsx` / giftcards.
- Nueva página `src/pages/PromoTalleres.tsx`, ruta lazy en `src/App.tsx`, con `SEOHead`/Helmet en `noindex, nofollow`.
- Compra vía `supabase.functions.invoke("purchase-session-package")` con `promoType: "promo_talleres"`, siguiendo exactamente el patrón de `MarzoReset.tsx` (soporte de cupón, `freeOrder`, redirect a `initPoint`).
- Tracking Meta/GA igual al patrón existente: `ViewContent` al montar y `InitiateCheckout` solo cuando hay `orderId` + `initPoint` y valor > 0, con `deterministicEventId`. Sin cambios en Google Ads ni BoxMagic.
- Los códigos se generan por el flujo actual del webhook de pago (una fila por sesión en `session_codes`, expiración a 90 días), así que la compartibilidad ya queda cubierta.
