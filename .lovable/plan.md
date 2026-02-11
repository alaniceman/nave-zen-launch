
# Reporte de Agotamiento de Codigos y Notificacion por Email

## Resumen

Se implementaran dos funcionalidades:

1. **Seccion en el Dashboard** que muestre compradores cuyos paquetes estan por agotarse o ya agotados (basado en `buyer_email` + `mercado_pago_payment_id` como agrupador de compra).
2. **Email automatico** a `lanve@alaniceman.com` cuando a un comprador le quede 1 codigo o menos sin usar de una compra, disparado al momento de usar un codigo en `create-booking`.

## Parte 1: Email automatico al usar un codigo

**Archivo:** `supabase/functions/create-booking/index.ts`

Despues de marcar un codigo como usado (linea ~385), agregar logica que:

1. Busque todos los `session_codes` del mismo comprador con el mismo `mercado_pago_payment_id` (esto agrupa los codigos por compra/paquete).
2. Cuente cuantos quedan sin usar (`is_used = false`).
3. Si quedan **1 o 0 codigos disponibles**, envie un email a `lanve@alaniceman.com` usando una nueva edge function.

**Nueva edge function:** `supabase/functions/send-package-depletion-alert/index.ts`

- Recibe: `buyerName`, `buyerEmail`, `buyerPhone`, `packageName`, `totalCodes`, `remainingCodes`, `usedCode`.
- Envia un email a `lanve@alaniceman.com` via Resend con asunto como "Alerta: [Nombre] agoto/casi agoto su paquete [Paquete]".
- Incluye datos del comprador y un CTA para contactarlo.

## Parte 2: Seccion en el Dashboard

**Archivo:** `src/pages/admin/AdminDashboard.tsx`

Agregar una nueva seccion/tabla al final del dashboard llamada **"Paquetes por Agotarse"** que muestre:

- Nombre del comprador
- Email
- Telefono
- Nombre del paquete
- Codigos totales / usados / restantes
- Estado (badge): "Agotado" (rojo), "Ultimo codigo" (amarillo), "Activo" (verde)

**Logica de datos:**

La query agrupara `session_codes` por `buyer_email` + `mercado_pago_payment_id` (identificador de compra) y calculara totales/usados. Se mostraran solo las compras con 1 o menos codigos restantes para mantener la tabla limpia y util.

Esto se cargara como una query adicional en `loadDashboardData()` sin filtro de fecha (queremos ver todos los paquetes activos que esten por agotarse, no solo los del periodo seleccionado).

## Detalle Tecnico

### Cambios en `create-booking/index.ts` (despues de linea 385):

```text
// Despues de marcar el codigo como usado:
// 1. Obtener mercado_pago_payment_id del sessionCode actual
// 2. Buscar todos los codigos hermanos (mismo payment_id)
// 3. Contar restantes
// 4. Si restantes <= 1, invocar send-package-depletion-alert
```

### Nueva edge function `send-package-depletion-alert/index.ts`:

- Usa Resend (secret `RESEND_API_KEY` ya existe)
- From: `agenda@studiolanave.com`
- To: `lanve@alaniceman.com`
- Contenido: datos del comprador + cuantos codigos le quedan + link a WhatsApp del comprador

### Cambios en `AdminDashboard.tsx`:

- Nueva query a `session_codes` con join a `session_packages`
- Agrupacion client-side por `buyer_email` + `mercado_pago_payment_id`
- Tabla con filtro visual: solo mostrar paquetes con <= 1 codigo restante
- Columnas: Comprador, Email, Telefono, Paquete, Total, Usados, Restantes, Estado

### Configuracion `supabase/config.toml`:

- Agregar `[functions.send-package-depletion-alert]` con `verify_jwt = false`

### Archivos a crear/modificar:

| Archivo | Accion |
|---|---|
| `supabase/functions/send-package-depletion-alert/index.ts` | Crear |
| `supabase/functions/create-booking/index.ts` | Modificar (agregar check post-uso) |
| `src/pages/admin/AdminDashboard.tsx` | Modificar (agregar seccion) |
| `supabase/config.toml` | Modificar (agregar config de nueva funcion) |
