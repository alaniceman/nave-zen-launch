import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OptimizedImage } from "@/components/OptimizedImage"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { Footer } from "@/components/Footer"

const Coaches = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [currentCoachIndex, setCurrentCoachIndex] = useState(0)
  const sliderRef = useRef<HTMLDivElement | null>(null)

  // Scroll reveal animation
  useEffect(() => {
    const cards = document.querySelectorAll('.coach-card')
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

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const filters = ["Nutrición", "Mindset", "Terapia", "Movimiento", "Energía"]

  const coaches = [
    {
      id: 1,
      name: "Alan Iceman Earle",
      title: "Fundador – Crioguía de Inmersiones y Breathwork",
      credentials: "Instructor Cert. Método Wim Hof · Coach Ontológico · Ing. Civil PUC",
      description: "Ayudo a las personas a vivir con la certeza de que pueden lograr lo que se propongan, sin sacrificar su bienestar.",
      image: "/lovable-uploads/d4e6319c-db70-4990-9f8d-ef7f76f87b6d.png",
      badge: "Fundador",
      tags: ["Mindset", "Movimiento"]
    },
    {
      id: 2,
      name: "Maral Hekmat",
      title: "Instructora de Yoga y Movimiento Consciente – Kinesióloga en formación",
      credentials: "Crioguía de Inmersiones, Power Yoga e Yoga Integral",
      description: "Guío prácticas que cultivan fuerza y flexibilidad sin perder el equilibrio interno.",
      image: "/lovable-uploads/16afe771-f09d-472a-bc9d-ae33af798cc9.png",
      tags: ["Movimiento", "Terapia"]
    },
    {
      id: 3,
      name: "Gastón Serrano",
      title: "Coach de Hábitos Saludables y Movimiento Consciente",
      credentials: "Crioguía de Biohacking, HIIT y Movimiento Funcional · Entrenador Funcional Cert.",
      description: "Te ayudo a diseñar hábitos sostenibles que potencian tu rendimiento sin descuidar tu bienestar.",
      image: "/lovable-uploads/6dafbe55-50e1-4124-9e81-2e1c5ccfdc02.png",
      tags: ["Movimiento", "Mindset"]
    },
    {
      id: 4,
      name: "Sol Evans",
      title: "Instructora de Ice Yoga · Reikista · Terapeuta Holística",
      credentials: "Reiki Master",
      description: "Te acompaño a encontrar calma y fortaleza a través del frío, la respiración y la energía.",
      image: "/lovable-uploads/f65792e3-e19c-49b3-a7fc-ce59b6a20ed3.png",
      tags: ["Energía", "Terapia"]
    },
    {
      id: 5,
      name: "Mar Carrasco",
      title: "Instructora de Vinyasa Yoga y Danza · Educadora Somática",
      credentials: "Educadora Somática Certificada",
      description: "Guío secuencias fluidas que despiertan tu creatividad y presencia corporal.",
      image: "/lovable-uploads/8e3c9f77-5221-40ea-91f2-0a59bd9fbbd0.png",
      tags: ["Movimiento", "Energía"]
    },
    {
      id: 6,
      name: "Val Medina",
      title: "Instructora de Yin Yoga · Facilitadora de Meditación y Mindfulness",
      credentials: "Certificada en Mindfulness y Meditación",
      description: "Te invito a habitar tu cuerpo con suavidad y consciencia profunda.",
      image: "/lovable-uploads/56138f79-7a92-46b6-8fdf-8bff1ef72d26.png",
      tags: ["Mindset", "Terapia"]
    },
    {
      id: 7,
      name: "Ámbar Vidal",
      title: "Instructora de Yoga · Doula · Reikista",
      credentials: "Doula Certificada · Reiki Master",
      description: "Te acompaño a transitar etapas de cambio con serenidad, cuerpo y corazón alineados.",
      image: "/lovable-uploads/1f80e046-a0e6-4b38-a2b1-73c27384f85a.png",
      tags: ["Energía", "Terapia"]
    }
  ]

  const testimonials = [
    {
      id: 1,
      text: "Alan me ayudó a transformar mi relación con el miedo. Ahora siento que puedo con todo.",
      author: "Carolina M."
    },
    {
      id: 2,
      text: "Las clases de Maral combinan fuerza física con equilibrio emocional de manera perfecta.",
      author: "Diego R."
    },
    {
      id: 3,
      text: "Sol tiene una energía increíble. Sus sesiones de yoga con hielo son transformadoras.",
      author: "Fernanda L."
    }
  ]

  const filteredCoaches = activeFilter 
    ? coaches.filter(coach => coach.tags.includes(activeFilter))
    : coaches

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      window.location.href = href
    }
  }

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }
  const scrollToCoach = (index: number) => {
    const container = sliderRef.current
    if (!container) return
    const firstChild = container.firstElementChild as HTMLElement | null
    if (!firstChild) return
    const cardWidth = firstChild.getBoundingClientRect().width
    const gap = 24 // gap-6
    container.scrollTo({ left: index * (cardWidth + gap), behavior: 'smooth' })
    setCurrentCoachIndex(index)
  }

  const handleCoachScroll = () => {
    const container = sliderRef.current
    if (!container) return
    const firstChild = container.firstElementChild as HTMLElement | null
    if (!firstChild) return
    const cardWidth = firstChild.getBoundingClientRect().width
    const gap = 24 // gap-6
    const idx = Math.round(container.scrollLeft / (cardWidth + gap))
    setCurrentCoachIndex(Math.max(0, Math.min(idx, filteredCoaches.length - 1)))
  }

  return (
    <main className="min-h-screen" id="coaches">
      {/* Hero Section */}
      <section 
        className="relative h-[65vh] flex flex-col items-center justify-center text-center px-6 bg-cover bg-center"
        style={{
          backgroundImage: `var(--hero-overlay), url('/lovable-uploads/29ec3d19-9f96-4f1c-83c7-3478795d74fe.png')`,
        }}
      >
        <h1 className="text-4xl md:text-5xl font-heading text-white mb-4 animate-fade-in">
          Tu equipo de guías y terapeutas
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-xl animate-fade-in">
          Profesionales certificados que combinan ciencia, experiencia y pasión para acompañarte.
        </p>
        <Button
          onClick={() => scrollToSection('#grid-coaches')}
          className="mt-8 bg-secondary hover:bg-primary text-white py-3 px-8 rounded-[10px] transition-all duration-200 hover:scale-105 animate-fade-in"
        >
          Conocer al equipo
        </Button>
      </section>


      {/* Grid Coaches */}
      <section id="grid-coaches" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading text-primary mb-4">
              Nuestro Equipo
            </h2>
            <p className="text-lg text-neutral-mid max-w-2xl mx-auto">
              Cada miembro de nuestro equipo aporta conocimiento especializado y pasión por el bienestar integral
            </p>
          </div>

          {/* Desktop: 3 columns, Tablet: 2 columns */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCoaches.map((coach, index) => (
              <div
                key={coach.id}
                className="coach-card relative bg-white rounded-xl shadow-lg p-6 text-center opacity-0 translate-y-5 transition-all duration-500 hover:scale-103 hover:shadow-xl group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {coach.badge && (
                  <Badge className="absolute top-4 left-4 bg-warm text-white text-xs rounded-full px-3 py-1 uppercase font-medium">
                    {coach.badge}
                  </Badge>
                )}
                <div className="relative mb-6">
                  <OptimizedImage
                    srcBase={coach.image.replace(/\.(jpg|jpeg|png|webp)$/i, '')}
                    alt={`${coach.name} – ${coach.title}`}
                    width={320}
                    height={320}
                    sizes="128px"
                    className="w-32 h-32 mx-auto rounded-full object-cover shadow-md"
                  />
                </div>
                <h3 className="text-xl font-heading text-primary mb-2">
                  {coach.name}
                </h3>
                <h4 className="text-sm font-medium text-neutral-mid mb-2">
                  {coach.title}
                </h4>
                <p className="text-xs text-neutral-mid mb-3 leading-relaxed">
                  {coach.credentials}
                </p>
                <p className="text-sm text-neutral-dark mb-6 leading-relaxed italic">
                  "{coach.description}"
                </p>
                <Button
                  variant="outline"
                  className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white py-2 px-6 rounded-[10px] transition-all duration-200 hover:scale-105 focus:outline-dashed focus:outline-2 focus:outline-secondary"
                >
                  Reservar sesión
                </Button>
              </div>
            ))}
          </div>

          {/* Mobile: Slider */}
          <div className="block md:hidden">
            <div
              ref={sliderRef}
              onScroll={handleCoachScroll}
              className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory px-4 -mx-4"
              style={{ scrollSnapType: 'x mandatory', scrollPaddingLeft: '1rem' }}
            >
              {filteredCoaches.map((coach, index) => (
                <div
                  key={coach.id}
                  className="coach-card flex-none w-[85vw] max-w-xs bg-white rounded-xl shadow-lg p-6 text-center snap-start opacity-0 translate-y-5 transition-all duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {coach.badge && (
                    <Badge className="absolute top-4 left-4 bg-warm text-white text-xs rounded-full px-3 py-1 uppercase font-medium">
                      {coach.badge}
                    </Badge>
                  )}
                  <div className="relative mb-6">
                    <OptimizedImage
                      srcBase={coach.image.replace(/\.(jpg|jpeg|png|webp)$/i, '')}
                      alt={`${coach.name} – ${coach.title}`}
                      width={320}
                      height={320}
                      sizes="112px"
                      className="w-28 h-28 mx-auto rounded-full object-cover shadow-md"
                    />
                  </div>
                  <h3 className="text-lg font-heading text-primary mb-2">
                    {coach.name}
                  </h3>
                  <h4 className="text-sm font-medium text-neutral-mid mb-2">
                    {coach.title}
                  </h4>
                  <p className="text-xs text-neutral-mid mb-3 leading-relaxed">
                    {coach.credentials}
                  </p>
                  <p className="text-sm text-neutral-dark mb-6 leading-relaxed italic">
                    "{coach.description}"
                  </p>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-secondary text-secondary hover:bg-secondary hover:text-white py-2 px-4 rounded-[10px] transition-all duration-200 hover:scale-105 text-sm"
                  >
                    Reservar sesión
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-2">
              {filteredCoaches.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToCoach(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${index === currentCoachIndex ? 'bg-secondary' : 'bg-neutral-mid/30'}`}
                  aria-label={`Ir al slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-6 bg-neutral-light">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading text-primary mb-4">
              Lo que dicen nuestros clientes
            </h2>
          </div>

          <div className="relative">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <Quote className="w-8 h-8 text-secondary mx-auto mb-4" />
              <p className="text-lg text-neutral-dark mb-6 italic leading-relaxed">
                {testimonials[currentTestimonial].text}
              </p>
              <div className="flex flex-col items-center justify-center">
                <div>
                  <p className="font-medium text-primary">
                    {testimonials[currentTestimonial].author}
                  </p>
                  <div className="flex gap-1 justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-neutral-light transition-colors duration-200"
              aria-label="Testimonio anterior"
            >
              <ChevronLeft className="w-5 h-5 text-primary" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-neutral-light transition-colors duration-200"
              aria-label="Siguiente testimonio"
            >
              <ChevronRight className="w-5 h-5 text-primary" />
            </button>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentTestimonial ? 'bg-secondary' : 'bg-neutral-mid/30'
                  }`}
                  aria-label={`Ir al testimonio ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-heading text-primary mb-4">
            ¿Listo para dar el siguiente paso?
          </h2>
          <p className="text-neutral-mid mb-8 max-w-lg mx-auto leading-relaxed">
            Explora nuestros planes o reserva tu primera experiencia en la Nave.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection('/planes')}
              className="bg-secondary hover:bg-primary text-white py-3 px-8 rounded-[10px] transition-all duration-200 hover:scale-105"
            >
              Ver planes
            </Button>
            <Button
              onClick={() => scrollToSection('/experiencias')}
              variant="outline"
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white py-3 px-8 rounded-[10px] transition-all duration-200 hover:scale-105"
            >
              Explorar experiencias
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Coaches