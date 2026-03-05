

## Plan: Fix webhook to allow failed→paid transitions

### Problem
When a customer retries payment after an initial rejection, Mercado Pago sends a new `approved` webhook. However, the atomic update on line 191 only allows transitions from `created` or `pending_payment` to `paid`:

```typescript
.in("status", ["created", "pending_payment"])
```

Since the first rejected webhook already set status to `failed`, the approved webhook finds no matching row and returns `already_processed` — silently dropping the successful payment.

### Fix
In `supabase/functions/mercadopago-webhook/index.ts`, add `"failed"` to the allowed statuses on line 191:

```typescript
.in("status", ["created", "pending_payment", "failed"])
```

This single change allows orders that were previously marked as `failed` (due to rejected card, bad CVV, etc.) to be correctly updated to `paid` when a subsequent approved payment arrives.

### Why this is safe
- The idempotency check on line 98 (`order.status === "paid"`) still prevents double-processing
- The payment ID check on line 107 prevents reprocessing the same payment
- Amount verification on line 162 still validates the correct amount was charged

### Files to modify
- `supabase/functions/mercadopago-webhook/index.ts` — line 191: add `"failed"` to status filter

