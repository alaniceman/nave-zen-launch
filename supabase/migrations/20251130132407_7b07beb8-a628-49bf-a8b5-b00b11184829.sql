-- Create session_packages table for available packages
CREATE TABLE public.session_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  sessions_quantity INTEGER NOT NULL,
  price_clp INTEGER NOT NULL,
  validity_days INTEGER NOT NULL DEFAULT 90,
  applicable_service_ids UUID[] NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create session_codes table for purchased codes
CREATE TABLE public.session_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES public.session_packages(id),
  code TEXT UNIQUE NOT NULL,
  applicable_service_ids UUID[] NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT,
  purchased_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_used BOOLEAN DEFAULT false,
  used_in_booking_id UUID REFERENCES public.bookings(id),
  used_at TIMESTAMPTZ,
  mercado_pago_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add session_code_id column to bookings table
ALTER TABLE public.bookings ADD COLUMN session_code_id UUID REFERENCES public.session_codes(id);

-- Enable Row Level Security
ALTER TABLE public.session_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for session_packages
CREATE POLICY "Anyone can view active packages"
ON public.session_packages
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage packages"
ON public.session_packages
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for session_codes
CREATE POLICY "Service role can insert codes"
ON public.session_codes
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role can update codes"
ON public.session_codes
FOR UPDATE
USING (true);

CREATE POLICY "Admins can view all codes"
ON public.session_codes
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger to update updated_at on session_packages
CREATE TRIGGER update_session_packages_updated_at
BEFORE UPDATE ON public.session_packages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster code lookups
CREATE INDEX idx_session_codes_code ON public.session_codes(code);
CREATE INDEX idx_session_codes_buyer_email ON public.session_codes(buyer_email);
CREATE INDEX idx_session_codes_used ON public.session_codes(is_used, expires_at);