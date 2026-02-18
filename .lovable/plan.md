
Configuraré el campo `reply-to` en todos los correos electrónicos enviados a través de Resend para que apunten a `lanave@alaniceman.com`. Esto permitirá que cuando los clientes respondan a los correos automáticos, el mensaje llegue directamente a la dirección de contacto del estudio.

### Cambios a realizar:

1.  **Actualización de Funciones del Backend (Edge Functions):**
    *   **book-trial-class**: Se agregará `reply_to: "lanave@alaniceman.com"` en los correos de confirmación al usuario y notificaciones internas.
    *   **send-booking-confirmation**: Se agregará el campo `reply_to` en el correo de confirmación de reserva.
    *   **send-booking-reminder**: Se agregará el campo `reply_to` en el correo recordatorio de sesión.
    *   **send-session-feedback**: Se agregará el campo `reply_to` en el correo de solicitud de feedback.
    *   **send-session-codes-email**: Se agregará el campo `reply_to` en el correo de envío de códigos de sesión.
    *   **send-abandonment-email**: Se agregará el campo `reply_to` en el correo de recuperación de carrito abandonado.
    *   **send-instructor-summary**: Se agregará el campo `reply_to` en el correo de resumen para el instructor.
    *   **send-package-depletion-alert**: Se agregará el campo `reply_to` en el correo de alerta de paquetes agotados y se corregirá un pequeño error tipográfico en la dirección de destino (`lanve` -> `lanave`).

### Detalles técnicos:
*   Se utilizará la propiedad `reply_to` (con guion bajo) que es el estándar aceptado tanto por la librería de Resend en Node/Deno como por su API REST directamente.
*   Esto asegura consistencia en todas las comunicaciones automáticas del estudio (confirmaciones, recordatorios, códigos y feedback).

Una vez aplicados los cambios, los correos seguirán saliendo desde `agenda@studiolanave.com` (o la dirección configurada), pero cualquier respuesta manual del usuario se dirigirá a `lanave@alaniceman.com` automáticamente.