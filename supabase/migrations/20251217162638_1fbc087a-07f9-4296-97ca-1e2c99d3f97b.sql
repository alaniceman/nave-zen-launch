-- Remove the permissive public SELECT policy that exposes customer PII
DROP POLICY IF EXISTS "Anyone can view session codes with valid access token" ON public.session_codes;