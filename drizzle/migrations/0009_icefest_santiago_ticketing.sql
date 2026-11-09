CREATE TABLE public.icefest_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text UNIQUE NOT NULL, name text NOT NULL, date date NOT NULL, schedule text NOT NULL DEFAULT '', location text NOT NULL DEFAULT '', address text NOT NULL DEFAULT '', description text NOT NULL DEFAULT '', google_maps_link text NOT NULL DEFAULT '', whatsapp_link text NOT NULL DEFAULT '', instructions text NOT NULL DEFAULT '', includes_lunch boolean NOT NULL DEFAULT false, includes_cacao boolean NOT NULL DEFAULT true, is_active boolean NOT NULL DEFAULT true, sales_open boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.icefest_events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.icefest_events TO authenticated;
GRANT ALL ON public.icefest_events TO service_role;
ALTER TABLE public.icefest_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY icefest_events_public ON public.icefest_events FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY icefest_events_admin ON public.icefest_events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TABLE public.icefest_ticket_types (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), event_id uuid NOT NULL REFERENCES public.icefest_events(id), name text NOT NULL, description text NOT NULL DEFAULT '', price integer NOT NULL DEFAULT 0 CHECK (price >= 0), stock integer CHECK (stock >= 0), stock_sold integer NOT NULL DEFAULT 0 CHECK (stock_sold >= 0), max_per_order integer NOT NULL DEFAULT 10 CHECK (max_per_order BETWEEN 1 AND 50), valid_from timestamptz, valid_until timestamptz, display_order integer NOT NULL DEFAULT 0, is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.icefest_ticket_types TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.icefest_ticket_types TO authenticated;
GRANT ALL ON public.icefest_ticket_types TO service_role;
ALTER TABLE public.icefest_ticket_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY icefest_types_public ON public.icefest_ticket_types FOR SELECT TO anon, authenticated USING (is_active AND EXISTS (SELECT 1 FROM public.icefest_events e WHERE e.id = event_id AND e.is_active));
CREATE POLICY icefest_types_admin ON public.icefest_ticket_types FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TABLE public.icefest_discounts (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), event_id uuid NOT NULL REFERENCES public.icefest_events(id), ticket_type_id uuid REFERENCES public.icefest_ticket_types(id), name text NOT NULL, code text, discount_type text NOT NULL DEFAULT 'percentage' CHECK (discount_type IN ('percentage', 'fixed_amount', 'fixed_price')), discount_value integer NOT NULL CHECK (discount_value >= 0), min_quantity integer NOT NULL DEFAULT 1 CHECK (min_quantity > 0), max_quantity integer, min_purchase_amount integer NOT NULL DEFAULT 0, max_uses integer, times_used integer NOT NULL DEFAULT 0, combinable boolean NOT NULL DEFAULT false, valid_from timestamptz, valid_until timestamptz, is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(event_id, code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.icefest_discounts TO authenticated;
GRANT ALL ON public.icefest_discounts TO service_role;
ALTER TABLE public.icefest_discounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY icefest_discounts_admin ON public.icefest_discounts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TABLE public.icefest_orders (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), event_id uuid NOT NULL REFERENCES public.icefest_events(id), ticket_type_id uuid NOT NULL REFERENCES public.icefest_ticket_types(id), buyer_name text NOT NULL, buyer_surname text NOT NULL DEFAULT '', buyer_email text NOT NULL, buyer_phone text NOT NULL DEFAULT '', quantity integer NOT NULL CHECK (quantity BETWEEN 1 AND 50), original_amount integer NOT NULL, discount_amount integer NOT NULL DEFAULT 0, total_amount integer NOT NULL CHECK (total_amount >= 0), discount_ids uuid[] NOT NULL DEFAULT '{}', status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','expired','refunded','needs_review')), source text NOT NULL DEFAULT 'web', source_order_id text UNIQUE, access_token uuid NOT NULL DEFAULT gen_random_uuid(), preference_id text, payment_id text UNIQUE, payment_status text, paid_at timestamptz, reserved_until timestamptz NOT NULL DEFAULT (now() + interval '30 minutes'), receipt_sent_at timestamptz, details_sent_at timestamptz, email_error text, email_lock_until timestamptz, recovery_sent_at timestamptz, meta_context jsonb NOT NULL DEFAULT '{}', admin_notes text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.icefest_orders TO authenticated;
GRANT ALL ON public.icefest_orders TO service_role;
ALTER TABLE public.icefest_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY icefest_orders_admin_read ON public.icefest_orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY icefest_orders_admin_update ON public.icefest_orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TABLE public.icefest_tickets (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid NOT NULL REFERENCES public.icefest_orders(id), event_id uuid NOT NULL REFERENCES public.icefest_events(id), ticket_code text UNIQUE NOT NULL DEFAULT ('IF-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))), ticket_number integer NOT NULL, access_token uuid NOT NULL DEFAULT gen_random_uuid(), checked_in boolean NOT NULL DEFAULT false, checked_in_at timestamptz, checked_in_by uuid, is_valid boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(order_id, ticket_number)
);
GRANT SELECT ON public.icefest_tickets TO authenticated;
GRANT ALL ON public.icefest_tickets TO service_role;
ALTER TABLE public.icefest_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY icefest_tickets_admin_read ON public.icefest_tickets FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX icefest_orders_reservations ON public.icefest_orders(ticket_type_id, status, reserved_until);
CREATE INDEX icefest_orders_email ON public.icefest_orders(buyer_email, created_at);
CREATE INDEX icefest_tickets_event ON public.icefest_tickets(event_id);
CREATE OR REPLACE FUNCTION public.icefest_price(_type_id uuid, _quantity integer, _coupon text DEFAULT NULL) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $$
DECLARE t public.icefest_ticket_types; e public.icefest_events; d record; subtotal integer; savings integer; ids uuid[] := '{}'; group_applied boolean := false;
BEGIN
 SELECT * INTO t FROM public.icefest_ticket_types WHERE id = _type_id;
 SELECT * INTO e FROM public.icefest_events WHERE id = t.event_id;
 IF t.id IS NULL OR NOT t.is_active OR NOT e.is_active OR NOT e.sales_open OR e.date < (now() AT TIME ZONE 'America/Santiago')::date THEN RAISE EXCEPTION 'La venta de entradas está cerrada'; END IF;
 IF _quantity < 1 OR _quantity > t.max_per_order THEN RAISE EXCEPTION 'Cantidad fuera del límite permitido'; END IF;
 IF (t.valid_from IS NOT NULL AND t.valid_from > now()) OR (t.valid_until IS NOT NULL AND t.valid_until <= now()) THEN RAISE EXCEPTION 'Esta etapa de venta no está vigente'; END IF;
 IF EXISTS(SELECT 1 FROM public.icefest_ticket_types x WHERE x.event_id = t.event_id AND x.is_active AND x.display_order < t.display_order AND (x.valid_from IS NULL OR x.valid_from <= now()) AND (x.valid_until IS NULL OR x.valid_until > now()) AND (x.stock IS NULL OR x.stock_sold < x.stock)) THEN RAISE EXCEPTION 'Hay una etapa de venta anterior disponible'; END IF;
 subtotal := t.price * _quantity;
 FOR d IN SELECT * FROM public.icefest_discounts WHERE event_id = t.event_id AND is_active AND (ticket_type_id IS NULL OR ticket_type_id = t.id) AND (valid_from IS NULL OR valid_from <= now()) AND (valid_until IS NULL OR valid_until > now()) AND min_quantity <= _quantity AND (max_quantity IS NULL OR max_quantity >= _quantity) AND min_purchase_amount <= subtotal AND (max_uses IS NULL OR times_used < max_uses) AND (code IS NULL OR code = upper(trim(_coupon))) ORDER BY (code IS NOT NULL), created_at LOOP
  IF d.code IS NULL AND group_applied THEN CONTINUE; END IF;
  IF d.code IS NOT NULL AND group_applied AND NOT d.combinable THEN RAISE EXCEPTION 'El cupón no se acumula con descuentos por cantidad'; END IF;
  savings := CASE d.discount_type WHEN 'percentage' THEN round(subtotal * least(d.discount_value,100)::numeric / 100)::integer WHEN 'fixed_price' THEN greatest(0,subtotal-d.discount_value*_quantity) ELSE d.discount_value END;
  subtotal := greatest(0,subtotal - savings); ids := array_append(ids,d.id);
  IF d.code IS NULL THEN group_applied := true; END IF;
 END LOOP;
 IF nullif(trim(_coupon),'') IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.icefest_discounts WHERE id = ANY(ids) AND code = upper(trim(_coupon))) THEN RAISE EXCEPTION 'Cupón inválido, vencido o no aplicable'; END IF;
 RETURN jsonb_build_object('original_amount',t.price*_quantity,'total_amount',subtotal,'discount_amount',t.price*_quantity-subtotal,'discount_ids',to_jsonb(ids));
END; $$;
REVOKE ALL ON FUNCTION public.icefest_price(uuid,integer,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.icefest_price(uuid,integer,text) TO service_role;
CREATE OR REPLACE FUNCTION public.icefest_reserve_order(_type_id uuid, _quantity integer, _buyer jsonb, _coupon text DEFAULT NULL, _meta jsonb DEFAULT '{}') RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $$
DECLARE t public.icefest_ticket_types; p jsonb; pending_qty integer; o public.icefest_orders; discount_id uuid;
BEGIN
 SELECT * INTO t FROM public.icefest_ticket_types WHERE id = _type_id FOR UPDATE;
 IF t.id IS NULL THEN RAISE EXCEPTION 'Entrada no encontrada'; END IF;
 PERFORM 1 FROM public.icefest_discounts WHERE event_id = t.event_id ORDER BY id FOR UPDATE;
 p := public.icefest_price(_type_id,_quantity,_coupon);
 SELECT COALESCE(sum(quantity),0)::integer INTO pending_qty FROM public.icefest_orders WHERE ticket_type_id = t.id AND status = 'pending' AND reserved_until > now();
 IF t.stock IS NOT NULL AND t.stock_sold + pending_qty + _quantity > t.stock THEN RAISE EXCEPTION 'No quedan suficientes cupos en esta etapa'; END IF;
 FOR discount_id IN SELECT jsonb_array_elements_text(p->'discount_ids')::uuid LOOP
  IF EXISTS(SELECT 1 FROM public.icefest_discounts d WHERE d.id = discount_id AND d.max_uses IS NOT NULL AND d.times_used + (SELECT count(*) FROM public.icefest_orders po WHERE po.status='pending' AND po.reserved_until>now() AND discount_id=ANY(po.discount_ids)) >= d.max_uses) THEN RAISE EXCEPTION 'El descuento alcanzó su límite de usos'; END IF;
 END LOOP;
 INSERT INTO public.icefest_orders(event_id,ticket_type_id,buyer_name,buyer_surname,buyer_email,buyer_phone,quantity,original_amount,total_amount,discount_amount,discount_ids,meta_context)
 VALUES(t.event_id,t.id,_buyer->>'name',COALESCE(_buyer->>'surname',''),lower(trim(_buyer->>'email')),COALESCE(_buyer->>'phone',''),_quantity,(p->>'original_amount')::integer,(p->>'total_amount')::integer,(p->>'discount_amount')::integer,ARRAY(SELECT jsonb_array_elements_text(p->'discount_ids')::uuid),_meta) RETURNING * INTO o;
 RETURN jsonb_build_object('id',o.id,'access_token',o.access_token,'total_amount',o.total_amount,'reserved_until',o.reserved_until);
END; $$;
REVOKE ALL ON FUNCTION public.icefest_reserve_order(uuid,integer,jsonb,text,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.icefest_reserve_order(uuid,integer,jsonb,text,jsonb) TO service_role;
CREATE OR REPLACE FUNCTION public.icefest_confirm_order(_order_id uuid, _payment_id text, _amount integer, _currency text DEFAULT 'CLP') RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $$
DECLARE o public.icefest_orders; t public.icefest_ticket_types; pending_qty integer;
BEGIN
 SELECT * INTO o FROM public.icefest_orders WHERE id=_order_id FOR UPDATE;
 IF o.id IS NULL THEN RETURN jsonb_build_object('ok',false,'reason','not_found'); END IF;
 IF o.status='paid' THEN RETURN jsonb_build_object('ok',true,'first_time',false); END IF;
 IF o.status='refunded' THEN RETURN jsonb_build_object('ok',false,'reason','refunded'); END IF;
 SELECT * INTO t FROM public.icefest_ticket_types WHERE id=o.ticket_type_id FOR UPDATE;
 IF _currency <> 'CLP' OR _amount <> o.total_amount THEN
  UPDATE public.icefest_orders SET status='needs_review', payment_id=_payment_id, payment_status='approved', admin_notes='Monto o moneda no coincide',updated_at=now() WHERE id=o.id;
  RETURN jsonb_build_object('ok',false,'reason','amount_mismatch');
 END IF;
 SELECT COALESCE(sum(quantity),0)::integer INTO pending_qty FROM public.icefest_orders WHERE ticket_type_id=t.id AND id<>o.id AND status='pending' AND reserved_until>now();
 IF t.stock IS NOT NULL AND t.stock_sold + pending_qty + o.quantity > t.stock THEN
  UPDATE public.icefest_orders SET status='needs_review', payment_id=_payment_id, payment_status='approved',admin_notes='Pago confirmado sin cupo: coordinar devolución o ampliar capacidad',updated_at=now() WHERE id=o.id;
  RETURN jsonb_build_object('ok',false,'reason','stock_conflict');
 END IF;
 INSERT INTO public.icefest_tickets(order_id,event_id,ticket_number) SELECT o.id,o.event_id,n FROM generate_series(1,o.quantity) n ON CONFLICT(order_id,ticket_number) DO NOTHING;
 UPDATE public.icefest_ticket_types SET stock_sold=stock_sold+o.quantity WHERE id=t.id;
 UPDATE public.icefest_discounts SET times_used=times_used+1 WHERE id=ANY(o.discount_ids);
 UPDATE public.icefest_orders SET status='paid',payment_id=_payment_id,payment_status='approved',paid_at=now(),updated_at=now() WHERE id=o.id;
 RETURN jsonb_build_object('ok',true,'first_time',true);
END; $$;
REVOKE ALL ON FUNCTION public.icefest_confirm_order(uuid,text,integer,text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.icefest_confirm_order(uuid,text,integer,text) TO service_role;
CREATE OR REPLACE FUNCTION public.icefest_check_in(_ticket_id uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $$
DECLARE t public.icefest_tickets;
BEGIN
 IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Acceso denegado'; END IF;
 SELECT * INTO t FROM public.icefest_tickets WHERE id=_ticket_id FOR UPDATE;
 IF t.id IS NULL OR NOT t.is_valid OR NOT EXISTS(SELECT 1 FROM public.icefest_orders WHERE id=t.order_id AND status='paid') THEN RETURN jsonb_build_object('ok',false,'reason','invalid'); END IF;
 IF t.checked_in THEN RETURN jsonb_build_object('ok',false,'reason','already_checked_in'); END IF;
 UPDATE public.icefest_tickets SET checked_in=true,checked_in_at=now(),checked_in_by=auth.uid() WHERE id=t.id;
 RETURN jsonb_build_object('ok',true);
END; $$;
REVOKE ALL ON FUNCTION public.icefest_check_in(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.icefest_check_in(uuid) TO authenticated;
CREATE OR REPLACE FUNCTION public.icefest_refund_order(_order_id uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $$
DECLARE o public.icefest_orders;
BEGIN
 SELECT * INTO o FROM public.icefest_orders WHERE id=_order_id FOR UPDATE;
 IF o.id IS NULL OR o.status='refunded' THEN RETURN; END IF;
 IF o.status='paid' THEN UPDATE public.icefest_ticket_types SET stock_sold=greatest(0,stock_sold-o.quantity) WHERE id=o.ticket_type_id; END IF;
 UPDATE public.icefest_tickets SET is_valid=false WHERE order_id=o.id;
 UPDATE public.icefest_orders SET status='refunded',payment_status='refunded',updated_at=now() WHERE id=o.id;
END; $$;
REVOKE ALL ON FUNCTION public.icefest_refund_order(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.icefest_refund_order(uuid) TO service_role;
CREATE TRIGGER icefest_event_updated BEFORE UPDATE ON public.icefest_events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER icefest_order_updated BEFORE UPDATE ON public.icefest_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();