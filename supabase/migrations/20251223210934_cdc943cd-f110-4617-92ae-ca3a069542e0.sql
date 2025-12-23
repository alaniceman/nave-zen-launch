-- Create package_orders table to store order details
-- This allows us to send only the order ID to Mercado Pago instead of full JSON

CREATE TABLE public.package_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_type TEXT NOT NULL CHECK (order_type IN ('giftcard', 'session_package')),
  package_id UUID NOT NULL REFERENCES public.session_packages(id),
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT,
  coupon_id UUID REFERENCES public.discount_coupons(id),
  coupon_code TEXT,
  original_price INTEGER NOT NULL,
  discount_amount INTEGER NOT NULL DEFAULT 0,
  final_price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed', 'cancelled')),
  mercado_pago_preference_id TEXT,
  mercado_pago_payment_id TEXT,
  mercado_pago_status TEXT,
  mercado_pago_status_detail TEXT,
  is_giftcard BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.package_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view their own orders (by order ID - for status checking)
CREATE POLICY "Anyone can view orders by id"
ON public.package_orders
FOR SELECT
USING (true);

-- Service role can insert and update orders (from edge functions)
CREATE POLICY "Service role can insert orders"
ON public.package_orders
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role can update orders"
ON public.package_orders
FOR UPDATE
USING (true);

-- Admins can manage all orders
CREATE POLICY "Admins can manage orders"
ON public.package_orders
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_package_orders_updated_at
BEFORE UPDATE ON public.package_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_package_orders_status ON public.package_orders(status);
CREATE INDEX idx_package_orders_mercado_pago_payment_id ON public.package_orders(mercado_pago_payment_id);