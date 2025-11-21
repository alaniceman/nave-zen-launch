-- Create generated_slots table to store all future time slots
CREATE TABLE public.generated_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  date_time_start TIMESTAMP WITH TIME ZONE NOT NULL,
  date_time_end TIMESTAMP WITH TIME ZONE NOT NULL,
  max_capacity INTEGER NOT NULL,
  confirmed_bookings INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_generated_slots_professional_service ON public.generated_slots(professional_id, service_id);
CREATE INDEX idx_generated_slots_date_time ON public.generated_slots(date_time_start, date_time_end);
CREATE INDEX idx_generated_slots_active ON public.generated_slots(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE public.generated_slots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for generated_slots
CREATE POLICY "Anyone can view active slots"
  ON public.generated_slots
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage slots"
  ON public.generated_slots
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_generated_slots_updated_at
  BEFORE UPDATE ON public.generated_slots
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();