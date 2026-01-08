SELECT cron.schedule(
  'send-session-feedback-hourly',
  '15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://pyupvlgdtcxgqjungiof.supabase.co/functions/v1/send-session-feedback',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5dXB2bGdkdGN4Z3FqdW5naW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MDU2MzYsImV4cCI6MjA3NjE4MTYzNn0.DGfGzmgZiHVDe46hMeXdhZNecFS6qKplOQHjztrNVHs"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);