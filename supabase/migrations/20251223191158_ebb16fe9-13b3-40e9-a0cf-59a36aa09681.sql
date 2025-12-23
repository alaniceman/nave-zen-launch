-- Add unique constraint to prevent duplicate slots
CREATE UNIQUE INDEX IF NOT EXISTS generated_slots_unique_slot 
ON public.generated_slots(professional_id, service_id, date_time_start);