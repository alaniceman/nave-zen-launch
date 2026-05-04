import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowDown, Check, Sparkles } from "lucide-react";
import { Footer } from "@/components/Footer";
import { PlanPruebaFormModal } from "@/components/plan-prueba/PlanPruebaFormModal";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";

const ScheduleDayCards = lazy(() => import("@/components/ScheduleDayCards"));
const ReviewsTrustBar = lazy(() =>
  import("@/components/ReviewsTrustBar").then((m) => ({ default: m.ReviewsTrustBar }))
);

type PlanType = "trial_7d" | "trial_15d";

export default function PlanDePrueba() {
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<PlanType>("trial_7d");
  const pricingRef = useRef<HTMLDivElement | null>(null);
  const scheduleRef = useRef<HTMLDivElement | null>(null);
  const { trackEvent } = useFacebookPixel();

  useEffect(() => {
    trackEvent("plan_trial_page_view");
  }, [trackEvent]);

  const openPlan = (p: PlanType) => {
    setPlan(p);
    setOpen(true);
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Plan de Prueba 7 o 15 días — Nave Studio</title>
        <meta
          name="description"
          content="Prueba Nave Studio por 7 o 15 días. Acceso ilimitado a Yoga, Criomedicina y Método Wim Hof. Tú eliges la fecha de inicio."
        />
        <link rel="canonical" href="https://studiolanave.com/plan-de-prueba" />
        <meta property="og:title" content="Plan de Prueba 7 o 15 días — Nave Studio" />
        <meta
          property="og:description"
          content="Ven todo lo que quieras a la Nave: Yoga, respiración, Criomedicina y Método Wim Hof."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-24">
        {/* fondo decorativo */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-[#EAF3EC] via-[#F4F9F5] to-background"
        />
        <div
          aria-hidden
          className="absolute -z-10 top-10 -left-20 w-72 h-72 rounded-full bg-[#2E4D3A]/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -z-10 top-40 right-0 w-80 h-80 rounded-full bg-[#5B8C6B]/15 blur-3xl"
        />

        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-[#2E4D3A]/15 text-[#2E4D3A] px-4 py-1.5 rounded-full text-sm font-medium mb-6 shadow-sm">
              <Sparkles className="w-4 h-4" />
              Acceso completo durante tu prueba
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#1F3A2A] mb-6 leading-[1.05] tracking-tight">
              Vive Nave Studio<br />
              <span className="text-[#2E4D3A]">por 7 o 15 días</span>
            </h1>
            <p className="text-lg md:text-xl text-[#4A4A4A] max-w-2xl mx-auto mb-10 leading-relaxed">
              Yoga, respiración, Criomedicina y Método Wim Hof —
              <span className="text-[#2E4D3A] font-medium"> ilimitado</span>. Tú eliges cuándo empezar.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button
                onClick={() => scrollTo(pricingRef)}
                className="bg-[#2E4D3A] hover:bg-[#26412F] text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Comprar plan de prueba
              </button>
              <button
                onClick={() => scrollTo(scheduleRef)}
                className="text-[#2E4D3A] font-medium px-6 py-4 rounded-xl hover:bg-[#2E4D3A]/5 transition-colors inline-flex items-center gap-2"
              >
                Ver horarios <ArrowDown className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <Suspense fallback={<div className="h-32" />}>
        <ReviewsTrustBar />
      </Suspense>

      {/* QUÉ INCLUYE — versión simple */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold tracking-widest text-[#2E4D3A] uppercase mb-3">Qué incluye</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F3A2A]">
              Simple y completo
            </h2>
          </div>
          <ul className="space-y-4">
            {[
              "Acceso a todas las clases disponibles durante tu período de prueba.",
              "Yoga + Criomedicina / Método Wim Hof.",
              "Tú eliges la fecha de inicio.",
              "Ideal para conocer la Nave antes de elegir una membresía.",
            ].map((t) => (
              <li
                key={t}
                className="flex gap-3 items-start bg-[#F8FAFB] border border-[#E8ECF0] rounded-2xl p-4"
              >
                <span className="w-6 h-6 rounded-full bg-[#2E4D3A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-[#2E4D3A]" />
                </span>
                <span className="text-[#2A2A2A] leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PRICING */}
      <section ref={pricingRef} className="py-16 md:py-24 bg-[#F4F4F5] relative overflow-hidden scroll-mt-24">
        <div aria-hidden className="absolute -top-32 right-0 w-96 h-96 rounded-full bg-[#2E4D3A]/5 blur-3xl" />
        <div className="container mx-auto px-4 max-w-5xl relative">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest text-[#2E4D3A] uppercase mb-3">Planes</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1F3A2A] mb-4">Elige tu plan de prueba</h2>
            <p className="text-[#4A4A4A] max-w-xl mx-auto text-lg">
              Acceso ilimitado durante tu período. Eliges cuándo empezar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <PlanCard
              title="7 días de prueba"
              normalPrice="$25.000"
              salePrice="$9.900"
              ctaLabel="Comprar prueba de 7 días"
              badge="60% OFF"
              onClick={() => openPlan("trial_7d")}
              features={[
                "Todas las clases de Yoga",
                "Criomedicina / Método Wim Hof",
                "Acceso por 7 días",
                "Elige la fecha de inicio",
              ]}
            />
            <PlanCard
              title="15 días de prueba"
              normalPrice="$50.000"
              salePrice="$19.900"
              ctaLabel="Comprar prueba de 15 días"
              badge="Más popular"
              highlight
              onClick={() => openPlan("trial_15d")}
              features={[
                "Todas las clases de Yoga",
                "Criomedicina / Método Wim Hof",
                "Acceso por 15 días",
                "Elige la fecha de inicio",
              ]}
            />
          </div>

          {/* Link a horarios dentro de la misma página */}
          <div className="text-center mt-10">
            <button
              onClick={() => scrollTo(scheduleRef)}
              className="inline-flex items-center gap-2 text-[#2E4D3A] font-semibold border-b-2 border-[#2E4D3A]/30 hover:border-[#2E4D3A] pb-1 transition-colors"
            >
              Ver horarios disponibles
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest text-[#2E4D3A] uppercase mb-3">Cómo funciona</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F3A2A]">3 pasos para empezar</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "01", title: "Compra tu plan", text: "Eliges 7 o 15 días, completas tus datos y pagas en BoxMagic." },
              { n: "02", title: "Confirmamos tu inicio", text: "Maral, nuestra asistente, activa tu acceso en la fecha que indicaste." },
              { n: "03", title: "Reservas y vives la Nave", text: "Reservas tus clases desde la app de BoxMagic y vienes todo lo que quieras." },
            ].map((s) => (
              <div key={s.n} className="relative bg-[#F8FAFB] rounded-2xl p-7 border border-[#E8ECF0]">
                <div className="text-5xl font-bold text-[#2E4D3A]/20 mb-3">{s.n}</div>
                <h3 className="text-lg font-bold text-[#1F3A2A] mb-2">{s.title}</h3>
                <p className="text-[#4A4A4A] text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HORARIOS */}
      <section ref={scheduleRef} className="py-16 md:py-24 bg-[#F4F4F5] scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="text-sm font-semibold tracking-widest text-[#2E4D3A] uppercase mb-3">Horarios</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F3A2A] mb-3">Mira los horarios reales</h2>
            <p className="text-[#4A4A4A] text-lg">
              Aprovecha al máximo tu prueba: revisa qué se ajusta mejor a tu semana.
            </p>
          </div>
          <Suspense
            fallback={
              <div className="max-w-5xl mx-auto h-64 bg-white rounded-2xl border border-[#E8ECF0] animate-pulse" />
            }
          >
            <ScheduleDayCards />
          </Suspense>
        </div>
      </section>

      {/* FAQ / DETALLE */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest text-[#2E4D3A] uppercase mb-3">Detalles</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1F3A2A]">Lo que necesitas saber</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                title: "Qué es Nave Studio",
                content:
                  "Somos un estudio en Las Condes que combina yoga, respiración consciente y exposición controlada al frío (Criomedicina y Método Wim Hof). Un espacio diseñado para entrenar cuerpo, mente y sistema nervioso.",
              },
              {
                title: "Qué clases puedes probar",
                content:
                  "Durante tu plan de prueba tienes acceso a todas las clases disponibles: yoga (Vinyasa, Yin, Integral), Criomedicina y sesiones guiadas del Método Wim Hof.",
              },
              {
                title: "Qué pasa después de comprar",
                content:
                  "Recibirás un correo de BoxMagic confirmando tu compra y otro de Nave Studio con instrucciones. Maral configura manualmente tu fecha de inicio según lo que indicaste.",
              },
              {
                title: "Cómo se agenda desde BoxMagic",
                content:
                  'Entra a cualesmi.boxmagic.app/members con el email que registraste y tu contraseña inicial. Desde ahí puedes ver horarios y reservar tus clases.',
              },
              {
                title: "Reglas de seguridad — Criomedicina / Método Wim Hof",
                content:
                  "Las clases de yoga de prueba no incluyen inmersión en hielo. Para terminar una clase de yoga en agua fría debes haber realizado previamente una sesión guiada del Método Wim Hof con nosotros. Tiempo máximo de inmersión después de yoga: 2 minutos. En sesiones completas del Método Wim Hof se sigue siempre la guía del instructor.",
              },
            ].map((item) => (
              <details
                key={item.title}
                className="group bg-[#F8FAFB] rounded-2xl border border-[#E8ECF0] open:border-[#2E4D3A]/40 transition-colors"
              >
                <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-4">
                  <span className="font-semibold text-[#1F3A2A]">{item.title}</span>
                  <span className="w-7 h-7 rounded-full bg-white border border-[#E8ECF0] flex items-center justify-center text-[#2E4D3A] group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-[#4A4A4A] leading-relaxed">{item.content}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-[#1F3A2A] text-white relative overflow-hidden">
        <div aria-hidden className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#5B8C6B]/20 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-[#2E4D3A]/40 blur-3xl" />
        <div className="container mx-auto px-4 max-w-3xl text-center relative">
          <Sparkles className="w-8 h-8 mx-auto mb-5 text-white/70" />
          <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">¿Listo para empezar?</h2>
          <p className="text-white/80 mb-10 text-lg max-w-xl mx-auto">
            Elige tu plan, indícanos tu fecha de inicio y empieza a vivir la Nave.
          </p>
          <button
            onClick={() => scrollTo(pricingRef)}
            className="bg-white text-[#1F3A2A] hover:bg-white/90 font-semibold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Ver planes
          </button>
        </div>
      </section>

      <Footer />

      <PlanPruebaFormModal open={open} onOpenChange={setOpen} initialPlan={plan} />
    </div>
  );
}

function PlanCard({
  title,
  normalPrice,
  salePrice,
  features,
  ctaLabel,
  onClick,
  highlight,
  badge,
}: {
  title: string;
  normalPrice: string;
  salePrice: string;
  features: string[];
  ctaLabel: string;
  onClick: () => void;
  highlight?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`relative rounded-3xl p-7 md:p-8 transition-all hover:-translate-y-1 ${
        highlight
          ? "bg-gradient-to-br from-white to-[#F0F7F2] border-2 border-[#2E4D3A] shadow-2xl"
          : "bg-white border border-[#E2E8F0] shadow-md hover:shadow-xl"
      }`}
    >
      {badge && (
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
            highlight ? "bg-[#2E4D3A] text-white" : "bg-[#1F3A2A] text-white"
          }`}
        >
          {badge}
        </div>
      )}
      <h3 className="text-2xl font-bold text-[#1F3A2A] mb-4">{title}</h3>
      <div className="mb-6 flex items-baseline gap-3">
        <p className="text-4xl md:text-5xl font-bold text-[#1A1A1A]">{salePrice}</p>
        <p className="text-[#9CA3AF] line-through text-base">{normalPrice}</p>
      </div>
      <ul className="space-y-3 mb-7">
        {features.map((f) => (
          <li key={f} className="flex gap-2.5 items-start text-[#2A2A2A] text-sm">
            <span className="w-5 h-5 rounded-full bg-[#2E4D3A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-[#2E4D3A]" />
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onClick}
        className={`w-full font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg ${
          highlight
            ? "bg-[#2E4D3A] hover:bg-[#26412F] text-white"
            : "bg-[#1F3A2A] hover:bg-[#2E4D3A] text-white"
        }`}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
