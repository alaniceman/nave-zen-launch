-- 1. Drop public SELECT policy on package_orders (PII exposure)
DROP POLICY IF EXISTS "Anyone can view orders by id" ON public.package_orders;

-- 2. Drop public SELECT policy on professionals (email exposure)
-- Public reads should go through get_active_professionals() RPC instead
DROP POLICY IF EXISTS "Anyone can view active professionals" ON public.professionals;

-- 3. Move extensions out of public schema where possible
CREATE SCHEMA IF NOT EXISTS extensions;
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

DO $$
DECLARE
  ext RECORD;
BEGIN
  FOR ext IN
    SELECT e.extname
    FROM pg_extension e
    JOIN pg_namespace n ON n.oid = e.extnamespace
    WHERE n.nspname = 'public'
      AND e.extname NOT IN ('plpgsql')
  LOOP
    BEGIN
      EXECUTE format('ALTER EXTENSION %I SET SCHEMA extensions', ext.extname);
      RAISE NOTICE 'Moved extension % to extensions schema', ext.extname;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not move extension %: %', ext.extname, SQLERRM;
    END;
  END LOOP;
END $$;