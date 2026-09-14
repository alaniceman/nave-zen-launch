---
name: Sync Notion Clientes (plan de prueba)
description: Sincronización de leads/compras de plan de prueba con la tabla Clientes de Notion vía connector gateway
type: feature
---
Notion connector linked (`NOTION_API_KEY`, gateway-backed). Data source "Clientes": `649c6d6d-f397-83f9-9494-876631271540` (database `b8dc6d6d-f397-82c1-8be7-010c3e2eccc3`), Notion-Version `2025-09-03`.

Helper: `supabase/functions/_shared/notionClientes.ts` (`syncTrialClientToNotion`, `formatWhatsapp`). Función: `sync-notion-cliente` ({leadId, paymentMethod?}).

Mapeo:
- Nombre (title), Mail (email), Whatsapp (phone_number formateado `+56 9 XXXX XXXX`)
- Fecha Ingreso = fecha de inicio del plan de prueba
- Próximo Follow-Up = fecha de término del plan
- Estado (multi_select): `plan de prueba 7` / `plan de prueba 15` si pagó; `Lead` si no
- Plan de Prueba (select): `7 días` / `15 días`
- Tipo de membresía (multi_select): `Plan de prueba`
- Forma de pago (select): `Pago online` (default al marcar pagado) / `Transferencia` (elegido en el modal admin)

Disparadores: `submit-plan-prueba-lead` step finalize → crea/actualiza como `Lead`; `MarkPaidModal` en `/admin/planes-prueba` → invoca `sync-notion-cliente` con la forma de pago elegida. Deduplica por Mail (actualiza si existe). Nunca bloquea el flujo: errores solo se registran.
