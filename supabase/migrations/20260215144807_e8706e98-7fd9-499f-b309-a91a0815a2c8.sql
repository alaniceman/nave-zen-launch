-- Remove the public SELECT policy on discount_coupons
DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.discount_coupons;

-- Create a restrictive policy: only admins can SELECT
-- The validate-coupon edge function will use service_role key to bypass RLS
CREATE POLICY "Only admins can view coupons"
ON public.discount_coupons
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
