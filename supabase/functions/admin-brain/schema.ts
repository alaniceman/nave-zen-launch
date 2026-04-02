export const DB_SCHEMA = `
## Database Schema — Nave Studio

### bookings
Reservas de sesiones (criomedicina, yoga, etc.)
- id: uuid PK
- professional_id: uuid FK → professionals.id
- service_id: uuid FK → services.id
- date_time_start: timestamptz
- date_time_end: timestamptz
- customer_name: text
- customer_email: text
- customer_phone: text
- customer_comments: text (nullable)
- status: text ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'REFUNDED')
- mercado_pago_preference_id: text (nullable)
- mercado_pago_payment_id: text (nullable)
- coupon_id: uuid FK → discount_coupons.id (nullable)
- discount_amount: int (default 0)
- original_price: int (nullable)
- final_price: int (nullable, en CLP)
- session_code_id: uuid FK → session_codes.id (nullable, si pagó con código prepago)
- feedback_email_sent: bool
- created_at, updated_at: timestamptz

NOTAS:
- CONFIRMED y CANCELLED cuentan como ingreso (no hay devoluciones).
- REFUNDED = devolución real, NO cuenta como ingreso.
- Si session_code_id != null y final_price = 0, pagó con código prepago.
- Si final_price > 0 y session_code_id is null, fue pago directo.

### package_orders
Órdenes de compra de paquetes de sesiones y gift cards.
- id: uuid PK
- package_id: uuid FK → session_packages.id
- order_type: text ('bono', 'giftcard')
- buyer_name: text
- buyer_email: text
- buyer_phone: text (nullable)
- coupon_id: uuid FK → discount_coupons.id (nullable)
- coupon_code: text (nullable)
- original_price: int (CLP)
- discount_amount: int (default 0)
- final_price: int (CLP)
- is_giftcard: bool
- status: text ('created', 'pending', 'approved', 'rejected', 'cancelled')
- mercado_pago_preference_id, mercado_pago_payment_id, mercado_pago_status, mercado_pago_status_detail: text
- abandonment_email_sent_at: timestamptz (nullable)
- error_message: text (nullable)
- created_at, updated_at: timestamptz

NOTAS:
- status='approved' = pagada exitosamente.
- is_giftcard=true → es una gift card.

### session_codes
Códigos de sesión generados al comprar paquetes.
- id: uuid PK
- code: text (código alfanumérico único)
- package_id: uuid FK → session_packages.id (nullable)
- buyer_email, buyer_name, buyer_phone: text
- applicable_service_ids: uuid[] (servicios donde se puede usar)
- purchased_at: timestamptz
- expires_at: timestamptz
- is_used: bool
- used_at: timestamptz (nullable)
- used_in_booking_id: uuid FK → bookings.id (nullable)
- mercado_pago_payment_id: text (nullable)
- giftcard_access_token: text (nullable)
- created_at: timestamptz

### customers
CRM de clientes.
- id: uuid PK
- email: text (unique)
- name: text
- phone: text (nullable)
- status: text ('new', 'active', 'inactive')
- notes: text (nullable)
- created_at, updated_at: timestamptz

### customer_events
Timeline de eventos del cliente (compras, registros, notas).
- id: uuid PK
- customer_id: uuid FK → customers.id
- event_type: text ('booking_confirmed', 'package_purchased', 'user_registered', 'trial_booked', 'note', etc.)
- title: text
- description: text (nullable)
- amount: int (nullable, CLP)
- metadata: jsonb
- event_date: timestamptz
- created_at: timestamptz

### customer_memberships
Membresías activas de clientes.
- id: uuid PK
- customer_id: uuid FK → customers.id
- membership_plan_id: uuid FK → membership_plans.id
- start_date: date
- end_date: date (nullable)
- status: text ('active', 'paused', 'cancelled', 'expired')
- notes: text (nullable)
- created_at, updated_at: timestamptz

### membership_plans
Planes de membresía disponibles.
- id: uuid PK
- name: text
- description: text (nullable)
- frequency: text ('weekly', 'monthly', etc.)
- classes_included: int
- price_clp: int
- is_active: bool
- created_at, updated_at: timestamptz

### trial_bookings
Clases de prueba agendadas.
- id: uuid PK
- customer_name, customer_email, customer_phone: text
- class_title: text
- class_day: text (ej: 'Lunes')
- class_time: text (ej: '19:00')
- scheduled_date: date
- status: text ('booked', 'attended', 'no_show', 'cancelled')
- source: text ('web', 'whatsapp', 'instagram', etc.)
- utm_source, utm_medium, utm_campaign: text (nullable)
- mailerlite_synced: bool
- reminder_sent: text[]
- created_at, updated_at: timestamptz

### services
Servicios ofrecidos (tipos de clase/sesión).
- id: uuid PK
- name: text
- description: text (nullable)
- duration_minutes: int
- price_clp: int (precio por sesión directa)
- max_capacity: int
- is_active: bool
- is_trial_enabled: bool
- show_in_agenda: bool
- sort_order: int
- color_tag: text
- branch_id: uuid FK → branches.id (nullable)
- created_at, updated_at: timestamptz

### session_packages
Paquetes de sesiones (bonos) disponibles para compra.
- id: uuid PK
- name: text
- description: text (nullable)
- sessions_quantity: int
- price_clp: int
- validity_days: int (default 90)
- applicable_service_ids: uuid[]
- is_active: bool
- available_as_giftcard: bool
- show_in_upsell_modal: bool
- show_in_criomedicina: bool
- created_at, updated_at: timestamptz

### professionals
Profesionales/instructores.
- id: uuid PK
- name: text
- slug: text
- email: text
- is_active: bool
- created_at, updated_at: timestamptz

### branches
Sucursales.
- id: uuid PK
- name: text
- slug: text
- address: text (nullable)
- description: text (nullable)
- is_default: bool
- sort_order: int
- is_active: bool
- created_at, updated_at: timestamptz

### schedule_entries
Horario semanal de clases.
- id: uuid PK
- service_id: uuid FK → services.id
- professional_id: uuid FK → professionals.id (nullable)
- day_of_week: int (0=domingo, 1=lunes, ..., 6=sábado)
- start_time: time
- display_name: text (nullable)
- badges: text[]
- is_active: bool
- sort_order: int
- created_at, updated_at: timestamptz

### generated_slots
Slots de agenda generados (disponibilidad futura).
- id: uuid PK
- professional_id: uuid FK → professionals.id
- service_id: uuid FK → services.id
- date_time_start, date_time_end: timestamptz
- max_capacity: int
- confirmed_bookings: int
- is_active: bool
- created_at, updated_at: timestamptz

### discount_coupons
Cupones de descuento.
- id: uuid PK
- code: text
- discount_type: text ('percentage', 'fixed')
- discount_value: int
- min_purchase_amount: int (nullable)
- max_uses: int (nullable)
- current_uses: int
- applicable_package_ids: uuid[] (nullable)
- valid_from, valid_until: timestamptz (nullable)
- is_active: bool
- created_at, updated_at: timestamptz

### email_subscribers
Suscriptores de email.
- id: uuid PK
- email: text
- whatsapp: text
- source: text
- tags: text[]
- groups: text[]
- mailerlite_synced: bool
- mailerlite_response: jsonb (nullable)
- created_at, updated_at: timestamptz

### chat_conversations
Conversaciones del chatbot público.
- id: uuid PK
- session_id: text (unique)
- messages: jsonb (array de {role, content})
- message_count: int
- first_user_message: text (nullable)
- ip_address: text (nullable)
- created_at, updated_at: timestamptz

## Key Relationships
- bookings.professional_id → professionals.id
- bookings.service_id → services.id
- bookings.session_code_id → session_codes.id
- bookings.coupon_id → discount_coupons.id
- package_orders.package_id → session_packages.id
- session_codes.package_id → session_packages.id
- customer_events.customer_id → customers.id
- customer_memberships.customer_id → customers.id
- customer_memberships.membership_plan_id → membership_plans.id
- schedule_entries.service_id → services.id
- schedule_entries.professional_id → professionals.id
- services.branch_id → branches.id

## Important Business Rules
- Currency is CLP (Chilean Pesos), no decimals.
- Timezone is America/Santiago.
- CONFIRMED + CANCELLED bookings = revenue (no refunds policy).
- REFUNDED bookings = real refund, excluded from revenue.
- session_code used in booking → final_price = 0 on that booking.
- package_orders with status='approved' = successful sale.
`;
