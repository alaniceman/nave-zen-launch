CREATE TABLE public.meta_event_deliveries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name text NOT NULL,
  event_id text NOT NULL,
  funnel text,
  entity_type text,
  entity_id text,
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  event_time timestamp with time zone NOT NULL DEFAULT now(),
  sent_at timestamp with time zone,
  error_code text,
  error_message text,
  meta_trace_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT meta_event_deliveries_status_check CHECK (status IN ('pending','sent','failed','skipped'))
);

CREATE UNIQUE INDEX meta_event_deliveries_event_id_key ON public.meta_event_deliveries (event_id);
CREATE INDEX meta_event_deliveries_status_idx ON public.meta_event_deliveries (status, created_at DESC);

GRANT ALL ON public.meta_event_deliveries TO service_role;
GRANT SELECT ON public.meta_event_deliveries TO authenticated;

ALTER TABLE public.meta_event_deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view meta event deliveries"
ON public.meta_event_deliveries
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_meta_event_deliveries_updated_at
BEFORE UPDATE ON public.meta_event_deliveries
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();