-- Drop the overly permissive policy that exposes all subscriber data
DROP POLICY IF EXISTS "Allow authenticated users to read" ON public.email_subscribers;

-- Add admin-only policy for viewing subscribers
CREATE POLICY "Admins can view subscribers"
  ON public.email_subscribers
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));