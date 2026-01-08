-- Add column to track feedback email sent status
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS feedback_email_sent BOOLEAN DEFAULT FALSE;