import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Loader2, Ticket, ShieldCheck, Calendar, MapPin, Tag, CreditCard } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { type IcefestEvent, type IcefestTier, icefestCall, icefestDate, icefestMoney, normalizeIcefestPhone } from "@/lib/icefest";
import { trackMetaClientEvent } from "@/lib/metaTracking";
import { getMetaBrowserContext } from "@/lib/metaPixel";
import { ICEFEST_DEPOSIT_TIER_ID, icefestDepositForQuantity } from "../../../supabase/functions/_shared/icefestDeposit";
import { IcefestTicketOptions } from "./IcefestTicketOptions";
import { icefestInstallments } from "@/lib/icefestInstallments";
import ice from "@/assets/icefest/ice-bath-new.webp";

type Quote = { total_amount: number; discount_amount: number };
type Props = { tier: IcefestTier | null; tiers: IcefestTier[]; activeTier: IcefestTier | null; now: number; onTierChange: (tier: IcefestTier) => void; event: IcefestEvent | null; canBuy: boolean; open: boolean; onOpenChange: (open: boolean) => void };

export function IcefestCheckout({ tier, tiers, activeTier, now, onTierChange, event, canBuy, open, onOpenChange }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [buyer, setBuyer] = useState({ name: "", surname: "", email: "", phone: "" });
  const [coupon, setCoupon] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState<"quote" | "payment" | null>(null);
  const [error, setError] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const locked = useRef(false);
  const tracked = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const revision = useRef(0);
  const deposit = tier?.id === ICEFEST_DEPOSIT_TIER_ID ? icefestDepositForQuantity(quantity) : null;
  const limit = tier ? Math.max(0, Math.min(tier.max_per_order, tier.stock === null ? tier.max_per_order : tier.stock - tier.stock_sold)) : 0;
  const checkoutAvailable = canBuy && limit > 0 && quantity <= limit && Boolean(tier?.is_active && (tier.id === activeTier?.id || tier.id === ICEFEST_DEPOSIT_TIER_ID) && (!tier.valid_from || new Date(tier.valid_from).getTime() <= now) && (!tier.valid_until || new Date(tier.valid_until).getTime() > now));
  const total = quote?.total_amount ?? (tier?.price ?? 0) * quantity;
  const installments = icefestInstallments(total);

  useEffect(() => {
    revision.current += 1;
    setQuote(null);
    setError("");
  }, [quantity, coupon, tier?.id, tier?.price]);
  useEffect(() => { setCoupon(""); setAccepted(false); }, [tier?.id]);
  useEffect(() => {
    if (limit > 0) setQuantity((current) => Math.min(current, limit));
  }, [limit]);
  useEffect(() => {
    if (open && tier && !tracked.current) {
      tracked.current = true;
      trackMetaClientEvent("InitiateCheckout", { contentName: "Icefest Santiago", contentIds: [tier.id], value: tier.price * quantity, currency: "CLP", funnel: "icefest" });
    }
  }, [open, tier, quantity]);

  const payload = {
    ticket_type_id: tier?.id,
    quantity,
    buyer: { name: buyer.name.trim(), surname: buyer.surname.trim(), email: buyer.email.trim().toLowerCase(), phone: normalizeIcefestPhone(buyer.phone) },
    coupon: deposit ? "" : coupon,
    accept_terms: accepted,
  };

  function validBuyer() {
    if (!form.current?.reportValidity()) return false;
    if (!/^\+[1-9]\d{7,14}$/.test(payload.buyer.phone)) {
      setError("Revisa tu número de WhatsApp, incluyendo el código de país.");
      document.getElementById("icefest-phone")?.focus();
      return false;
    }
    return true;
  }

  async function applyCoupon() {
    if (locked.current || !checkoutAvailable || !coupon || !validBuyer()) return;
    locked.current = true;
    setBusy("quote");
    setError("");
    const version = revision.current;
    try {
      // A quote only reads prices; it never creates an order or accepts terms for payment.
      const result = await icefestCall<Quote>("icefest-checkout", { ...payload, accept_terms: true, quote: true });
      if (version !== revision.current) return;
      if (!Number.isFinite(result.total_amount) || result.total_amount < 0) throw new Error("No se pudo confirmar el total. Intenta nuevamente.");
      setQuote(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo aplicar el cupón.");
    } finally {
      locked.current = false;
      setBusy(null);
    }
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (locked.current || !checkoutAvailable || !accepted || !validBuyer()) return;
    if (!deposit && coupon && !quote) {
      setError("Aplica el cupón para confirmar tu descuento antes de pagar.");
      document.getElementById("icefest-coupon")?.focus();
      return;
    }
    locked.current = true;
    setBusy("payment");
    setError("");
    try {
      const ctx = getMetaBrowserContext();
      const result = await icefestCall<{ init_point?: string; redirect_url?: string }>("icefest-checkout", {
        ...payload,
        meta: { first_touch: ctx.first_touch, last_touch: ctx.last_touch, fbp: ctx.fbp || undefined, fbc: ctx.fbc || undefined, clientUserAgent: navigator.userAgent, utm: { source: ctx.utm_source, medium: ctx.utm_medium, campaign: ctx.utm_campaign, content: ctx.utm_content, term: ctx.utm_term, referrer: ctx.referrer } },
      });
      const destination = result.init_point || result.redirect_url;
      if (!destination) throw new Error("No recibimos el enlace de pago. Intenta nuevamente.");
      const url = new URL(destination);
      if (url.protocol !== "https:") throw new Error("No se pudo abrir un enlace de pago seguro.");
      window.location.assign(url.href);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar el pago.");
      locked.current = false;
      setBusy(null);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(value) => { if (!locked.current) onOpenChange(value); }}>
      <SheetContent
        className="icefest-theme icefest-checkout text-foreground w-full sm:max-w-xl p-0 h-[100dvh] overflow-y-auto overscroll-contain"
        onEscapeKeyDown={(e) => { if (locked.current) e.preventDefault(); }}
        onPointerDownOutside={(e) => { if (locked.current) e.preventDefault(); }}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Entradas Icefest + Breath Act</SheetTitle>
          <SheetDescription>Selecciona tu modalidad de pago y completa tus datos.</SheetDescription>
        </SheetHeader>
        <form ref={form} onSubmit={pay} className="px-5 sm:px-7 pt-12 space-y-5 pb-8">
          {!checkoutAvailable && <p role="alert" className="text-destructive">La disponibilidad cambió. Cierra el carrito y revisa las entradas disponibles.</p>}
          {tier && <>
            <div className="flex items-start gap-3 border-b pb-5">
              <img src={ice} alt="Icefest" className="w-16 h-20 object-cover rounded-md shrink-0" />
              <div className="min-w-0 space-y-1.5">
                <h2 className="text-base font-semibold">Icefest + Breath Act</h2>
                {event && <div className="text-xs text-muted-foreground space-y-1.5">
                  <p className="flex gap-1.5"><Calendar className="w-3.5 h-3.5 shrink-0" />{new Date(`${event.date}T12:00:00Z`).toLocaleDateString("es-CL", { timeZone: "America/Santiago", weekday: "short", day: "numeric", month: "short" })} · {event.schedule}</p>
                  <p className="flex gap-1.5"><MapPin className="w-3.5 h-3.5 shrink-0" />{event.location}</p>
                </div>}
              </div>
            </div>
            <IcefestTicketOptions tiers={tiers} selected={tier} activeTier={activeTier} now={now} disabled={Boolean(busy) || !canBuy} onChange={onTierChange} />
            <fieldset disabled={Boolean(busy)} className="min-w-0 space-y-4">
              <legend className="text-sm font-semibold mb-3">Datos de contacto</legend>
              <div className="icefest-field">
                <Input id="icefest-email" name="email" type="email" autoComplete="email" required maxLength={255} placeholder=" " value={buyer.email} onChange={(e) => setBuyer((b) => ({ ...b, email: e.target.value }))} className="peer" />
                <Label htmlFor="icefest-email">Email</Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {([{ key: "name", label: "Nombre", autoComplete: "given-name" }, { key: "surname", label: "Apellido", autoComplete: "family-name" }] as const).map((f) => <div key={f.key} className="icefest-field">
                  <Input id={`icefest-${f.key}`} name={f.key} autoComplete={f.autoComplete} required pattern=".*\S.*" maxLength={100} placeholder=" " value={buyer[f.key]} onChange={(e) => setBuyer((b) => ({ ...b, [f.key]: e.target.value }))} className="peer" />
                  <Label htmlFor={`icefest-${f.key}`}>{f.label}</Label>
                </div>)}
              </div>
              <div className="icefest-field">
                <Input id="icefest-phone" name="phone" type="tel" autoComplete="tel" required maxLength={30} placeholder=" " value={buyer.phone} onChange={(e) => setBuyer((b) => ({ ...b, phone: e.target.value }))} className="peer" />
                <Label htmlFor="icefest-phone">WhatsApp</Label>
              </div>
              <div className="flex gap-2 items-start pt-2">
                <div className="icefest-field flex-1 min-w-0">
                  <Input id="icefest-coupon" name="coupon" maxLength={50} autoComplete="off" placeholder=" " disabled={Boolean(deposit)} value={coupon} onChange={(e) => setCoupon(e.target.value.replace(/\s/g, "").toUpperCase())} className="peer" />
                  <Label htmlFor="icefest-coupon">Código de descuento</Label>
                </div>
                <Button type="button" variant="outline" className="h-14 px-4" disabled={Boolean(deposit) || !coupon || Boolean(quote)} onClick={() => void applyCoupon()}>
                  {busy === "quote" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4 mr-2" />}{quote ? "Aplicado" : "Aplicar"}
                </Button>
              </div>
              {deposit && <p className="text-xs text-muted-foreground">El abono no admite descuentos.</p>}
              <div className="flex justify-between items-center gap-3 pt-1">
                <span className="text-sm font-medium">Cantidad de entradas</span>
                <div className="flex items-center gap-2 shrink-0">
                  <Button type="button" variant="outline" size="icon" aria-label="Quitar entrada" disabled={quantity <= 1} onClick={() => setQuantity((q) => q - 1)}><Minus className="w-4 h-4" /></Button>
                  <span aria-live="polite" className="w-7 text-center font-semibold">{quantity}</span>
                  <Button type="button" variant="outline" size="icon" aria-label="Agregar entrada" disabled={quantity >= limit} onClick={() => setQuantity((q) => q + 1)}><Plus className="w-4 h-4" /></Button>
                </div>
              </div>
            </fieldset>
            {deposit ? <div className="border-y py-4 space-y-3">
              <dl className="space-y-3 text-sm" aria-live="polite">
                <div className="flex justify-between gap-4 text-lg font-semibold"><dt>Pagas hoy</dt><dd className="whitespace-nowrap text-primary">{icefestMoney(total)}</dd></div>
                <div className="flex justify-between gap-4"><dt>Saldo pendiente</dt><dd className="whitespace-nowrap font-semibold">{icefestMoney(deposit.balance_due)}</dd></div>
                <div className="flex justify-between gap-4"><dt>Total {quantity === 1 ? "entrada" : `${quantity} entradas`}</dt><dd className="whitespace-nowrap">{icefestMoney(deposit.full_price * quantity)}</dd></div>
              </dl>
              <p className="text-xs text-muted-foreground leading-relaxed">El saldo se paga del 7 al 13 de diciembre o en la puerta, antes de ingresar. Para pagar antes, <a className="text-primary underline" href="https://wa.me/56946120426?text=Hola%2C%20quiero%20coordinar%20el%20saldo%20de%20mi%20reserva%20Icefest" target="_blank" rel="noopener noreferrer">coordina por WhatsApp</a>. No se cobra automáticamente; tu precio queda fijo en {icefestMoney(deposit.full_price)} por persona.</p>
            </div> : <dl className="border-y py-4 space-y-3 text-sm" aria-live="polite">
              <div className="flex justify-between gap-4"><dt>Subtotal</dt><dd>{icefestMoney(tier.price * quantity)}</dd></div>
              {quote && quote.discount_amount > 0 && <div className="flex justify-between gap-4 text-primary"><dt>Descuento</dt><dd>−{icefestMoney(quote.discount_amount)}</dd></div>}
              <div className="flex justify-between gap-4 text-lg font-semibold"><dt>{deposit ? "Abono a pagar ahora" : "Total"}</dt><dd>{icefestMoney(total)}</dd></div>
            </dl>}
            {installments && <div className="flex items-start gap-3 border-l-4 border-primary bg-primary/10 px-4 py-4" aria-live="polite">
              <CreditCard className="w-6 h-6 shrink-0 text-primary mt-0.5" aria-hidden="true" />
              <div className="min-w-0 space-y-1">
                <p className="text-base font-semibold text-primary leading-relaxed">{deposit ? "Paga tu abono" : "Paga"} en 3 cuotas sin intereses de {icefestMoney(installments.amount)}.</p>
                {deposit && <p className="text-xs text-muted-foreground leading-relaxed">Las cuotas corresponden solo al abono de {icefestMoney(total)}; el saldo de {icefestMoney(deposit.balance_due)} se paga por separado antes de ingresar.</p>}
              </div>
            </div>}
            <div className="flex items-start gap-3">
              <Checkbox id="icefest-terms" checked={accepted} disabled={Boolean(busy)} onCheckedChange={(v) => setAccepted(v === true)} className="mt-0.5 shrink-0" />
              <Label htmlFor="icefest-terms" className="text-sm leading-relaxed font-normal">
                Acepto los <a href="https://docs.google.com/document/d/18GOC_ay6NezpF3CEenaItpWsMNIehBsOLMZuexJJKl4/" target="_blank" rel="noopener noreferrer" className="text-primary underline">términos y condiciones</a> y <a href="https://drive.google.com/file/d/1_VlQ4biLOZFEpZvFrSFbDhoX734K6JBx/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Certificado de Responsabilidad</a>.
                {deposit && <span className="block mt-2 font-medium">Entiendo que este pago es un abono y que debo cancelar {icefestMoney(deposit.balance_due)} antes de ingresar, durante la semana del evento o en la puerta.</span>}
              </Label>
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <div className="space-y-4">
              <Button type="submit" className="festival-cta w-full h-14 text-base" disabled={!accepted || Boolean(busy) || !checkoutAvailable}>
                {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Ticket className="w-4 h-4 mr-2" />}
                {busy === "payment" ? "Abriendo pago seguro…" : busy === "quote" ? "Aplicando cupón…" : quote?.total_amount === 0 ? "Confirmar entradas" : deposit ? "Reservar con Mercado Pago" : "Pagar con Mercado Pago"}
              </Button>
              <p className="text-xs text-muted-foreground flex gap-2 leading-relaxed"><ShieldCheck className="w-4 h-4 text-primary shrink-0" />Pago seguro con Mercado Pago.</p>
            </div>
          </>}
        </form>
      </SheetContent>
    </Sheet>
  );
}
