

## Problem

The MailerLite eCommerce API is returning a **422 error** with three validation issues:

1. **`status: "paid"` is invalid** -- MailerLite expects `"complete"` (not `"paid"`)
2. **`cart` object is missing** -- the API requires a `cart` wrapper around the items
3. **`cart.items` format is wrong** -- items must be nested inside `cart.items`, not top-level `items`

The current payload in `supabase/functions/_shared/mailerlite.ts` (line 142-158) builds:
```json
{ "order_id": "...", "status": "paid", "items": [...] }
```

But MailerLite expects:
```json
{ "order_id": "...", "status": "complete", "cart": { "items": [...], "total": 40000 } }
```

## Fix: `supabase/functions/_shared/mailerlite.ts`

Update the payload construction (lines ~142-158) to:

1. Change `status` from `"paid"` to `"complete"`
2. Wrap `items` inside a `cart` object with `total` and `currency`
3. Remove top-level `items` (move them into `cart.items`)

The corrected payload structure:
```typescript
const payload = {
  order_id: orderData.order_id,
  currency: "CLP",
  total: orderData.total,
  subtotal: orderData.subtotal || orderData.total,
  status: "complete",
  customer: {
    email: orderData.customer_email,
    first_name,
    last_name,
  },
  cart: {
    items: orderData.items.map((item) => ({
      product_id: item.product_id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    total: orderData.total,
    currency: "CLP",
  },
};
```

This is a single-file fix in the shared helper. All callers (mercadopago-webhook, mailerlite-sync-order) will automatically use the corrected payload.

