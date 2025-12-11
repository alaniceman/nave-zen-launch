-- Fix search_path for ensure_uppercase_code function
CREATE OR REPLACE FUNCTION public.ensure_uppercase_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.code = UPPER(NEW.code);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;