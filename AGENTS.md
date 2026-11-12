# Project Architecture Rules

- Keep the agenda's visual professional selection isolated in `ProfessionalPicker`; this preserves booking state and URL behavior in the page.- Cyber campaign products live in `cyber_products` and are sold through the existing shop cart (`create-shop-preference` → `shop_orders`), fulfilled idempotently per row in `cyber_purchases` by `_shared/cyberFulfillment.ts`; keeps one checkout and webhook path.
- Cyber stock limits live in `cyber_stock` (pools linked by `cyber_products.stock_pool`), checked in `create-shop-preference` and decremented once per paid row in `cyberFulfillment.ts`; keeps scarcity real and server-enforced.
- Canonicals use the official origin and query-free, trailing-slash-normalized paths; legacy aliases and agenda selections resolve to their destination/base page in both SEOHead and the early head script, whose canonical is Helmet-owned (`data-rh`), preventing unmanaged duplicate tags.
- Icefest uses isolated `icefest_` tables, service-only atomic inventory/payment RPCs and the existing Mercado Pago webhook; this keeps ticket fulfillment separate from bookings and prevents duplicate issuance.
- Icefest private ticket/order access requires bearer link tokens; check-in requires the existing admin role and an atomic RPC, so a public PIN cannot authorize entry.
- Icefest order deletion uses an admin-validated edge action and service-only atomic RPC; remove tickets and restore counted inventory together without initiating a payment refund.
- Public Icefest routes use an isolated festival shell and scoped semantic tokens (also on checkout portals) plus one direct WhatsApp floating button with no AI option; this preserves Nave styling and global Pixel tracking without competing navigation or popups.
- Icefest event and tier reads share a cached, abortable query; preload and mount the closed checkout when sales become available, keeping it mounted thereafter; this removes the tap-time download on mobile while preserving buyer data in memory and tracking checkout only when opened.
- Icefest hero mounts one video, chosen after mount with the 768px media query (none during SSR); this prevents desktop and mobile video downloads from competing on initial load.
- Icefest checkout uses one scrolling form with inline totals/payment and scoped floating-label fields; this prevents fixed controls from covering inputs when the mobile keyboard opens.
- Shop products with negative sort_order are private (hidden from /tienda) and sold only via direct links/upsells; avoids a schema change for one-off offers.
- Share metadata is emitted server-side by each route's `head()` through `routeSeo`, with page text in `routeMetadata` and Icefest articles using their existing data; social crawlers do not execute client JS, and homepage metadata must remain unchanged.
- Icefest gallery discovers both bundled WebP images and CDN asset pointers; new uploaded photos use optimized WebP pointers without migrating existing gallery assets.
- Nave chat keeps request options in its server-only requestOptions module and disables internal reasoning within the existing output budget; the client surfaces length termination and stream persistence uses EdgeRuntime.waitUntil.
- The app runs on TanStack Start file routes (`src/routes`, SSR) with pages kept in `src/pages` and routing calls going through `@/lib/router-compat`; this preserves existing react-router call sites without a typed-router rewrite.
- `react-helmet-async` is listed in `ssr.noExternal` in `vite.config.ts`; it ships CommonJS and Vite's SSR runner cannot resolve its named exports otherwise, which would 500 every server-rendered page.
- Backend services stay as Lovable Cloud functions (payments, webhooks, cron, email) rather than server functions; their URLs and shared payment logic are load-bearing.
- Head scripts that initialise tracking are guarded by a window flag; TanStack can re-run head scripts on client navigation, which would double-count init/page views.
- Attribution is captured by one browser helper and sanitized by a shared pure module; checkout snapshots first/last touch without changing Meta event IDs or retaining private return-link parameters.

- Icefest deposit pilot uses a dedicated tier excluded from sequential stages and discounts; immutable terms are snapshotted into order meta_context by an insert trigger, with admin-only balance receipt confirmation blocking check-in until settled, preserving the existing checkout and payment webhook.
