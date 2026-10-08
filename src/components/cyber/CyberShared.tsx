import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/tienda/CartContext";
import { CartSheet } from "@/components/tienda/CartSheet";
import { CartBottomBar } from "@/components/tienda/CartBottomBar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle, Minus, Plus } from "lucide-react";
import { CYBER_ENDS_AT, CYBER_ROUTES, WHATSAPP_URL } from "@/lib/cyberNave";
import { cn } from "@/lib/utils";

export function useCyberNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  return { now, expired: now > CYBER_ENDS_AT };
}

export const CyberCountdown = ({ className }: { className?: string }) => {
  const { now } = useCyberNow();
  const diff = Math.max(0, CYBER_ENDS_AT - now);
  const parts = [
    { v: Math.floor(diff / 86400000), l: "días" },
    { v: Math.floor((diff / 3600000) % 24), l: "horas" },
    { v: Math.floor((diff / 60000) % 60), l: "min" },
    { v: Math.floor((diff / 1000) % 60), l: "seg" },
  ];
  return (
    <div className={cn("w-full max-w-sm mx-auto", className)} aria-live="off">
      <p className="font-inter text-xs uppercase tracking-[0.2em] text-muted-foreground text-center mb-2">
        Últimos días de oferta
      </p>
      <div className="grid grid-cols-4 gap-2">
        {parts.map((p) => (
          <div key={p.l} className="rounded-xl bg-primary text-primary-foreground py-2.5 text-center min-w-0">
            <span className="block font-space-grotesk text-2xl sm:text-3xl font-bold tabular-nums leading-none">
              {String(p.v).padStart(2, "0")}
            </span>
            <span className="block font-inter text-[11px] mt-1 opacity-80">{p.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const NAV = [
  { to: CYBER_ROUTES.home, label: "Resumen" },
  { to: CYBER_ROUTES.packs, label: "Hielo" },
  { to: CYBER_ROUTES.memberships, label: "Membresías" },
];

export const CyberNav = () => {
  const { pathname } = useLocation();
  return (
    <nav aria-label="Secciones Cyber" className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto max-w-5xl px-4 py-2 grid grid-cols-3 gap-1">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className={cn(
              "rounded-full py-2.5 text-center font-inter text-sm font-semibold transition-colors",
              pathname === n.to ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted",
            )}
          >
            {n.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export const CyberLayout = ({ children }: { children: ReactNode }) => (
  <CartProvider>
    <main className="min-h-screen bg-background pt-16 pb-28">
      <CyberNav />
      {children}
      <section className="container mx-auto max-w-3xl px-4 mt-16 text-center">
        <p className="font-space-grotesk text-xl font-bold text-primary">Nave Studio</p>
        <p className="font-inter text-sm text-muted-foreground mt-2 leading-relaxed">
          Antares 259, Las Condes · a pasos del Metro Los Domínicos. Yoga, respiración y experiencias de agua fría
          guiadas por instructores certificados.
        </p>
        <Button asChild variant="outline" size="lg" className="mt-5 h-12 rounded-full">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4 mr-2" /> Escríbenos por WhatsApp
          </a>
        </Button>
      </section>
      <CartSheet />
      <CartBottomBar />
    </main>
    <Footer />
  </CartProvider>
);

export const QuantityStepper = ({ value, onChange, disabled }: { value: number; onChange: (n: number) => void; disabled?: boolean }) => (
  <div className="flex items-center justify-between rounded-full border border-border h-12 px-1.5">
    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Quitar uno" disabled={disabled || value <= 1} onClick={() => onChange(value - 1)}>
      <Minus className="h-4 w-4" />
    </Button>
    <span className="font-space-grotesk text-lg font-bold tabular-nums">{value}</span>
    <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Agregar uno" disabled={disabled || value >= 10} onClick={() => onChange(value + 1)}>
      <Plus className="h-4 w-4" />
    </Button>
  </div>
);

export const CyberFAQ = ({ items }: { items: { q: string; a: string }[] }) => (
  <Accordion type="single" collapsible className="w-full">
    {items.map((it, i) => (
      <AccordionItem key={i} value={`f${i}`}>
        <AccordionTrigger className="text-left font-space-grotesk text-base">{it.q}</AccordionTrigger>
        <AccordionContent className="font-inter text-sm text-muted-foreground leading-relaxed">{it.a}</AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
);

export const CyberSeal = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-accent/15 text-primary px-4 py-1.5 font-inter text-xs sm:text-sm font-semibold">
    {children}
  </span>
);
