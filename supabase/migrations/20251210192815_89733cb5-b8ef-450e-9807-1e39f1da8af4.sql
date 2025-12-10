-- Drop the dangerous open SELECT policy that exposes all customer data
DROP POLICY IF EXISTS "Anyone can view their own bookings by email" ON public.bookings;

-- Note: The existing "Admins can view all bookings" policy remains in place
-- Customers receive booking confirmations via email, so they don't need direct DB access
-- The edge functions (create-booking, mercadopago-webhook) use service role for writes