-- Remove overly permissive INSERT policy (edge functions use service_role which bypasses RLS)
DROP POLICY IF EXISTS "Service role can insert codes" ON public.session_codes;

-- Remove overly permissive UPDATE policy
DROP POLICY IF EXISTS "Service role can update codes" ON public.session_codes;

-- Add policy for admins to update codes (for admin panel management)
CREATE POLICY "Admins can update session codes" 
ON public.session_codes 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add policy for admins to insert codes (if needed from admin panel)
CREATE POLICY "Admins can insert session codes" 
ON public.session_codes 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));