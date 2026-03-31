
CREATE TABLE public.chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL UNIQUE,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  ip_address text,
  message_count integer NOT NULL DEFAULT 0,
  first_user_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view chat conversations"
ON public.chat_conversations FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can insert chat conversations"
ON public.chat_conversations FOR INSERT
WITH CHECK (true);

CREATE POLICY "Service role can update chat conversations"
ON public.chat_conversations FOR UPDATE
USING (true);
