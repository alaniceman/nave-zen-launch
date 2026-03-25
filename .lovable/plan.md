

## Plan: Enviar promo Icefest a compradores con paquetes agotados/por agotarse

### Resumen
Crear una edge function `send-icefest-promo` siguiendo el mismo patron de `send-marzo-reset-promo`, que identifique compradores con 0 o 1 sesion restante y les envie un email promocional de Icefest con link a `/icefest`.

### Pasos

**1. Crear edge function `send-icefest-promo`**
- Mismo patron que `send-marzo-reset-promo`: query a `session_codes`, agrupar por `buyer_email`, filtrar quienes tienen 0 o 1 codigos sin usar
- HTML del email con branding de Icefest (gradiente cyan/azul, snowflakes)
- Contenido: saludo personalizado, mencion de que vimos que se les estan acabando o ya se acabaron las sesiones, detalle de la promo (6 sesiones por $60.000, validas 6 meses, compartibles), CTA a `https://studiolanave.com/icefest`
- Rate limit 600ms entre envios (Resend)
- Modo preview con `previewEmail` para testear antes

**2. Desplegar y ejecutar**
- Deploy de la edge function
- Invocar la funcion para enviar los emails

### Detalle tecnico
- Query: `session_codes` agrupados por `buyer_email`, filtrar `remaining <= 1`
- Subject: algo como "🧊 Icefest — 6 sesiones de Criomedicina por $60.000"
- From: `Studio La Nave <agenda@studiolanave.com>`
- Reply-to: `lanave@alaniceman.com`

