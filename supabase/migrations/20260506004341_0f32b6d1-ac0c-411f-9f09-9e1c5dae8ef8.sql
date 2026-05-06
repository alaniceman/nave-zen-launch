-- Create ai_knowledge table for editable Nave AI chatbot knowledge base
CREATE TABLE public.ai_knowledge (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_knowledge ENABLE ROW LEVEL SECURITY;

-- Admins can manage all knowledge entries
CREATE POLICY "Admins can manage ai_knowledge"
ON public.ai_knowledge
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Service role (edge functions) needs to read active entries
CREATE POLICY "Anyone can view active ai_knowledge"
ON public.ai_knowledge
FOR SELECT
USING (is_active = true);

-- Auto-update updated_at
CREATE TRIGGER update_ai_knowledge_updated_at
BEFORE UPDATE ON public.ai_knowledge
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_ai_knowledge_active_priority
ON public.ai_knowledge (is_active, priority DESC, category);

-- Add fields to membership_plans for trial plans
ALTER TABLE public.membership_plans
  ADD COLUMN IF NOT EXISTS plan_type TEXT NOT NULL DEFAULT 'membership',
  ADD COLUMN IF NOT EXISTS duration_days INTEGER,
  ADD COLUMN IF NOT EXISTS original_price_clp INTEGER,
  ADD COLUMN IF NOT EXISTS allows_custom_start_date BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;