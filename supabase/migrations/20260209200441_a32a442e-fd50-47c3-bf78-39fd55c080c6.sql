
-- Create trial_bookings table
CREATE TABLE public.trial_bookings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  class_title text NOT NULL,
  class_day text NOT NULL,
  class_time text NOT NULL,
  scheduled_date date NOT NULL,
  status text NOT NULL DEFAULT 'booked',
  source text NOT NULL DEFAULT 'web',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  mailerlite_synced boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trial_bookings ENABLE ROW LEVEL SECURITY;

-- SELECT: admins only
CREATE POLICY "Admins can view trial bookings"
  ON public.trial_bookings FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- INSERT: only via service role (edge function) — no anon/user insert
-- No INSERT policy needed; service role bypasses RLS

-- UPDATE: admins only (service role bypasses RLS)
CREATE POLICY "Admins can update trial bookings"
  ON public.trial_bookings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_trial_bookings_updated_at
  BEFORE UPDATE ON public.trial_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for eligibility lookup
CREATE INDEX idx_trial_bookings_email_status ON public.trial_bookings (customer_email, status);
