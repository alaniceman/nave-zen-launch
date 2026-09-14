---
name: Aviso interno de planes de prueba por terminar
description: Correo diario 09:00 Chile a lanave@alaniceman.com y flowithmaral@gmail.com con planes de prueba que terminan mañana, por terminar y ya terminados sin membresía
type: feature
---
- Edge function `send-trial-ending-alert`, cron `trial-ending-alert-daily` (12:00 UTC ≈ 09:00 Chile).
- Excluye status `convertido_a_membresia`; secciones: termina mañana, próximos 7 días, terminados últimos 30 días.
- Incluye email (mailto) y teléfono como link wa.me normalizado a E.164 chileno.
- Soporta `{"dryRun": true}` para previsualizar HTML sin enviar.

Botones flotantes (StickyMobileCTA, WhatsAppWidget, CTA sticky de landings) usan el hook
`useScrolledPastHero` para no tapar los CTAs del hero: aparecen sólo tras hacer scroll (~55% del viewport).
