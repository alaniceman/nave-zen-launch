

## Plan: Chatbot BI Admin — "Nave Brain"

### Resumen
Crear un chatbot de inteligencia de negocios exclusivo para administradores dentro del panel admin. Este bot puede consultar la base de datos en tiempo real para responder preguntas sobre clientes, ventas, reservas, paquetes, membresías y estadísticas del negocio.

### Arquitectura

```text
Admin Panel (React)          Edge Function              Base de Datos
┌─────────────────┐    ┌─────────────────────┐    ┌──────────────┐
│ AdminBrain.tsx   │───▶│ admin-brain/        │───▶│ SQL queries  │
│ Chat UI          │    │ 1. Valida JWT+admin │    │ via service  │
│ (streaming)      │◀───│ 2. Genera SQL con AI│◀───│ role key     │
│                  │    │ 3. Ejecuta query    │    └──────────────┘
│                  │    │ 4. AI interpreta    │
└─────────────────┘    │    resultados        │
                       └─────────────────────┘
```

### Funcionamiento (2-step AI)

1. El admin hace una pregunta en lenguaje natural (ej: "¿cuántas personas compraron paquetes en marzo?")
2. La edge function usa AI para generar una query SQL SELECT (solo lectura)
3. Ejecuta la query contra la base de datos con el service role key
4. Envía los resultados de vuelta al AI para que los interprete y responda en lenguaje natural
5. Streamed response al admin

### Protecciones de seguridad

- Solo usuarios con rol admin pueden acceder (JWT + verificación de rol en edge function)
- Solo queries SELECT permitidas (validación estricta, no INSERT/UPDATE/DELETE/DROP)
- El AI recibe el schema de las tablas como contexto para generar queries correctas
- Límite de filas en queries (LIMIT 500)
- Sin acceso a tablas de auth/storage/system

### Paso 1 — Edge function `admin-brain`

**`supabase/functions/admin-brain/index.ts`**
- Validar JWT y verificar rol admin via `user_roles`
- System prompt con el schema completo de todas las tablas del proyecto
- Flujo de 2 pasos:
  - Paso A: AI genera query SQL basada en la pregunta
  - Paso B: Ejecuta query, AI interpreta resultados y responde
- Streaming de la respuesta final
- Manejo de errores 429/402

**`supabase/functions/admin-brain/schema.ts`**
- Schema de todas las tablas exportado como string para el system prompt
- Incluye descripciones de columnas y relaciones lógicas entre tablas

### Paso 2 — Página admin

**`src/pages/admin/AdminBrain.tsx`**
- Chat UI completo con historial de mensajes
- Input para preguntas en lenguaje natural
- Streaming de respuestas con markdown
- Sugerencias de preguntas frecuentes (chips clickeables):
  - "¿Cuántas reservas hubo este mes?"
  - "¿Quiénes son los clientes más activos?"
  - "¿Cuánto se vendió en paquetes esta semana?"
  - "¿Qué servicios son los más populares?"
  - "¿Cuántas clases de prueba se agendaron este mes?"

### Paso 3 — Integración en admin

- Agregar ruta `/admin/brain` en `App.tsx` (protegida con `requireAdmin`)
- Agregar item "Nave Brain" con icono `Brain` en `AdminSidebar.tsx`

### Tablas accesibles al bot
El bot podrá consultar: `bookings`, `package_orders`, `session_codes`, `customers`, `customer_events`, `customer_memberships`, `membership_plans`, `trial_bookings`, `services`, `session_packages`, `professionals`, `branches`, `schedule_entries`, `generated_slots`, `discount_coupons`, `email_subscribers`, `chat_conversations`

### Archivos
- `supabase/functions/admin-brain/index.ts` — edge function principal
- `supabase/functions/admin-brain/schema.ts` — schema de tablas
- `src/pages/admin/AdminBrain.tsx` — página de chat admin
- `src/components/admin/AdminSidebar.tsx` — agregar link
- `src/App.tsx` — agregar ruta

### Modelo AI
`google/gemini-2.5-flash` — buen balance entre precisión SQL y velocidad de respuesta

