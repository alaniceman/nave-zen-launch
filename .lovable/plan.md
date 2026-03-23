

## Plan: Landing por Instructor `/instructor/:slug`

### Resumen
Crear una página dinámica que muestre el perfil completo de cada instructor, usando los datos hardcodeados de coaches (foto, rol, credenciales, frase) más el slug de la tabla `professionals` para resolver la URL y el link a la agenda.

### Estructura de la página

1. **Hero** — Foto grande del instructor (la misma de CoachesSection) con nombre, rol y badge de fundador si aplica
2. **Botón CTA** — "Agendar con [nombre]" → lleva a `/agenda-nave-studio/{slug}`
3. **Sección Bio** — Frase/propósito, credenciales, descripción extendida
4. **Galería de fotos** — Sección con fotos del coach en acción (placeholder por ahora, se pueden agregar después)
5. **CTA final** — Repetir botón de agendar + link a WhatsApp

### Archivos a crear/modificar

1. **`src/data/coaches.ts`** — Extraer los datos de coaches a un archivo compartido (evitar duplicación entre CoachesSection, Coaches page e InstructorProfile)
2. **`src/pages/InstructorProfile.tsx`** — Nueva página dinámica que recibe `:slug` por params, busca el coach por slug, y renderiza el perfil completo
3. **`src/App.tsx`** — Agregar ruta `/instructor/:slug` con lazy loading
4. **`src/components/CoachesSection.tsx`** — Importar coaches desde `src/data/coaches.ts`
5. **`src/pages/Coaches.tsx`** — Importar coaches desde `src/data/coaches.ts`

### Mapeo slug → coach

Los slugs de la tabla `professionals` (alan no está en la tabla, pero sí en los coaches hardcodeados) se mapean así:
- `sol` → Sol Evans
- `maral` → Maral Hekmat  
- `rolo` → Rolo Varela
- `mar` → Mar Carrasco (slug: mar, db name: Mariela Carrasco)
- `amanda` → Amanda Moutel
- `amber` → Ámbar Vidal (no está en professionals)
- `alan` → Alan Iceman Earle (no está en professionals, pero existe como id en coaches)

Se usará el `id` del array de coaches como slug para la URL. El botón "Agendar" apuntará a `/agenda-nave-studio/{slug}` solo si el profesional existe en la DB; sino, a WhatsApp.

### Detalle técnico

- La página hace un query simple a `professionals` para verificar que el slug existe y obtener datos reales
- Los datos extendidos (bio, fotos, credenciales) vienen del archivo `coaches.ts` hardcodeado
- SEO con Helmet dinámico por instructor
- Responsive: hero full-width en mobile, layout de 2 columnas en desktop
- La galería de fotos quedará con placeholders que se pueden reemplazar con fotos reales después

