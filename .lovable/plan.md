

## Plan: Fix critical security findings

Three findings to address:

### 1. `package_orders` — public SELECT exposes 90 rows of PII (ERROR)

**Current**: Policy `Anyone can view orders by id USING (true)` lets any visitor list all orders with names, emails, phones, payment IDs.

**Fix**: Drop the `Anyone can view orders by id` policy entirely. Admins + service role still have full access via existing policies.

**Code impact** (only 2 client-side reads remain after the policy is removed):
- `src/pages/BonosSuccess.tsx` — fetches `final_price, status, buyer_email, buyer_name, buyer_phone, session_packages(name)` to fire Facebook Purchase event client-side + server-side (Conversions API).
- `src/pages/GiftCardsSuccess.tsx` — fetches `buyer_email, buyer_name, buyer_phone` for the same reason.

**Replacement**: Move the server-side Conversions API call into the `mercadopago-webhook` edge function (it already runs when payment status becomes `paid` and has full buyer data via service role). The success pages then only fire the client-side pixel using data already returned by `get-order-status` (price, package name) — no need to read PII from the browser at all.

Other uses (`AdminAbandonedCarts`, `AdminPackageOrders`, `AdminDashboard`) are admin-only and continue to work via the existing admin policy.

### 2. `professionals` — emails publicly readable (WARN)

**Current**: Policy `Anyone can view active professionals USING (is_active = true)` exposes the `email` column to anonymous users.

**Fix**: Drop the public-SELECT policy. Public reads should go through the existing `get_active_professionals()` security-definer function (which already returns only `id, name, slug, is_active, created_at, updated_at` — no email). The public agenda page (`AgendaNaveStudio.tsx`) already uses this RPC. Admin pages will continue to read directly via the admin policy.

Remaining authenticated admin reads (`AdminBookings`, `AdminFutureSlots`, `AdminCapacityOverrides`, `AdminProfessionals`, `AvailabilityForm`, `ScheduleEntryForm`) are protected by `ProtectedRoute` and the admin policy still allows them.

The implicit foreign-key joins like `professionals:professional_id(name)` used in admin pages require a SELECT policy; the admin policy covers that.

### 3. Extension in `public` schema (WARN)

Move any extensions installed in `public` to a dedicated `extensions` schema per Supabase guidance. Will run a migration that uses `ALTER EXTENSION ... SET SCHEMA extensions` for each detected extension (typically `pg_net`, `pgcrypto`, `pg_graphql`, etc., depending on what's there). Some Supabase-managed extensions can't be moved — those will be skipped with a NOTICE.

### Files changed

- **Migration**: drop two RLS policies; move extensions out of public.
- `supabase/functions/mercadopago-webhook/index.ts` — fire Facebook Conversions API Purchase event when order transitions to `paid`.
- `src/pages/BonosSuccess.tsx` — remove the `package_orders` query; keep client-side pixel using data from `get-order-status`.
- `src/pages/GiftCardsSuccess.tsx` — remove the `package_orders` query; keep client-side pixel using `orderStatus` data.

### Out of scope (other findings shown in security view)

The other findings (chat_conversations RLS, gift card token enumeration, leaked-password protection, redundant mailerlite policies) are not in this request and will be left alone unless you ask.

