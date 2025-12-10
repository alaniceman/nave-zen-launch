-- Drop the public SELECT policy that exposes emails
DROP POLICY IF EXISTS "Anyone can view active professionals" ON public.professionals;

-- Create a public view that only exposes safe columns (no email)
CREATE OR REPLACE VIEW public.professionals_public AS
SELECT 
  id,
  name,
  slug,
  is_active,
  created_at,
  updated_at
FROM public.professionals
WHERE is_active = true;

-- Grant access to the view for anonymous and authenticated users
GRANT SELECT ON public.professionals_public TO anon;
GRANT SELECT ON public.professionals_public TO authenticated;

-- Create a security definer function to get public professional data
-- This bypasses RLS and returns only safe fields
CREATE OR REPLACE FUNCTION public.get_active_professionals()
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  is_active boolean,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.name,
    p.slug,
    p.is_active,
    p.created_at,
    p.updated_at
  FROM public.professionals p
  WHERE p.is_active = true;
$$;