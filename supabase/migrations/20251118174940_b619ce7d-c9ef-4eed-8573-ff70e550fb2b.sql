-- Add max_capacity column to services table
ALTER TABLE services 
ADD COLUMN max_capacity INTEGER NOT NULL DEFAULT 1;

COMMENT ON COLUMN services.max_capacity IS 'Capacidad máxima por defecto de cada time slot';

-- Create capacity_overrides table for specific date/time overrides
CREATE TABLE capacity_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  max_capacity INTEGER NOT NULL CHECK (max_capacity >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(professional_id, service_id, date, start_time)
);

CREATE INDEX idx_capacity_overrides_lookup ON capacity_overrides(professional_id, service_id, date);

ALTER TABLE capacity_overrides ENABLE ROW LEVEL SECURITY;

-- Only admins can manage capacity overrides
CREATE POLICY "Admins can manage capacity overrides"
ON capacity_overrides FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_capacity_overrides_updated_at
  BEFORE UPDATE ON capacity_overrides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update existing Wim Hof service with 6 capacity
UPDATE services 
SET max_capacity = 6 
WHERE name ILIKE '%wim hof%';