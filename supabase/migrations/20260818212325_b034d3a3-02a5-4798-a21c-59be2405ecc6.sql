ALTER TABLE public.package_orders ADD COLUMN IF NOT EXISTS meta_context jsonb;
ALTER TABLE public.shop_orders ADD COLUMN IF NOT EXISTS meta_context jsonb;
ALTER TABLE public.taller_inscripciones ADD COLUMN IF NOT EXISTS meta_context jsonb;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS meta_context jsonb;

DELETE FROM public.meta_event_deliveries d
USING public.meta_event_deliveries d2
WHERE d.event_name = d2.event_name
  AND d.event_id = d2.event_id
  AND d.ctid > d2.ctid;

CREATE UNIQUE INDEX IF NOT EXISTS meta_event_deliveries_name_event_uidx
  ON public.meta_event_deliveries (event_name, event_id);