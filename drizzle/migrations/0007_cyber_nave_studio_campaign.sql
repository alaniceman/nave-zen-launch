CREATE TABLE public.cyber_products (
  id uuid PRIMARY KEY,
  sku text NOT NULL UNIQUE,
  kind text NOT NULL CHECK (kind IN ('pack','membership')),
  name text NOT NULL,
  price integer NOT NULL,
  regular_price integer NOT NULL,
  own_codes integer NOT NULL DEFAULT 0,
  invite_codes integer NOT NULL DEFAULT 0,
  validity_months integer NOT NULL DEFAULT 6,
  plan_name text,
  months_paid integer,
  months_free integer,
  months_total integer,
  campaign text NOT NULL DEFAULT 'cyber-2026-10',
  ends_at timestamptz NOT NULL DEFAULT '2026-10-07T23:59:59-03:00',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cyber_products TO anon, authenticated;
GRANT ALL ON public.cyber_products TO service_role;
ALTER TABLE public.cyber_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read cyber products" ON public.cyber_products FOR SELECT USING (true);
CREATE POLICY "Admins manage cyber products" ON public.cyber_products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.cyber_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_order_id uuid NOT NULL REFERENCES public.shop_orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.cyber_products(id),
  sku text NOT NULL,
  kind text NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price integer NOT NULL,
  total_amount integer NOT NULL,
  buyer_name text NOT NULL,
  buyer_email text NOT NULL,
  buyer_phone text,
  plan_name text,
  months_paid integer,
  months_free integer,
  months_total integer,
  own_codes text[] NOT NULL DEFAULT '{}',
  invite_codes text[] NOT NULL DEFAULT '{}',
  codes_expire_at timestamptz,
  payment_status text NOT NULL DEFAULT 'pending',
  activation_status text NOT NULL DEFAULT 'not_applicable',
  mercado_pago_payment_id text,
  paid_at timestamptz,
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (shop_order_id, product_id)
);
GRANT SELECT, UPDATE ON public.cyber_purchases TO authenticated;
GRANT ALL ON public.cyber_purchases TO service_role;
ALTER TABLE public.cyber_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read cyber purchases" ON public.cyber_purchases FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update cyber purchases" ON public.cyber_purchases FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_cyber_purchases_updated_at BEFORE UPDATE ON public.cyber_purchases FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.cyber_products (id, sku, kind, name, price, regular_price, own_codes, invite_codes, plan_name, months_paid, months_free, months_total) VALUES
('c7be0000-0000-4000-8000-000000000001','bautizo','pack','Cyber · Bautizo de hielo (1 sesión)',15000,30000,1,0,NULL,NULL,NULL,NULL),
('c7be0000-0000-4000-8000-000000000002','pack-3','pack','Cyber · 3 sesiones + 1 invitación',36000,90000,3,1,NULL,NULL,NULL,NULL),
('c7be0000-0000-4000-8000-000000000003','pack-6','pack','Cyber · 6 sesiones + 2 invitaciones',60000,180000,6,2,NULL,NULL,NULL,NULL),
('c7be0000-0000-4000-8000-000000000011','orbita-3','membership','Cyber · Órbita 3 meses',201450,237000,0,0,'Órbita',3,0,3),
('c7be0000-0000-4000-8000-000000000012','universo-3','membership','Cyber · Universo 3 meses',242250,285000,0,0,'Universo',3,0,3),
('c7be0000-0000-4000-8000-000000000013','yoga-continuo-3','membership','Cyber · Yoga Continuo 3 meses',175950,207000,0,0,'Yoga Continuo',3,0,3),
('c7be0000-0000-4000-8000-000000000014','yoga-libre-3','membership','Cyber · Yoga Libre 3 meses',216750,255000,0,0,'Yoga Libre',3,0,3),
('c7be0000-0000-4000-8000-000000000021','orbita-7','membership','Cyber · Órbita 7 meses (pagas 6)',379200,553000,0,0,'Órbita',6,1,7),
('c7be0000-0000-4000-8000-000000000022','universo-7','membership','Cyber · Universo 7 meses (pagas 6)',456000,665000,0,0,'Universo',6,1,7),
('c7be0000-0000-4000-8000-000000000023','yoga-continuo-7','membership','Cyber · Yoga Continuo 7 meses (pagas 6)',331200,483000,0,0,'Yoga Continuo',6,1,7),
('c7be0000-0000-4000-8000-000000000024','yoga-libre-7','membership','Cyber · Yoga Libre 7 meses (pagas 6)',408000,595000,0,0,'Yoga Libre',6,1,7),
('c7be0000-0000-4000-8000-000000000031','orbita-14','membership','Cyber · Órbita 14 meses (pagas 12)',711000,1106000,0,0,'Órbita',12,2,14),
('c7be0000-0000-4000-8000-000000000032','universo-14','membership','Cyber · Universo 14 meses (pagas 12)',855000,1330000,0,0,'Universo',12,2,14),
('c7be0000-0000-4000-8000-000000000033','yoga-continuo-14','membership','Cyber · Yoga Continuo 14 meses (pagas 12)',621000,966000,0,0,'Yoga Continuo',12,2,14),
('c7be0000-0000-4000-8000-000000000034','yoga-libre-14','membership','Cyber · Yoga Libre 14 meses (pagas 12)',765000,1190000,0,0,'Yoga Libre',12,2,14);