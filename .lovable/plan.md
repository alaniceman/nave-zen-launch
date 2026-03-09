

# Plan: Agregar campo de celular al registro de usuario

## Cambio

Agregar un campo "Celular" al formulario de registro (`/signup`) usando la misma validación y formato que ya existe en el formulario de clases de prueba.

## Detalle técnico

### 1. Modificar `src/pages/Signup.tsx`

- Agregar campo `phone` al schema zod con la misma regex del trial form: `/^\+?[0-9]{8,15}$/`
- Agregar el campo en el formulario entre email y password, con label "Celular", placeholder "912345678", type "tel"
- Pasar el phone al `signUp` method

### 2. Modificar `src/context/AuthContext.tsx`

- Actualizar `signUp` para aceptar `phone` como parámetro y guardarlo en `options.data` del signup de Supabase
- El trigger `handle_new_user_signup` ya crea el profile; se actualizará para leer el phone del metadata y guardarlo en `profiles.phone`

### 3. Migración SQL

- Actualizar la función `handle_new_user_signup` para extraer `phone` del `raw_user_meta_data` y guardarlo tanto en `profiles.phone` como en `customers.phone`

