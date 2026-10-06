# Project Architecture Rules

- Keep the agenda's visual professional selection isolated in `ProfessionalPicker`; this preserves booking state and URL behavior in the page.- Cyber campaign products live in `cyber_products` and are sold through the existing shop cart (`create-shop-preference` → `shop_orders`), fulfilled idempotently per row in `cyber_purchases` by `_shared/cyberFulfillment.ts`; keeps one checkout and webhook path.
- Cyber stock limits live in `cyber_stock` (pools linked by `cyber_products.stock_pool`), checked in `create-shop-preference` and decremented once per paid row in `cyberFulfillment.ts`; keeps scarcity real and server-enforced.
