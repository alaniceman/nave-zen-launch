
ALTER TABLE public.trial_bookings
  ADD COLUMN IF NOT EXISTS plan_type text,
  ADD COLUMN IF NOT EXISTS requested_start_date date,
  ADD COLUMN IF NOT EXISTS actual_start_date date,
  ADD COLUMN IF NOT EXISTS actual_end_date date,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz,
  ADD COLUMN IF NOT EXISTS paid_marked_by uuid,
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS redirected_to_boxmagic_at timestamptz;

UPDATE public.trial_bookings SET plan_type = 'free_class' WHERE plan_type IS NULL;

CREATE INDEX IF NOT EXISTS idx_trial_bookings_plan_type ON public.trial_bookings(plan_type);
CREATE INDEX IF NOT EXISTS idx_trial_bookings_status ON public.trial_bookings(status);
