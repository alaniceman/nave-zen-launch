import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Loader2, Ticket, ShieldCheck, Calendar, MapPin, Tag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { type IcefestEvent, type IcefestTier, icefestCall, icefestDate, icefestMoney, normalizeIcefestPhone } from "@/lib/icefest";
import { trackMetaClientEvent } from "@/lib/metaTracking";
import { getMetaBrowserContext } from "@/lib/metaPixel";
import ice from "@/assets/icefest/ice-bath-new.webp";

type Quote = { total_amount: number; discount_amount: number };
type Props = { tier: IcefestTier | null; event: IcefestEvent | null; canBuy: boolean; open: boolean; onOpenChange: (open: boolean) => void };

export function IcefestCheckout({ tier, event, canBuy, open, onOpenChange }: Props) {
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
  const limit = tier ? Math.max(0, Math.min(tier.max_per_order, tier.stock === null ? tier.max_per_order : tier.stock - tier.stock_sold)) : 0;
  const checkoutAvailable = canBuy && limit > 0 && quantity <= limit;

  useEffect(() => {
    revision.current += 1;
    setQuote(null);
    setError("");
  }, [quantity, coupon, tier?.id, tier?.price]);
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
    coupon,
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
    if (coupon && !quote) {
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
        meta: { fbp: ctx.fbp || undefined, fbc: ctx.fbc || undefined, clientUserAgent: navigator.userAgent },
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
        <SheetHeader className="px-5 sm:px-7 pt-6 pb-5 border-b text-left">
          <SheetTitle className="text-xl pr-8">Tu viaje a Icefest</SheetTitle>
          <SheetDescription>Icefest + Breath Act · Santiago</SheetDescription>
        </SheetHeader>
        <form ref={form} onSubmit={pay} className="px-5 sm:px-7 py-6 space-y-7 pb-10">
          {!checkoutAvailable && <p role="alert" className="text-destructive">La disponibilidad cambió. Cierra el carrito y revisa las entradas disponibles.</p>}
          {tier && <>
            <fieldset disabled={Boolean(busy)} className="space-y-5 min-w-0">
              <legend className="sr-only">Entradas</legend>
              <div className="flex gap-4">
                <img src={ice} alt="Icefest" className="w-16 h-20 object-cover rounded-md shrink-0" />
                <div className="min-w-0">
                  <h2 className="text-base font-semibold">Icefest + Breath Act</h2>
                  <p className="text-primary text-sm mt-1">{tier.name}</p>
                  <p className="font-semibold mt-1">{icefestMoney(tier.price)} <span className="text-muted-foreground text-xs font-normal">por persona</span></p>
                </div>
              </div>
              {event && <div className="text-xs text-muted-foreground space-y-2">
                <p className="flex gap-2"><Calendar className="w-4 h-4 shrink-0" />{icefestDate(event.date)} · {event.schedule}</p>
                <p className="flex gap-2"><MapPin className="w-4 h-4 shrink-0" />{event.location}</p>
              </div>}
              <div className="border-b pb-5 flex justify-between items-center">
                <span className="text-sm font-medium">Cantidad</span>
                <div className="flex items-center gap-3">
                  <Button type="button" variant="outline" size="icon" aria-label="Quitar entrada" disabled={quantity <= 1} onClick={() => setQuantity((q) => q - 1)}><Minus className="w-4 h-4" /></Button>
                  <span aria-live="polite" className="w-7 text-center font-semibold">{quantity}</span>
                  <Button type="button" variant="outline" size="icon" aria-label="Agregar entrada" disabled={quantity >= limit} onClick={() => setQuantity((q) => q + 1)}><Plus className="w-4 h-4" /></Button>
                </div>
              </div>
            </fieldset>
            <fieldset disabled={Boolean(busy)} className="min-w-0 space-y-4">
              <legend className="text-base font-semibold mb-4">Contacto</legend>
              <div className="icefest-field">
                <Input id="icefest-email" name="email" type="email" autoComplete="email" required maxLength={255} placeholder=" " value={buyer.email} onChange={(e) => setBuyer((b) => ({ ...b, email: e.target.value }))} className="peer" />
                <Label htmlFor="icefest-email">Email</Label>
              </div>
              <p className="text-xs text-muted-foreground">Tus entradas y el comprobante llegarán a este email.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([{ key: "name", label: "Nombre", autoComplete: "given-name" }, { key: "surname", label: "Apellido", autoComplete: "family-name" }] as const).map((f) => <div key={f.key} className="icefest-field">
                  <Input id={`icefest-${f.key}`} name={f.key} autoComplete={f.autoComplete} required pattern=".*\S.*" maxLength={100} placeholder=" " value={buyer[f.key]} onChange={(e) => setBuyer((b) => ({ ...b, [f.key]: e.target.value }))} className="peer" />
                  <Label htmlFor={`icefest-${f.key}`}>{f.label}</Label>
                </div>)}
              </div>
              <div className="icefest-field">
                <Input id="icefest-phone" name="phone" type="tel" autoComplete="tel" required maxLength={30} placeholder=" " value={buyer.phone} onChange={(e) => setBuyer((b) => ({ ...b, phone: e.target.value }))} className="peer" />
                <Label htmlFor="icefest-phone">WhatsApp</Label>
              </div>
              <p className="text-xs text-muted-foreground">Incluye el código de país: +56 9 1234 5678.</p>
              <div className="flex gap-2 items-start pt-2">
                <div className="icefest-field flex-1 min-w-0">
                  <Input id="icefest-coupon" name="coupon" maxLength={50} autoComplete="off" placeholder=" " value={coupon} onChange={(e) => setCoupon(e.target.value.replace(/\s/g, "").toUpperCase())} className="peer" />
                  <Label htmlFor="icefest-coupon">Código de descuento</Label>
                </div>
                <Button type="button" variant="outline" className="h-14 px-4" disabled={!coupon || Boolean(quote)} onClick={() => void applyCoupon()}>
                  {busy === "quote" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4 mr-2" />}{quote ? "Aplicado" : "Aplicar"}
                </Button>
              </div>
            </fieldset>
            <dl className="border-y py-5 space-y-3 text-sm" aria-live="polite">
              <div className="flex justify-between gap-4"><dt>Subtotal</dt><dd>{icefestMoney(tier.price * quantity)}</dd></div>
              {quote && quote.discount_amount > 0 && <div className="flex justify-between gap-4 text-primary"><dt>Descuento</dt><dd>−{icefestMoney(quote.discount_amount)}</dd></div>}
              <div className="flex justify-between gap-4 text-lg font-semibold"><dt>Total</dt><dd>{icefestMoney(quote?.total_amount ?? tier.price * quantity)}</dd></div>
            </dl>
            <div className="flex items-start gap-3">
              <Checkbox id="icefest-terms" checked={accepted} disabled={Boolean(busy)} onCheckedChange={(v) => setAccepted(v === true)} className="mt-0.5 shrink-0" />
              <Label htmlFor="icefest-terms" className="text-sm leading-relaxed font-normal">
                Acepto los <a href="https://docs.google.com/document/d/18GOC_ay6NezpF3CEenaItpWsMNIehBsOLMZuexJJKl4/" target="_blank" rel="noopener noreferrer" className="text-primary underline">términos y condiciones</a> y <a href="https://drive.google.com/file/d/1_VlQ4biLOZFEpZvFrSFbDhoX734K6JBx/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Certificado de Responsabilidad</a>.
              </Label>
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <div className="space-y-4">
              <Button type="submit" className="festival-cta w-full h-14 text-base" disabled={!accepted || Boolean(busy) || !checkoutAvailable}>
                {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Ticket className="w-4 h-4 mr-2" />}
                {busy === "payment" ? "Abriendo pago seguro…" : busy === "quote" ? "Aplicando cupón…" : quote?.total_amount === 0 ? "Confirmar entradas" : "Pagar con Mercado Pago"}
              </Button>
              <p className="text-xs text-muted-foreground flex gap-2 leading-relaxed"><ShieldCheck className="w-4 h-4 text-primary shrink-0" />Pago seguro con Mercado Pago. Puedes elegir hasta 3 cuotas; las condiciones de tu tarjeta se muestran al pagar.</p>
            </div>
          </>}
        </form>
      </SheetContent>
    </Sheet>
  );
}
