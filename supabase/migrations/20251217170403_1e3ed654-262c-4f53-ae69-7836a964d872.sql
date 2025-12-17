-- Add SELECT policy for admins to view professionals
CREATE POLICY "Admins can view professionals" 
ON public.professionals 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Also add a public SELECT policy for active professionals (needed for public booking flow)
CREATE POLICY "Anyone can view active professionals" 
ON public.professionals 
FOR SELECT 
USING (is_active = true);