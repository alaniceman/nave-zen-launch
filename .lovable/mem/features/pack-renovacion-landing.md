---
name: Landing /pack-renovacion para renovación 1 a 1
description: Landing privada /pack-renovacion vende el pack privado 577d13fc (6 sesiones $60.000, Criomedicina/WHM + Yoga) para enviar link uno a uno a clientes que renuevan; sin expiración ni countdown
type: feature
---

- `/pack-renovacion` (src/pages/PackRenovacion.tsx) es una landing privada (noindex, sin links en menú/footer/sitemap) pensada para enviar el link uno a uno a clientes para que renueven.
- Reutiliza el pack privado `577d13fc-590e-4e9f-a99e-18cc1e62e414` (6 sesiones, $60.000, 90 días de vigencia de códigos, Criomedicina/WHM + Yoga, `is_private = true`).
- A diferencia de /promo-talleres: NO tiene countdown ni fecha de expiración de la oferta; copy orientado a renovación ("Sigue entrenando el frío. Renueva tu práctica.").
- Compra vía `purchase-session-package` con `promoType: "pack_renovacion"`; cupones permitidos; códigos compartibles generados por el webhook.
