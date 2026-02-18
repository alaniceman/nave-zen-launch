# Reorganizacion del Menu de Navegacion

## Problema actual

El menu tiene 8 enlaces directos y se quiere agregar Yoga. Son demasiados items para una barra de navegacion, especialmente en pantallas medianas (tablets, laptops pequenos).

## Propuesta de agrupacion

Reducir de 9 items sueltos a **5 items visibles** en desktop, usando 2 dropdowns para agrupar contenido relacionado:

```text
| NAVE Studio |  Experiencias v  |  Horarios  |  Planes v  |  Blog  |  Contacto  |  [Empezar v] |
```

### Detalle de cada item:

1. **Experiencias** (dropdown)
  - Yoga (`/yoga-las-condes`)
  - Criomedicina y Metodo Wim Hof (`/criomedicina-metodo-wim-hof-las-condes`)
  - Todas las experiencias (`/experiencias`)
  - Coaches (`/coaches`)
2. **Horarios** (enlace directo a `/horarios`)
3. **Planes** (dropdown)
  - Membresias (`/planes-precios`)
  - Paquete de sesiones (`/bonos`)
  - Gift Cards (`/giftcards`)
4. **Blog** (enlace directo a `/blog`)
5. **Contacto** (enlace directo a `/contacto`)
6. **Empezar** (dropdown existente, sin cambios)

### Menu mobile

En mobile se mantiene el drawer actual pero con las mismas agrupaciones usando secciones colapsables (acordeon):

- Seccion "Experiencias" con sub-items
- "Horarios" directo
- Seccion "Planes" con sub-items
- "Blog" directo
- "Contacto" directo
- Botones de accion al final (clase de prueba, registrarse, ingresar)

## Cambios tecnicos

### Archivo: `src/components/Header.tsx`

- Refactorizar `navigationLinks` de array plano a estructura con grupos
- Implementar dropdowns en desktop usando estado local (similar al dropdown "Empezar" existente)
- En mobile, usar secciones con toggle para los grupos
- Agregar animacion de chevron rotado en los dropdowns
- Los dropdowns se cierran al hacer click fuera (reutilizar patron existente)

### Estructura de datos propuesta:

```text
navigationLinks = [
  {
    label: "Experiencias",
    type: "dropdown",
    children: [
      { label: "Yoga en Las Condes", href: "/yoga-las-condes" },
      { label: "Criomedicina", href: "/criomedicina-metodo-wim-hof-las-condes" },
      { label: "Todas las experiencias", href: "/experiencias" },
      { label: "Coaches", href: "/coaches" },
    ]
  },
  { label: "Horarios", href: "/horarios", type: "link" },
  {
    label: "Planes",
    type: "dropdown",
    children: [
      { label: "Membresias y Precios", href: "/planes-precios" },
      { label: "Bonos", href: "/bonos" },
      { label: "Gift Cards", href: "/giftcards" },
    ]
  },
  { label: "Blog", href: "/blog", type: "link" },
  { label: "Contacto", href: "/contacto", type: "link" },
]
```

### Estilo de los dropdowns

- Mismo estilo visual que el dropdown "Empezar" existente (rounded-xl, shadow-lg, ring-1)
- Hover con bg-neutral-light
- Transicion suave de aparicion
- Chevron que rota 180 grados al abrir

No se crean archivos nuevos, solo se modifica `src/components/Header.tsx`.