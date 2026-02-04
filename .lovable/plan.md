

# Plan: Corregir Cálculo de Ingresos Totales en Dashboard

## Problema Identificado

El dashboard está mostrando ingresos incorrectos porque:

1. **Bug crítico**: El código filtra `package_orders` por `status === "completed"`, pero el estado correcto en la base de datos es `status === "paid"`
2. **Resultado**: Los ingresos de bonos, paquetes y gift cards se muestran como $0

### Datos Reales de Enero 2026:
| Fuente | Total | Cantidad |
|--------|-------|----------|
| Bookings directos (pagados) | $210,000 | 7 |
| Órdenes de paquetes/giftcards (paid) | $262,700 | 8 |
| **Total real** | **$472,700** | 15 |

El dashboard probablemente solo mostraba ~$210,000 porque ignoraba los $262,700 de órdenes de paquetes.

## Cambios a Realizar

### 1. Corregir el filtro de status en `package_orders`

Cambiar todas las referencias de `status === "completed"` a `status === "paid"`:

```text
Archivo: src/pages/admin/AdminDashboard.tsx

Línea 171: 
ANTES: const completedOrders = orders.filter(o => o.status === "completed");
DESPUÉS: const completedOrders = orders.filter(o => o.status === "paid");

Línea 609:
ANTES: .filter(o => o.status === "completed")
DESPUÉS: .filter(o => o.status === "paid")

Línea 731:
ANTES: .filter(o => o.status === "completed")
DESPUÉS: .filter(o => o.status === "paid")
```

### 2. Actualizar etiquetas del gráfico para claridad

Cambiar las etiquetas para que reflejen mejor las fuentes de ingresos:
- "Reservas" → "Sesiones Directas" (bookings pagados directamente)
- "Bonos" → "Bonos/GiftCards" (órdenes de paquetes)

## Resultado Esperado

Después de la corrección:

```text
┌─────────────────────────────────────────┐
│  Ingresos Totales por Mes - Enero 2026  │
│  ┌──────────────────────────────────┐   │
│  │  ████  Sesiones: $210,000        │   │
│  │  ████  Bonos/GiftCards: $262,700 │   │
│  │  Total: $472,700                 │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Archivo a Modificar

- `src/pages/admin/AdminDashboard.tsx`
  - Línea 171: Cambiar filtro de status
  - Línea 609: Cambiar filtro en `getRevenueByMonth()`
  - Línea 731: Cambiar filtro en `getRedeemedValueByMonth()`
  - Líneas 391-392: Actualizar etiquetas de leyenda del gráfico

## Detalles Técnicos

La corrección es simple pero crítica:

```typescript
// ANTES (incorrecto):
const completedOrders = orders.filter(o => o.status === "completed");

// DESPUÉS (correcto):
const completedOrders = orders.filter(o => o.status === "paid");
```

Este cambio afecta:
- KPI de "Ingresos Reales"
- Gráfico "Ingresos vs Valor Canjeado por Mes"  
- Gráfico "Ingresos Totales por Mes"
- Tabla "Top Bonos/Paquetes por Ingresos"

