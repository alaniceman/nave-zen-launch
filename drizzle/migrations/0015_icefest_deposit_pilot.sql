CREATE OR REPLACE FUNCTION public.icefest_price(_type_id uuid, _quantity integer, _coupon text DEFAULT NULL) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $$
DECLARE t public.icefest_ticket_types; e public.icefest_events; d record; subtotal integer; savings integer; ids uuid[] := '{}'; group_applied boolean := false; deposit boolean;
BEGIN
 SELECT * INTO t FROM public.icefest_ticket_types WHERE id = _type_id;
 SELECT * INTO e FROM public.icefest_events WHERE id = t.event_id;
 deposit := t.id = '9cefe570-2026-4000-8000-000000000025'::uuid;
 IF t.id IS NULL OR NOT t.is_active OR NOT e.is_active OR NOT e.sales_open OR e.date < (now() AT TIME ZONE 'America/Santiago')::date THEN RAISE EXCEPTION 'La venta de entradas está cerrada'; END IF;
 IF _quantity < 1 OR _quantity > t.max_per_order THEN RAISE EXCEPTION 'Cantidad fuera del límite permitido'; END IF;
 IF (t.valid_from IS NOT NULL AND t.valid_from > now()) OR (t.valid_until IS NOT NULL AND t.valid_until <= now()) THEN RAISE EXCEPTION 'Esta etapa de venta no está vigente'; END IF;
 IF NOT deposit AND EXISTS(SELECT 1 FROM public.icefest_ticket_types x WHERE x.event_id = t.event_id AND x.id <> '9cefe570-2026-4000-8000-000000000025'::uuid AND x.is_active AND x.display_order < t.display_order AND (x.valid_from IS NULL OR x.valid_from <= now()) AND (x.valid_until IS NULL OR x.valid_until > now()) AND (x.stock IS NULL OR x.stock_sold < x.stock)) THEN RAISE EXCEPTION 'Hay una etapa de venta anterior disponible'; END IF;
 subtotal := t.price * _quantity;
 IF deposit THEN
  IF t.price <> 25000 THEN RAISE EXCEPTION 'El abono debe ser de $25.000 por persona'; END IF;
  IF nullif(trim(_coupon),'') IS NOT NULL THEN RAISE EXCEPTION 'La reserva con abono no admite cupones'; END IF;
  RETURN jsonb_build_object('original_amount',subtotal,'total_amount',subtotal,'discount_amount',0,'discount_ids','[]'::jsonb);
 END IF;
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
CREATE OR REPLACE FUNCTION public.icefest_snapshot_deposit() RETURNS trigger LANGUAGE plpgsql SET search_path TO public AS $$
BEGIN
 IF NEW.ticket_type_id = '9cefe570-2026-4000-8000-000000000025'::uuid THEN
 NEW.meta_context := coalesce(NEW.meta_context,'{}'::jsonb) || jsonb_build_object('deposit',jsonb_build_object('full_price',77000,'deposit_per_person',25000,'balance_due',52000*NEW.quantity,'balance_paid',false));
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER icefest_snapshot_deposit BEFORE INSERT ON public.icefest_orders FOR EACH ROW EXECUTE FUNCTION public.icefest_snapshot_deposit();
CREATE OR REPLACE FUNCTION public.icefest_mark_balance_paid(_order_id uuid) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $$
BEGIN
 IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Acceso denegado'; END IF;
 UPDATE public.icefest_orders SET meta_context=jsonb_set(meta_context,'{deposit}',(meta_context->'deposit') || jsonb_build_object('balance_paid',true,'balance_paid_at',now(),'balance_paid_by',auth.uid())) WHERE id=_order_id AND status='paid' AND meta_context ? 'deposit' AND coalesce((meta_context->'deposit'->>'balance_paid')::boolean,false)=false;
 IF NOT FOUND THEN RAISE EXCEPTION 'Reserva no disponible o saldo ya registrado'; END IF;
END; $$;
REVOKE ALL ON FUNCTION public.icefest_mark_balance_paid(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.icefest_mark_balance_paid(uuid) TO authenticated;
CREATE OR REPLACE FUNCTION public.icefest_check_in(_ticket_id uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $$
DECLARE t public.icefest_tickets; o public.icefest_orders;
BEGIN
 IF NOT public.has_role(auth.uid(),'admin') THEN RAISE EXCEPTION 'Acceso denegado'; END IF;
 SELECT * INTO t FROM public.icefest_tickets WHERE id=_ticket_id FOR UPDATE;
 SELECT * INTO o FROM public.icefest_orders WHERE id=t.order_id FOR UPDATE;
 IF t.id IS NULL OR NOT t.is_valid OR o.id IS NULL OR o.status <> 'paid' THEN RETURN jsonb_build_object('ok',false,'reason','invalid'); END IF;
 IF t.checked_in THEN RETURN jsonb_build_object('ok',false,'reason','already_checked_in'); END IF;
 IF o.meta_context ? 'deposit' AND coalesce((o.meta_context->'deposit'->>'balance_paid')::boolean,false)=false THEN RETURN jsonb_build_object('ok',false,'reason','balance_due'); END IF;
 UPDATE public.icefest_tickets SET checked_in=true,checked_in_at=now(),checked_in_by=auth.uid() WHERE id=t.id;
 RETURN jsonb_build_object('ok',true);
END; $$;
REVOKE ALL ON FUNCTION public.icefest_check_in(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.icefest_check_in(uuid) TO authenticated;