import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useScheduleEntries } from "@/hooks/useScheduleEntries";
import { CoachesSection } from "@/components/CoachesSection";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Wind, Check, ArrowRight } from "lucide-react";

const HERO_IMAGE = "/lovable-uploads/82672388-9723-4aee-a1f2-ac72618cd26a.png";

const DAY_ORDER = ["lunes","martes","miercoles","jueves","viernes","sabado","domingo"] as const;
const DAY_NAMES: Record<string, string> = {
  lunes: "Lunes", martes: "Martes", miercoles: "Miércoles",
  jueves: "Jueves", viernes: "Viernes", sabado: "Sábado", domingo: "Domingo",
};

const STYLE_NAME = "Vinyasa Yoga";
const PAGE_TITLE = "Vinyasa Yoga en Las Condes — Flujo y Respiración | Nave Studio";
const META_DESC = "Clases de Vinyasa Yoga en Las Condes, Santiago. Flujo continuo de posturas sincronizado con la respiración para ganar fuerza, resistencia y claridad mental. Plan de prueba 7 días $9.900.";
const CANONICAL = "https://studiolanave.com/yoga/vinyasa-yoga-las-condes";
const OG_IMAGE = "https://studiolanave.com/lovable-uploads/82672388-9723-4aee-a1f2-ac72618cd26a.png";

const benefits = [
  "Coordinación cuerpo-mente profunda",
  "Resistencia cardiovascular natural",
  "Creatividad y expresión en movimiento",
];

const audience = [
  "Quienes buscan un yoga dinámico y fluido",
  "Personas que quieren quemar estrés con movimiento",
  "Practicantes que disfrutan la danza y la expresión corporal",
  "Cualquiera que quiera mejorar la respiración consciente",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "name": `Nave Studio — ${STYLE_NAME} en Las Condes`,
  "description": META_DESC,
  "url": CANONICAL,
  "telephone": "+56946120426",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Antares 259",
    "addressLocality": "Las Condes",
    "addressRegion": "Región Metropolitana",
    "postalCode": "7550000",
    "addressCountry": "CL"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": -33.4172, "longitude": -70.5885 },
  "priceRange": "$$",
  "image": OG_IMAGE,
};

export default function VinyasaYogaPage() {
  const { data: scheduleData, isLoading } = useScheduleEntries();

  const schedule = useMemo(() => {
    if (!scheduleData) return [];
    return DAY_ORDER.map((day) => {
      const items = (scheduleData.scheduleData[day] || [])
        .filter((item: any) => /Vinyasa Yoga/i.test(item.title) && !/Somático|Power Vinyasa/i.test(item.title))
        .sort((a: any, b: any) => a.time.localeCompare(b.time));
      if (items.length === 0) return null;
      return { day, dayName: DAY_NAMES[day], items };
    }).filter(Boolean) as { day: string; dayName: string; items: any[] }[];
  }, [scheduleData]);

  return (
    <>
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={META_DESC} />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={META_DESC} />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main>
        <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
          <img src={HERO_IMAGE} alt={`Sala de ${STYLE_NAME} en Nave Studio Las Condes`} className="absolute inset-0 w-full h-full object-cover scale-105" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm px-4 py-1.5 rounded-full mb-6 border border-white/20">
              <Wind className="w-4 h-4" />
              Clases de lunes a domingo · Plan de prueba 7 días $9.900
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white font-space mb-5 leading-tight tracking-tight">
              {STYLE_NAME}<br />en Las Condes
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-inter mb-2 font-light">Nave Studio</p>
            <p className="text-base md:text-lg text-white/60 font-inter mb-10 tracking-wide">Flujo, respiración y presencia en cada transición</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/plan-de-prueba" className="bg-accent hover:bg-accent/90 text-white rounded-full px-10 py-4 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg font-inter inline-flex items-center justify-center text-lg">Activa tu plan de prueba</a>
              <a href="#horarios" className="border-2 border-white/40 text-white hover:bg-white/10 rounded-full px-10 py-4 font-medium transition-all duration-300 font-inter inline-flex items-center justify-center backdrop-blur-sm">Ver horarios</a>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <p className="text-accent font-medium font-inter text-sm uppercase tracking-widest mb-3">Encuentra tu práctica</p>
            <h2 className="text-3xl md:text-5xl font-bold text-primary font-space mb-5">¿Qué es el {STYLE_NAME}?</h2>
            <p className="text-muted-foreground font-inter text-lg leading-relaxed max-w-3xl mx-auto">
              El {STYLE_NAME} conecta una postura con la siguiente a través del flujo y la respiración. Cada movimiento está sincronizado con una inhalación o exhalación, creando una meditación en movimiento que fortalece, moviliza y centra. En Nave Studio practicamos un Vinyasa creativo donde la técnica se une a la expresión personal.
            </p>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-muted">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-space mb-5">Beneficios del {STYLE_NAME}</h2>
              <p className="text-muted-foreground font-inter text-lg">Por qué el fluego cambia tu energía</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((b) => (
                <div key={b} className="bg-card rounded-2xl p-7 border border-border/50 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5"><Check className="w-6 h-6 text-accent" /></div>
                  <p className="text-foreground font-inter font-medium">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-space mb-10 text-center">¿Para quién es el {STYLE_NAME}?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {audience.map((a) => (
                <div key={a} className="flex items-start gap-3 bg-card rounded-xl p-5 border border-border/50">
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-foreground font-inter text-sm">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="horarios" className="py-20 md:py-28 bg-muted">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <p className="text-accent font-medium font-inter text-sm uppercase tracking-widest mb-3">Planifica tu semana</p>
              <h2 className="text-3xl md:text-5xl font-bold text-primary font-space mb-5">Horarios de {STYLE_NAME}</h2>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {schedule.map((block) => (
                  <div key={block.day} className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all duration-300">
                    <h3 className="text-lg font-bold text-primary font-space mb-4 capitalize pb-3 border-b border-border/50">{block.dayName}</h3>
                    <ul className="space-y-3">
                      {block.items.map((item: any, i: number) => (
                        <li key={i} className="text-sm font-inter flex items-start gap-3">
                          <span className="font-bold text-accent min-w-[48px]">{item.time}</span>
                          <div>
                            <span className="text-foreground font-medium">{item.title}</span>
                            {item.instructor && <span className="text-muted-foreground text-xs block mt-0.5">{item.instructor}</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            <div className="text-center mt-10">
              <a href="/horarios" className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors font-inter font-semibold text-lg group">Ver todos los horarios <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></a>
            </div>
          </div>
        </section>

        <CoachesSection filterIds={["mar"]} />

        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-space mb-5">Prueba el {STYLE_NAME} esta semana</h2>
            <p className="text-muted-foreground font-inter text-lg mb-8">Tu primera semana de descubrimiento desde $9.900. Sin compromiso, con acceso a todas nuestras clases de yoga.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/plan-de-prueba" className="bg-accent hover:bg-accent/90 text-white rounded-full px-10 py-4 font-semibold transition-all duration-300 hover:scale-105 shadow-lg font-inter inline-flex items-center justify-center text-lg">Activa tu plan de prueba</a>
              <a href="/planes-precios" className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full px-10 py-4 font-medium transition-all duration-300 font-inter inline-flex items-center justify-center">Ver membresías</a>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
