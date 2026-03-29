

## Revisión del flujo "Agendas Futuras" — Problemas encontrados

### Problemas identificados

**1. Limite de 1000 filas en la consulta de slots existentes (CRITICO)**
En `generate-future-slots/index.ts` linea 135-139, la query a `generated_slots` para verificar duplicados no tiene paginacion. Supabase retorna maximo 1000 filas por defecto. Si hay mas de 1000 slots en el rango, la deduplicacion falla y se insertan duplicados.

El mismo problema existe en la pagina admin (`AdminFutureSlots.tsx` linea 77-99): la query de visualizacion tambien esta limitada a 1000 filas sin paginacion.

**2. Limite de 1000 filas en la consulta de la pagina admin (VISUAL)**
Si hay mas de 1000 slots en el rango filtrado, la tabla solo muestra los primeros 1000. No hay indicador ni paginacion para ver el resto.

**3. Hardcodeo de timezone GMT-3 en slotGenerator.ts**
Chile usa GMT-3 en invierno y GMT-4 en verano (horario de verano). El slotGenerator hardcodea `+3` horas para convertir a UTC (linea 99). Esto genera slots con 1 hora de desfase durante el horario de verano (abril-septiembre). Actualmente estamos en marzo, asi que esta correcto por ahora, pero fallara en abril.

**4. Horas mostradas sin timezone en la tabla admin**
En `AdminFutureSlots.tsx` linea 318, las horas se muestran con `format(parseISO(...), "HH:mm")` que usa la timezone del navegador. Si el admin esta en otra timezone, vera horas incorrectas. Deberia usar `formatInTimeZone` con "America/Santiago".

### Plan de correccion

**Paso 1 — Paginar la query de deduplicacion en `generate-future-slots`**
- Cambiar la query de existing slots para paginar con `.range()` en bloques de 1000 hasta obtener todos los registros.

**Paso 2 — Agregar paginacion a la tabla admin**
- Agregar paginacion al listado de slots en `AdminFutureSlots.tsx` con botones de pagina y un limit de ~50 filas por pagina.

**Paso 3 — Usar timezone correcta en la tabla admin**
- Importar `formatInTimeZone` y mostrar las horas en "America/Santiago".

**Paso 4 — Corregir hardcodeo de timezone en slotGenerator (opcional ahora, critico en abril)**
- Usar calculo dinamico del offset UTC de Chile en vez de hardcodear +3.

### Archivos a modificar
- `supabase/functions/generate-future-slots/index.ts` — paginacion de deduplicacion
- `supabase/functions/_shared/slotGenerator.ts` — timezone dinamica
- `src/pages/admin/AdminFutureSlots.tsx` — paginacion + timezone en horas

