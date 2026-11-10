DROP POLICY IF EXISTS "Public can read cyber products" ON public.cyber_products;
CREATE POLICY "Public can read active cyber products" ON public.cyber_products
FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "Cyber stock visible" ON public.cyber_stock;
CREATE POLICY "Public can read stock of active cyber pools" ON public.cyber_stock
FOR SELECT TO anon, authenticated USING (
  EXISTS (SELECT 1 FROM public.cyber_products p WHERE p.stock_pool = cyber_stock.pool AND p.is_active = true)
);
CREATE POLICY "Admins read all cyber stock" ON public.cyber_stock
FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));