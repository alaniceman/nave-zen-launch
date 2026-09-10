CREATE TABLE IF NOT EXISTS public.email_campaign_sends (
  id uuid primary key default gen_random_uuid(),
  campaign text not null,
  email text not null,
  sent_at timestamptz not null default now(),
  unique (campaign, email)
);
GRANT ALL ON public.email_campaign_sends TO service_role;
ALTER TABLE public.email_campaign_sends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view campaign sends" ON public.email_campaign_sends FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
GRANT SELECT ON public.email_campaign_sends TO authenticated;