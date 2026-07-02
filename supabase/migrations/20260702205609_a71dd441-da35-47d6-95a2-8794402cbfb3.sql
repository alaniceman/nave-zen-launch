
CREATE TABLE public.membership_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  plan_code TEXT,
  plan_label TEXT,
  plan_group TEXT,
  boxmagic_url TEXT,
  requested_start_date DATE,
  status TEXT NOT NULL DEFAULT 'interesado_membresia',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  redirected_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  paid_marked_by UUID,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.membership_leads TO authenticated;
GRANT ALL ON public.membership_leads TO service_role;

ALTER TABLE public.membership_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view membership leads"
  ON public.membership_leads FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update membership leads"
  ON public.membership_leads FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete membership leads"
  ON public.membership_leads FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_membership_leads_updated_at
  BEFORE UPDATE ON public.membership_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_membership_leads_email ON public.membership_leads(customer_email);
CREATE INDEX idx_membership_leads_status ON public.membership_leads(status);
CREATE INDEX idx_membership_leads_created_at ON public.membership_leads(created_at DESC);
