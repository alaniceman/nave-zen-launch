import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Check, Gift, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/tienda/CartContext";
import { useToast } from "@/hooks/use-toast";
import { CyberCountdown, CyberFAQ, CyberLayout, CyberSeal, QuantityStepper, useCyberNow } from "@/components/cyber/CyberShared";
import { CYBER_IMAGES, CYBER_PACKS, CYBER_ROUTES, CyberPack, formatCLP, toCartProduct } from "@/lib/cyberNave";
import { trackMetaClientEvent } from "@/lib/metaTracking";
import { stockFor, useCyberStock } from "@/hooks/useCyberStock";
import { StockBadge } from "@/components/cyber/StockBadge";

const FAQ = [
  { q: "¿Necesito experiencia previa?", a: "No. Cada sesión es guiada por instructores certificados: respiración Método Wim Hof, baño de hielo guiado y recuperación. Adaptamos la experiencia a tu nivel." },
  { q: "¿Cómo uso mis códigos y agendo?", a: "Después de confirmar tu pago te llega un email con tus códigos. Entra a la agenda, elige tu clase e ingresa un código al reservar. Cada código es una sesión." },
  { q: "¿Puedo usar los códigos en yoga?", a: "Sí. También puedes usarlos en clases de Yoga + Ice Bath al final. Para entrar al hielo después de yoga necesitas haber hecho antes una sesión guiada Método Wim Hof, y la inmersión es de máximo 2 minutos." },
  { q: "¿Cuánto duran los códigos?", a: "Todos los códigos de estos packs son válidos por 6 meses desde la confirmación de tu compra." },
  { q: "¿Cómo funcionan las invitaciones?", a: "Las invitaciones llegan en tu email como códigos de regalo, con la misma vigencia y forma de agendar. Compártelas con quien quieras invitar." },
  { q: "¿Puedo comprar varios packs?", a: "Sí. Elige la cantidad en cada tarjeta; recibirás todos los códigos correspondientes en tu email. Las promociones Cyber no son acumulables con otros cupones o descuentos." },
];

const PackCard = ({ pack, expired }: { pack: CyberPack; expired: boolean }) => {
  const { add, setOpen } = useCart();
  const { toast } = useToast();
  const [qty, setQty] = useState(1);
  const name = `Cyber · ${pack.title}`;
  const handleAdd = () => {
    add(toCartProduct(pack.id, name, pack.price, pack.image, pack.subtitle), qty);
    trackMetaClientEvent("AddToCart", {
      contentName: name, contentCategory: "cyber", contentIds: [pack.id], value: pack.price * qty, currency: "CLP",
      pixelParams: { content_name: name, content_category: "cyber", content_ids: [pack.id], value: pack.price * qty, currency: "CLP" },
    } as any);
    toast({ title: "Agregado al carrito", description: `${qty} × ${pack.title}`, duration: 1800 });
    setOpen(true);
  };
  return (
    <article className="rounded-3xl border border-border bg-card overflow-hidden flex flex-col">
      <div className="relative">
        <img src={pack.image} alt={pack.title} loading="lazy" className="h-44 w-full object-cover" />
        <span className="absolute top-3 left-3 rounded-full bg-primary text-primary-foreground px-3 py-1 font-inter text-xs font-bold">
          {pack.discountLabel}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-space-grotesk text-xl font-bold text-foreground leading-tight">{pack.title}</h3>
        <p className="font-inter text-sm text-muted-foreground mt-1">{pack.subtitle}</p>

        <div className="mt-4">
          <p className="font-inter text-sm text-muted-foreground line-through">{formatCLP(pack.regular)}</p>
          <p className="font-space-grotesk text-4xl font-bold text-primary leading-none mt-1">{formatCLP(pack.price)}</p>
          <p className="font-inter text-sm text-foreground mt-2">o 3 cuotas sin interés de {formatCLP(pack.price / 3)}</p>
        </div>

        <ul className="mt-4 space-y-1.5 font-inter text-sm">
          <li className="flex gap-2"><Check className="h-4 w-4 text-accent shrink-0 mt-0.5" /> {pack.own} {pack.own === 1 ? "sesión" : "sesiones"} para ti</li>
          {pack.invites > 0 && (
            <li className="flex gap-2"><Gift className="h-4 w-4 text-accent shrink-0 mt-0.5" /> {pack.invites} {pack.invites === 1 ? "invitación" : "invitaciones"} de regalo</li>
          )}
          <li className="flex gap-2"><Check className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Válido 6 meses desde tu compra</li>
        </ul>
        <p className="font-inter text-xs text-muted-foreground mt-3">También puedes usar tus códigos en clases de Yoga + Ice Bath al final.</p>

        <div className="mt-auto pt-5 space-y-3">
          <QuantityStepper value={qty} onChange={setQty} disabled={expired} />
          <Button size="lg" className="w-full h-14 rounded-full text-base" onClick={handleAdd} disabled={expired}>
            <ShoppingCart className="h-4 w-4 mr-2" /> {expired ? "Oferta finalizada" : "Agregar al carrito"}
          </Button>
        </div>
      </div>
    </article>
  );
};

const CyberNaveStudioPaquetes = () => {
  const { expired } = useCyberNow();
  const { data: stockRows } = useCyberStock();
  const packStock = stockFor(stockRows, "paquetes");
  return (
    <CyberLayout>
      <Helmet>
        <title>Cyber Paquetes de Hielo y Wim Hof | Nave Studio Las Condes</title>
        <meta name="description" content="Bautizo de hielo a $15.000 y packs de 3 y 6 sesiones Método Wim Hof con invitaciones de regalo. Cyber Nave Studio, hasta 3 cuotas sin interés." />
        <link rel="canonical" href="https://studiolanave.com/cyber-nave-studio-paquetes" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cyber Nave Studio · Experiencias de hielo" />
        <meta property="og:description" content="El primer paso es atreverte. Bautizo desde $15.000 y packs con invitaciones de regalo." />
        <meta property="og:url" content="https://studiolanave.com/cyber-nave-studio-paquetes" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <section className="container mx-auto max-w-3xl px-4 pt-10 text-center">
        <CyberSeal>Desde 50% de descuento · Hasta 3 cuotas sin interés</CyberSeal>
        <h1 className="mt-5 font-space-grotesk font-bold text-primary text-[clamp(2rem,7.5vw,3.5rem)] leading-[1.05]">
          El primer paso es atreverte. El siguiente es volver.
        </h1>
        <p className="mt-4 font-inter text-base sm:text-lg text-muted-foreground leading-relaxed">
          Respira con intención, entra al hielo y descubre lo que pasa cuando te desafías. Vuelve las veces que
          necesites y comparte la experiencia con quien quieras invitar.
        </p>
        <CyberCountdown className="mt-7" />
      </section>

      <section className="container mx-auto max-w-md px-4 mt-8">
        <StockBadge stock={packStock} />
      </section>
      <section className="container mx-auto max-w-5xl px-4 mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CYBER_PACKS.map((p) => <PackCard key={p.id} pack={p} expired={expired || packStock?.left === 0} />)}
      </section>

      <section className="container mx-auto max-w-3xl px-4 mt-14 grid gap-4 sm:grid-cols-3">
        {[
          { t: "Respiración", d: "Método Wim Hof guiado para preparar cuerpo y mente." },
          { t: "Baño de hielo", d: "Inmersión guiada, a tu ritmo y con acompañamiento." },
          { t: "Recuperación", d: "Vuelves al calor con calma y presencia." },
        ].map((x) => (
          <div key={x.t} className="rounded-2xl bg-muted p-5">
            <p className="font-space-grotesk font-bold text-primary">{x.t}</p>
            <p className="font-inter text-sm text-muted-foreground mt-1">{x.d}</p>
          </div>
        ))}
      </section>

      <section className="container mx-auto max-w-3xl px-4 mt-14">
        <h2 className="font-space-grotesk text-2xl font-bold text-primary mb-5">Cómo funciona</h2>
        <ol className="space-y-3">
          {["Agrega tu pack al carrito de Nave.", "Completa tus datos en el checkout.", "Paga con Mercado Pago, hasta 3 cuotas.", "Recibe tus códigos por email tras confirmar el pago.", "Agenda tus sesiones con tus códigos."].map((s, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="h-8 w-8 shrink-0 rounded-full bg-primary text-primary-foreground grid place-items-center font-space-grotesk font-bold text-sm">{i + 1}</span>
              <span className="font-inter text-base pt-1">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="container mx-auto max-w-3xl px-4 mt-14">
        <h2 className="font-space-grotesk text-2xl font-bold text-primary mb-2">Preguntas frecuentes</h2>
        <CyberFAQ items={FAQ} />
        <div className="mt-8 rounded-3xl overflow-hidden relative">
          <img src={CYBER_IMAGES.yoga} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-primary/80" />
          <div className="relative p-6 text-center">
            <p className="font-space-grotesk text-xl font-bold text-primary-foreground">¿Buscas continuidad?</p>
            <Button asChild variant="secondary" size="lg" className="mt-4 h-12 rounded-full">
              <Link to={CYBER_ROUTES.memberships}>Ver membresías Cyber</Link>
            </Button>
          </div>
        </div>
      </section>
    </CyberLayout>
  );
};

export default CyberNaveStudioPaquetes;
