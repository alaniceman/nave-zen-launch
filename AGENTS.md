# Project Architecture Rules

- Keep the agenda's visual professional selection isolated in `ProfessionalPicker`; this preserves booking state and URL behavior in the page.- Cyber campaign products live in `cyber_products` and are sold through the existing shop cart (`create-shop-preference` → `shop_orders`), fulfilled idempotently per row in `cyber_purchases` by `_shared/cyberFulfillment.ts`; keeps one checkout and webhook path.
- Cyber stock limits live in `cyber_stock` (pools linked by `cyber_products.stock_pool`), checked in `create-shop-preference` and decremented once per paid row in `cyberFulfillment.ts`; keeps scarcity real and server-enforced.
- Canonicals use the official origin and query-free, trailing-slash-normalized paths; legacy aliases and agenda selections resolve to their destination/base page in both SEOHead and the early head script, whose canonical is Helmet-owned (`data-rh`), preventing unmanaged duplicate tags.
- Icefest uses isolated `icefest_` tables, service-only atomic inventory/payment RPCs and the existing Mercado Pago webhook; this keeps ticket fulfillment separate from bookings and prevents duplicate issuance.
- Icefest private ticket/order access requires bearer link tokens; check-in requires the existing admin role and an atomic RPC, so a public PIN cannot authorize entry.
- Public Icefest routes use an isolated festival shell and scoped semantic tokens (also on checkout portals); this preserves Nave styling and global Pixel tracking without competing navigation or popups.
- Icefest event and tier reads share a cached, abortable query; checkout loads on intent and remains mounted once opened, preserving in-memory buyer data without persisting personal information.
- Icefest hero mounts one video selected with the 768px media query; this prevents desktop and mobile video downloads from competing on initial load.
