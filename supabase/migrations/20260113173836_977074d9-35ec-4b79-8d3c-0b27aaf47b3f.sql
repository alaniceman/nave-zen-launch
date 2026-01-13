-- Add column to control visibility in Criomedicina page
ALTER TABLE session_packages 
ADD COLUMN show_in_criomedicina boolean DEFAULT false;