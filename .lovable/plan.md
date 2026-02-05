

## Plan: Redirigir Criomedicina a la Landing de Ads

### Resumen
Actualizaremos dos elementos de navegación para que dirijan a la landing optimizada para conversiones en `/criomedicina-metodo-wim-hof-las-condes`.

---

### Cambios a realizar

#### 1. Menú de navegación (Header)
**Archivo:** `src/components/Header.tsx`

Cambiar la ruta del enlace "Criomedicina" en el array `navigationLinks`:
- **Antes:** `/criomedicina-metodo-wim-hof`
- **Después:** `/criomedicina-metodo-wim-hof-las-condes`

#### 2. Botón del Hero en Home
**Archivo:** `src/components/HeroSection.tsx`

Actualizar el botón "Agenda tu sesión de Criomedicina →" para que navegue a la landing de ads en lugar de directamente a la agenda:
- **Antes:** `/agenda-nave-studio`
- **Después:** `/criomedicina-metodo-wim-hof-las-condes`

---

### Archivos a modificar
| Archivo | Cambio |
|---------|--------|
| `src/components/Header.tsx` | Línea 48: cambiar href de `/criomedicina-metodo-wim-hof` a `/criomedicina-metodo-wim-hof-las-condes` |
| `src/components/HeroSection.tsx` | Línea 66: cambiar navegación de `/agenda-nave-studio` a `/criomedicina-metodo-wim-hof-las-condes` |

---

### Detalles técnicos

```text
Header.tsx (línea 48)
─────────────────────
Antes:  { label: "Criomedicina", href: "/criomedicina-metodo-wim-hof", isExternal: true }
Después: { label: "Criomedicina", href: "/criomedicina-metodo-wim-hof-las-condes", isExternal: true }

HeroSection.tsx (línea 66)
──────────────────────────
Antes:  onClick={() => navigate('/agenda-nave-studio')}
Después: onClick={() => navigate('/criomedicina-metodo-wim-hof-las-condes')}
```

---

### Resultado esperado
- Al hacer clic en "Criomedicina" en el menú (desktop y móvil), los usuarios llegarán a la landing optimizada
- Al hacer clic en "Agenda tu sesión de Criomedicina" en el hero del home, los usuarios también llegarán a esta landing
- Desde la landing, los usuarios pueden agendar directamente o explorar los paquetes y membresías

