CREATE OR REPLACE FUNCTION public.icefest_delete_order(_order_id uuid, _admin_id uuid) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $$
DECLARE o public.icefest_orders;
BEGIN
 IF NOT public.has_role(_admin_id, 'admin') THEN RAISE EXCEPTION 'Acceso denegado'; END IF;
 SELECT * INTO o FROM public.icefest_orders WHERE id = _order_id FOR UPDATE;
 IF o.id IS NULL THEN RETURN jsonb_build_object('ok', false, 'reason', 'not_found'); END IF;
 IF o.email_lock_until > now() THEN RAISE EXCEPTION 'Hay un envío de correo en curso. Intenta nuevamente en unos minutos.'; END IF;
 PERFORM id FROM public.icefest_ticket_types WHERE id = o.ticket_type_id FOR UPDATE;
 IF o.status = 'paid' THEN
  UPDATE public.icefest_ticket_types SET stock_sold = greatest(0, stock_sold - o.quantity) WHERE id = o.ticket_type_id;
 END IF;
 IF o.status IN ('paid', 'refunded') THEN
  UPDATE public.icefest_discounts SET times_used = greatest(0, times_used - 1) WHERE id = ANY(o.discount_ids);
 END IF;
 DELETE FROM public.icefest_tickets WHERE order_id = o.id;
 DELETE FROM public.icefest_orders WHERE id = o.id;
 RETURN jsonb_build_object('ok', true);
END; $$;
REVOKE ALL ON FUNCTION public.icefest_delete_order(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.icefest_delete_order(uuid, uuid) TO service_role;