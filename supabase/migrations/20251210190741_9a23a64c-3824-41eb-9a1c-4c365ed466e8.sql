-- Drop the security definer view (flagged by linter)
-- We'll use the function instead which is properly scoped
DROP VIEW IF EXISTS public.professionals_public;

-- The function get_active_professionals() is the proper way to access public data
-- It's a security definer function with a fixed search_path which is safe