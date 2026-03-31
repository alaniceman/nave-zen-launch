

## Plan: Chatbot IA para Studio La Nave

### Resumen
Crear un chatbot flotante en la web que use Lovable AI para responder preguntas de clientes sobre horarios, experiencias, precios, reservas y FAQ. El bot tendrá un system prompt estricto que lo limita solo a temas de La Nave, evitando uso como "ChatGPT gratis".

### Protecciones contra abuso

1. **System prompt restrictivo**: El bot solo responde sobre La Nave (horarios, precios, experiencias, reservas, FAQ). Cualquier pregunta fuera de tema recibe una respuesta corta redirigiendo a WhatsApp.
2. **Rate limiting por IP/sesión**: Maximo 15 mensajes por sesión y 30 por hora por IP en la edge function. Evita que alguien lo use como chatbot general ilimitado.
3. **Limite de tokens**: `max_tokens: 300` por respuesta para mantener respuestas cortas y reducir costos.
4. **Sin historial largo**: Maximo 6 mensajes de contexto para evitar conversaciones infinitas.

### Arquitectura

```text
[Widget flotante React]
       │
       ▼
[Edge function: chat-nave]
  - Valida rate limit (in-memory)
  - Inyecta system prompt con datos de La Nave
  - Llama a Lovable AI Gateway (gemini-3-flash-preview)
  - Streaming SSE al frontend
       │
       ▼
[Lovable AI Gateway]
```

### Pasos

**1. Crear edge function `chat-nave`**
- System prompt con: FAQ completo, horarios, precios de paquetes, info de experiencias, ubicacion, contacto WhatsApp
- Rate limit in-memory: 15 msg/sesion, 30/hora por IP
- `max_tokens: 300`, modelo `google/gemini-3-flash-preview`
- Streaming SSE
- Instrucciones estrictas: "Solo responde sobre Studio La Nave. Si la pregunta no es sobre La Nave, responde: 'Solo puedo ayudarte con temas de Studio La Nave. Escríbenos por WhatsApp al +56 9 xxxx xxxx'"

**2. Crear componente `ChatWidget.tsx`**
- Boton flotante en esquina inferior izquierda (el WhatsApp ya está a la derecha)
- Modal de chat con historial de mensajes
- Input de texto + boton enviar
- Streaming token-by-token con markdown rendering
- Limite visual de 15 mensajes por sesion, despues sugiere WhatsApp
- Mensaje inicial automatico: "Hola! Soy el asistente de La Nave. Pregúntame sobre horarios, experiencias, precios o reservas."

**3. Integrar en `App.tsx`**
- Agregar el widget globalmente como el WhatsAppWidget

### Datos incluidos en el system prompt
- Todas las FAQ (12 preguntas/respuestas)
- Experiencias: Yoga (Yin, Yang, Vinyasa, Integral, Power), Método Wim Hof, Ice Bath, Breathwork
- Precios de paquetes de sesiones (consulta DB o hardcoded)
- Horarios principales
- Ubicacion: Las Condes, Santiago
- Links: clase de prueba → /clase-de-prueba, agenda → /agenda, icefest → /icefest
- Contacto WhatsApp

### Archivos
- `supabase/functions/chat-nave/index.ts` — edge function con AI + rate limiting
- `src/components/ChatWidget.tsx` — widget flotante de chat
- `src/App.tsx` — integrar widget

### Costos estimados
- Modelo `gemini-3-flash-preview`: muy economico (~$0.001 por respuesta corta)
- Con rate limiting de 15 msg/sesion, el abuso es minimo

