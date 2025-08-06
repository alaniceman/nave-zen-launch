import { Button } from "@/components/ui/button-variants"
import heroImage from "@/assets/nave-studio-hero.jpg"

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20 md:pt-28 md:pb-24 lg:pt-32 lg:pb-28">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `var(--hero-overlay), url(${heroImage})`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="font-space-grotesk font-bold text-4xl md:text-6xl lg:text-7xl leading-tight mb-4">
            El centro de bienestar basado en ciencia
          </h1>
          
          {/* Subheading */}
          <div className="space-y-4 mb-5">
            <h2 className="font-inter font-medium text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed">
              Para sentirte sano, fuerte y feliz.
            </h2>
            <div className="font-inter font-medium text-lg md:text-xl text-white/80 tracking-wide">
              Ice Bath · Breathwork · Yoga · Biohacking
            </div>
          </div>
          
          {/* Micro line */}
          <p className="font-inter text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Creado por <span className="font-medium text-accent">Alan Iceman</span> — Instructor Wim Hof, +115k seguidores en Instagram
          </p>
          
          {/* CTA Section */}
          <div className="text-center">
            <Button 
              variant="hero" 
              size="xl"
              className="inline-block max-w-[340px] transition-transform duration-200 hover:scale-105 hover:-translate-y-0.5"
            >
              Empieza hoy con 50% OFF el primer mes
            </Button>
            
            <p className="font-inter text-sm text-white/70 mt-4">
              Válido solo este mes. Cancelas cuando quieras.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}