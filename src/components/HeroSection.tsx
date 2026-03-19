import { Button } from "@/components/ui/button-variants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

// Marzo Reset promo ends on March 31, 2026 at 23:59:59 Chile time
const MARZO_RESET_END_DATE = new Date("2026-04-01T02:59:59Z"); // UTC equivalent

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

const HeroSlideMarzoReset = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-start md:items-center justify-center pt-20 md:pt-0">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-800 via-cyan-700 to-sky-600" />
      
      {/* Subtle ice texture overlay */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 0%, transparent 40%)' }} />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-5 md:space-y-7">
          {/* Urgency badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm md:text-base font-semibold border border-white/25 shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-400"></span>
            </span>
            Solo hasta el 31 de marzo
          </div>
          
          {/* Main Heading */}
          <h1 className="font-space-grotesk font-bold text-4xl md:text-6xl lg:text-7xl leading-[1.1]">
            Marzo Reset
            <span className="block text-2xl md:text-3xl lg:text-4xl font-medium text-white/90 mt-2">
              Packs de Criomedicina a precio especial
            </span>
          </h1>
          
          {/* Price cards */}
          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 max-w-lg mx-auto">
            <div className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center">
              <p className="text-sm uppercase tracking-wider text-white/70 font-medium mb-1">2 Sesiones</p>
              <p className="text-sm text-white/50 line-through">$60.000</p>
              <p className="text-3xl md:text-4xl font-bold">$40.000</p>
            </div>
            <div className="flex-1 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-2xl p-5 text-center relative overflow-hidden shadow-lg">
              <div className="absolute top-0 right-0 bg-accent text-white text-[10px] font-bold px-3 py-0.5 rounded-bl-lg">MEJOR PRECIO</div>
              <p className="text-sm uppercase tracking-wider text-white/70 font-medium mb-1">3 Sesiones</p>
              <p className="text-sm text-white/50 line-through">$90.000</p>
              <p className="text-3xl md:text-4xl font-bold">$50.000</p>
            </div>
          </div>
          
          {/* Key benefits */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 text-white/90 text-sm md:text-base">
            <span className="flex items-center justify-center gap-2">
              🎁 <strong>Compártelas</strong> con quien quieras
            </span>
            <span className="flex items-center justify-center gap-2">
              📅 <strong>6 meses</strong> para usarlas
            </span>
            <span className="flex items-center justify-center gap-2">
              🧊 Sesiones guiadas de <strong>Criomedicina</strong>
            </span>
          </div>
          
          {/* CTA */}
          <div className="space-y-3 pt-2">
            <Button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/marzo-reset');
              }}
              className="w-full md:w-auto min-w-[320px] bg-white text-cyan-700 hover:bg-white/90 font-bold text-lg py-6 px-10 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              size="xl"
            >
              Comprar Marzo Reset →
            </Button>
            
            <p className="font-inter text-xs text-white/60">
              Promo válida solo en marzo 2026. No reembolsable.
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
  
  // Check if we should show Marzo Reset promo
  useEffect(() => {
    const now = new Date();
    setShowPromo(now < MARZO_RESET_END_DATE);
  }, []);

  const autoplayPlugin = Autoplay({
    delay: 6000, // 6 seconds - industry standard
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      duration: 30, // Smooth transition
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

  // If no Valentine promo, just show main hero without carousel
  if (!showPromo) {
    return (
      <section className="relative min-h-screen overflow-hidden">
        <HeroSlideMain />
      </section>
    );
  }

  const slides = [
    { id: 'marzo-reset', component: <HeroSlideMarzoReset /> },
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
