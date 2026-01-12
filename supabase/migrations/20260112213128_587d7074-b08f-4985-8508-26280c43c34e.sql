-- Add show_in_upsell_modal column to session_packages
ALTER TABLE public.session_packages
ADD COLUMN show_in_upsell_modal boolean DEFAULT false;