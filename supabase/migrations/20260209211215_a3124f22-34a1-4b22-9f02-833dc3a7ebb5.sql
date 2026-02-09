
-- 1a. New columns on services
ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS is_trial_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS show_in_agenda boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS color_tag text NOT NULL DEFAULT 'default';

-- Update existing services: Sesión Criomedicina / Método Wim Hof keeps show_in_agenda true
UPDATE public.services SET show_in_agenda = true, is_trial_enabled = false, color_tag = 'wim-hof' WHERE id = 'ced4be53-8e5c-4d34-8370-0784f8d7a4b1';
-- Yoga Integral keeps show_in_agenda true
UPDATE public.services SET show_in_agenda = true, is_trial_enabled = true, color_tag = 'yoga' WHERE id = '55a20a48-0b74-4520-9b03-b2780f7622d2';
-- Sesión Criomedicina Algarrobo
UPDATE public.services SET show_in_agenda = true, is_trial_enabled = false, color_tag = 'wim-hof' WHERE id = '4597bac7-b438-48b7-ba9c-e6c5dcac8df5';

-- 1b. Create schedule_entries table
CREATE TABLE public.schedule_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id uuid NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  professional_id uuid REFERENCES public.professionals(id) ON DELETE SET NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  display_name text,
  badges text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.schedule_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active schedule entries"
  ON public.schedule_entries FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage schedule entries"
  ON public.schedule_entries FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 1c. Insert missing services (branch = Nave Studio Santiago)
INSERT INTO public.services (name, duration_minutes, price_clp, max_capacity, branch_id, is_active, sort_order, is_trial_enabled, show_in_agenda, color_tag, description) VALUES
  ('Yang Yoga + Ice Bath (opcional)', 60, 0, 15, '175460be-4ad4-4082-ad43-7a6ec8952a82', true, 10, true, false, 'yoga', 'Yoga dinámico que fortalece y activa el cuerpo con movimiento fluido.'),
  ('Isométrica + Flexibilidad', 60, 0, 15, '175460be-4ad4-4082-ad43-7a6ec8952a82', true, 11, true, false, 'yoga', 'Ejercicios isométricos que desarrollan fuerza y estabilidad profunda.'),
  ('Yin Yoga + Ice Bath (opcional)', 60, 0, 15, '175460be-4ad4-4082-ad43-7a6ec8952a82', true, 12, true, false, 'yoga', 'Posturas pasivas y prolongadas para soltar tensión profunda y ganar flexibilidad.'),
  ('Vinyasa Yoga + Ice Bath (opcional)', 60, 0, 15, '175460be-4ad4-4082-ad43-7a6ec8952a82', true, 13, true, false, 'yoga', 'Flujo continuo de posturas sincronizado con la respiración.'),
  ('Power Yoga + Ice Bath (opcional)', 60, 0, 15, '175460be-4ad4-4082-ad43-7a6ec8952a82', true, 14, true, false, 'yoga', 'Yoga de alta intensidad enfocado en fuerza y resistencia muscular.'),
  ('HIIT + Ice Bath', 60, 0, 15, '175460be-4ad4-4082-ad43-7a6ec8952a82', true, 15, true, false, 'hiit', 'Entrenamiento de alta intensidad seguido de inmersión en agua fría.'),
  ('Breathwork Wim Hof', 60, 0, 15, '175460be-4ad4-4082-ad43-7a6ec8952a82', true, 16, true, false, 'breathwork', 'Sesión guiada de respiración Wim Hof para energía y claridad mental.'),
  ('Personalizado Método Wim Hof', 60, 0, 2, '175460be-4ad4-4082-ad43-7a6ec8952a82', true, 17, false, false, 'wim-hof', 'Sesión personalizada 1-a-1 con instructor certificado Wim Hof.'),
  ('Yoga Integral + Ice Bath (opcional)', 60, 0, 15, '175460be-4ad4-4082-ad43-7a6ec8952a82', true, 18, true, false, 'yoga', 'Combina fuerza, flexibilidad y meditación en una práctica completa.');
