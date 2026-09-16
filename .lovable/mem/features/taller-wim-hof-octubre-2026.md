---
name: Taller Wim Hof Santiago (octubre 2026)
description: Edición 3 y 4 de octubre 2026, cupos, email de confirmación con grupo de WhatsApp y agradecimiento con encuesta
type: feature
---

Landing única en `/taller-wim-hof-santiago-fundamentales-avanzado` (nunca crear slug nuevo).

Edición vigente (nombre visible «Fundamentales», key interna `fundamentos`):
- Fundamentales: sábado 3 de octubre de 2026, 11:30–15:00 (mostrar siempre «3,5 horas»), $50.000, event_id `santiago_fundamentos_2026_10_03`, 15 cupos.
- Avanzado: domingo 4 de octubre de 2026, 11:30–15:00, $60.000, event_id `santiago_avanzado_2026_10_04`, 15 cupos. Requiere experiencia previa e incluye **The Snake** (práctica guiada de foco y calor interno; sin promesas de resultados, se mantienen requisitos y contraindicaciones).

Fuente de verdad: `supabase/functions/_shared/talleres.ts` (fechas, horarios, valores, eventId, thankYouDateISO, URL del grupo de WhatsApp y de la encuesta). `src/pages/TallerSantiago.tsx` tiene copia client-side que debe mantenerse sincronizada.

Flujo de pago igual que antes (create-taller-preference + mercadopago-webhook, cupo atómico vía `reserve_event_cupo`, validación de monto y cupones). El email al participante solo se envía con pago aprobado, es idempotente y su **Paso 1 destacado** es entrar al grupo de WhatsApp `https://chat.whatsapp.com/H9sRekuU8Mh1VPZdCqMe1t?mode=gi_t` (ahí se comparten fotos y actualizaciones).

Agradecimiento + encuesta: `send-taller-thankyou` corre con cron `taller-thankyou-octubre-2026` (`0 13 4,5 10 *` = 10:00 Chile del 4 y 5 de octubre), protegido por header `x-cron-token` validado contra `internal_cron_tokens` (sin tokens en código; sin token responde 401). Idempotencia durable por `taller_thankyou_logs.inscripcion_id` UNIQUE; reintenta solo los `failed`. Encuesta: `https://tally.so/r/yPGbxX`.

El cron antiguo `send-post-taller-lastday-2026-08-31` fue eliminado para que no llegue contenido de agosto a los participantes de octubre.

Reintentos y anti-duplicados del agradecimiento (revisión final):
- Cron `taller-thankyou-octubre-2026` = `0 13-21 4,5 10 *` (cada hora, 10:00–18:00 Chile, el 4 y 5 de octubre).
- Cada corrida salta `sent` y `pending/in flight`; solo reintenta `failed` con transición atómica condicional (`update ... eq('status','failed').select()` y comprobación de fila devuelta). Nunca reintenta `pending` automáticamente porque Resend pudo haber aceptado el envío y fallar solo el UPDATE.
- Cabecera `Idempotency-Key: taller-thankyou-<inscripcion_id>` (válida 24h en Resend) para que los reintentos del mismo día no dupliquen; se guarda `resend_email_id` e `idempotency_key` en `taller_thankyou_logs`.
- `dryRun` es solo lectura: cuenta pagados, por enviar, ya enviados, en vuelo y reintentables; no reclama, no modifica ni envía.
- Nombre del participante escapado en HTML; saludo neutro «Hola 👋» si no hay nombre. Solo POST (OPTIONS para preflight, GET → 405); errores genéricos, sin detalles sensibles.
