import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/Footer"
import { TrialMiniBar } from "@/components/TrialMiniBar"
import { useTrialModal } from "@/hooks/useTrialModal"
import { useFacebookPixel } from "@/hooks/useFacebookPixel"
import { Snowflake, Wind, Dumbbell, Brain, Flame } from "lucide-react"

const Experiencias = () => {
  const { openTrialModal } = useTrialModal()
  const { trackViewContent } = useFacebookPixel()
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    trackViewContent({
      content_name: 'Experiences Overview',
      content_category: 'Service Catalog',
      content_ids: ['wim-hof', 'yoga', 'breathwork', 'biohacking', 'isometrica'],
      content_type: 'service_group',
    });
  }, [trackViewContent]);

  // Scroll reveal
  useEffect(() => {
    const cards = document.querySelectorAll('.exp-card')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in')
          }
        })
      },
      { threshold: 0.1 }
    )
    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  const experiences: Array<{
    id: string; title: string; subtitle: string; duration: string; image: string;
    icon: typeof Snowflake; description: string; benefits: string[];
    note?: string; cta: string; href?: string; ctaAction?: "trial";
  }> = [
    {
      id: "wim-hof",
      title: "Método Wim Hof",
      subtitle: "Breathwork + Ice Bath (3 °C)",
      duration: "60 min",
      image: "/lovable-uploads/0ead276d-928f-4395-b552-f0bebcc62ede.png",
      icon: Snowflake,
      description: "Sesión guiada de respiración Wim Hof seguida de inmersión en agua fría a 3 °C. Fortalece tu sistema nervioso y despierta tu resiliencia interior.",
      benefits: [
        "↓ Inflamación y dolor crónico",
        "↑ Energía y claridad mental",
        "Entrenas resiliencia del sistema nervioso"
      ],
      cta: "Agendar sesión",
      href: "/agenda-nave-studio",
    },
    {
      id: "yoga",
      title: "Yoga (Yin · Yang · Vinyasa · Integral)",
      subtitle: "Ice Bath opcional al final",
      duration: "60 min",
      image: "/lovable-uploads/3649b4d9-a5b6-40c3-a674-5ce8da8b13e4.png",
      icon: Wind,
      description: "Secuencias para fuerza, flexibilidad y equilibrio interno. Puedes complementar con inmersión en agua fría al final de la clase.",
      benefits: [
        "Desarrolla fuerza y flexibilidad",
        "Mejora el equilibrio mental",
        "Reduce estrés y ansiedad"
      ],
      note: "Para sumergirte necesitas haber completado una sesión de Método Wim Hof.",
      cta: "Clase de prueba GRATIS",
      ctaAction: "trial",
    },
    {
      id: "breathwork",
      title: "Breathwork & Meditación",
      subtitle: "Técnicas WHM sin inmersión",
      duration: "60 min",
      image: "/lovable-uploads/ae8dc267-b3c4-4b99-aedd-4e39f167b9cb.png",
      icon: Brain,
      description: "Técnicas de respiración Wim Hof, respiración consciente y mindfulness para regular tu sistema nervioso sin necesidad de hielo.",
      benefits: [
        "Regula el sistema nervioso",
        "Mejora concentración y foco",
        "Reduce niveles de cortisol"
      ],
      cta: "Ver horarios",
      href: "/horarios",
    },
    {
      id: "biohacking",
      title: "HIIT + Ice Bath",
      subtitle: "Breathwork + circuito HIIT + baño de hielo",
      duration: "60 min",
      image: "/lovable-uploads/4483c652-df99-4b53-9841-a5b5b2ff21c4.png",
      icon: Flame,
      description: "Explosión metabólica: respiración activante, circuito HIIT de alta intensidad y cierre con inmersión en agua fría para máxima recuperación.",
      benefits: [
        "Acelera el metabolismo",
        "Optimiza la recuperación muscular",
        "Maximiza la quema de grasa"
      ],
      cta: "Reservar spot",
      href: "/agenda-nave-studio",
    },
    {
      id: "isometrica",
      title: "Isométrica + Flexibilidad",
      subtitle: "Fuerza profunda y movilidad",
      duration: "60 min",
      image: "/lovable-uploads/b009e7fc-5c3e-4b38-99e1-a3cc58605206.png",
      icon: Dumbbell,
      description: "Ejercicios isométricos que desarrollan fuerza y estabilidad profunda, combinados con trabajo de flexibilidad funcional.",
      benefits: [
        "Desarrolla fuerza sin impacto",
        "Mejora estabilidad articular",
        "Aumenta rango de movimiento"
      ],
      cta: "Ver horarios",
      href: "/horarios",
    }
  ]

  const stats = [
    { number: "9.9/10", caption: "satisfacción promedio" },
    { number: "97%", caption: "reportaron menos estrés" },
    { number: "+2,000", caption: "participantes guiados" }
  ]

  return (
    <main className="min-h-screen" id="experiencias">
      <TrialMiniBar />

      {/* Hero */}
      <section
        className="relative h-[75vh] flex flex-col items-center justify-center text-center px-6 bg-cover bg-center"
        style={{
          backgroundImage: `var(--hero-overlay), url('/lovable-uploads/01b95c7e-fe23-45a2-8548-05d7d0734fab.png')`,
        }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-white mb-4 animate-fade-in max-w-3xl">
          Experiencias que transforman
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl animate-fade-in mb-8">
          Frío, respiración, movimiento y ciencia para que estés sano, fuerte y feliz.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
          <Button
            onClick={openTrialModal}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white py-3 px-8 rounded-[10px] transition-all duration-200 hover:scale-105 text-base"
          >
            Prueba una clase gratis
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2 border-white text-white hover:bg-white/20 py-3 px-8 rounded-[10px] transition-all duration-200 hover:scale-105 text-base bg-transparent"
          >
            <Link to="/planes-precios">Ver planes y precios</Link>
          </Button>
        </div>
      </section>

      {/* Experiences Grid */}
      <section id="grid-experiencias" className="py-16 md:py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-heading text-primary mb-4">
              Nuestras Experiencias
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cada sesión está diseñada para transformar tu bienestar físico y mental
            </p>
          </div>

          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {experiences.map((exp, index) => {
              const Icon = exp.icon
              return (
                <div
                  key={exp.id}
                  className={`exp-card opacity-0 translate-y-5 transition-all duration-500 bg-card rounded-2xl shadow-lg overflow-hidden hover:shadow-xl group ${
                    index === experiences.length - 1 && experiences.length % 2 !== 0
                      ? 'md:col-span-2 md:max-w-lg md:mx-auto'
                      : ''
                  }`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={exp.image}
                      alt={exp.title}
                      loading={index <= 1 ? "eager" : "lazy"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm text-xs">
                        <Icon className="w-3 h-3 mr-1" />
                        {exp.duration}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-heading text-primary mb-1">
                      {exp.title}
                    </h3>
                    <p className="text-sm text-accent font-medium mb-3">
                      {exp.subtitle}
                    </p>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {exp.description}
                    </p>

                    {exp.note && (
                      <div className="bg-warm/10 border border-warm/20 text-foreground p-3 rounded-lg mb-4 text-sm">
                        ⚠️ {exp.note}
                      </div>
                    )}

                    <ul className="space-y-2 mb-6">
                      {exp.benefits.map((benefit, i) => (
                        <li key={i} className="text-foreground text-sm flex items-start">
                          <span className="text-secondary mr-2 mt-0.5">✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>

                    {exp.ctaAction === "trial" ? (
                      <Button
                        onClick={openTrialModal}
                        className="w-full bg-accent hover:bg-accent/90 text-white rounded-[10px] transition-all duration-200 hover:scale-[1.02]"
                      >
                        {exp.cta}
                      </Button>
                    ) : (
                      <Button
                        asChild
                        className="w-full bg-secondary hover:bg-secondary/90 text-white rounded-[10px] transition-all duration-200 hover:scale-[1.02]"
                      >
                        <Link to={exp.href || "/horarios"}>{exp.cta}</Link>
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Ice Bath Prerequisite */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary/5 border border-primary/10 py-6 px-8 rounded-2xl flex items-start gap-4">
            <Snowflake className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-foreground leading-relaxed">
              Para entrar al <strong className="text-primary">Ice Bath</strong> después de cualquier clase de Yoga debes completar primero
              la sesión guiada del <strong className="text-primary">Método Wim Hof</strong>.{" "}
              <Link to="/agenda-nave-studio" className="text-accent hover:underline font-medium">
                Agenda tu primera sesión →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in">
                <div className="text-4xl md:text-5xl font-heading text-secondary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.caption}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center bg-background">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-heading text-primary mb-4">
            ¿Listo para vivir tu primera experiencia?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed text-lg">
            Comienza con una clase de prueba gratuita o explora nuestros planes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={openTrialModal}
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white py-3 px-8 rounded-[10px] transition-all duration-200 hover:scale-105 text-base"
            >
              Clase de prueba gratis
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white py-3 px-8 rounded-[10px] transition-all duration-200 hover:scale-105 text-base"
            >
              <Link to="/planes-precios">Ver planes desde $39.990/mes</Link>
            </Button>
          </div>
          <div className="mt-6">
            <a
              href="https://wa.me/56946120426?text=Hola%21%20quiero%20saber%20más%20sobre%20las%20experiencias%20de%20Nave%20Studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary underline-offset-4 hover:underline transition-colors"
            >
              ¿Dudas? Hablar por WhatsApp →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Experiencias
