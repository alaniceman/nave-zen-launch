-- Create email_subscribers table
CREATE TABLE IF NOT EXISTS public.email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  source TEXT DEFAULT 'email-capture-modal',
  tags TEXT[] DEFAULT '{}',
  groups TEXT[] DEFAULT '{}',
  mailerlite_synced BOOLEAN DEFAULT false,
  mailerlite_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON public.email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_created_at ON public.email_subscribers(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public inserts (from edge function using service role)
CREATE POLICY "Allow service role to insert" ON public.email_subscribers
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow authenticated users to read
CREATE POLICY "Allow authenticated users to read" ON public.email_subscribers
  FOR SELECT
  USING (auth.role() = 'authenticated');