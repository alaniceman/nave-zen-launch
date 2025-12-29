-- Add sort_order column to services table
ALTER TABLE services ADD COLUMN sort_order integer DEFAULT 0;

-- Set initial sort order based on desired display order
UPDATE services SET sort_order = 1 WHERE name ILIKE '%Santiago%' AND name ILIKE '%Criomedicina%';
UPDATE services SET sort_order = 2 WHERE name ILIKE '%Yoga%';
UPDATE services SET sort_order = 3 WHERE name ILIKE '%Algarrobo%';