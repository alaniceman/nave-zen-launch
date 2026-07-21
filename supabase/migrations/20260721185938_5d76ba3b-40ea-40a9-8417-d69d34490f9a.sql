
CREATE TABLE public.trial_reminder_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.trial_bookings(id) ON DELETE CASCADE,
  reminder_day integer NOT NULL,
  scheduled_for date NOT NULL,
  sent_at timestamptz,
  status text NOT NULL DEFAULT 'sent',
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (lead_id, reminder_day)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.trial_reminder_logs TO authenticated;
GRANT ALL ON public.trial_reminder_logs TO service_role;

ALTER TABLE public.trial_reminder_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage trial reminder logs"
  ON public.trial_reminder_logs
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_trial_reminder_logs_updated_at
  BEFORE UPDATE ON public.trial_reminder_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
