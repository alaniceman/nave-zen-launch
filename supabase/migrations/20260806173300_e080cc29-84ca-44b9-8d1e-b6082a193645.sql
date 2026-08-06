ALTER TABLE public.discount_coupons
  ADD COLUMN IF NOT EXISTS applies_to_talleres boolean NOT NULL DEFAULT false;

ALTER TABLE public.taller_inscripciones
  ADD COLUMN IF NOT EXISTS coupon_id uuid REFERENCES public.discount_coupons(id),
  ADD COLUMN IF NOT EXISTS coupon_code text,
  ADD COLUMN IF NOT EXISTS original_amount integer,
  ADD COLUMN IF NOT EXISTS discount_amount integer NOT NULL DEFAULT 0;