-- 1) Cantidad de personas por inscripción (compatible con órdenes antiguas)
ALTER TABLE public.taller_inscripciones
  ADD COLUMN IF NOT EXISTS quantity integer NOT NULL DEFAULT 1;

ALTER TABLE public.taller_inscripciones
  ADD CONSTRAINT taller_inscripciones_quantity_positive CHECK (quantity >= 1 AND quantity <= 50);

COMMENT ON COLUMN public.taller_inscripciones.quantity IS 'Cantidad de personas/cupos de la orden. Pack: N cupos en CADA evento de event_ids.';

-- 2) Confirmación de pago + reserva de N cupos por evento en UNA sola transacción.
--    Bloquea la orden y luego los stocks en orden estable (event_id) para evitar deadlocks.
--    Idempotente por orden y por payment_id. Nunca deja reservas parciales.
CREATE OR REPLACE FUNCTION public.confirm_taller_payment(
  _order_id uuid,
  _payment_id text,
  _payment_status text,
  _paid_amount integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  insc record;
  ids text[];
  qty integer;
  rec record;
  res jsonb := '{}'::jsonb;
BEGIN
  SELECT * INTO insc FROM public.taller_inscripciones WHERE id = _order_id FOR UPDATE;

  IF insc IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'order_not_found');
  END IF;

  -- Idempotencia: ya confirmada (misma orden o mismo pago)
  IF insc.status = 'paid' AND insc.cupo_reserved THEN
    RETURN jsonb_build_object(
      'ok', true, 'already_processed', true, 'first_time', false,
      'quantity', COALESCE(insc.quantity, 1)
    );
  END IF;

  IF insc.cupo_reserved THEN
    RETURN jsonb_build_object('ok', true, 'already_processed', true, 'first_time', false,
                              'quantity', COALESCE(insc.quantity, 1));
  END IF;

  qty := GREATEST(1, COALESCE(insc.quantity, 1));

  SELECT array_agg(DISTINCT e) INTO ids
  FROM unnest(
    CASE
      WHEN insc.event_ids IS NOT NULL AND array_length(insc.event_ids, 1) > 0 THEN insc.event_ids
      WHEN insc.event_id IS NOT NULL THEN ARRAY[insc.event_id]
      ELSE ARRAY[]::text[]
    END
  ) AS e
  WHERE e IS NOT NULL;

  IF ids IS NULL OR array_length(ids, 1) = 0 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'no_events');
  END IF;

  -- Bloqueo determinista de los stocks involucrados
  PERFORM 1 FROM public.event_cupos
   WHERE event_id = ANY(ids)
   ORDER BY event_id
     FOR UPDATE;

  IF (SELECT count(*) FROM public.event_cupos WHERE event_id = ANY(ids)) <> array_length(ids, 1) THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'event_missing');
  END IF;

  -- Verifica TODOS antes de descontar: todo o nada
  FOR rec IN
    SELECT event_id, cupos_total, cupos_vendidos
      FROM public.event_cupos
     WHERE event_id = ANY(ids)
  LOOP
    IF rec.cupos_vendidos + qty > rec.cupos_total THEN
      RETURN jsonb_build_object('ok', false, 'reason', 'sold_out', 'event_id', rec.event_id,
                                'quantity', qty);
    END IF;
  END LOOP;

  FOR rec IN
    UPDATE public.event_cupos
       SET cupos_vendidos = cupos_vendidos + qty,
           updated_at = now()
     WHERE event_id = ANY(ids)
    RETURNING event_id, (cupos_total - cupos_vendidos) AS remaining
  LOOP
    res := res || jsonb_build_object(rec.event_id, rec.remaining);
  END LOOP;

  UPDATE public.taller_inscripciones
     SET status = 'paid',
         cupo_reserved = true,
         mercado_pago_payment_id = COALESCE(_payment_id, mercado_pago_payment_id),
         mercado_pago_status = COALESCE(_payment_status, mercado_pago_status),
         paid_at = COALESCE(paid_at, now()),
         updated_at = now()
   WHERE id = _order_id;

  RETURN jsonb_build_object('ok', true, 'first_time', true, 'already_processed', false,
                            'quantity', qty, 'remaining', res, 'event_ids', to_jsonb(ids));
END;
$$;

-- 3) Las funciones de reserva NO deben ser ejecutables por anon/authenticated/PUBLIC
REVOKE ALL ON FUNCTION public.confirm_taller_payment(uuid, text, text, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.confirm_taller_payment(uuid, text, text, integer) FROM anon;
REVOKE ALL ON FUNCTION public.confirm_taller_payment(uuid, text, text, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_taller_payment(uuid, text, text, integer) TO service_role;

REVOKE ALL ON FUNCTION public.reserve_event_cupos(text[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reserve_event_cupos(text[]) FROM anon;
REVOKE ALL ON FUNCTION public.reserve_event_cupos(text[]) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_event_cupos(text[]) TO service_role;

REVOKE ALL ON FUNCTION public.reserve_event_cupo(text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reserve_event_cupo(text) FROM anon;
REVOKE ALL ON FUNCTION public.reserve_event_cupo(text) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_event_cupo(text) TO service_role;
