---
name: Schedule instructor names via RPC
description: professionals table is not publicly readable; schedule instructor names must come from get_active_professionals RPC and yoga pages derive coaches from the live schedule
type: feature
---
- `professionals` no es legible por `anon` (fix de seguridad de emails). Nunca hacer join anidado `professionals(name)` en queries públicas: devuelve null silenciosamente.
- `useScheduleEntries` obtiene los nombres con la RPC `get_active_professionals` y hace el join en cliente (id -> name).
- Las páginas `/yoga/*` derivan los facilitadores mostrados desde los horarios reales usando `src/lib/coachSync.ts` (`coachIdsFromScheduleItems`), con lista de respaldo. Alias en `NAME_ALIASES`: "Mariela Carrasco" -> coach `mar`.
- Resultado: cambios en /admin/horarios se reflejan en /horarios y en todas las landings de yoga (clases e instructores).
