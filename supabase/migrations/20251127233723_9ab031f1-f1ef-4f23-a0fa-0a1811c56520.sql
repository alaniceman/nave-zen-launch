-- Remove unique constraint that prevents multiple confirmed bookings per slot
-- This constraint was blocking group classes where multiple people can book the same time slot
DROP INDEX IF EXISTS bookings_professional_time_unique;