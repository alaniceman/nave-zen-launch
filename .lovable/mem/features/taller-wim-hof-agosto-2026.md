---
name: Taller Wim Hof Santiago (agosto 2026)
description: Evento 23 agosto 2026, flujo de inscripción con Mercado Pago dinámico, cupos atómicos y aviso admin
type: feature
---

Landing única en `/taller-wim-hof-santiago-fundamentales-avanzado` (nunca crear slug nuevo).

Evento vigente: domingo 23 de agosto de 2026, Nave Studio (Antares 259, Las Condes).
- Fundamentos: 11:30–15:00, $50.000, event_id `santiago_fundamentos_2026_08_23`, 15 cupos.
- Avanzado: 15:30–19:00, $60.000, event_id `santiago_avanzado_2026_08_23`, 15 cupos. Requiere experiencia previa.

Flujo de pago:
1. Modal pide nombre, apellido, email, celular → edge function `create-taller-preference`.
2. Crea fila en `taller_inscripciones` (status `pending`) y preferencia de Mercado Pago con `external_reference` = UUID de la inscripción.
3. `mercadopago-webhook` → `handleTallerPayment`: idempotente (payment_id único + claim atómico pending→paid), valida monto, reserva cupo con RPC `reserve_event_cupo` y envía email al admin (ADMIN_NOTIFICATION_EMAIL, fallback flowithmaral@gmail.com).
4. Retorno a la landing con `?pago=approved|pending|rejected&order=<id>&nivel=<nivel>` que muestra el banner de estado.

Cupos se leen en vivo desde `event_cupos`; si están agotados el botón se desactiva y se ofrece lista de espera por WhatsApp.
