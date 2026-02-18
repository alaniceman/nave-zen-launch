import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import { weeklyByExperience } from "@/lib/scheduleByExperience";
import { CoachesSection } from "@/components/CoachesSection";
import { LocationSection } from "@/components/LocationSection";
import { TrialYogaSection } from "@/components/TrialYogaSection";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Flower2, Flame, Wind, Sun, Zap, Check, Star, Sparkles } from "lucide-react";

const yogaStyles = [
  {
    name: "Yin Yoga",
    icon: Flower2,
    description: "Posturas pasivas y prolongadas para soltar tensión profunda y ganar flexibilidad.",
    benefits: ["Flexibilidad profunda", "Relajación del sistema nervioso", "Liberación de fascia"],
  },
  {
    name: "Yang Yoga",
    icon: Flame,
    description: "Yoga dinámico que fortalece y activa el cuerpo con movimiento fluido.",
    benefits: ["Fuerza muscular", "Activación cardiovascular", "Energía matutina"],
  },
  {
    name: "Vinyasa Yoga",
    icon: Wind,
    description: "Flujo continuo de posturas sincronizado con la respiración.",
    benefits: ["Coordinación cuerpo-mente", "Resistencia", "Creatividad en movimiento"],
  },
  {
    name: "Yoga Integral",
    icon: Sun,
    description: "Combina fuerza, flexibilidad y meditación en una práctica completa.",
    benefits: ["Equilibrio completo", "Meditación activa", "Para todos los niveles"],
  },
  {
    name: "Power Yoga",
    icon: Zap,
    description: "Yoga de alta intensidad enfocado en fuerza y resistencia muscular.",
    benefits: ["Alta intensidad", "Tonificación", "Desafío físico"],
  },
];

const galleryImages = [
  { src: "/lovable-uploads/yoga-sala-1.webp", alt: "Sala de yoga Nave Studio Las Condes con mats y cojines" },
  { src: "/lovable-uploads/yoga-sala-2.webp", alt: "Vista amplia del estudio de yoga en Las Condes" },
  { src: "/lovable-uploads/yoga-sala-3.webp", alt: "Estudio de yoga con luz natural y vista a la cordillera" },
  { src: "/lovable-uploads/yoga-sala-4.webp", alt: "Rincón de meditación con vista a los Andes" },
];

const membershipPlans = [
  {
    name: "Eclipse",
    sessions: "1 / sem",
    price: "$59.000",
    features: [
      "Yoga (Yin · Yang · Integral · Vinyasa · Power)",
      "Método Wim Hof",
      "Breathwork & Meditación",
      "Biohacking (Breathwork + HIIT + Ice Bath)",
    ],
    excludes: ["Comunidad online + mentorías"],
    url: "https://boxmagic.cl/market/plan/AvLXQOM4EK",
    popular: false,
    accent: false,
  },
  {
    name: "Órbita",
    sessions: "2 / sem",
    price: "$79.000",
    promo: "30% OFF 1° mes — código 1MES",
    features: [
      "Yoga (Yin · Yang · Integral · Vinyasa · Power)",
      "Método Wim Hof",
      "Breathwork & Meditación",
      "Biohacking (Breathwork + HIIT + Ice Bath)",
      "Comunidad online + mentorías",
    ],
    excludes: [],
    url: "https://boxmagic.cl/market/plan_subscription/ev4VPzOD9A",
    popular: true,
    accent: false,
  },
  {
    name: "Universo",
    sessions: "Ilimitadas",
    price: "$95.000",
    promo: "30% OFF 1° mes — código 1MES",
    features: [
      "Yoga (Yin · Yang · Integral · Vinyasa · Power)",
      "Método Wim Hof",
      "Breathwork & Meditación",
      "Biohacking (Breathwork + HIIT + Ice Bath)",
      "Comunidad online + mentorías",
    ],
    excludes: [],
    url: "https://boxmagic.cl/market/plan_subscription/j80p5OdDW6",
    popular: false,
    accent: true,
  },
];

const yogaSchedule = weeklyByExperience("yoga");

const structuredDataYoga = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "name": "Nave Studio — Yoga en Las Condes",
  "description": "Clases de Yoga en Las Condes: Yin, Yang, Vinyasa, Integral y Power Yoga. Primera clase de prueba gratis.",
  "url": "https://studiolanave.com/yoga-las-condes",
  "telephone": "+56946120426",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Antares 259",
    "addressLocality": "Las Condes",
    "addressRegion": "Región Metropolitana",
    "postalCode": "7550000",
    "addressCountry": "CL"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": -33.4172,
    "longitude": -70.5885
  },
  "openingHours": ["Mo-Fr 06:00-22:00", "Sa-Su 07:00-20:00"],
  "priceRange": "$$",
  "image": "https://studiolanave.com/lovable-uploads/82672388-9723-4aee-a1f2-ac72618cd26a.png",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Clases de Yoga",
    "itemListElement": yogaStyles.map(s => ({
      "@type": "Offer",
      "itemOffered": { "@type": "Service", "name": s.name, "description": s.description }
    }))
  }
};

const YogaLasCondes = () => {
  const { trackViewContent, trackLead, trackInitiateCheckout } = useFacebookPixel();

  useEffect(() => {
    trackViewContent({ content_name: "Yoga Las Condes", content_category: "landing_page" });
  }, [trackViewContent]);

  const handleTrialClick = () => {
    trackLead({ content_name: "Yoga Las Condes — Clase de prueba" });
  };

  const handleMembershipClick = (planName: string) => {
    trackInitiateCheckout({ content_name: planName, content_category: "membership" });
  };

  return (
    <>
      <Helmet>
        <title>Yoga en Las Condes | Yin, Vinyasa, Power Yoga | Nave Studio</title>
        <meta name="description" content="Clases de Yoga en Las Condes, Santiago. Prueba Yin, Vinyasa, Power e Integral Yoga con instructores certificados. Primera clase gratis. Antares 259." />
        <link rel="canonical" href="https://studiolanave.com/yoga-las-condes" />
        <meta property="og:title" content="Yoga en Las Condes | Yin, Vinyasa, Power Yoga | Nave Studio" />
        <meta property="og:description" content="Clases de Yoga en Las Condes. Yin, Vinyasa, Power e Integral con instructores certificados. Primera clase gratis." />
        <meta property="og:url" content="https://studiolanave.com/yoga-las-condes" />
        <meta property="og:image" content="https://studiolanave.com/lovable-uploads/82672388-9723-4aee-a1f2-ac72618cd26a.png" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(structuredDataYoga)}</script>
      </Helmet>

      <main>
        {/* Hero — full viewport with gradient overlay */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <img
            src="/lovable-uploads/82672388-9723-4aee-a1f2-ac72618cd26a.png"
            alt="Sala de Yoga de Nave Studio en Las Condes"
            className="absolute inset-0 w-full h-full object-cover scale-105"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/50 to-primary/80" />
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm px-4 py-1.5 rounded-full mb-6 border border-white/20">
              <Sparkles className="w-4 h-4" />
              Clases de lunes a domingo · Primera clase gratis
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white font-space mb-5 leading-tight tracking-tight">
              Yoga en<br />Las Condes
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-inter mb-2 font-light">
              Nave Studio
            </p>
            <p className="text-base md:text-lg text-white/60 font-inter mb-10 tracking-wide">
              Yin · Yang · Vinyasa · Integral · Power Yoga
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                data-open-trial="true"
                onClick={handleTrialClick}
                className="bg-accent hover:bg-accent/90 text-white rounded-full px-10 py-4 font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg font-inter inline-flex items-center justify-center text-lg"
              >
                Agenda tu clase gratis
              </a>
              <a
                href="#horarios-yoga"
                className="border-2 border-white/40 text-white hover:bg-white/10 rounded-full px-10 py-4 font-medium transition-all duration-300 font-inter inline-flex items-center justify-center backdrop-blur-sm"
              >
                Ver horarios
              </a>
            </div>
          </div>
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Estilos de Yoga */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <p className="text-accent font-medium font-inter text-sm uppercase tracking-widest mb-3">Encuentra tu práctica</p>
              <h2 className="text-3xl md:text-5xl font-bold text-primary font-space mb-5">
                5 estilos de Yoga
              </h2>
              <p className="text-muted-foreground font-inter max-w-2xl mx-auto text-lg">
                Desde la calma del Yin hasta la intensidad del Power Yoga, hay una práctica que resuena contigo.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {yogaStyles.map((style, index) => {
                const Icon = style.icon;
                return (
                  <article
                    key={style.name}
                    className="group bg-card rounded-2xl p-7 border border-border/50 hover:border-accent/30 hover:shadow-xl transition-all duration-500 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors duration-300">
                        <Icon className="w-7 h-7 text-accent" />
                      </div>
                      <h3 className="text-xl font-bold text-primary font-space mb-3">{style.name}</h3>
                      <p className="text-muted-foreground font-inter text-sm mb-5 leading-relaxed">{style.description}</p>
                      <ul className="space-y-2">
                        {style.benefits.map((b) => (
                          <li key={b} className="text-sm text-foreground/80 font-inter flex items-center gap-2.5">
                            <Check className="w-4 h-4 text-accent flex-shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Instructores — solo Maral, Val, Mar */}
        <CoachesSection filterIds={["maral", "val", "mar"]} />

        {/* Horarios */}
        <section id="horarios-yoga" className="py-20 md:py-28 bg-muted">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <p className="text-accent font-medium font-inter text-sm uppercase tracking-widest mb-3">Planifica tu semana</p>
              <h2 className="text-3xl md:text-5xl font-bold text-primary font-space mb-5">
                Horarios de Yoga
              </h2>
              <p className="text-muted-foreground font-inter text-lg">Clases de lunes a domingo en Las Condes</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {yogaSchedule.map((block) => (
                <div key={block.day} className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-lg font-bold text-primary font-space mb-4 capitalize pb-3 border-b border-border/50">
                    {block.dayName}
                  </h3>
                  <ul className="space-y-3">
                    {block.items.map((item, i) => (
                      <li key={i} className="text-sm font-inter flex items-start gap-3">
                        <span className="font-bold text-accent min-w-[48px]">{item.time}</span>
                        <div>
                          <span className="text-foreground font-medium">{item.title}</span>
                          {item.instructor && (
                            <span className="text-muted-foreground text-xs block mt-0.5">{item.instructor}</span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <a
                href="/horarios"
                className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors font-inter font-semibold text-lg group"
              >
                Ver todos los horarios
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Membresías Solo Yoga */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <p className="text-accent font-medium font-inter text-sm uppercase tracking-widest mb-3">Planes exclusivos de Yoga</p>
              <h2 className="text-3xl md:text-5xl font-bold text-primary font-space mb-5">
                Membresías Solo Yoga
              </h2>
              <p className="text-muted-foreground font-inter text-lg max-w-2xl mx-auto">
                Planes diseñados para tu práctica de Yoga, sin compromiso con otras experiencias.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Yoga Esencial */}
              <div className="bg-card rounded-2xl p-7 border-2 border-border/50 hover:border-accent/30 hover:shadow-xl transition-all duration-300 group">
                <h3 className="text-2xl font-bold text-primary font-space mb-1">Yoga Esencial</h3>
                <p className="text-sm text-muted-foreground font-inter mb-5">1 clase por semana</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">$49.000</span>
                  <span className="text-muted-foreground text-sm">/mes</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="text-sm font-inter text-foreground/80 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    Yoga (Yin · Yang · Integral · Vinyasa · Power)
                  </li>
                  <li className="text-sm font-inter text-foreground/80 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    Ideal para mantener tu práctica semanal
                  </li>
                </ul>
                <a
                  href="https://boxmagic.cl/market/plan/oGDPzoy4b5"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleMembershipClick("Yoga Esencial $49.000")}
                  className="block w-full text-center rounded-full px-6 py-3.5 font-semibold transition-all duration-300 hover:scale-105 font-inter bg-accent hover:bg-primary text-white"
                >
                  Suscribirme
                </a>
              </div>

              {/* Yoga Continuo */}
              <div className="relative bg-card rounded-2xl p-7 border-2 border-warm shadow-lg scale-[1.02] hover:shadow-xl transition-all duration-300 group">
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-warm text-white px-4 py-1 text-xs shadow-md">
                  <Star className="w-3 h-3 mr-1" />
                  Más popular
                </Badge>
                <div className="pt-2">
                  <h3 className="text-2xl font-bold text-primary font-space mb-1">Yoga Continuo</h3>
                  <p className="text-sm text-muted-foreground font-inter mb-5">2 clases por semana</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">$69.000</span>
                    <span className="text-muted-foreground text-sm">/mes</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="text-sm font-inter text-foreground/80 flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      Yoga (Yin · Yang · Integral · Vinyasa · Power)
                    </li>
                    <li className="text-sm font-inter text-foreground/80 flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                      Profundiza tu práctica con más frecuencia
                    </li>
                  </ul>
                  <a
                    href="https://boxmagic.cl/market/plan/XY0llrA0kV"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleMembershipClick("Yoga Continuo $69.000")}
                    className="block w-full text-center rounded-full px-6 py-3.5 font-semibold transition-all duration-300 hover:scale-105 font-inter bg-warm hover:bg-warm/90 text-white shadow-md"
                  >
                    Suscribirme
                  </a>
                </div>
              </div>

              {/* Yoga Libre */}
              <div className="bg-card rounded-2xl p-7 border-2 border-accent/50 hover:shadow-xl transition-all duration-300 group">
                <h3 className="text-2xl font-bold text-primary font-space mb-1">Yoga Libre</h3>
                <p className="text-sm text-muted-foreground font-inter mb-5">Clases ilimitadas</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">$85.000</span>
                  <span className="text-muted-foreground text-sm">/mes</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="text-sm font-inter text-foreground/80 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    Yoga (Yin · Yang · Integral · Vinyasa · Power)
                  </li>
                  <li className="text-sm font-inter text-foreground/80 flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    Sin límites, practica todos los días
                  </li>
                </ul>
                <a
                  href="https://boxmagic.cl/market/plan/rq4mapE4JZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleMembershipClick("Yoga Libre $85.000")}
                  className="block w-full text-center rounded-full px-6 py-3.5 font-semibold transition-all duration-300 hover:scale-105 font-inter bg-accent hover:bg-primary text-white"
                >
                  Suscribirme
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Separador hacia membresías generales */}
        <section className="py-12 bg-muted">
          <div className="container mx-auto px-6 text-center max-w-3xl">
            <p className="text-lg md:text-xl font-inter text-muted-foreground">
              ¿Quieres acceso a <strong className="text-primary">todas las experiencias</strong>?
            </p>
            <p className="text-sm text-muted-foreground font-inter mt-2">
              Yoga + Método Wim Hof + Breathwork + Biohacking + Comunidad
            </p>
          </div>
        </section>

        {/* Membresías completas — Eclipse, Órbita, Universo */}
        <section className="py-20 md:py-28 bg-background">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <p className="text-accent font-medium font-inter text-sm uppercase tracking-widest mb-3">Todas las experiencias</p>
              <h2 className="text-3xl md:text-5xl font-bold text-primary font-space mb-5">
                Membresías Completas
              </h2>
              <p className="text-muted-foreground font-inter text-lg max-w-2xl mx-auto">
                Accede a Yoga y todas las experiencias de Nave Studio con planes flexibles.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {membershipPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative bg-card rounded-2xl p-7 border-2 transition-all duration-300 hover:shadow-xl group ${
                    plan.popular
                      ? "border-warm shadow-lg scale-[1.02]"
                      : plan.accent
                      ? "border-accent/50"
                      : "border-border/50 hover:border-accent/30"
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-warm text-white px-4 py-1 text-xs shadow-md">
                      <Star className="w-3 h-3 mr-1" />
                      Más popular
                    </Badge>
                  )}

                  <div className={plan.popular ? "pt-2" : ""}>
                    <h3 className="text-2xl font-bold text-primary font-space mb-1">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground font-inter mb-5">{plan.sessions} por semana</p>

                    <div className="mb-6">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground text-sm">/mes</span>
                    </div>

                    {plan.promo && (
                      <div className="mb-6 bg-warm/10 text-warm border border-warm/20 rounded-lg px-3 py-2 text-xs font-semibold text-center">
                        {plan.promo}
                      </div>
                    )}

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((f) => (
                        <li key={f} className="text-sm font-inter text-foreground/80 flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                      {plan.excludes.map((e) => (
                        <li key={e} className="text-sm font-inter text-muted-foreground/50 flex items-start gap-2.5 line-through">
                          <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-center">—</span>
                          {e}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={plan.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleMembershipClick(`${plan.name} ${plan.price}`)}
                      className={`block w-full text-center rounded-full px-6 py-3.5 font-semibold transition-all duration-300 hover:scale-105 font-inter ${
                        plan.popular
                          ? "bg-warm hover:bg-warm/90 text-white shadow-md"
                          : "bg-accent hover:bg-primary text-white"
                      }`}
                    >
                      Suscribirme
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground font-inter mt-8">
              ¿Primera vez? Tu{" "}
              <a href="#" data-open-trial="true" onClick={handleTrialClick} className="text-accent underline font-semibold hover:text-primary transition-colors">
                clase de prueba es gratis
              </a>
              .
            </p>
          </div>
        </section>

        {/* Galería */}
        <section className="py-20 md:py-28 bg-muted">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <p className="text-accent font-medium font-inter text-sm uppercase tracking-widest mb-3">Nuestro espacio</p>
              <h2 className="text-3xl md:text-5xl font-bold text-primary font-space mb-5">
                El estudio en Las Condes
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden ${
                    i === 0 ? "col-span-2 md:col-span-1 md:row-span-2" : ""
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover aspect-square hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Clase de prueba */}
        <TrialYogaSection />

        {/* Ubicación */}
        <LocationSection />
      </main>

      <Footer />
    </>
  );
};

export default YogaLasCondes;
