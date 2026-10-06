import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/tienda/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/tienda/CartContext";
import { CartSheet } from "@/components/tienda/CartSheet";
import { CartBottomBar } from "@/components/tienda/CartBottomBar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CyberCountdown, CyberSeal, useCyberNow } from "@/components/cyber/CyberShared";
import {
  CYBER_DURATIONS, CYBER_PLANS, WHATSAPP_URL, DurationKey, formatCLP, membershipOffer, toCartProduct,
} from "@/lib/cyberNave";
import { trackMetaClientEvent } from "@/lib/metaTracking";
import { cn } from "@/lib/utils";
import { poolForDuration, stockFor, useCyberStock } from "@/hooks/useCyberStock";
import { StockBadge } from "@/components/cyber/StockBadge";

const FAQ = [
  { q: "¿Qué diferencia hay entre los planes?", a: "Órbita: 2 veces por semana en todas las experiencias. Universo: acceso ilimitado a todas las experiencias. Yoga Continuo: solo yoga, 2 clases por semana. Yoga Libre: yoga ilimitado." },
  { q: "¿Cómo funcionan los meses de regalo?", a: "En el plan de 7 meses pagas 6 y en el de 14 pagas 12. Los meses de regalo mantienen todos los beneficios y la frecuencia del plan elegido." },
  { q: "¿Puedo pagar en cuotas?", a: "Sí. Los planes por periodo (3, 7 o 14 meses) se pagan con un solo pago en Mercado Pago, en hasta 3 cuotas sin interés." },
  { q: "Ya tengo un plan, ¿cuándo empieza el nuevo?", a: "Si tienes un plan vigente, el nuevo periodo se suma al final del actual. Nuestro equipo te escribirá para coordinar la fecha de inicio." },
];

const PlanesActivosContent = () => {
  const { expired } = useCyberNow();
  const { add, setOpen } = useCart();
  const { toast } = useToast();
  const [dur, setDur] = useState<DurationKey>(7);
  const duration = CYBER_DURATIONS.find((d) => d.key === dur)!;
  const { data: stockRows } = useCyberStock();
  const durStock = stockFor(stockRows, poolForDuration(dur));

  const addPlan = (plan: (typeof CYBER_PLANS)[number]) => {
    const o = membershipOffer(plan, duration);
    add(toCartProduct(o.id, o.name, o.total, plan.image, `${duration.key} meses · ${plan.desc}`), 1);
    trackMetaClientEvent("AddToCart", {
      contentName: o.name, contentCategory: "cyber", contentIds: [o.id], value: o.total, currency: "CLP",
      pixelParams: { content_name: o.name, content_category: "cyber", content_ids: [o.id], value: o.total, currency: "CLP" },
    } as any);
    toast({ title: "Agregado al carrito", description: o.name, duration: 1800 });
    setOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Planes por varios meses · Cyber Nave Studio</title>
        <meta name="description" content="Planes de 3, 7 y 14 meses con descuento y meses de regalo. Un solo pago en hasta 3 cuotas sin interés. Para miembros de Nave Studio." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://studiolanave.com/cyber-nave-studio-membresia-activos" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cyber Nave Studio · Plan por varios meses" />
        <meta property="og:description" content="Un solo pago en hasta 3 cuotas sin interés. Planes con descuento y meses de regalo." />
        <meta property="og:url" content="https://studiolanave.com/cyber-nave-studio-membresia-activos" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <section className="container mx-auto max-w-3xl px-4 pt-10 text-center">
        <CyberSeal>Cyber Nave Studio · Membresías</CyberSeal>
        <h1 className="mt-5 font-space-grotesk font-bold text-primary text-[clamp(2rem,7.5vw,3.5rem)] leading-[1.05]">
          Tu poder se entrena. Tu crecimiento también.
        </h1>
        <p className="mt-4 font-inter text-base sm:text-lg text-muted-foreground leading-relaxed">
          Dale continuidad a tu práctica con yoga, respiración e hielo, o encuentra tu propio ritmo con yoga.
        </p>
        <CyberCountdown className="mt-7" />
      </section>

      {/* Plan por varios meses */}
      <section className="scroll-mt-32 container mx-auto max-w-5xl px-4 mt-14">
        <p className="font-inter text-xs uppercase tracking-[0.2em] text-accent font-semibold">Nuevos y actuales</p>
        <h2 className="font-space-grotesk text-2xl sm:text-3xl font-bold text-primary mt-1">Plan por varios meses</h2>
        <p className="font-inter text-sm text-muted-foreground mt-2">Un solo pago en hasta 3 cuotas sin interés.</p>

        <div role="radiogroup" aria-label="Duración" className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-muted p-1.5">
          {CYBER_DURATIONS.map((d) => (
            <button
              key={d.key}
              role="radio"
              aria-checked={dur === d.key}
              onClick={() => setDur(d.key)}
              className={cn(
                "rounded-xl px-2 py-3 font-inter text-sm font-semibold leading-tight transition-colors min-h-[56px]",
                dur === d.key ? "bg-primary text-primary-foreground shadow" : "text-foreground hover:bg-background",
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-center font-space-grotesk text-lg font-bold text-foreground">{duration.headline}</p>
        {durStock && <StockBadge stock={durStock} className="mt-4 mx-auto max-w-md" />}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CYBER_PLANS.map((plan) => {
            const o = membershipOffer(plan, duration);
            return (
              <article key={plan.key} className="rounded-3xl border border-border bg-card p-5 flex flex-col">
                <h3 className="font-space-grotesk text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="font-inter text-sm text-muted-foreground">{plan.desc}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-primary/10 text-primary px-2.5 py-0.5 font-inter text-xs font-semibold">{duration.key} meses en total</span>
                  {duration.free > 0 && (
                    <span className="rounded-full bg-accent/15 text-primary px-2.5 py-0.5 font-inter text-xs font-semibold">
                      +{duration.free} {duration.free === 1 ? "mes" : "meses"} de regalo
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <p className="font-inter text-sm text-muted-foreground line-through">{formatCLP(o.regularPaid)}</p>
                  <p className="font-space-grotesk text-3xl font-bold text-primary leading-none mt-1">{formatCLP(o.total)}</p>
                  <p className="font-inter text-xs text-muted-foreground mt-1">Precio total · {duration.discount}% de descuento</p>
                  <p className="font-inter text-sm mt-2">3 cuotas sin interés de {formatCLP(o.installment)}</p>
                  <p className="font-inter text-xs text-muted-foreground mt-1">Equivale a {formatCLP(o.perMonth)} por mes</p>
                </div>
                <Button size="lg" className="mt-auto w-full h-14 rounded-full text-base" style={{ marginTop: "1.25rem" }} onClick={() => addPlan(plan)} disabled={expired || durStock?.left === 0}>
                  <ShoppingCart className="h-4 w-4 mr-2" /> {expired ? "Oferta finalizada" : durStock?.left === 0 ? "Agotado" : "Agregar al carrito"}
                </Button>
              </article>
            );
          })}
        </div>
        <p className="mt-5 font-inter text-sm text-muted-foreground text-center">
          Los meses de regalo mantienen todos los beneficios y la frecuencia del plan elegido. Promociones no acumulables.
        </p>
      </section>

      <section className="container mx-auto max-w-3xl px-4 mt-14">
        <h2 className="font-space-grotesk text-2xl font-bold text-primary mb-2">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible className="w-full">
          {FAQ.map((it, i) => (
            <AccordionItem key={i} value={`f${i}`}>
              <AccordionTrigger className="text-left font-space-grotesk text-base">{it.q}</AccordionTrigger>
              <AccordionContent className="font-inter text-sm text-muted-foreground leading-relaxed">{it.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="container mx-auto max-w-3xl px-4 mt-16 text-center">
        <p className="font-space-grotesk text-xl font-bold text-primary">Nave Studio</p>
        <p className="font-inter text-sm text-muted-foreground mt-2 leading-relaxed">
          Antares 259, Las Condes · a pasos del Metro Los Domínicos. Yoga, respiración y experiencias de agua fría
          guiadas por instructores certificados.
        </p>
        <Button asChild variant="outline" size="lg" className="mt-5 h-12 rounded-full">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Escríbenos por WhatsApp</a>
        </Button>
      </section>
    </>
  );
};

/** Página sin nav Cyber ni enlaces a la promo de nuevos: link especial para clientes actuales. */
const CyberNaveStudioMembresiaActivos = () => (
  <CartProvider>
    <main className="min-h-screen bg-background pt-16 pb-28">
      <PlanesActivosContent />
    </main>
    <CartSheet />
    <CartBottomBar />
    <Footer />
  </CartProvider>
);

export default CyberNaveStudioMembresiaActivos;
