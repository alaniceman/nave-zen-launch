## Cambios en `/planes-precios` (src/pages/Planes.tsx)

### 1) Nuevo formato de features en las 3 membresías (Eclipse, Órbita, Universo)

Reemplazar las filas actuales de cada card por exactamente estas 5, en este orden:

- **Sesiones presenciales** → Eclipse: `5 / mes` · Órbita: `10 / mes` · Universo: `Ilimitadas` (se mantiene)
- **Criomedicina / Método Wim Hof** ✔
- **Yoga (Vinyasa · Yin · Yang · Integral · Power)** ✔
- **Breathwork & Meditación** ✔
- **Comunidad online** ✔

Se elimina la fila "Isométrica + Flexibilidad" y la fila "Comunidad online + mentorías" (reemplazada por "Comunidad online").

### 2) Badge "Plan de Prueba" en Eclipse

Agregar a la card Eclipse (debajo del precio $59.000) el mismo badge que ya existe en Órbita/Universo:

> "Prueba antes con Plan de Prueba desde $9.900"

Envolverlo en un `<a href="#plan-prueba-section">` para que al click haga scroll a la sección de Plan de Prueba ya existente en la misma página (`<PricingTrialYogaSection />` en línea 457). Se le agregará `id="plan-prueba-section"` al wrapper de esa sección para que el ancla funcione.

Nota: los badges equivalentes en Órbita y Universo también se harán clickeables al mismo ancla, por consistencia.

### 3) Mover "Misión 90 Órbita" (plan trimestral) al final de la página

- Eliminar el bloque actual de "Misión 90 Órbita" dentro de la sección `#habito-semanal` (líneas ~279-296).
- Re-insertarlo como nueva sección al final del `<main>`, justo antes del `<Footer />`, con su mismo card y CTA intactos, bajo un encabezado breve tipo "Plan trimestral".

### Fuera de alcance

No se tocan precios, URLs de checkout, tracking de Pixel, ni otras secciones (Paquetes Criomedicina, Solo Yoga, Drop-In, etc.).
