-- Remove UNIQUE constraint from giftcard_access_token
-- This column should allow duplicates because a gift card can have multiple session codes
ALTER TABLE public.session_codes DROP CONSTRAINT IF EXISTS session_codes_giftcard_access_token_key;