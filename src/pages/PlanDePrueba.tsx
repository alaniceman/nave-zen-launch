import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Check, Sparkles } from "lucide-react";
import { Footer } from "@/components/Footer";
import ScheduleDayCards from "@/components/ScheduleDayCards";
import { ReviewsTrustBar } from "@/components/ReviewsTrustBar";
import { PlanPruebaFormModal } from "@/components/plan-prueba/PlanPruebaFormModal";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";

type PlanType = "trial_7d" | "trial_15d";

export default function PlanDePrueba() {
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<PlanType>("trial_7d");
  const pricingRef = useRef<HTMLDivElement | null>(null);
  const { trackEvent } = useFacebookPixel();

  useEffect(() => {
    trackEvent("plan_trial_page_view");
  }, [trackEvent]);

  const openPlan = (p: PlanType) => {
    setPlan(p);
    setOpen(true);
  };

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Plan de Prueba 7 o 15 días — Nave Studio</title>
        <meta name="description" content="Prueba Nave Studio por 7 o 15 días. Acceso a Yoga, Criomedicina y Método Wim Hof. Tú eliges la fecha de inicio." />
        <link rel="canonical" href="https://studiolanave.com/plan-de-prueba" />
        <meta property="og:title" content="Plan de Prueba 7 o 15 días — Nave Studio" />
        <meta property="og:description" content="Ven todo lo que quieras a la Nave: Yoga, respiración, Criomedicina y Método Wim Hof." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-[#F0F7F2] to-background">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-[#2E4D3A]/10 text-[#2E4D3A] px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Acceso completo durante tu prueba
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#2E4D3A] mb-6 leading-tight">
            Prueba Nave Studio por 7 o 15 días
          </h1>
          <p className="text-lg md:text-xl text-[#4A4A4A] max-w-2xl mx-auto mb-8 leading-relaxed">
            Ven todo lo que quieras a la Nave y vive la experiencia completa: Yoga, respiración, Criomedicina y Método Wim Hof.
          </p>
          <button
            onClick={scrollToPricing}
            className="bg-[#2E4D3A] hover:bg-[#2E4D3A]/90 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg"
          >
            Comprar plan de prueba
          </button>
          <p className="text-sm text-[#6B7280] mt-4">Tú eliges la fecha de inicio · Pago seguro vía BoxMagic</p>
        </div>
      </section>

      {/* Info corta */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Acceso a todas las clases disponibles durante tu período de prueba.",
              "Yoga + Criomedicina / Método Wim Hof.",
              "Tú eliges la fecha de inicio.",
              "Ideal para conocer la Nave antes de elegir una membresía.",
            ].map((b) => (
              <div key={b} className="flex gap-3 items-start bg-[#F8FAFB] rounded-xl p-4 border border-[#E8ECF0]">
                <Check className="w-5 h-5 text-[#2E4D3A] flex-shrink-0 mt-0.5" />
                <p className="text-[#2A2A2A] text-base leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-[#4A4A4A] text-base md:text-lg mt-8 italic">
            "Clases para moverte, respirar, regular tu sistema nervioso y entrenar tu relación con el frío."
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section ref={pricingRef} className="py-16 md:py-24 bg-[#F4F4F5]">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2E4D3A] mb-3">
            Elige tu plan de prueba
          </h2>
          <p className="text-center text-[#4A4A4A] mb-12 max-w-xl mx-auto">
            Acceso ilimitado durante tu período. Eliges cuándo empezar.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <PlanCard
              title="7 días de prueba"
              normalPrice="$25.000"
              salePrice="$9.900"
              ctaLabel="Comprar prueba de 7 días"
              onClick={() => openPlan("trial_7d")}
              features={[
                "Todas las clases de Yoga",
                "Criomedicina / Método Wim Hof",
                "Acceso por 7 días desde tu fecha de inicio",
              ]}
            />
            <PlanCard
              title="15 días de prueba"
              normalPrice="$50.000"
              salePrice="$19.900"
              ctaLabel="Comprar prueba de 15 días"
              highlight
              onClick={() => openPlan("trial_15d")}
              features={[
                "Todas las clases de Yoga",
                "Criomedicina / Método Wim Hof",
                "Acceso por 15 días desde tu fecha de inicio",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <ReviewsTrustBar />

      {/* Info larga */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-[#2E4D3A] mb-8 text-center">¿Cómo funciona?</h2>
          <div className="space-y-8 text-[#2A2A2A] leading-relaxed text-[15px]">
            <Block title="Qué es Nave Studio">
              <p>Somos un estudio en Las Condes que combina yoga, respiración consciente y exposición controlada al frío (Criomedicina y Método Wim Hof). Un espacio diseñado para entrenar cuerpo, mente y sistema nervioso.</p>
            </Block>
            <Block title="Qué clases puedes probar">
              <p>Durante tu plan de prueba tienes acceso a <strong>todas las clases disponibles</strong>: yoga (Vinyasa, Yin, Integral), Criomedicina y sesiones guiadas del Método Wim Hof.</p>
            </Block>
            <Block title="Cómo funciona el plan de prueba">
              <p>Eliges 7 o 15 días, indicas tu fecha de inicio, y pagas en BoxMagic (nuestra plataforma de gestión). Una vez confirmado, activamos tu acceso para que puedas agendar libremente desde la app de BoxMagic.</p>
            </Block>
            <Block title="Qué pasa después de comprar">
              <p>Recibirás un correo de BoxMagic confirmando tu compra y otro de Nave Studio con instrucciones. Maral, nuestra asistente, configura manualmente tu fecha de inicio según lo que indicaste.</p>
            </Block>
            <Block title="Cómo se agenda desde BoxMagic">
              <p>Entra a <a className="text-[#2E4D3A] underline" href="https://cualesmi.boxmagic.app/members" target="_blank" rel="noopener noreferrer">cualesmi.boxmagic.app/members</a> con el email que registraste y tu contraseña inicial. Desde ahí puedes ver horarios y reservar tus clases.</p>
            </Block>
            <Block title="Reglas de seguridad — Criomedicina / Método Wim Hof">
              <ul className="list-disc pl-5 space-y-2">
                <li>Las clases de yoga de prueba <strong>no incluyen inmersión en hielo</strong>.</li>
                <li>Para terminar una clase de yoga en agua fría debes haber realizado previamente una sesión guiada del Método Wim Hof con nosotros.</li>
                <li>Tiempo máximo de inmersión después de yoga: <strong>2 minutos</strong>.</li>
                <li>En sesiones completas del Método Wim Hof se sigue siempre la guía del instructor.</li>
              </ul>
            </Block>
          </div>
        </div>
      </section>

      {/* Horarios */}
      <section className="py-16 md:py-20 bg-[#F4F4F5]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2E4D3A] mb-3">Horarios disponibles</h2>
            <p className="text-[#4A4A4A]">
              Mira los horarios reales para que aproveches al máximo tu prueba.
            </p>
          </div>
          <ScheduleDayCards />
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 bg-[#2E4D3A] text-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para empezar?</h2>
          <p className="text-white/80 mb-8 text-lg">
            Elige tu plan, indícanos tu fecha de inicio y empieza a vivir la Nave.
          </p>
          <button
            onClick={scrollToPricing}
            className="bg-white text-[#2E4D3A] hover:bg-white/90 font-semibold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg"
          >
            Ver planes
          </button>
        </div>
      </section>

      <Footer />

      <PlanPruebaFormModal
        open={open}
        onOpenChange={setOpen}
        initialPlan={plan}
      />
    </div>
  );
}

function PlanCard({
  title, normalPrice, salePrice, features, ctaLabel, onClick, highlight,
}: {
  title: string; normalPrice: string; salePrice: string;
  features: string[]; ctaLabel: string; onClick: () => void; highlight?: boolean;
}) {
  return (
    <div className={`relative rounded-2xl p-7 md:p-8 bg-white border ${highlight ? "border-[#2E4D3A] shadow-xl ring-2 ring-[#2E4D3A]/20" : "border-[#E2E8F0] shadow-md"}`}>
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#2E4D3A] text-white text-xs font-semibold px-3 py-1 rounded-full">
          Más popular
        </div>
      )}
      <h3 className="text-2xl font-bold text-[#2E4D3A] mb-4">{title}</h3>
      <div className="mb-5">
        <p className="text-[#9CA3AF] line-through text-base">{normalPrice}</p>
        <p className="text-4xl font-bold text-[#1A1A1A]">{salePrice}</p>
      </div>
      <ul className="space-y-2.5 mb-7">
        {features.map((f) => (
          <li key={f} className="flex gap-2 items-start text-[#2A2A2A] text-sm">
            <Check className="w-4 h-4 text-[#2E4D3A] flex-shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onClick}
        className="w-full bg-[#2E4D3A] hover:bg-[#2E4D3A]/90 text-white font-semibold py-3.5 rounded-xl transition-colors"
      >
        {ctaLabel}
      </button>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-[#2E4D3A] mb-2">{title}</h3>
      <div className="text-[#4A4A4A]">{children}</div>
    </div>
  );
}
