CREATE OR REPLACE FUNCTION public.icefest_short_ticket_code()
RETURNS text LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE c text; letters constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ'; i int := 0;
BEGIN
 LOOP
  c := substr(letters, 1 + floor(random()*24)::int, 1) || lpad(floor(random()*100)::int::text, 2, '0');
  EXIT WHEN NOT EXISTS (SELECT 1 FROM public.icefest_tickets WHERE ticket_code = c);
  i := i + 1;
  IF i > 5000 THEN RAISE EXCEPTION 'No quedan códigos cortos disponibles'; END IF;
 END LOOP;
 RETURN c;
END; $$;
REVOKE ALL ON FUNCTION public.icefest_short_ticket_code() FROM public, anon, authenticated;
ALTER TABLE public.icefest_tickets ALTER COLUMN ticket_code SET DEFAULT public.icefest_short_ticket_code();