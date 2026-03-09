
# Plan: Sistema de Login de Usuario con Identificación de Clases de Prueba

## Análisis del Estado Actual

Revisando la aplicación, encuentro:

**✅ Ya existe:**
- Sistema de autenticación base con Supabase (`AuthContext`)
- Tabla `profiles` para usuarios
- Tabla `customers` en CRM
- Tabla `trial_bookings` para clases de prueba
- Función CRM `upsertCustomerAndLogEvent` en `_shared/crm.ts`

**❌ Lo que falta:**
- Login/registro para usuarios finales (no admin)
- Conexión entre `auth.users` → `profiles` → `customers`
- Detección automática de clases de prueba previas al registrarse
- Dashboard de usuario para ver su perfil y suscripciones

## Implementación Propuesta

### FASE 1: Estructura de Base de Datos

**Modificar tabla `profiles`:**
```sql
-- Agregar campos necesarios para conectar con CRM
ALTER TABLE profiles ADD COLUMN customer_id UUID REFERENCES customers(id);
ALTER TABLE profiles ADD COLUMN phone TEXT;
```

**Función automática de trigger:**
```sql
-- Crear función que conecta signup → profile → customer automáticamente
CREATE OR REPLACE FUNCTION handle_new_user_signup()
RETURNS trigger AS $$
DECLARE
  existing_customer customers%ROWTYPE;
  new_customer_id UUID;
BEGIN
  -- Buscar customer existente por email
  SELECT * INTO existing_customer 
  FROM customers 
  WHERE email = NEW.email;
  
  IF existing_customer.id IS NOT NULL THEN
    -- Cliente ya existe, conectar profile con customer existente
    new_customer_id := existing_customer.id;
    
    -- Log event: usuario se registró y ya tenía historial
    INSERT INTO customer_events (customer_id, event_type, title, description)
    VALUES (
      new_customer_id, 
      'user_registered', 
      'Usuario creó cuenta',
      'Se registró con email que ya tenía historial en CRM'
    );
  ELSE
    -- Crear nuevo customer
    INSERT INTO customers (email, name, status)
    VALUES (NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 'new')
    RETURNING id INTO new_customer_id;
    
    -- Log event: nuevo usuario
    INSERT INTO customer_events (customer_id, event_type, title, description)
    VALUES (
      new_customer_id, 
      'user_registered', 
      'Nuevo usuario registrado',
      'Primera vez en la plataforma'
    );
  END IF;

  -- Crear profile conectado al customer
  INSERT INTO profiles (id, customer_id, full_name)
  VALUES (
    NEW.id, 
    new_customer_id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que se ejecuta al crear usuario
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_signup();
```

### FASE 2: Páginas de Autenticación

**Crear nuevas páginas:**
- `/login` - Página de login para usuarios
- `/signup` - Página de registro para usuarios  
- `/dashboard` - Dashboard personal del usuario
- `/forgot-password` - Recuperar contraseña
- `/reset-password` - Resetear contraseña

**Componentes nuevos:**
- `LoginForm.tsx` - Formulario de login
- `SignupForm.tsx` - Formulario de registro
- `UserDashboard.tsx` - Dashboard del usuario
- `PasswordResetForm.tsx` - Formulario de reset

### FASE 3: Lógica de Detección de Clases de Prueba

**Edge Function: `check-user-trial-history`**
```typescript
// Cuando usuario se registra, verificar si hizo clases de prueba
export async function checkTrialHistory(email: string) {
  const { data: trialBookings } = await supabase
    .from('trial_bookings')
    .select('*')
    .eq('customer_email', email.toLowerCase())
    .order('created_at', { ascending: false });

  if (trialBookings?.length > 0) {
    // Usuario ya hizo clases de prueba
    return {
      hasTrialHistory: true,
      lastTrial: trialBookings[0],
      totalTrials: trialBookings.length
    };
  }
  
  return { hasTrialHistory: false };
}
```

### FASE 4: Modificación del AuthContext

**Extender `AuthContext.tsx`:**
```typescript
interface AuthContextType {
  user: User | null;
  profile: Profile | null; // Agregar profile del usuario
  customer: Customer | null; // Agregar customer data  
  isAdmin: boolean;
  isAuthenticated: boolean; // Para usuarios normales
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  checkIsAdmin: (session?: Session | null) => Promise<boolean>;
}
```

### FASE 5: Dashboard de Usuario

**Funcionalidades del Dashboard:**
- Ver perfil personal (nombre, email, teléfono)
- Historial de clases de prueba anteriores
- Suscripción actual y tokens disponibles (futuro)
- Historial de reservas y asistencias
- Configuración de cuenta

### FASE 6: Integración con Sistema de Reservas

**Modificar `BookingForm.tsx`:**
- Si usuario está logueado, usar su perfil automáticamente
- Si no está logueado, mostrar opción "¿Ya tienes cuenta? Inicia sesión"
- Auto-completar datos del perfil en formularios

### FASE 7: Notificaciones y Mejoras CRM

**Mejoras automáticas:**
- Email de bienvenida personalizado según historial
- Si usuario se registra y ya hizo trial: "¡Te recordamos! Bienvenido de vuelta"
- Si es nuevo: "¡Bienvenido! ¿Te interesa probar una clase gratuita?"
- Actualización automática de estado en CRM (new → registered)

## Flujo de Usuario Completo

### Escenario 1: Usuario Nuevo
1. Usuario llega al sitio por primera vez
2. Reserva clase de prueba → se crea en `customers` + `trial_bookings`
3. Más tarde decide crear cuenta
4. Al registrarse → trigger detecta email, conecta con customer existente
5. CRM se actualiza: "Usuario se registró, ya había hecho 1 clase de prueba"

### Escenario 2: Usuario que se Registra Primero
1. Usuario crea cuenta primero
2. Se crea `profile` + `customer` automáticamente
3. Luego reserva clases → ya están conectadas a su perfil
4. Todo queda unificado desde el inicio

### Escenario 3: Usuario Existente
1. Usuario ya registrado hace login
2. Ve su dashboard con historial completo
3. Puede reservar clases con su perfil automático

## Consideraciones de Seguridad

**RLS Policies necesarias:**
- Users solo pueden ver/editar su propio profile
- Users solo pueden ver su propio customer data
- Proteger datos sensibles de otros usuarios
- Admins mantienen acceso completo

**Validaciones:**
- Emails únicos en signup
- Passwords seguros (min 8 caracteres)
- Rate limiting en login attempts
- Protección contra ataques de enumeración

## Beneficios del Sistema

1. **Unificación de Datos**: Todo el historial del usuario en un solo lugar
2. **Mejor UX**: Usuario no tiene que llenar formularios repetitivos  
3. **CRM Completo**: Visión 360° del cliente desde primera interacción
4. **Personalización**: Experiencia adaptada según historial
5. **Preparación para Suscripciones**: Base sólida para el sistema de tokens

Este sistema crea la base perfecta para después implementar las suscripciones y tokens del modelo BoxMagic, ya que tendremos usuarios autenticados conectados directamente con el CRM.
