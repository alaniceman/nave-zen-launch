

## Plan: Optimizar el chatbot Nave AI

### Problemas actuales identificados

1. **Modelo basico** — Usa `gemini-3-flash-preview` (rapido pero menos preciso). Para un chatbot de atencion al cliente, un modelo mas inteligente dara mejores respuestas.
2. **Contexto limitado** — Solo envia los ultimos 6 mensajes al modelo, puede perder contexto de la conversacion.
3. **max_tokens bajo** — 300 tokens limita respuestas que necesitan mas detalle (ej: listar horarios completos).
4. **saveConversation ineficiente** — Hace SELECT + INSERT/UPDATE (2 queries). Deberia usar UPSERT con ON CONFLICT.
5. **Supabase client se crea en cada save** — Deberia reutilizarse como singleton.
6. **Rate limit por IP se pierde en cold starts** — No es critico pero vale documentar.
7. **Frontend no tiene AbortController** — Si el usuario cierra el chat o envia otro mensaje, el stream previo sigue corriendo.
8. **Admin Chat Logs basico** — No tiene busqueda, no renderiza markdown en las respuestas.

### Cambios

**1. Edge function `chat-nave/index.ts`**
- Cambiar modelo a `google/gemini-2.5-flash` (mejor razonamiento, sigue siendo rapido y economico para alto volumen)
- Subir `max_tokens` de 300 a 500
- Subir contexto de 6 a 10 mensajes
- Crear Supabase client como singleton (fuera del handler)
- Reemplazar SELECT+INSERT/UPDATE por UPSERT con `ON CONFLICT(session_id)`

**2. Migracion SQL**
- Agregar constraint UNIQUE en `chat_conversations.session_id` si no existe (necesario para UPSERT)

**3. `ChatWidget.tsx`**
- Agregar AbortController para cancelar streams previos al enviar un nuevo mensaje o cerrar el chat
- Limpiar el controller en cleanup del componente

**4. `AdminChatLogs.tsx`**
- Agregar campo de busqueda para filtrar conversaciones por texto del primer mensaje
- Renderizar markdown en las respuestas del asistente (consistencia con el widget)

### Archivos a modificar
- `supabase/functions/chat-nave/index.ts` — modelo, tokens, singleton, upsert
- `src/components/ChatWidget.tsx` — AbortController
- `src/pages/admin/AdminChatLogs.tsx` — busqueda + markdown
- Nueva migracion SQL — UNIQUE constraint en session_id

