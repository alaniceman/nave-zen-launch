import { Button } from "@/components/ui/button-variants";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

// San Valentín promo ends on Feb 14, 2026 at 23:59:59 Chile time
const VALENTINE_END_DATE = new Date("2026-02-15T02:59:59Z"); // UTC equivalent

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
              Ice Bath · Breathwork · Yoga · Biohacking
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
                onClick={() => navigate('/agenda-nave-studio')}
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

const HeroSlideValentine = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-start md:items-center justify-center pt-20 md:pt-0">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-pink-500 to-rose-400" />
      
      {/* Decorative hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl md:text-8xl opacity-20 animate-pulse">💕</div>
        <div className="absolute top-40 right-20 text-5xl md:text-7xl opacity-15 animate-pulse" style={{ animationDelay: '0.5s' }}>❤️</div>
        <div className="absolute bottom-40 left-20 text-4xl md:text-6xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}>💝</div>
        <div className="absolute bottom-20 right-10 text-5xl md:text-7xl opacity-15 animate-pulse" style={{ animationDelay: '1.5s' }}>💕</div>
        <div className="absolute top-1/3 left-1/4 text-3xl md:text-5xl opacity-10 animate-pulse" style={{ animationDelay: '0.3s' }}>❤️</div>
        <div className="absolute top-1/2 right-1/4 text-4xl md:text-6xl opacity-10 animate-pulse" style={{ animationDelay: '0.8s' }}>💝</div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          {/* Badge */}
          <div className="inline-block">
            <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm md:text-base font-medium border border-white/30">
              💕 Oferta Especial San Valentín 💕
            </span>
          </div>
          
          {/* Main Heading */}
          <h1 className="font-space-grotesk font-bold text-3xl md:text-5xl lg:text-6xl leading-tight">
            Regala una experiencia <br className="hidden md:block" />
            transformadora
          </h1>
          
          {/* Subheading */}
          <div className="space-y-3">
            <h2 className="font-inter font-medium text-xl md:text-2xl lg:text-3xl text-white/95 leading-relaxed">
              2 Sesiones de Criomedicina / Método Wim Hof
            </h2>
            
            {/* Price */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <span className="text-xl md:text-2xl text-white/60 line-through">$60.000</span>
              <span className="text-4xl md:text-5xl font-bold text-white">$40.000</span>
              <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                ¡Ahorra $20.000!
              </span>
            </div>
          </div>
          
          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-4 text-white/90 text-sm md:text-base">
            <span className="flex items-center gap-2">
              <span className="text-lg">✓</span> 2 códigos de sesión
            </span>
            <span className="flex items-center gap-2">
              <span className="text-lg">✓</span> Válido 6 meses
            </span>
            <span className="flex items-center gap-2">
              <span className="text-lg">✓</span> Gift Card descargable
            </span>
          </div>
          
          {/* CTA */}
          <div className="space-y-4 pt-4">
            <Button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/san-valentin');
              }}
              className="w-full md:w-auto min-w-[320px] bg-white text-rose-600 hover:bg-white/90 font-bold text-lg py-6 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              size="xl"
            >
              💝 Comprar Gift Card de San Valentín
            </Button>
            
            <p className="font-inter text-sm text-white/80">
              Válido hasta el 14 de febrero
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HeroSection = () => {
  const [showValentine, setShowValentine] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Check if we should show Valentine's promo
  useEffect(() => {
    const now = new Date();
    setShowValentine(now < VALENTINE_END_DATE);
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
  if (!showValentine) {
    return (
      <section className="relative min-h-screen overflow-hidden">
        <HeroSlideMain />
      </section>
    );
  }

  const slides = [
    { id: 'valentine', component: <HeroSlideValentine /> },
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
