
# Lazy Loading (Code Splitting) para las Rutas

## Problema
Todas las 40+ paginas se cargan en un solo bundle JavaScript de mas de 500 kB, lo que ralentiza la carga inicial del sitio.

## Solucion
Convertir todos los imports estaticos de paginas a imports dinamicos usando `React.lazy()` + `Suspense`, para que cada pagina se cargue solo cuando el usuario la visita.

## Cambios

### Archivo: `src/App.tsx`

1. **Agregar imports de React**: `lazy` y `Suspense` desde React.

2. **Reemplazar ~45 imports estaticos por lazy imports**:
   ```typescript
   // Antes:
   import Planes from "./pages/Planes";
   
   // Despues:
   const Planes = lazy(() => import("./pages/Planes"));
   ```

   Se aplicara a TODAS las paginas (Index, Planes, Experiencias, Coaches, Blog, todos los BlogX, Cyber2025, PlanAnual2026, SanValentin, Horarios, FAQ, ClaseDePrueba, TrialClassSchedule, todas las Criomedicin, Terminos, Privacidad, Bonos, BonosSuccess, GiftCards, GiftCardsSuccess, GiftCardsFailure, GiftCardView, AgendaNaveStudio, AgendaSuccess, AgendaFailure, AgendaPending, NotFound, AdminLogin, AdminLayout, y todas las paginas admin).

3. **Envolver `<Routes>` con `<Suspense>`** y un fallback de carga:
   ```typescript
   <Suspense fallback={
     <div className="min-h-screen flex items-center justify-center">
       <Loader2 className="h-8 w-8 animate-spin text-primary" />
     </div>
   }>
     <Routes>
       ...
     </Routes>
   </Suspense>
   ```

4. **Importar `Loader2`** desde lucide-react para el spinner de carga.

### Que NO cambia
- Los providers, Header, WhatsAppWidget y componentes globales siguen con import estatico (se necesitan siempre).
- Las rutas y sus paths no cambian.
- La funcionalidad de cada pagina permanece identica.

### Resultado esperado
- El bundle principal se reduce significativamente (cada pagina se convierte en un chunk separado).
- Solo se descarga el codigo de la pagina que el usuario visita.
- Mientras carga, se muestra un spinner centrado.
