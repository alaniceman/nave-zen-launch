import { Button } from "@/components/ui/button-variants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

// Bautizo de Hielo promo end date — 31 mayo 2026 fin del día Chile (UTC-3)
const BAUTIZO_END_DATE = new Date("2026-06-01T03:00:00Z");

const HeroSlideMain = () => {
  const navigate = useNavigate();

  const handlePlanClick = () => {
    navigate('/planes');
  };

  return (
    <div className="relative min-h-screen flex items-start md:items-center justify-center pt-20 md:pt-0">
      {/* Background Image with Overlay */}
      <img
        src="/lovable-uploads/82672388-9723-4aee-a1f2-ac72618cd26a.png"
        alt="Nave Studio wellness center hero background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'right 32% center' }}
        fetchPriority="high"
      />

      {/* Green Overlay */}
      <div className="absolute inset-0 bg-primary opacity-55" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-8">
          {/* Main Heading */}
          <h1 className="font-space-grotesk font-bold text-3xl md:text-6xl lg:text-7xl leading-tight">
            El centro de bienestar basado en ciencia
          </h1>

          {/* Subheading */}
          <div className="space-y-4">
            <h2 className="font-inter font-medium text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed">
              Para sentirte sano, fuerte y feliz.
            </h2>
            <div className="font-inter font-medium text-lg md:text-xl text-white/80 tracking-wide">
              Ice Bath · Método Wim Hof · Yoga · Breathwork
            </div>
          </div>

          {/* Micro line */}
          <p className="font-inter text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            Creado por <a href="https://instagram.com/alan_iceman" target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:text-accent/80 transition-colors">Alan Iceman</a> — Instructor Wim Hof, +115k seguidores en Instagram
          </p>

          {/* CTA Section */}
          <div className="space-y-4 pt-4 md:pt-8">
            <div className="flex flex-col gap-3 items-center">
              <Button variant="hero" size="xl" className="w-full md:w-auto min-w-[320px]" onClick={handlePlanClick}>
                Empieza hoy con 30% OFF en tu Membresía
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full md:w-auto min-w-[280px] border-2 border-white/80 bg-white/10 text-white hover:bg-white hover:text-primary transition-colors backdrop-blur-sm"
                onClick={() => navigate('/criomedicina-metodo-wim-hof-las-condes')}
              >
                Agenda tu sesión de Criomedicina →
              </Button>
            </div>

            <p className="font-inter text-sm text-white/70">
              Válido solo este mes. Cancelas cuando quieras.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroSlideBautizo = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-start md:items-center justify-center pt-20 md:pt-0">
      {/* Background — brand palette */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 0%, transparent 45%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-5 md:space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm md:text-base font-semibold border border-white/25 shadow-lg">
            <span className="text-base">🧊</span>
            Bautizo de Hielo · también para regalar 🎁
          </div>

          {/* Heading */}
          <h1 className="font-space-grotesk font-bold text-3xl md:text-6xl lg:text-7xl leading-[1.1]">
            Bautizo de Hielo
            <span className="block text-xl md:text-3xl lg:text-4xl font-medium text-white/90 mt-3">
              Una sesión guiada de Criomedicina
            </span>
          </h1>

          {/* Price */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <span className="font-space-grotesk text-5xl md:text-7xl font-bold">$15.000</span>
            <div className="text-left">
              <p className="line-through text-base md:text-lg text-white/60">$30.000</p>
              <span className="inline-block bg-accent text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full">
                50% OFF
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="font-inter text-base md:text-lg text-white/85 max-w-xl mx-auto">
            Breathwork + inmersión guiada en agua a <strong>3°C</strong> con coach certificado.
            Vívelo solo, ven con alguien (Dúo $30.000) o con tus amigos (Trío $45.000).
            También puedes <strong>regalarlo</strong>.
          </p>

          {/* CTA */}
          <div className="space-y-3 pt-2">
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/bautizo-hielo');
              }}
              className="w-full md:w-auto min-w-[320px] bg-white text-primary hover:bg-white/90 font-bold text-lg py-6 px-10 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              size="xl"
            >
              Reservar o regalar →
            </Button>

            <p className="font-inter text-xs text-white/70">
              60 min · coach certificado · disponible como Gift Card
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HeroSection = () => {
  const [showPromo, setShowPromo] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Check if we should show Bautizo promo
  useEffect(() => {
    const now = new Date();
    setShowPromo(now < BAUTIZO_END_DATE);
  }, []);

  const autoplayPlugin = Autoplay({
    delay: 6000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 30,
    },
    [autoplayPlugin]
  );

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  // If promo expired, just show main hero without carousel
  if (!showPromo) {
    return (
      <section className="relative min-h-screen overflow-hidden">
        <HeroSlideMain />
      </section>
    );
  }

  const slides = [
    { id: 'bautizo', component: <HeroSlideBautizo /> },
    { id: 'main', component: <HeroSlideMain /> },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div key={slide.id} className="flex-[0_0_100%] min-w-0">
              {slide.component}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300 border-2 border-white/80",
              selectedIndex === index
                ? "bg-white w-8"
                : "bg-white/30 hover:bg-white/50"
            )}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow indicators */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Slide anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Slide siguiente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  );
};
