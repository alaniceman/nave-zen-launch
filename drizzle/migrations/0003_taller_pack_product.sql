ALTER TABLE public.taller_inscripciones
  ADD COLUMN IF NOT EXISTS product_type text NOT NULL DEFAULT 'single',
  ADD COLUMN IF NOT EXISTS event_ids text[] NOT NULL DEFAULT '{}'::text[];

UPDATE public.taller_inscripciones
SET event_ids = ARRAY[event_id]
WHERE event_ids = '{}'::text[] AND event_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.reserve_event_cupos(_event_ids text[])
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ids text[];
  rec record;
  res jsonb := '{}'::jsonb;
BEGIN
  SELECT array_agg(DISTINCT e) INTO ids FROM unnest(_event_ids) AS e WHERE e IS NOT NULL;

  IF ids IS NULL OR array_length(ids, 1) = 0 THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'no_events');
  END IF;

  -- Bloqueo determinista de todas las filas involucradas (evita deadlocks)
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
    IF rec.cupos_vendidos >= rec.cupos_total THEN
      RETURN jsonb_build_object('ok', false, 'reason', 'sold_out', 'event_id', rec.event_id);
    END IF;
  END LOOP;

  FOR rec IN
    UPDATE public.event_cupos
       SET cupos_vendidos = cupos_vendidos + 1,
           updated_at = now()
     WHERE event_id = ANY(ids)
    RETURNING event_id, (cupos_total - cupos_vendidos) AS remaining
  LOOP
    res := res || jsonb_build_object(rec.event_id, rec.remaining);
  END LOOP;

  RETURN jsonb_build_object('ok', true, 'remaining', res);
END;
$$;

GRANT EXECUTE ON FUNCTION public.reserve_event_cupos(text[]) TO service_role;