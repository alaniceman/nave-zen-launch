ALTER TABLE public.trial_bookings ADD COLUMN IF NOT EXISTS meta_context jsonb NOT NULL DEFAULT '{}'::jsonb;
COMMENT ON COLUMN public.trial_bookings.meta_context IS 'Browser attribution snapshot: first_touch and last_touch at lead creation.';
ALTER TABLE public.icefest_orders ADD COLUMN IF NOT EXISTS admin_notification_sent_at timestamptz;