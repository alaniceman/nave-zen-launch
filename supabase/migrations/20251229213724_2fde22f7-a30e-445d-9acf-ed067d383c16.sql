-- Create branches table
CREATE TABLE public.branches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  address TEXT,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active branches"
ON public.branches
FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage branches"
ON public.branches
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add branch_id to services table
ALTER TABLE public.services ADD COLUMN branch_id UUID REFERENCES public.branches(id);

-- Create trigger for updated_at
CREATE TRIGGER update_branches_updated_at
BEFORE UPDATE ON public.branches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial branches
INSERT INTO public.branches (name, slug, address, is_default, sort_order)
VALUES 
  ('Santiago Centro', 'santiago', 'Santiago, Chile', true, 1),
  ('Algarrobo', 'algarrobo', 'Casa Pía Medel, Algarrobo', false, 2);

-- Update existing services with branch_id
UPDATE public.services 
SET branch_id = (SELECT id FROM public.branches WHERE slug = 'santiago')
WHERE name LIKE '%Santiago%' OR name LIKE '%Yoga%';

UPDATE public.services 
SET branch_id = (SELECT id FROM public.branches WHERE slug = 'algarrobo')
WHERE name LIKE '%Algarrobo%';

-- Simplify service names (remove location from name)
UPDATE public.services SET name = 'Sesión Criomedicina / Método Wim Hof' WHERE name LIKE 'Sesión Criomedicina%Santiago%';
UPDATE public.services SET name = 'Yoga Integral' WHERE name LIKE 'Yoga Integral%Santiago%';
UPDATE public.services SET name = 'Sesión Criomedicina' WHERE name LIKE 'Sesión Criomedicina%Algarrobo%';