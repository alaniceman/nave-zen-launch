-- Update existing codes to uppercase
UPDATE session_codes 
SET code = UPPER(code)
WHERE code != UPPER(code);

-- Create function to ensure codes are always uppercase
CREATE OR REPLACE FUNCTION public.ensure_uppercase_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.code = UPPER(NEW.code);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically uppercase codes on insert/update
CREATE TRIGGER trigger_uppercase_session_code
BEFORE INSERT OR UPDATE ON session_codes
FOR EACH ROW
EXECUTE FUNCTION public.ensure_uppercase_code();