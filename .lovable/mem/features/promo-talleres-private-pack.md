---
name: Landing /promo-talleres y packs privados
description: Pack Post Taller de 6 sesiones ($60.000, 90 días) vendido solo en /promo-talleres; flag is_private oculta packs de las vistas públicas
type: feature
---

- `/promo-talleres` es una landing privada (noindex, sin links en menú/footer/sitemap) para asistentes del Taller Wim Hof.
- Vende el pack `577d13fc-590e-4e9f-a99e-18cc1e62e414` = "Pack Post Taller · 6 Sesiones": $60.000, 6 sesiones, `validity_days = 90`, aplicable a Criomedicina/WHM + Yoga.
- `session_packages.is_private` (boolean) marca packs que deben estar activos para cobrarse pero NO listarse. Todas las vistas públicas de packs filtran `is_private = false`: Bonos, GiftCards, CriomedicinMetodoWimHof, CriomedicinAdsLanding, UpsellModal. Cualquier vista nueva que liste paquetes debe agregar ese filtro.
- Compra vía `purchase-session-package` con `promoType: "promo_talleres"`; códigos compartibles (1 por sesión) generados por el webhook.
