

# Plan: Mejorar Dashboard con Métricas de Valor Canjeado

## Problema Identificado

El dashboard actual mezcla conceptos que deberían estar separados:

1. **Ingresos reales (flujo de caja)**: Dinero que entra cuando se compra un paquete
2. **Valor canjeado**: Valor prepagado que se "consume" cuando el cliente usa un código de sesión

## Cambios Propuestos

### 1. Arreglar visualización del menú Dashboard
- Verificar que el ítem "Dashboard" aparezca visible en el sidebar
- Si el sidebar está en modo colapsado, asegurar que al expandirlo se vea correctamente

### 2. Agregar nuevas métricas de "Valor Canjeado"

Se modificará el dashboard para incluir:

**Nueva tarjeta KPI:**
- **Valor Canjeado (mes actual)**: Suma del valor de los códigos de sesión usados este mes

**Nuevo gráfico:**
- **Ingresos vs Valor Canjeado por Mes**: Gráfico de barras comparativo que muestre:
  - Barras azules: Ingresos reales (compras de paquetes)
  - Barras verdes: Valor canjeado (códigos usados)

### 3. Cálculo del Valor por Código

Para cada código de sesión usado, se calculará su valor unitario:
```
valor_codigo = precio_paquete / cantidad_sesiones_paquete
```

Por ejemplo:
- Paquete de 5 sesiones a $100.000 → cada código vale $20.000
- Si en enero se usaron 8 códigos → Valor canjeado = $160.000

### 4. Consultas de Datos Adicionales

Se modificará `loadDashboardData()` para:
1. Obtener session_codes con `used_at` (fecha de uso)
2. Relacionar con session_packages para obtener precio y cantidad de sesiones
3. Calcular valor canjeado agrupado por mes

## Secciones del Dashboard Mejorado

```text
┌─────────────────────────────────────────────────────────────┐
│  DASHBOARD                                    [Período ▼]   │
├─────────────────────────────────────────────────────────────┤
│  KPIs Principales (4 tarjetas)                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│  │Ingresos │  │ Valor   │  │Reservas │  │ Cupones │        │
│  │ Reales  │  │Canjeado │  │Confirm. │  │  Usados │        │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
├─────────────────────────────────────────────────────────────┤
│  Códigos de Sesión (4 tarjetas pequeñas)                    │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐            │
│  │Generados│  │ Usados │  │Disponib│  │Expirados│          │
│  └────────┘  └────────┘  └────────┘  └────────┘            │
├─────────────────────────────────────────────────────────────┤
│  Gráficos                                                   │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │ Ingresos vs Valor   │  │  Uso de Cupones     │          │
│  │ Canjeado por Mes    │  │    por Mes          │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │ Reservas por        │  │  Ventas por         │          │
│  │   Servicio          │  │   Bono/Paquete      │          │
│  └─────────────────────┘  └─────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

## Archivos a Modificar

1. **`src/pages/admin/AdminDashboard.tsx`**
   - Agregar consulta de session_packages con precios
   - Agregar cálculo de valor canjeado por mes
   - Agregar nueva KPI "Valor Canjeado"
   - Modificar gráfico de ingresos para mostrar comparativa

## Detalles Técnicos

### Nueva consulta de datos:
```typescript
// Obtener session_codes con fecha de uso
const codesWithUsage = await supabase
  .from("session_codes")
  .select("id, is_used, used_at, package_id")
  .eq("is_used", true)
  .gte("used_at", startDate.toISOString())

// Obtener paquetes con precio y cantidad
const packages = await supabase
  .from("session_packages")
  .select("id, name, price_clp, sessions_quantity")
```

### Cálculo de valor canjeado:
```typescript
// Para cada código usado, calcular su valor
const valorCodigo = package.price_clp / package.sessions_quantity
```

## Resultado Esperado

El dashboard mostrará claramente:
- **Cuánto dinero entró** (ventas de paquetes/gift cards)
- **Cuánto valor prepagado se canjeó** (códigos usados)
- Comparativa mensual de ambas métricas

