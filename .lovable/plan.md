

## Plan: Guardar conversaciones del chat de Nave AI

### Resumen
Crear una tabla para almacenar cada conversación del chatbot y una página en el admin para revisarlas. Cada vez que un usuario envía un mensaje al chat, la edge function guarda la conversación completa.

### Pasos

**1. Crear tabla `chat_conversations`**
- Migración SQL con columnas: `id`, `messages` (jsonb array con role/content), `ip_address`, `message_count`, `created_at`, `updated_at`
- RLS: solo admins pueden SELECT; INSERT/UPDATE abierto para service role

**2. Modificar edge function `chat-nave`**
- Al recibir un mensaje, hacer upsert en `chat_conversations`:
  - Primera interacción: INSERT con session ID (generado en frontend y enviado como parámetro)
  - Mensajes siguientes: UPDATE agregando al array de messages
- Usar Supabase client con service role key para escribir
- Guardar IP del usuario para contexto

**3. Modificar `ChatWidget.tsx`**
- Generar un `sessionId` (UUID) al abrir el chat
- Enviarlo en cada request al endpoint `chat-nave`

**4. Crear página admin `AdminChatLogs.tsx`**
- Listar conversaciones ordenadas por fecha (más recientes primero)
- Mostrar: fecha, IP, cantidad de mensajes, preview del primer mensaje del usuario
- Click para expandir y ver la conversación completa con formato user/assistant
- Agregar ruta `/admin/chat-logs` y link en el sidebar

### Archivos
- Nueva migración SQL — tabla `chat_conversations`
- `supabase/functions/chat-nave/index.ts` — guardar mensajes
- `src/components/ChatWidget.tsx` — enviar sessionId
- `src/pages/admin/AdminChatLogs.tsx` — nueva página
- `src/components/admin/AdminSidebar.tsx` — agregar link
- `src/App.tsx` — agregar ruta

