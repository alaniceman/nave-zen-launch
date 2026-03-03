

## Plan: Create 6 gift session codes for Marcos (no metric pollution)

### What will be done

1. **Insert 6 session codes directly** into `session_codes` table via SQL INSERT (no `package_orders` row created):
   - Buyer: Marcos (`Marcosmarcialg@gmail.com`)
   - Service: Sesión Criomedicina / Método Wim Hof (`ced4be53-8e5c-4d34-8370-0784f8d7a4b1`)
   - Expiration: 2026-04-18T23:59:59 (Chile time)
   - `mercado_pago_payment_id`: `GIFT_MARCOS` to identify as manual gift
   - 6 unique random 8-char uppercase codes

2. **Send email** via `send-session-codes-email` edge function with the 6 codes

3. **No `package_orders` row** -- this is the key to avoiding dashboard pollution since `AdminDashboard` calculates revenue from `package_orders` with status `paid`

4. **No MailerLite ecommerce sync** -- keeps revenue stats clean there too

5. **CRM upsert** with $0 amount just to have a record of the gift in customer history (optional, non-revenue event)

### Why this won't pollute metrics
- Dashboard "Ingresos Reales" sums `final_price` from `package_orders` where `status = 'paid'` -- no row = no impact
- Dashboard "Bonos por Ingresos" also queries `package_orders` -- same
- No MailerLite order sync = no revenue impact there

### Files to modify
None -- purely operational (DB insert + edge function call)

