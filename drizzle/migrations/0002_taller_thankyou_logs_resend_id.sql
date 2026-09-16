ALTER TABLE public.taller_thankyou_logs
  ADD COLUMN IF NOT EXISTS resend_email_id TEXT,
  ADD COLUMN IF NOT EXISTS idempotency_key TEXT;