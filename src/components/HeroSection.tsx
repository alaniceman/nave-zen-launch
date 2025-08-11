import { Button } from "@/components/ui/button-variants"
import { useNavigate } from "react-router-dom"
import heroImage from "@/assets/nave-studio-hero.jpg"

export const HeroSection = () => {
  const navigate = useNavigate()

  const handlePlanClick = () => {
    navigate('/planes')
  }
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-no-repeat bg-center md:bg-center"
        style={{
          backgroundImage: `url(/lovable-uploads/923c01f2-ceec-42a1-8418-1da57f72fb81.png)`,
          backgroundPosition: 'right 32% center',
        }}
      />
      
      {/* Green Overlay */}
      <div className="absolute inset-0 bg-primary opacity-55" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Heading */}
          <h1 className="font-space-grotesk font-bold text-4xl md:text-6xl lg:text-7xl leading-tight">
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
          <div className="space-y-4 pt-8">
            <Button 
              variant="hero" 
              size="xl"
              className="w-full md:w-auto min-w-[320px]"
              onClick={handlePlanClick}
            >
              Empieza hoy con 50% OFF el primer mes
            </Button>
            
            <p className="font-inter text-sm text-white/70">
              Válido solo este mes. Cancelas cuando quieras.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}