
-- Table: integrations_mailerlite (config for MailerLite shop)
CREATE TABLE public.integrations_mailerlite (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mailerlite_account_id text,
  mailerlite_shop_id text,
  shop_name text NOT NULL DEFAULT 'Nave Studio',
  currency text NOT NULL DEFAULT 'CLP',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.integrations_mailerlite ENABLE ROW LEVEL SECURITY;

-- Admins can manage the config
CREATE POLICY "Admins can manage mailerlite config"
  ON public.integrations_mailerlite
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can read the account_id (needed for Universal JS, not secret)
CREATE POLICY "Anyone can view active mailerlite config"
  ON public.integrations_mailerlite
  FOR SELECT
  USING (is_active = true);

-- Service role can update (for edge functions)
CREATE POLICY "Service role can update mailerlite config"
  ON public.integrations_mailerlite
  FOR UPDATE
  USING (true);

CREATE POLICY "Service role can insert mailerlite config"
  ON public.integrations_mailerlite
  FOR INSERT
  WITH CHECK (true);

-- Table: orders_sync_log (log of synced orders to MailerLite)
CREATE TABLE public.orders_sync_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id text NOT NULL,
  order_type text NOT NULL DEFAULT 'package_order',
  status text NOT NULL DEFAULT 'pending',
  request_body jsonb,
  response_body jsonb,
  http_status integer,
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.orders_sync_log ENABLE ROW LEVEL SECURITY;

-- Admins can view sync logs
CREATE POLICY "Admins can view sync logs"
  ON public.orders_sync_log
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Service role can insert/update logs
CREATE POLICY "Service role can insert sync logs"
  ON public.orders_sync_log
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update sync logs"
  ON public.orders_sync_log
  FOR UPDATE
  USING (true);

-- Create index for idempotency lookups
CREATE INDEX idx_orders_sync_log_order_id ON public.orders_sync_log (order_id);

-- Create trigger for updated_at on integrations_mailerlite
CREATE TRIGGER update_integrations_mailerlite_updated_at
  BEFORE UPDATE ON public.integrations_mailerlite
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
