---
name: Aviso interno de planes de prueba por terminar
description: Correo 09:00 Chile (lunes o cuando hay cambio de estado) a lanave@alaniceman.com y flowithmaral@gmail.com con resumen de planes de prueba
type: feature
---
- Edge function `send-trial-ending-alert`, cron `trial-ending-alert-daily` (12:00 UTC ≈ 09:00 Chile).
- Se envía SOLO si: es lunes en Chile, o cambió la firma de eventos (nuevos registros últimos 7 días, por expirar ≤2 días, ya expirados). Firma guardada en tabla `trial_alert_state` (id `trial_ending_alert`).
- Secciones: nuevos pagados, nuevos por pagar, por terminar ≤2 días, por terminar ≤7 días, terminados últimos 30 días, y pasados a membresía últimos 30 días (`convertido_a_membresia`, excluido del resto).
- Incluye email (mailto) y teléfono como link wa.me normalizado a E.164 chileno.
- Soporta `{"dryRun": true}` para previsualizar HTML y `{"force": true}` para forzar envío.

Botones flotantes (StickyMobileCTA, WhatsAppWidget, CTA sticky de landings) usan el hook
`useScrolledPastHero` para no tapar los CTAs del hero: aparecen sólo tras hacer scroll (~55% del viewport).
