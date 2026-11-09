REVOKE UPDATE ON public.icefest_orders FROM authenticated;
DROP POLICY icefest_orders_admin_update ON public.icefest_orders;
ALTER TABLE public.icefest_discounts ADD CONSTRAINT icefest_discount_percentage CHECK (discount_type <> 'percentage' OR discount_value <= 100);
ALTER TABLE public.icefest_discounts ADD CONSTRAINT icefest_discount_max_quantity CHECK (max_quantity IS NULL OR max_quantity >= min_quantity);
ALTER TABLE public.icefest_discounts ADD CONSTRAINT icefest_discount_max_uses CHECK (max_uses IS NULL OR max_uses > 0);
ALTER TABLE public.icefest_ticket_types ADD CONSTRAINT icefest_stock_sold_bounds CHECK (stock IS NULL OR stock >= stock_sold);