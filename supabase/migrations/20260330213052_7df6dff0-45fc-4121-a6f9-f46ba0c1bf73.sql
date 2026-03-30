CREATE POLICY "Admins can view all availability rules"
ON public.availability_rules
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));