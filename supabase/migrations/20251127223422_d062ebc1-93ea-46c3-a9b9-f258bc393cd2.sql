-- Create discount_coupons table
CREATE TABLE public.discount_coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value integer NOT NULL CHECK (discount_value > 0),
  min_purchase_amount integer DEFAULT 0 CHECK (min_purchase_amount >= 0),
  max_uses integer DEFAULT NULL CHECK (max_uses IS NULL OR max_uses > 0),
  current_uses integer DEFAULT 0 CHECK (current_uses >= 0),
  valid_from timestamp with time zone DEFAULT now(),
  valid_until timestamp with time zone DEFAULT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.discount_coupons ENABLE ROW LEVEL SECURITY;

-- Admins can manage all coupons
CREATE POLICY "Admins can manage coupons" ON public.discount_coupons
FOR ALL 
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Anyone can view active coupons (for validation in booking flow)
CREATE POLICY "Anyone can view active coupons" ON public.discount_coupons
FOR SELECT
USING (is_active = true);

-- Add trigger for updated_at
CREATE TRIGGER update_discount_coupons_updated_at
BEFORE UPDATE ON public.discount_coupons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add coupon fields to bookings table
ALTER TABLE public.bookings 
ADD COLUMN coupon_id uuid REFERENCES public.discount_coupons(id),
ADD COLUMN discount_amount integer DEFAULT 0 CHECK (discount_amount >= 0),
ADD COLUMN original_price integer CHECK (original_price IS NULL OR original_price > 0),
ADD COLUMN final_price integer CHECK (final_price IS NULL OR final_price >= 0);

-- Create index for better performance on coupon lookups
CREATE INDEX idx_discount_coupons_code ON public.discount_coupons(code) WHERE is_active = true;
CREATE INDEX idx_discount_coupons_active ON public.discount_coupons(is_active, valid_from, valid_until);
CREATE INDEX idx_bookings_coupon_id ON public.bookings(coupon_id);