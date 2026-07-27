# Email masivo: Promo de Invierno a compradores de paquetes

## Audiencia (confirmado en BD)
- **7 personas** con paquetes agotados en los últimos 60 días (todas sus sesiones marcadas `is_used`, último uso ≥ hoy - 60 días).
- **32 personas** con 1 o 2 sesiones restantes en sus paquetes/giftcards vigentes.
- Total ≈ **39 destinatarios únicos** (deduplicados por email; si alguien califica en ambos grupos se envía una sola vez, priorizando el mensaje de "agotado").

Fuente: `session_codes` con `mercado_pago_payment_id IS NOT NULL`, agrupado por `buyer_email`.

## Nuevo Edge Function: `send-invierno-promo-recovery`
Basado en el patrón existente de `send-icefest-promo` / `send-marzo-reset-promo`:

- Endpoint POST con soporte `previewEmail` (para testeo) y modo producción.
- Rate limit 600ms entre envíos (regla del proyecto: Resend 2 req/s).
- From: `Nave Studio <agenda@studiolanave.com>`, reply-to: `lanave@alaniceman.com`.
- Query única a `session_codes` que arma dos segmentos:
  - `depleted`: total = usados y `MAX(used_at) >= now() - 60 días`.
  - `lowRemaining`: (total - usados) entre 1 y 2.
- Dedup por email; si aparece en ambos, gana `depleted`.
- Log de enviados/errores en respuesta JSON.

## Copy del email (HTML, estilo Helvetica Neue, primary #2E4D3A + acentos hielo)

**Subject (agotados):** `❄️ Se te acabaron las sesiones — Promo de Invierno termina mañana`
**Subject (1-2 restantes):** `❄️ Te quedan pocas sesiones — Promo de Invierno termina mañana`

**Preview:** `6 sesiones por $60.000 — úsalas en Wim Hof o Yoga, válidas 3 meses.`

Estructura:
1. Hero con gradiente hielo + título "Promo de Invierno".
2. Saludo personalizado con primer nombre + frase específica según segmento (agotado vs por agotarse).
3. **Bloque motivacional** sobre agua fría: enfoque, energía, recuperación, sistema inmune, resiliencia mental — 3-4 líneas potentes, sin claims médicos fuertes.
4. **Urgencia**: "La promo termina mañana."
5. **Card de la promo**: 6 sesiones · $60.000 · $10.000 por sesión.
6. **Ventajas nuevas** (bullets):
   - ✅ Ahora con más horarios disponibles (ampliamos la agenda).
   - 🧘 Úsalas en **Wim Hof / Criomedicina** o **Yoga** — tú eliges.
   - 📅 Válidas por **3 meses**.
   - 🎁 Compártelas con quien quieras.
7. **CTA principal**: "Aprovechar la Promo de Invierno" → `https://studiolanave.com/promo-invierno` (ruta existente `PromoInvierno.tsx`).
8. Footer con WhatsApp y link a agenda.

## Ejecución
1. Crear `supabase/functions/send-invierno-promo-recovery/index.ts`.
2. Añadir entrada `verify_jwt = false` en `supabase/config.toml`.
3. Deploy del edge function.
4. **Primero enviar preview** a `alan.earle@gmail.com` (o el email que confirmes) para validar copy y diseño.
5. Tras tu OK, invocar en modo producción para disparar a los ~39 destinatarios.

## Fuera de alcance
- No se toca la promo en sí ni las páginas públicas.
- No se registra en `email_send_log` (los envíos legacy tipo icefest/marzo-reset tampoco lo hacen; se mantiene consistencia).
- No se marca a los destinatarios en BD; la deduplicación se basa en la query en cada corrida.

## Detalles técnicos
- Query base:
```sql
SELECT buyer_email, buyer_name, is_used, used_at
FROM session_codes
WHERE mercado_pago_payment_id IS NOT NULL;
```
Agregado en memoria por email → clasificación en `depleted` / `lowRemaining` / descarta.
- Ventana de 60 días aplicada solo al segmento `depleted` mirando `MAX(used_at)`.
- Nombres se toman del primer segmento del `buyer_name` para saludo personalizado con fallback "hola 👋".

¿Confirmas que envíe primero un preview antes de disparar los 39?
