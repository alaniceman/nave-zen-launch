

## Plan: Eliminar slots sin reservas hasta mayo

### Resumen
Borrar los 258 registros de `generated_slots` que tienen `confirmed_bookings = 0` desde hoy hasta fin de mayo 2026. Los 2 slots con reservas se mantienen intactos.

### Paso único

Ejecutar un DELETE en `generated_slots`:
```sql
DELETE FROM generated_slots
WHERE date_time_start >= NOW()
  AND date_time_start < '2026-06-01'
  AND confirmed_bookings = 0;
```

Esto eliminará ~258 filas y conservará los 2 slots que tienen reservas confirmadas.

### Nota
Si en el futuro necesitas regenerar slots, puedes hacerlo desde `/admin/agendas-futuras` con el botón de generar.

