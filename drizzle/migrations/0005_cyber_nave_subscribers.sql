CREATE TABLE public.cyber_nave_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL UNIQUE,
  consent boolean NOT NULL DEFAULT false,
  consent_at timestamptz,
  consent_version text,
  source text NOT NULL DEFAULT 'cyber-nave',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  ip_hash text,
  delivery_status text NOT NULL DEFAULT 'pending',
  delivery_attempts integer NOT NULL DEFAULT 0,
  last_attempt_at timestamptz,
  resend_email_id text,
  delivery_error text,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX cyber_nave_subscribers_ip_created_idx ON public.cyber_nave_subscribers (ip_hash, created_at);
GRANT ALL ON public.cyber_nave_subscribers TO service_role;
GRANT SELECT ON public.cyber_nave_subscribers TO authenticated;
ALTER TABLE public.cyber_nave_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view cyber subscribers" ON public.cyber_nave_subscribers
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER cyber_nave_subscribers_updated_at BEFORE UPDATE ON public.cyber_nave_subscribers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();