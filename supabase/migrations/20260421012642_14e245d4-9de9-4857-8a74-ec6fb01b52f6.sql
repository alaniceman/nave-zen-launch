ALTER TABLE public.session_packages ADD COLUMN sort_order integer NOT NULL DEFAULT 0;
UPDATE public.session_packages SET sort_order = sub.rn FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY sessions_quantity, created_at) AS rn FROM public.session_packages) sub WHERE public.session_packages.id = sub.id;
CREATE INDEX IF NOT EXISTS idx_session_packages_sort_order ON public.session_packages(sort_order);