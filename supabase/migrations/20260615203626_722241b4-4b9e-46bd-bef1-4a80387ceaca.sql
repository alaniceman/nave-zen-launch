-- RLS policies for shop-products storage bucket: public read, admin-only write
CREATE POLICY "Public can view shop product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'shop-products');

CREATE POLICY "Admins can upload shop product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'shop-products' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update shop product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'shop-products' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete shop product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'shop-products' AND public.has_role(auth.uid(), 'admin'));