CREATE TABLE public.taller_inscripciones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  nivel TEXT NOT NULL,
  taller_nombre TEXT NOT NULL,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  fecha_evento DATE NOT NULL,
  horario TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  mercado_pago_preference_id TEXT,
  mercado_pago_payment_id TEXT,
  mercado_pago_status TEXT,
  paid_at TIMESTAMPTZ,
  cupo_reserved BOOLEAN NOT NULL DEFAULT false,
  source TEXT NOT NULL DEFAULT 'landing taller wim hof',
  slug TEXT NOT NULL DEFAULT '/taller-wim-hof-santiago-fundamentales-avanzado',
  notification_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX taller_inscripciones_payment_id_idx
  ON public.taller_inscripciones(mercado_pago_payment_id)
  WHERE mercado_pago_payment_id IS NOT NULL;
CREATE INDEX taller_inscripciones_event_idx ON public.taller_inscripciones(event_id);
CREATE INDEX taller_inscripciones_email_idx ON public.taller_inscripciones(email);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.taller_inscripciones TO authenticated;
GRANT ALL ON public.taller_inscripciones TO service_role;

ALTER TABLE public.taller_inscripciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage taller inscripciones"
  ON public.taller_inscripciones FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER taller_inscripciones_updated_at
  BEFORE UPDATE ON public.taller_inscripciones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.reserve_event_cupo(_event_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  remaining INTEGER;
BEGIN
  UPDATE public.event_cupos
  SET cupos_vendidos = cupos_vendidos + 1
  WHERE event_id = _event_id
    AND cupos_vendidos < cupos_total
  RETURNING cupos_total - cupos_vendidos INTO remaining;

  IF remaining IS NULL THEN
    RETURN -1;
  END IF;

  RETURN remaining;
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_event_cupo(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reserve_event_cupo(TEXT) TO service_role;