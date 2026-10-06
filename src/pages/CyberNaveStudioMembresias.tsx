import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowDown, ExternalLink, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/tienda/CartContext";
import { useToast } from "@/hooks/use-toast";
import { CyberCountdown, CyberFAQ, CyberLayout, CyberSeal, useCyberNow } from "@/components/cyber/CyberShared";
import {
  BOXMAGIC_NEW, CYBER_DURATIONS, CYBER_PLANS, CYBER_ROUTES, DurationKey, formatCLP, membershipOffer, toCartProduct,
} from "@/lib/cyberNave";
import { trackMetaClientEvent } from "@/lib/metaTracking";
import { cn } from "@/lib/utils";
import { poolForDuration, stockFor, useCyberStock } from "@/hooks/useCyberStock";
import { StockBadge } from "@/components/cyber/StockBadge";

const NEW_PLANS = [
  { key: "orbita" as const, name: "Órbita", desc: "2 veces por semana", regular: 79000, cyber: 39500, url: BOXMAGIC_NEW.orbita },
  { key: "universo" as const, name: "Universo", desc: "Acceso ilimitado", regular: 95000, cyber: 47500, url: BOXMAGIC_NEW.universo },
];

const FAQ = [
  { q: "¿Qué diferencia hay entre los planes?", a: "Órbita: 2 veces por semana en todas las experiencias. Universo: acceso ilimitado a todas las experiencias. Yoga Continuo: solo yoga, 2 clases por semana. Yoga Libre: yoga ilimitado." },
  { q: "¿Cómo funcionan los meses de regalo?", a: "En el plan de 7 meses pagas 6 y en el de 14 pagas 12. Los meses de regalo mantienen todos los beneficios y la frecuencia del plan elegido." },
  { q: "¿Puedo pagar en cuotas?", a: "Las compras por periodo (3, 7 o 14 meses) se pagan con Mercado Pago en hasta 3 cuotas sin interés. La oferta para nuevos de 50% por 3 meses es una suscripción mensual, no se paga en cuotas." },
  { q: "Ya tengo un plan, ¿cuándo empieza el nuevo?", a: "Si tienes un plan vigente, el nuevo periodo se suma al final del actual. Nuestro equipo te escribirá para coordinar la fecha de inicio." },
  { q: "¿Qué diferencia hay entre la suscripción y la compra por periodo?", a: "La oferta para nuevos es una suscripción mensual con 3 meses de compromiso: se cobra mes a mes. La compra por periodo es un pago único por 3, 7 o 14 meses." },
];

const MembresiasContent = () => {
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
        <title>Cyber Membresías Yoga y Wim Hof | Nave Studio Las Condes</title>
        <meta name="description" content="Membresías Cyber Nave Studio: 50% por 3 meses para nuevos en Órbita y Universo, y planes de 3, 7 y 14 meses con descuento y meses de regalo. Hasta el 7 de octubre." />
        <link rel="canonical" href="https://studiolanave.com/cyber-nave-studio-membresias" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cyber Nave Studio · Membresías" />
        <meta property="og:description" content="Tu poder se entrena. Tu crecimiento también. Planes con descuento y meses de regalo." />
        <meta property="og:url" content="https://studiolanave.com/cyber-nave-studio-membresias" />
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
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button asChild size="lg" variant="outline" className="h-14 rounded-full text-base">
            <a href="#nuevos">Soy nuevo: quiero comenzar <ArrowDown className="h-4 w-4 ml-2" /></a>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 rounded-full text-base">
            <a href="#periodos">Quiero un plan por varios meses <ArrowDown className="h-4 w-4 ml-2" /></a>
          </Button>
        </div>
      </section>

      {/* A) Solo nuevos — suscripción BoxMagic */}
      <section id="nuevos" className="scroll-mt-32 container mx-auto max-w-5xl px-4 mt-14">
        <p className="font-inter text-xs uppercase tracking-[0.2em] text-accent font-semibold">Solo nuevos</p>
        <h2 className="font-space-grotesk text-2xl sm:text-3xl font-bold text-primary mt-1">50% los primeros 3 meses</h2>
        <p className="font-inter text-sm text-muted-foreground mt-2">Suscripción mensual con 3 meses de compromiso. Luego continúa a precio normal.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {NEW_PLANS.map((p) => (
            <article key={p.key} className="rounded-3xl border border-border bg-card p-5 flex flex-col">
              <h3 className="font-space-grotesk text-2xl font-bold text-foreground">{p.name}</h3>
              <p className="font-inter text-sm text-muted-foreground">{p.desc} · todas las experiencias</p>
              <div className="mt-4">
                <p className="font-inter text-sm text-muted-foreground line-through">{formatCLP(p.regular)}/mes</p>
                <p className="font-space-grotesk text-4xl font-bold text-primary leading-none mt-1">
                  {formatCLP(p.cyber)}<span className="text-lg font-semibold">/mes</span>
                </p>
                <p className="font-inter text-sm mt-2">durante 3 meses, luego {formatCLP(p.regular)}/mes.</p>
                <p className="font-inter text-xs text-muted-foreground mt-1">Compromiso primeros 3 meses: {formatCLP(p.cyber * 3)}</p>
              </div>
              <Button asChild={!expired} size="lg" className="mt-6 h-14 rounded-full text-base w-full" disabled={expired}>
                {expired ? <span>Oferta finalizada</span> : (
                  <a href={p.url} target="_blank" rel="noopener noreferrer">Comenzar mi membresía <ExternalLink className="h-4 w-4 ml-2" /></a>
                )}
              </Button>
            </article>
          ))}
        </div>
      </section>

      {/* B) Compra por periodos */}
      <section id="periodos" className="scroll-mt-32 container mx-auto max-w-5xl px-4 mt-16">
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
        <CyberFAQ items={FAQ} />
        <p className="mt-6 text-center font-inter text-sm">
          ¿Prefieres partir con el hielo? <Link to={CYBER_ROUTES.packs} className="text-primary font-semibold underline">Ver experiencias de hielo</Link>
        </p>
      </section>
    </>
  );
};

const CyberNaveStudioMembresias = () => (
  <CyberLayout>
    <MembresiasContent />
  </CyberLayout>
);

export default CyberNaveStudioMembresias;
