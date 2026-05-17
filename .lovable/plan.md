# Conectar `/generative` a la documentación de Nave AI

Hoy la edge function `generate-landing` solo inyecta planes y bonos en vivo. Nave AI (chatbot) además lee la tabla editable `ai_knowledge`, donde tú vas agregando reglas, tono, info de servicios, FAQs, etc. Queremos que la landing generativa use la **misma** fuente, para que cualquier cambio que hagas en `/admin/ai-knowledge` se refleje también acá.

## Qué cambia

- `generate-landing` pasa a leer `ai_knowledge` (filas activas, ordenadas por `priority`) además de los planes y bonos que ya lee.
- El system prompt se arma en este orden:
  1. **Rol creativo + formato JSON estricto** (lo que ya tiene hoy, queda fijo en código porque define la estructura de salida).
  2. **Knowledge base de Nave AI** (texto editable desde admin).
  3. **Datos en vivo** (membresías, bonos).
- Si `ai_knowledge` está vacío, se usa un fallback corto (igual que hace `chat-nave`).

## Por qué así

- Reusa la misma fuente de verdad que ya editas para el chatbot → no duplicas contenido.
- La parte "formato JSON" se queda en código porque si el admin la borra sin querer, la landing rompe. El admin controla el **contenido/tono**, no la estructura.
- No agregamos tabla nueva ni endpoint nuevo.

## Archivos a tocar

- `supabase/functions/generate-landing/index.ts` → agregar `buildKnowledgeSection()` (igual al de `chat-nave/systemPrompt.ts`) y concatenarlo al prompt.
- Nada más. Frontend no cambia.

## Detalle técnico

```text
SYSTEM_PROMPT (rol + schema JSON, fijo)
        +
ai_knowledge (DB, editable en /admin/ai-knowledge)
        +
CONTEXTO EN VIVO (planes + bonos desde DB)
        +
user input
```

Sin cambios de schema, sin migraciones, sin secrets nuevos.

## Fuera de scope

- Mover el rol creativo a la DB (riesgoso, rompe el JSON si se edita mal).
- UI nueva en admin (ya existe `/admin/ai-knowledge`).
