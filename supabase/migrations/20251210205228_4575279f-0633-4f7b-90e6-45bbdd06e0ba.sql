-- Add available_as_giftcard to session_packages
ALTER TABLE public.session_packages 
ADD COLUMN available_as_giftcard boolean DEFAULT false;

-- Add giftcard_access_token to session_codes for secure access to gift card page
ALTER TABLE public.session_codes 
ADD COLUMN giftcard_access_token text UNIQUE;