## Objetivo
El correo interno "lead completó solo el paso 1" debe llegar únicamente cuando efectivamente el lead no completó el paso 2 — al mismo tiempo que se envía el mail de recuperación al usuario (≥1h de abandono).

## Cambios

1. **`supabase/functions/submit-plan-prueba-lead/index.ts`**
   - Eliminar el envío inmediato de notificación admin cuando se guarda el lead en estado `interesado_plan_prueba` (paso 1).
   - Mantener el insert en `trial_bookings` igual que ahora.

2. **`supabase/functions/send-plan-prueba-recovery/index.ts`**
   - En el mismo ciclo donde ya identifica leads con `status = 'interesado_plan_prueba'` y >1h sin completar, y antes/después de enviar el mail de recuperación al usuario, disparar también el mail admin a `lanave@alaniceman.com` (BCC `flowithmaral@gmail.com`) con los datos del lead (nombre, email, teléfono, hora del paso 1).
   - Usar el mismo flag `recovery_email_sent_at` para evitar duplicados: si ya está seteado, no reenviar ni admin ni usuario.
   - Respetar el límite de 2 req/s de Resend al enviar ambos correos por lead.

## Resultado
- Si el lead completa el paso 2 dentro de 1h → no llega mail admin de abandono (comportamiento nuevo).
- Si el lead no completa en 1h → llega mail admin + mail de recuperación al usuario simultáneamente, una sola vez.
