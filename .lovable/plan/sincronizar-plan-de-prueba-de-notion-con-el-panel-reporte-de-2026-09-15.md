# Sincronizar plan de prueba de Notion con el panel + reporte de KPIs

Conector: Alan's Notion (1). Reporte a lanave@alaniceman.com.

## Qué se hará

1. **Leer Notion (tabla Clientes)**
   - Traer todas las fichas cuyo estado o tipo indique plan de prueba (Estado "plan de prueba 7"/"plan de prueba 15"/"Lead", Tipo de membresía "Plan de prueba", o campo Plan de Prueba con valor).
   - De cada ficha: nombre, mail, WhatsApp, fechas, Tipo de membresía y Estado actual.

2. **Detectar quién pasó a membresía**
   - Si en Notion el Tipo de membresía ya no es "Plan de prueba" y coincide con un plan real (Universo, Órbita, Eclipse, Yoga Esencial, Yoga Continuo, Yoga Libre), ese cliente cuenta como convertido.
   - En el panel: crear la membresía en la ficha del cliente (buscado por correo) con el plan correspondiente, estado activa y fecha de inicio la del primer pago de membresía en Notion; marcar su plan de prueba como "convertido a membresía" y registrar el evento en su historial.

3. **Detectar quién compró un paquete de sesiones**
   - Si el Tipo de membresía en Notion corresponde a un paquete (por ejemplo "8 sesiones de yoga", "Icefest - 6 sesiones", "3 sesiones método Wim Hof", promos de 2/4/5 sesiones), se anota en la ficha del cliente en el panel como evento de compra de paquete, cruzando primero con los códigos de sesiones que ya existan en el sistema para no duplicar.
   - Si el paquete ya está registrado en el panel, no se toca nada.

4. **Reporte por correo con KPIs**
   - Se envía a lanave@alaniceman.com con: total de planes de prueba leídos, convertidos a membresía y tasa de conversión, desglose por plan (7 vs 15 días) y por membresía de destino, cuántos compraron paquete en lugar de membresía, cuántos siguen sin comprar nada, ingresos estimados de las conversiones, lista de fichas actualizadas y lista de casos que no se pudieron cruzar (correo distinto o plan ambiguo) para revisión manual.

## Criterios y salvaguardas

- El cruce Notion ↔ panel se hace por correo normalizado (minúsculas, sin espacios). Nadie se crea dos veces: si el correo no existe en el panel, el caso va a la lista de revisión manual en vez de inventar un cliente.
- Notion no se modifica: solo se lee.
- Hay dos planes llamados "Universo" en el panel ($89.990 y $95.000); se usará el vigente de $95.000 y se avisará en el reporte.
- Nombres de membresía ambiguos en Notion ("Otro", "Acceso Ilimitado", "plan duo", "Ilimitado con descuento Maral", anuales) no se asignan automáticamente: quedan listados para que decidas.

## Detalles técnicos

- Lectura Notion vía gateway (`/v1/data_sources/649c6d6d-.../query`, Notion-Version 2025-09-03) con paginación por cursor.
- Escrituras en `customer_memberships` (plan de `membership_plans` por nombre), `customer_events` (evento de conversión o de paquete) y `trial_bookings.status = 'convertido_a_membresia'` con nota en `admin_notes`.
- El reporte se envía con Resend desde una nueva edge function `send-notion-reconciliation-report` (HTML con el estilo de los correos actuales, Helvetica Neue, #2E4D3A), reutilizable si quieres repetir la revisión más adelante.
- Sin cambios de UI.
