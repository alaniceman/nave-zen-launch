
-- Workshop lead tables
CREATE TABLE public.taller_santiago_fundamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT true,
  paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX taller_santiago_fundamentos_email_idx ON public.taller_santiago_fundamentos(email);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.taller_santiago_fundamentos TO authenticated;
GRANT INSERT ON public.taller_santiago_fundamentos TO anon;
GRANT ALL ON public.taller_santiago_fundamentos TO service_role;
ALTER TABLE public.taller_santiago_fundamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert santiago fundamentos leads"
  ON public.taller_santiago_fundamentos FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "Admins manage santiago fundamentos leads"
  ON public.taller_santiago_fundamentos FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.taller_santiago_avanzado (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT true,
  paid BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX taller_santiago_avanzado_email_idx ON public.taller_santiago_avanzado(email);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.taller_santiago_avanzado TO authenticated;
GRANT INSERT ON public.taller_santiago_avanzado TO anon;
GRANT ALL ON public.taller_santiago_avanzado TO service_role;
ALTER TABLE public.taller_santiago_avanzado ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert santiago avanzado leads"
  ON public.taller_santiago_avanzado FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "Admins manage santiago avanzado leads"
  ON public.taller_santiago_avanzado FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Event cupos tracking
CREATE TABLE public.event_cupos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE,
  cupos_total INTEGER NOT NULL DEFAULT 15,
  cupos_vendidos INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.event_cupos TO anon, authenticated;
GRANT ALL ON public.event_cupos TO service_role;
ALTER TABLE public.event_cupos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read event cupos"
  ON public.event_cupos FOR SELECT
  TO anon, authenticated
  USING (true);
CREATE POLICY "Admins manage event cupos"
  ON public.event_cupos FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER event_cupos_updated_at
  BEFORE UPDATE ON public.event_cupos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.event_cupos (event_id, cupos_total, cupos_vendidos) VALUES
  ('santiago_fundamentos_2026_06_27', 15, 0),
  ('santiago_avanzado_2026_06_28', 15, 0);
