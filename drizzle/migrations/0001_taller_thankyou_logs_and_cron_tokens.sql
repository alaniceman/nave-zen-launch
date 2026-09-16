-- Log durable de idempotencia para el email de agradecimiento post-taller
CREATE TABLE public.taller_thankyou_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inscripcion_id UUID NOT NULL UNIQUE,
  event_id TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.taller_thankyou_logs TO service_role;
GRANT SELECT ON public.taller_thankyou_logs TO authenticated;

ALTER TABLE public.taller_thankyou_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view taller thankyou logs"
ON public.taller_thankyou_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_taller_thankyou_logs_updated_at
BEFORE UPDATE ON public.taller_thankyou_logs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tokens internos para proteger endpoints invocados por pg_cron (sin secretos en el código)
CREATE TABLE public.internal_cron_tokens (
  name TEXT PRIMARY KEY,
  token TEXT NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.internal_cron_tokens TO service_role;

ALTER TABLE public.internal_cron_tokens ENABLE ROW LEVEL SECURITY;
