

## Página Promoción San Valentín - 2 Sesiones Criomedicina

### Resumen

Crear una página especial de San Valentín para vender 2 sesiones de Criomedicina / Método Wim Hof a **$40.000 CLP** (precio normal $60.000), incluyendo:
- Pago vía Mercado Pago
- Envío de 2 códigos de sesión por email
- Gift Card temática de San Valentín descargable en PDF

### Arquitectura del flujo

```text
┌─────────────────────────────────────────────────────────────────────┐
│                     /san-valentin                                   │
├─────────────────────────────────────────────────────────────────────┤
│  1. Usuario ve landing de San Valentín con la promo                 │
│  2. Llena formulario (nombre, email, teléfono)                      │
│  3. Clic en "Comprar" → llama edge function                         │
│  4. Redirige a Mercado Pago ($40.000)                               │
│  5. Pago exitoso → webhook genera 2 códigos + email con Gift Card   │
│  6. Email incluye link a /giftcard/{token} con diseño San Valentín  │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Cambios a realizar

#### 1. Base de datos: Crear paquete especial San Valentín

Crear un nuevo paquete de sesiones con las características de la promo:

| Campo | Valor |
|-------|-------|
| `name` | Promo San Valentín - 2 Sesiones |
| `description` | 2 sesiones de Criomedicina / Método Wim Hof para compartir en pareja o regalar a alguien especial |
| `sessions_quantity` | 2 |
| `price_clp` | 40000 |
| `validity_days` | 180 (6 meses) |
| `applicable_service_ids` | IDs de Criomedicina/Wim Hof |
| `is_active` | true |
| `available_as_giftcard` | true |
| `promo_type` | "san_valentin" (nuevo campo opcional) |

---

#### 2. Nueva página: `/san-valentin`

**Archivo:** `src/pages/SanValentin.tsx`

**Estructura de la página:**

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    💕 HERO SECTION 💕                               │
│  "Regala una experiencia transformadora este San Valentín"         │
│  Imagen temática con corazones / pareja en ice bath                 │
├─────────────────────────────────────────────────────────────────────┤
│                    PROMO CARD                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  🧊 2 Sesiones Método Wim Hof / Criomedicina               │   │
│  │                                                             │   │
│  │  Precio normal: $60.000 (tachado)                           │   │
│  │  Precio San Valentín: $40.000                               │   │
│  │  ¡Ahorra $20.000!                                           │   │
│  │                                                             │   │
│  │  ✓ 2 códigos de sesión para usar cuando quieran            │   │
│  │  ✓ Válido por 6 meses                                       │   │
│  │  ✓ Gift Card descargable con diseño San Valentín            │   │
│  └─────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│                    FORMULARIO DE COMPRA                             │
│  - Nombre completo                                                  │
│  - Email (recibirá la Gift Card)                                    │
│  - Celular                                                          │
│  - [Botón: Comprar Gift Card - $40.000]                             │
├─────────────────────────────────────────────────────────────────────┤
│                    BENEFICIOS                                       │
│  💪 Fortalece el sistema inmune                                     │
│  🧠 Reduce el estrés y la ansiedad                                  │
│  ❄️ Mejora la circulación                                          │
│  💕 Experiencia para compartir en pareja                            │
├─────────────────────────────────────────────────────────────────────┤
│                    FAQ San Valentín                                 │
├─────────────────────────────────────────────────────────────────────┤
│                    FOOTER                                           │
└─────────────────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- Formulario integrado (sin selección de paquete, es fijo)
- Llamada a `purchase-session-package` con `isGiftCard: true`
- Meta Pixel tracking (ViewContent, InitiateCheckout, Purchase)
- SEO optimizado para San Valentín

---

#### 3. Ruta en App.tsx

Agregar la nueva ruta:

```tsx
<Route path="/san-valentin" element={<SanValentin />} />
```

---

#### 4. Edge function: Email y PDF con diseño San Valentín

**Modificar:** `supabase/functions/send-session-codes-email/index.ts`

Agregar parámetro `promoType` para detectar San Valentín y personalizar:
- Subject: "💕 Tu Gift Card de San Valentín está lista"
- Diseño del email con colores rosados/rojos
- Corazones y emojis temáticos

**Modificar:** `supabase/functions/generate-giftcard-pdf/index.ts`

Agregar lógica para detectar promo San Valentín y generar PDF con:
- Colores rosados/rojos en vez de azul marino
- Corazones decorativos
- Texto temático de San Valentín

---

#### 5. Flujo de compra

El flujo usa el mismo backend existente (`purchase-session-package`):

1. Usuario llena formulario en `/san-valentin`
2. Frontend llama `purchase-session-package` con:
   - `packageId`: ID del paquete San Valentín
   - `isGiftCard: true`
   - `promoType: "san_valentin"` (nuevo campo)
3. Backend crea orden y redirige a Mercado Pago
4. Webhook procesa pago y genera códigos
5. Email enviado con diseño San Valentín

---

### Archivos a crear/modificar

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/pages/SanValentin.tsx` | **Crear** | Landing page de la promoción |
| `src/App.tsx` | Modificar | Agregar ruta `/san-valentin` |
| `supabase/functions/send-session-codes-email/index.ts` | Modificar | Template de email San Valentín |
| `supabase/functions/generate-giftcard-pdf/index.ts` | Modificar | Diseño PDF San Valentín |
| `supabase/functions/purchase-session-package/index.ts` | Modificar | Pasar promoType a las funciones de email |
| Migración SQL | **Crear** | Paquete especial San Valentín en BD |

---

### Diseño visual de la página

**Paleta de colores San Valentín:**
- Rosa principal: `#EC4899` (pink-500)
- Rosa claro: `#FCE7F3` (pink-100)
- Rojo acento: `#E11D48` (rose-600)
- Gradientes suaves rosados

**Elementos visuales:**
- Corazones decorativos
- Iconos temáticos (💕❄️🧊💝)
- Badge de "Oferta Especial" o "Solo por San Valentín"
- Contador de urgencia opcional

---

### Detalles técnicos

**Paquete San Valentín (migración SQL):**
```sql
INSERT INTO session_packages (
  name, description, sessions_quantity, price_clp, 
  validity_days, applicable_service_ids, is_active, 
  available_as_giftcard
) VALUES (
  'Promo San Valentín - 2 Sesiones',
  '2 sesiones de Criomedicina / Método Wim Hof para compartir en pareja',
  2,
  40000,
  180,
  ARRAY['ced4be53-8e5c-4d34-8370-0784f8d7a4b1', '4597bac7-b438-48b7-ba9c-e6c5dcac8df5']::uuid[],
  true,
  true
);
```

**Comparación de precios:**
- Precio normal: 2 × $30.000 = $60.000
- Precio promo: $40.000
- Ahorro: $20.000 (33% off)

