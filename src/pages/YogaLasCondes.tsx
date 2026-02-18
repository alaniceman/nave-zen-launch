import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import { weeklyByExperience } from "@/lib/scheduleByExperience";
import { CoachesSection } from "@/components/CoachesSection";
import { LocationSection } from "@/components/LocationSection";
import { TrialYogaSection } from "@/components/TrialYogaSection";
import { Footer } from "@/components/Footer";
import { Flower2, Flame, Wind, Sun, Zap } from "lucide-react";

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
  { src: "/lovable-uploads/82672388-9723-4aee-a1f2-ac72618cd26a.png", alt: "Sala de yoga Nave Studio Las Condes" },
  { src: "/lovable-uploads/30549bc9-e0a1-4084-927b-f3eadfec8372.png", alt: "Instructora de yoga en Nave Studio" },
  { src: "/lovable-uploads/27a0352e-30dd-41fc-8a91-48b297e8615a.png", alt: "Clase de yoga guiada en Las Condes" },
  { src: "/lovable-uploads/bb33cba0-3deb-41b3-97f1-c55d9dc169c1.png", alt: "Vinyasa yoga flow en Nave Studio" },
  { src: "/lovable-uploads/367f27fb-5f27-4b38-bc21-af8951de42aa.png", alt: "Yoga integral en estudio Las Condes" },
  { src: "/lovable-uploads/bab00752-1c18-40b5-bfeb-4089da69749a.png", alt: "Yin yoga relajación profunda" },
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
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <img
            src="/lovable-uploads/82672388-9723-4aee-a1f2-ac72618cd26a.png"
            alt="Sala de Yoga de Nave Studio en Las Condes"
            className="absolute inset-0 w-full h-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-primary/55" />
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white font-space mb-4">
              Yoga en Las Condes
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-inter mb-2">
              Nave Studio
            </p>
            <p className="text-base md:text-lg text-white/80 font-inter mb-8">
              Yin · Yang · Vinyasa · Integral · Power Yoga
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                data-open-trial="true"
                onClick={handleTrialClick}
                className="bg-accent hover:bg-accent/90 text-white rounded-[10px] px-8 py-3 font-medium transition-transform duration-200 hover:scale-105 font-inter inline-flex items-center justify-center"
              >
                Agenda tu clase de prueba gratis
              </a>
              <a
                href="#horarios-yoga"
                className="border-2 border-white text-white hover:bg-white/10 rounded-[10px] px-8 py-3 font-medium transition-all duration-200 font-inter inline-flex items-center justify-center"
              >
                Ver horarios
              </a>
            </div>
          </div>
        </section>

        {/* Estilos de Yoga */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-space mb-4">
                5 estilos de Yoga para cada cuerpo
              </h2>
              <p className="text-neutral-mid font-inter max-w-2xl mx-auto">
                Desde la calma del Yin hasta la intensidad del Power Yoga, encuentra la práctica que resuena contigo.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {yogaStyles.map((style) => {
                const Icon = style.icon;
                return (
                  <article key={style.name} className="bg-card rounded-xl p-6 shadow-[var(--shadow-light)] hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-primary font-space mb-2">{style.name}</h3>
                    <p className="text-neutral-mid font-inter text-sm mb-4">{style.description}</p>
                    <ul className="space-y-1">
                      {style.benefits.map((b) => (
                        <li key={b} className="text-xs text-neutral-dark font-inter flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Instructores */}
        <CoachesSection filterIds={["maral", "sol", "rolo", "mar", "val", "amber"]} />

        {/* Horarios */}
        <section id="horarios-yoga" className="py-16 md:py-20 bg-muted">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-space mb-4">
                Horarios de Yoga
              </h2>
              <p className="text-neutral-mid font-inter">Clases de lunes a domingo en Las Condes</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {yogaSchedule.map((block) => (
                <div key={block.day} className="bg-card rounded-xl p-5 shadow-[var(--shadow-light)]">
                  <h3 className="text-lg font-bold text-primary font-space mb-3 capitalize">
                    {block.dayName}
                  </h3>
                  <ul className="space-y-2">
                    {block.items.map((item, i) => (
                      <li key={i} className="text-sm font-inter">
                        <span className="font-semibold text-accent">{item.time}</span>
                        <span className="text-neutral-dark ml-2">{item.title}</span>
                        {item.instructor && (
                          <span className="text-neutral-mid text-xs ml-1">· {item.instructor}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <a
                href="/horarios"
                className="text-accent underline-offset-4 hover:underline hover:text-primary transition-colors font-inter font-medium"
              >
                Ver todos los horarios →
              </a>
            </div>
          </div>
        </section>

        {/* Membresías */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-space mb-4">
                Membresías de Yoga
              </h2>
              <p className="text-neutral-mid font-inter">Planes flexibles para tu práctica semanal</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plan Yin-Yang */}
              <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-light)] border border-border">
                <h3 className="text-xl font-bold text-primary font-space mb-2">Membresía Yin-Yang Yoga</h3>
                <p className="text-3xl font-bold text-accent font-space mb-1">$39.000<span className="text-sm text-neutral-mid font-normal">/mes</span></p>
                <p className="text-neutral-mid font-inter text-sm mb-4">1 clase de yoga por semana</p>
                <ul className="space-y-2 mb-6 text-sm font-inter text-neutral-dark">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" />Acceso a cualquier estilo de yoga</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" />Ice Bath opcional post-clase</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" />Sin contrato de permanencia</li>
                </ul>
                <a
                  href="https://nave-studio.boxmagic.com/plans"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleMembershipClick("Yin-Yang Yoga $39.000")}
                  className="block w-full bg-accent hover:bg-primary text-white text-center rounded-[10px] px-6 py-3 font-medium transition-all duration-200 hover:scale-105 font-inter"
                >
                  Suscribirme
                </a>
              </div>
              {/* Sesión suelta */}
              <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-light)] border border-border">
                <h3 className="text-xl font-bold text-primary font-space mb-2">Yoga + Ice Bath</h3>
                <p className="text-3xl font-bold text-accent font-space mb-1">$15.000<span className="text-sm text-neutral-mid font-normal">/sesión</span></p>
                <p className="text-neutral-mid font-inter text-sm mb-4">Sesión suelta sin suscripción</p>
                <ul className="space-y-2 mb-6 text-sm font-inter text-neutral-dark">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" />Clase de yoga completa</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" />Ice Bath incluido</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" />Ideal para probar</li>
                </ul>
                <a
                  href="https://nave-studio.boxmagic.com/plans"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleMembershipClick("Yoga + Ice Bath $15.000")}
                  className="block w-full border-2 border-accent text-accent hover:bg-accent hover:text-white text-center rounded-[10px] px-6 py-3 font-medium transition-all duration-200 hover:scale-105 font-inter"
                >
                  Reservar sesión
                </a>
              </div>
            </div>
            <p className="text-center text-sm text-neutral-mid font-inter mt-6">
              ¿Primera vez? Tu{" "}
              <a href="#" data-open-trial="true" onClick={handleTrialClick} className="text-accent underline font-medium">
                clase de prueba es gratis
              </a>
              .
            </p>
          </div>
        </section>

        {/* Galería */}
        <section className="py-16 md:py-20 bg-muted">
          <div className="container mx-auto px-6 max-w-7xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-space text-center mb-12">
              Nuestro espacio en Las Condes
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {galleryImages.map((img, i) => (
                <div key={i} className={`rounded-xl overflow-hidden ${i === 0 ? "col-span-2 md:col-span-1 md:row-span-2" : ""}`}>
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover aspect-square hover:scale-105 transition-transform duration-500"
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
