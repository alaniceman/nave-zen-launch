
UPDATE public.shop_products
SET image_url = regexp_replace(image_url, '/shop-products/([0-9a-f-]+)\.(jpeg|jpg|png|webp)$', '/shop-products/opt-\1.webp'),
    image_urls = (
      SELECT array_agg(regexp_replace(u, '/shop-products/([0-9a-f-]+)\.(jpeg|jpg|png|webp)$', '/shop-products/opt-\1.webp'))
      FROM unnest(image_urls) AS u
    )
WHERE image_url ~ '/shop-products/[0-9a-f-]+\.(jpeg|jpg|png|webp)$';
