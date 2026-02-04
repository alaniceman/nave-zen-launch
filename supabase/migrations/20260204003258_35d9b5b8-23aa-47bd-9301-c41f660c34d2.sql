-- Add column to track abandonment email sent
ALTER TABLE package_orders 
ADD COLUMN IF NOT EXISTS abandonment_email_sent_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;