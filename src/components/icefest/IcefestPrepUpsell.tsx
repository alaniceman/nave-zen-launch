import { useState } from "react";
import { Loader2, Snowflake, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const OPTIONS = [
  { id: "16b3f640-67e7-482f-8333-74477b0e69d0", kind: "package", label: "1 sesión", sub: "Breathwork + Icebath o Yoga (expiran en 6 meses)", price: 15000, off: "50% dcto" },
  { id: "25f89aba-9114-47ee-96a1-9b3582994ab4", kind: "package", label: "3 sesiones", sub: "Breathwork + Icebath o Yoga (expiran en 6 meses)", price: 30000, off: "67% dcto", best: true },
  { id: "956cf8ea-5d66-4434-8693-ac2bee9317e0", kind: "shop", label: "1 Mes Membresía Ilimitada", sub: "Ven todo lo que quieras (lun a dom) a Nave Studio por 1 mes: Breathwork + Icebath o Yoga. Puedes elegir la fecha de inicio.", price: 40000, off: "Ilimitado" },
];
const clp = (n: number) => `$${n.toLocaleString("es-CL")}`;

type Buyer = { buyer_name?: string; buyer_surname?: string; buyer_email?: string; buyer_phone?: string };

export function IcefestPrepUpsell({ buyer }: { buyer: Buyer }) {
  const [selected, setSelected] = useState(OPTIONS[1].id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!buyer.buyer_email) return null;

  async function buy() {
    setBusy(true);
    setError("");
    try {
      const opt = OPTIONS.find((o) => o.id === selected)!;
      const name = `${buyer.buyer_name ?? ""} ${buyer.buyer_surname ?? ""}`.trim() || "Participante Icefest";
      const phone = (buyer.buyer_phone || "").replace(/\D/g, "").slice(0, 20) || "56900000000";
      const { data, error } = opt.kind === "shop"
        ? await supabase.functions.invoke("create-shop-preference", { body: { productId: opt.id, buyerName: name, buyerEmail: buyer.buyer_email, buyerPhone: phone, eventSourceUrl: window.location.href } })
        : await supabase.functions.invoke("purchase-session-package", {
        body: {
          packageId: selected,
          buyerName: `${buyer.buyer_name ?? ""} ${buyer.buyer_surname ?? ""}`.trim() || "Participante Icefest",
          buyerEmail: buyer.buyer_email,
          buyerPhone: (buyer.buyer_phone || "").replace(/\D/g, "").slice(0, 20) || "56900000000",
          isGiftCard: false,
          eventSourceUrl: window.location.href,
        },
      });
      if (error) throw error;
      const url = data?.initPoint || data?.init_point || data?.redirectUrl;
      if (!url) throw new Error();
      window.location.href = url;
    } catch {
      setError("No pudimos iniciar el pago. Intenta de nuevo.");
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="prep-title" className="mt-8 rounded-2xl border-2 border-primary bg-primary/5 p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary flex items-center gap-2">
        <Snowflake className="h-4 w-4" /> Oferta solo para asistentes
      </p>
      <h2 id="prep-title" className="text-2xl font-bold mt-2">Prepárate para el Icefest</h2>
      <p className="text-muted-foreground mt-1">Sesiones de Breathwork + Icebath (1 hr) o Yoga en Nave Studio, o un mes ilimitado</p>
      <div role="radiogroup" className="grid gap-3 mt-5">
        {OPTIONS.map((o) => {
          const active = selected === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelected(o.id)}
              className={`flex items-center justify-between gap-3 rounded-xl border-2 p-4 text-left transition ${active ? "border-primary bg-background" : "border-border bg-background/60"}`}
            >
              <span className="flex items-center gap-3">
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}>
                  {active && <Check className="h-3 w-3" />}
                </span>
                <span>
                  <span className="block font-semibold">{o.label}</span>
                  <span className="block text-xs text-muted-foreground">{o.sub}</span>
                  {o.best && <span className="text-xs text-primary font-semibold">Más conveniente</span>}
                </span>
              </span>
              <span className="text-right">
                <span className="block text-lg font-bold">{clp(o.price)}</span>
                <span className="text-xs font-semibold rounded-full bg-primary/15 text-primary px-2 py-0.5">{o.off}</span>
              </span>
            </button>
          );
        })}
      </div>
      <Button onClick={buy} disabled={busy} size="lg" className="w-full mt-5">
        {busy ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Agregar y pagar {clp(OPTIONS.find((o) => o.id === selected)!.price)}
      </Button>
      <p className="text-xs text-muted-foreground mt-3 text-center">
        Usaremos los datos de tu compra. Recibirás un email aparte con tus códigos y el link para agendar (o con la activación de tu membresía).
      </p>
      {error && <p role="alert" className="text-destructive text-sm mt-2">{error}</p>}
    </section>
  );
}
