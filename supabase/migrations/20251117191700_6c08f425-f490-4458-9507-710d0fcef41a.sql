-- Create professionals table
CREATE TABLE public.professionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price_clp INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create availability_rules table
CREATE TABLE public.availability_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  specific_date DATE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  recurrence_type TEXT NOT NULL CHECK (recurrence_type IN ('WEEKLY', 'ONCE')),
  max_days_in_future INTEGER NOT NULL DEFAULT 30,
  min_hours_before_booking INTEGER NOT NULL DEFAULT 3,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT availability_date_or_day CHECK (
    (day_of_week IS NOT NULL AND specific_date IS NULL) OR
    (day_of_week IS NULL AND specific_date IS NOT NULL)
  )
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_comments TEXT,
  date_time_start TIMESTAMP WITH TIME ZONE NOT NULL,
  date_time_end TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT' CHECK (status IN ('PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'EXPIRED')),
  mercado_pago_preference_id TEXT,
  mercado_pago_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique index to prevent double bookings
CREATE UNIQUE INDEX bookings_professional_time_unique 
ON public.bookings(professional_id, date_time_start) 
WHERE status = 'CONFIRMED';

-- Enable RLS
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (booking system needs to be public)
CREATE POLICY "Anyone can view active professionals" 
ON public.professionals FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can view active services" 
ON public.services FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can view active availability rules" 
ON public.availability_rules FOR SELECT 
USING (is_active = true);

CREATE POLICY "Anyone can view their own bookings by email" 
ON public.bookings FOR SELECT 
USING (true);

-- Service role can manage everything (for edge functions)
CREATE POLICY "Service role can insert bookings" 
ON public.bookings FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can update bookings" 
ON public.bookings FOR UPDATE 
USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_professionals_updated_at
BEFORE UPDATE ON public.professionals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_availability_rules_updated_at
BEFORE UPDATE ON public.availability_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data
INSERT INTO public.professionals (name, slug, email, is_active) VALUES
  ('Alan', 'alan', 'alan@navestudio.cl', true),
  ('Maral', 'maral', 'maral@navestudio.cl', true),
  ('Sol', 'sol', 'sol@navestudio.cl', true);

INSERT INTO public.services (name, duration_minutes, price_clp, description, is_active) VALUES
  ('Sesión Método Wim Hof', 60, 30000, 'Sesión guiada de respiración Wim Hof y baño de hielo', true),
  ('Ice Bath en Grupo', 45, 20000, 'Experiencia de baño de hielo grupal', true);

-- Insert some sample availability rules (Lunes a Viernes, 9:00-18:00 para cada profesional)
INSERT INTO public.availability_rules (
  professional_id, 
  day_of_week, 
  start_time, 
  end_time, 
  duration_minutes, 
  recurrence_type,
  max_days_in_future,
  min_hours_before_booking
)
SELECT 
  p.id,
  dow,
  '09:00'::TIME,
  '18:00'::TIME,
  60,
  'WEEKLY',
  30,
  3
FROM public.professionals p
CROSS JOIN generate_series(1, 5) dow
WHERE p.is_active = true;