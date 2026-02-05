

# Plan: Landing Page Criomedicina Optimizada para Ads

## Objetivo
Crear una nueva landing page en `/criomedicina-metodo-wim-hof-las-condes` optimizada para tráfico frío desde campañas publicitarias. La landing mantiene todo el flujo de conversión dentro del dominio (pixel friendly) y reutiliza componentes existentes.

---

## Estructura de la Landing (10 secciones)

### 1. Hero Section (Above the fold)
- **H1**: "Criomedicina en Nave Studio: Respiracion Metodo Wim Hof + Inmersion en Agua Fria"
- **Subtitulo**: Sesion guiada para entrenar tu sistema nervioso con respiracion, presencia y frio en la Nave. Apta para principiantes y para quienes ya practican.
- **4 bullets**: Guia paso a paso, tecnica y control, energia/calma/claridad, experiencia completa
- **Doble CTA**:
  - "Agendar sesion" (scroll a seccion Agenda)
  - "Ver horarios" (scroll a seccion Horarios)
- **Imagen**: Reutilizar `/lovable-uploads/criomedicina-hero.webp`

### 2. Que es Criomedicina
- Bloque corto explicativo
- Frase de impacto: "El frio no es el objetivo. Es el medio para entrenar resiliencia."

### 3. Como es una sesion (Paso a paso)
- 5 pasos numerados con iconos:
  1. Bienvenida y preparacion (5-10 min)
  2. Respiracion Metodo Wim Hof guiada (20-30 min)
  3. Transicion al frio + tecnica (5 min)
  4. Inmersion en agua fria (1-3 min aprox.)
  5. Recuperacion e integracion (10-15 min)
- Subseccion "Ajuste por nivel" (principiante vs avanzado)

### 4. Beneficios esperables
- 4 bullets: calma mental, energia/foco, confianza corporal, resiliencia
- Sin claims medicos

### 5. Seguridad y contraindicaciones
- Texto breve sobre seguridad
- Mini CTA a WhatsApp

### 6. Que traer
- Lista simple (traje de bano, toalla, bolsa, ayunas ligeras)
- "Todo lo demas lo tenemos en la Nave"

### 7. Seccion Paquetes (dinamica)
- Carga desde `session_packages` donde `show_in_criomedicina = true`
- Cards con precio, sesiones, validez
- Boton "Comprar" que redirige a `/bonos?package={id}`
- Links adicionales a `/bonos` y `/giftcards`

### 8. Seccion Horarios (dinamica)
- Filtrar horarios de Metodo Wim Hof desde `scheduleData`
- Mostrar solo sesiones que contengan "Metodo Wim Hof" en tags
- Link a `/horarios` para ver todos

### 9. Seccion Agenda (embebida)
- CTA prominente a `/agenda-nave-studio`
- Texto: "Reserva tu cupo aqui mismo"
- Botones sticky en movil

### 10. FAQ (Objeciones de Ads)
- 5 preguntas clave:
  1. Necesito experiencia?
  2. Cuanto dura la sesion?
  3. Tengo que estar mucho rato en el agua fria?
  4. Que pasa si me da ansiedad?
  5. Donde es?
- Componente Accordion reutilizable

### 11. Seccion Instructores
- Reutilizar `CoachesSection` con `filterIds={["alan", "sol", "maral", "rolo"]}`

### 12. CTA Final + Footer
- Botones repetidos: Agendar ahora, Ver paquetes, WhatsApp
- Reutilizar `Footer`

---

## Detalles Tecnicos

### Nuevo archivo
```
src/pages/CriomedicinAdsLanding.tsx
```

### Modificacion en App.tsx
Agregar ruta:
```tsx
<Route path="/criomedicina-metodo-wim-hof-las-condes" element={<CriomedicinAdsLanding />} />
```

### Componentes a reutilizar

| Componente | Uso |
|------------|-----|
| `Footer` | Footer de la pagina |
| `CoachesSection` | Seccion de instructores con filtro |
| `Accordion` | Seccion FAQ |
| `Card` | Cards de paquetes y pasos |
| `Button` | CTAs |
| `GiftCardSection` | Promocion de gift cards |

### Carga dinamica de paquetes
```typescript
const { data } = await supabase
  .from("session_packages")
  .select("id, name, description, sessions_quantity, price_clp, validity_days")
  .eq("is_active", true)
  .eq("show_in_criomedicina", true)
  .order("sessions_quantity", { ascending: true });
```

### Filtrado de horarios Wim Hof
```typescript
// Filtrar sesiones que contengan "Metodo Wim Hof" en tags
const wimHofSchedule = Object.entries(scheduleData).map(([day, classes]) => ({
  day,
  dayName: dayNames[day],
  classes: classes.filter(c => c.tags.includes("Metodo Wim Hof"))
})).filter(d => d.classes.length > 0);
```

### SEO y Structured Data
- Helmet con meta tags optimizados para Ads y Las Condes
- Open Graph tags con imagen
- Schema.org JSON-LD:
  - LocalBusiness (Nave Studio Las Condes)
  - Product (sesion Wim Hof)
  - FAQPage
  - BreadcrumbList

### Links internos y externos

| Destino | URL |
|---------|-----|
| Agenda interna | `/agenda-nave-studio` |
| Paquetes | `/bonos?package={id}` |
| Gift Cards | `/giftcards` |
| Horarios completos | `/horarios` |
| WhatsApp | `https://wa.me/56946120426` |

---

## Optimizaciones para Conversion (Ads)

1. **CTAs repetidos**: Hero, despues de pasos, antes de agenda, cierre final
2. **Sticky CTA movil**: Boton flotante "Agendar sesion" en mobile
3. **Scroll suave**: Botones ancla con `scrollIntoView({ behavior: 'smooth' })`
4. **Carga optimizada**: Imagen hero con `fetchPriority="high"`, lazy load para resto
5. **Sin salir del dominio**: Todo embebido o con links internos

---

## Diseno Visual

- Paleta: Verde primario, acentos calidos (consistente con el sitio)
- Hero: Overlay verde semi-transparente sobre imagen
- Cards: Bordes redondeados 2xl, sombras suaves
- Espaciado: py-12 a py-16 para secciones
- Mobile-first: Diseño responsivo optimizado

---

## Resumen de Cambios

1. **Crear** `src/pages/CriomedicinAdsLanding.tsx` - Landing completa optimizada para Ads
2. **Modificar** `src/App.tsx` - Agregar ruta `/criomedicina-metodo-wim-hof-las-condes`

