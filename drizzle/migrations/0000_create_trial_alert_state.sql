CREATE TABLE public.trial_alert_state (
  id text PRIMARY KEY,
  signature text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.trial_alert_state TO service_role;

ALTER TABLE public.trial_alert_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view trial alert state"
ON public.trial_alert_state
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

GRANT SELECT ON public.trial_alert_state TO authenticated;