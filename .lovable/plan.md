

## Plan: Add buyers to MailerLite groups on purchase

### Problem
When a customer completes a purchase, they are not being added to the specified MailerLite subscriber groups.

### Approach

**1. Add a shared helper function in `supabase/functions/_shared/mailerlite.ts`**

Add a new `addSubscriberToGroups` function that:
- Takes buyer email, name, and an array of group IDs
- Calls the MailerLite API `POST /api/subscribers` with the groups array
- Uses the existing `MAILERLITE_API_KEY` secret (same one used by `subscribe-mailerlite` function)
- Non-blocking: errors are logged but don't break the purchase flow

**2. Call the helper after successful purchases in `mercadopago-webhook/index.ts`**

Add a call to `addSubscriberToGroups` in two places:
- `handlePackageOrderPayment` (line ~355, after MailerLite order sync) for package/giftcard purchases
- `handleBookingPayment` (line ~535, after MailerLite order sync) for booking purchases

Both will pass the buyer's email, name, and the two group IDs:
- `168517368312498017`
- `180841311274796302`

**3. Call the helper for free (100% discount) orders in `purchase-session-package/index.ts`**

Add the same call after the CRM event log (line ~330) for orders completed without Mercado Pago.

### Technical details

The MailerLite subscriber API (`POST /subscribers`) is idempotent -- if the subscriber already exists, it updates their groups. The `MAILERLITE_API_KEY` secret is already configured.

```text
Purchase flow:
  Payment approved (webhook) ──► codes generated ──► email sent ──► MailerLite order sync ──► [NEW] add to groups
  Free order (purchase fn)   ──► codes generated ──► email sent ──► CRM log ──► [NEW] add to groups
```

### Files to modify
- `supabase/functions/_shared/mailerlite.ts` -- add `addSubscriberToGroups` helper
- `supabase/functions/mercadopago-webhook/index.ts` -- call helper in both payment handlers
- `supabase/functions/purchase-session-package/index.ts` -- call helper for free orders

