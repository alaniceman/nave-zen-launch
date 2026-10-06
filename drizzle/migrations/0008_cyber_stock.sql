CREATE TABLE public.cyber_stock (
  pool text PRIMARY KEY,
  label text NOT NULL,
  total integer NOT NULL DEFAULT 0,
  sold integer NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cyber_stock TO anon, authenticated;
GRANT UPDATE ON public.cyber_stock TO authenticated;
GRANT ALL ON public.cyber_stock TO service_role;
ALTER TABLE public.cyber_stock ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cyber stock visible" ON public.cyber_stock FOR SELECT USING (true);
CREATE POLICY "Admins update cyber stock" ON public.cyber_stock FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER cyber_stock_updated_at BEFORE UPDATE ON public.cyber_stock
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.cyber_products ADD COLUMN IF NOT EXISTS stock_pool text;

CREATE OR REPLACE FUNCTION public.cyber_stock_add(_pool text, _qty integer)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.cyber_stock SET sold = sold + _qty WHERE pool = _pool;
$$;
REVOKE EXECUTE ON FUNCTION public.cyber_stock_add(text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cyber_stock_add(text, integer) TO service_role;