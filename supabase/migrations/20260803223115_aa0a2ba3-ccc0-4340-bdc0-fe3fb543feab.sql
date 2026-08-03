CREATE TABLE IF NOT EXISTS public.email_optouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  list_type TEXT NOT NULL DEFAULT 'weekly_package_reminder',
  token TEXT NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  opted_out_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (email, list_type)
);

GRANT ALL ON public.email_optouts TO service_role;
ALTER TABLE public.email_optouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view optouts" ON public.email_optouts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.weekly_reminder_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  buyer_name TEXT,
  week_key TEXT NOT NULL,
  remaining INTEGER,
  status TEXT NOT NULL DEFAULT 'sent',
  error_message TEXT,
  subject TEXT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (email, week_key)
);

GRANT ALL ON public.weekly_reminder_logs TO service_role;
ALTER TABLE public.weekly_reminder_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view weekly reminder logs" ON public.weekly_reminder_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_weekly_reminder_logs_week ON public.weekly_reminder_logs (week_key);