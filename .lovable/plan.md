## Tienda Nave Studio

Esqueleto de tienda para que los clientes en el local escaneen un QR, vean los productos en vitrina y paguen por Mercado Pago. Productos gestionados desde el admin (sin tocar código).

## Alcance del esqueleto

1. Link **Tienda** en el menú principal → `/tienda`.
2. Landing minimalista en `/tienda` con grid de productos (foto cuadrada, nombre, mini descripción, precio, botón **Comprar**, botón **Más detalles**).
3. Modal de "Más detalles" con descripción completa.
4. Botón **Comprar** → genera preferencia en Mercado Pago con nombre + precio y redirige al checkout.
5. Páginas de éxito/falla/pendiente del pago.
6. Admin `/admin/tienda` para CRUD de productos.
7. Admin `/admin/tienda-ordenes` para ver compras (quién compró qué, cuándo, estado de pago).

No incluye: control de stock con descuento automático, envíos, retiros programados, variantes (talla/color), descuentos/cupones. Se puede agregar después si lo necesitas.

## Detalles técnicos

### Base de datos (1 migración)

Tabla `shop_products`:
- `name`, `description`, `short_description`, `price` (int CLP), `image_url`, `is_active`, `sort_order`

Tabla `shop_orders`:
- `product_id` (ref a shop_products), `product_name`, `product_price` (snapshot), `customer_name`, `customer_email`, `customer_phone`, `status` (`pending` | `paid` | `failed` | `cancelled`), `mercado_pago_preference_id`, `mercado_pago_payment_id`

RLS:
- `shop_products`: lectura pública solo de `is_active = true`; escritura solo admins.
- `shop_orders`: sin acceso público (todo vía edge functions con service role); admins pueden leer.

Storage bucket público `shop-products` para las imágenes (subida desde el admin).

### Edge Functions (2 nuevas)

- `create-shop-preference`: recibe `product_id` + datos del comprador, crea `shop_orders` con `status='pending'`, llama a Mercado Pago con `items: [{ title: product.name, unit_price: product.price, quantity: 1 }]`, `external_reference = order.id`, `back_urls` a `/tienda/success|failure|pending`, guarda `preference_id` y devuelve `init_point`.
- Reutiliza `mercadopago-webhook` existente (extendido para reconocer ordenes de tipo `shop`): al recibir notificación, verifica el pago vía API de MP, actualiza `shop_orders.status` y `mercado_pago_payment_id`.

### Frontend

- `src/pages/Tienda.tsx`: landing pública con grid.
- `src/components/tienda/ProductCard.tsx`: card con foto cuadrada, precio, botones.
- `src/components/tienda/ProductDetailModal.tsx`: modal con descripción completa + botón Comprar.
- `src/components/tienda/BuyFormModal.tsx`: mini-form (nombre, email, teléfono) antes de redirigir a MP.
- `src/pages/TiendaSuccess.tsx`, `TiendaFailure.tsx`, `TiendaPending.tsx`: estilo coherente con `AgendaSuccess`.
- Link **Tienda** en `Header.tsx` (escritorio + móvil) con ícono monocromático.
- Ruta nueva en `src/App.tsx`.

### Admin

- `src/pages/admin/AdminShopProducts.tsx`: tabla con CRUD, subir imagen al bucket, toggle activo, reordenar.
- `src/pages/admin/AdminShopOrders.tsx`: tabla de compras con filtros por estado.
- Links en `AdminSidebar.tsx`.

### Mercado Pago

Reutiliza `MERCADO_PAGO_ACCESS_TOKEN` y `MERCADO_PAGO_WEBHOOK_SECRET` ya configurados. `external_reference` = UUID crudo de `shop_orders.id` (regla del proyecto).

## Después del esqueleto

Cuando apruebes el plan y todo esté armado, me pasas las fotos, nombres, descripciones y precios, y los cargo desde el admin (o por SQL si prefieres ir más rápido la primera vez).