CREATE POLICY "Anyone can view active professionals"
ON public.professionals
FOR SELECT
TO anon, authenticated
USING (is_active = true);

GRANT SELECT ON public.professionals TO anon;