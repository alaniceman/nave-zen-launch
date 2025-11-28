import { Button } from "@/components/ui/button-variants"
import { useNavigate } from "react-router-dom"
import heroImage from "@/assets/nave-studio-hero.jpg"

export const HeroSection = () => {
  const navigate = useNavigate()

  const handlePlanClick = () => {
    navigate('/planes')
  }
  return (
    <section className="relative min-h-screen flex items-start md:items-center justify-center pt-20 md:pt-0 overflow-hidden">
      {/* Background Image with Overlay */}
      <img 
        src="/lovable-uploads/82672388-9723-4aee-a1f2-ac72618cd26a.png"
        alt="Nave Studio wellness center hero background"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          objectPosition: 'right 32% center',
        }}
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
              <Button 
                variant="hero" 
                size="xl"
                className="w-full md:w-auto min-w-[320px]"
                onClick={handlePlanClick}
              >
                Empieza hoy con 50% OFF el primer mes
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="w-full md:w-auto min-w-[280px] border-2 border-white/80 bg-white/10 text-white hover:bg-white hover:text-primary transition-colors backdrop-blur-sm"
                onClick={() => navigate('/agenda-nave-studio')}
              >
                Agenda tu sesión del Método Wim Hof →
              </Button>
            </div>
            
            <p className="font-inter text-sm text-white/70">
              Válido solo este mes. Cancelas cuando quieras.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}