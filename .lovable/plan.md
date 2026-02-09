

## Cambios actualizados

### 1. Schedule (`src/data/schedule.ts`)

**Martes** (linea 75-81): Eliminar la clase de Biohacking a las 13:00.

**Miercoles** (lineas 106-113): Renombrar de "Biohacking: Breathwork + HIIT + Ice Bath" a **"HIIT + Ice Bath"**, mantener instructor "Maral Hekmat". Actualizar tags y badges acorde.

**Jueves** (lineas 161-167): Eliminar la clase de Biohacking a las 13:00.

### 2. Eliminar a Gaston Serrano

**`src/components/CoachesSection.tsx`** (lineas 27-33): Eliminar su entrada del array de coaches.

**`src/pages/Coaches.tsx`** (lineas 61-69): Eliminar su entrada del array de coaches.

### 3. Experiencias (`src/lib/experiences.ts`)

Revisar si el matcher de "biohacking" sigue siendo relevante dado que la unica clase restante se llamara "HIIT + Ice Bath". Se actualizara el match del slug `biohacking` para que tambien capture "HIIT + Ice Bath" o se renombrara el slug segun corresponda, para que la clase del miercoles siga apareciendo en los filtros de experiencias.

### Resumen

| Archivo | Cambio |
|---|---|
| `src/data/schedule.ts` | Eliminar Biohacking martes 13:00 y jueves 13:00. Renombrar miercoles 08:00 a "HIIT + Ice Bath" con Maral |
| `src/lib/experiences.ts` | Actualizar matcher de biohacking para capturar "HIIT + Ice Bath" |
| `src/components/CoachesSection.tsx` | Eliminar Gaston Serrano |
| `src/pages/Coaches.tsx` | Eliminar Gaston Serrano |

