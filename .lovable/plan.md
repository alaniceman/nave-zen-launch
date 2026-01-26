

## Actualizar link del Plan Anual Ilimitado

### Cambio a realizar

**Archivo:** `src/components/PlanesAnualesPromo.tsx`

| Línea | Valor actual | Valor nuevo |
|-------|--------------|-------------|
| 125 | `https://boxmagic.cl/market/plan/V8dDG7ldzE` | `https://boxmagic.cl/market/plan/Vx0J5xA4vB` |

### Ubicación en el código

El link está en el botón "Suscribirme" de la tarjeta del Plan Ilimitado:

```tsx
<Button asChild className="w-full" size="sm">
  <a
    href="https://boxmagic.cl/market/plan/Vx0J5xA4vB"  // ← Actualizar aquí
    target="_blank"
    rel="noopener noreferrer"
  >
    Suscribirme
    <ExternalLink className="ml-2 w-3 h-3" />
  </a>
</Button>
```

