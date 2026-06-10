import { Button } from "@/components/ui/button-variants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import planPruebaHero from "@/assets/plan-prueba-hero.webp";

// Día de la Madre (Chile: 10 mayo 2026) — banner activo hasta fin del 10 mayo
const DIA_MADRE_END_DATE = new Date("2026-05-11T03:00:00Z");

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
              Yoga · Ice Bath · Método Wim Hof · Breathwork
            </div>
          </div>

          {/* Micro line */}
          <p className="font-inter text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            Creado por <a href="https://instagram.com/alan_iceman" target="_blank" rel="noopener noreferrer" className="font-medium text-accent hover:text-accent/80 transition-colors">Alan Iceman</a> — Instructor Wim Hof, +118k seguidores en Instagram
          </p>

          {/* CTA Section */}
          <div className="space-y-4 pt-4 md:pt-8">
            <div className="flex flex-col gap-3 items-center">
              <Button variant="hero" size="xl" className="w-full md:w-auto min-w-[320px]" onClick={() => navigate('/plan-de-prueba')}>
                Empieza hoy con tu Plan de Prueba
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
              Desde $9.900 · 7 o 15 días · acceso ilimitado a todas las clases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroSlidePlanPrueba = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-start md:items-center justify-center pt-20 md:pt-0">
      {/* Background image */}
      <img
        src={planPruebaHero}
        alt="Plan de Prueba — Yoga en Nave Studio"
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-primary/65" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-5 md:space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm md:text-base font-semibold border border-white/25 shadow-lg">
            <span className="text-base">✨</span>
            Plan de Prueba · 7 o 15 días
          </div>

          {/* Heading */}
          <h1 className="font-space-grotesk font-bold text-3xl md:text-6xl lg:text-7xl leading-[1.1]">
            Plan de Prueba
            <span className="block text-xl md:text-3xl lg:text-4xl font-medium text-white/90 mt-3">
              Acceso ilimitado a todas las clases
            </span>
          </h1>

          {/* Price */}
          <div className="flex items-center justify-center gap-4 pt-2 flex-wrap">
            <div className="text-left">
              <span className="font-space-grotesk text-4xl md:text-6xl font-bold">$9.900</span>
              <p className="text-sm md:text-base text-white/80">7 días</p>
            </div>
            <span className="text-3xl md:text-4xl text-white/50">·</span>
            <div className="text-left">
              <span className="font-space-grotesk text-4xl md:text-6xl font-bold">$19.900</span>
              <p className="text-sm md:text-base text-white/80">15 días</p>
            </div>
          </div>

          {/* Description */}
          <p className="font-inter text-base md:text-lg text-white/90 max-w-xl mx-auto">
            Yoga, Breathwork, Criomedicina y Método Wim Hof. <strong>Tú eliges cuándo empezar</strong> (hasta 30 días en el futuro).
          </p>

          {/* CTA */}
          <div className="space-y-3 pt-2">
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/plan-de-prueba');
              }}
              className="w-full md:w-auto min-w-[320px] bg-white text-primary hover:bg-white/90 font-bold text-lg py-6 px-10 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              size="xl"
            >
              Comenzar mi plan de prueba →
            </Button>

            <p className="font-inter text-xs text-white/70">
              Acceso ilimitado · Inicio flexible · Todas las disciplinas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroSlideDiaMadre = () => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-screen flex items-start md:items-center justify-center pt-20 md:pt-0 bg-gradient-to-br from-rose-500 via-rose-400 to-amber-400">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="max-w-3xl mx-auto space-y-5 md:space-y-7">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm md:text-base font-semibold border border-white/30">
            💐 Día de la Madre · Edición limitada
          </div>
          <h1 className="font-space-grotesk font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.05]">
            Mamá también necesita un reset
          </h1>
          <p className="font-inter text-base md:text-xl text-white/95 max-w-2xl mx-auto">
            Regálale 4 sesiones en Nave Studio — Yoga o Criomedicina. Puede usarlas sola o compartirlas contigo.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="font-space-grotesk text-5xl md:text-7xl font-bold">$45.000</span>
            <span className="text-sm md:text-base text-white/90 self-end pb-2">4 sesiones</span>
          </div>
          <div className="space-y-3 pt-2">
            <Button
              type="button"
              onClick={(e) => { e.stopPropagation(); navigate('/dia-de-la-madre'); }}
              className="w-full md:w-auto min-w-[320px] bg-white text-rose-600 hover:bg-white/90 font-bold text-lg py-6 px-10 rounded-xl shadow-xl transition-all transform hover:scale-105"
              size="xl"
            >
              Quiero regalarle bienestar →
            </Button>
            <p className="font-inter text-xs text-white/80">Validez 200 días · Gift Card descargable</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HeroSection = () => {
  const [showDiaMadre, setShowDiaMadre] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const now = new Date();
    setShowDiaMadre(now < DIA_MADRE_END_DATE);
  }, []);

  const autoplayPlugin = Autoplay({
    delay: 6000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 30 },
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

  const slides = [
    { id: 'plan-prueba', component: <HeroSlidePlanPrueba /> },
    { id: 'main', component: <HeroSlideMain /> },
    ...(showDiaMadre ? [{ id: 'dia-madre', component: <HeroSlideDiaMadre /> }] : []),
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
