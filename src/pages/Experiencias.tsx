import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Footer } from "@/components/Footer"

const Experiencias = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null)

  // Scroll reveal animation
  useEffect(() => {
    const cards = document.querySelectorAll('.method-card')
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

  const methods = [
    {
      id: 1,
      title: "Método Wim Hof",
      subtitle: "1 h Breathwork + Ice Bath (3 °C) guiado y sostenido. Ideal para tu primera inmersión.",
      image: "/lovable-uploads/2c005154-6b4f-43b7-b3cb-d3f15869f7ef.png",
      benefits: [
        "↓ inflamación y dolor",
        "↑ energía y claridad mental", 
        "Entrenas resiliencia del sistema nervioso"
      ],
      cta: "Agendar sesión",
      href: "#planes"
    },
    {
      id: 2,
      title: "Yoga (Yin · Yang · Integral)",
      subtitle: "Secuencias para fuerza, flexibilidad y equilibrio interno. Ice Bath opcional al final.",
      image: "/lovable-uploads/1f80e046-a0e6-4b38-a2b1-73c27384f85a.png",
      note: "Para sumergirte necesitas haber completado Método Wim Hof.",
      benefits: [
        "Desarrolla fuerza y flexibilidad",
        "Mejora el equilibrio mental",
        "Reduce el estrés y ansiedad"
      ],
      cta: "Ver horarios",
      href: "#planes"
    },
    {
      id: 3,
      title: "Breathwork & Meditación",
      subtitle: "Técnicas WHM, respiración consciente y mindfulness para regular el estrés.",
      image: "/lovable-uploads/4237a4a8-4b67-4133-9d1e-5a134df22d8c.png",
      benefits: [
        "Regula el sistema nervioso",
        "Mejora la concentración",
        "Reduce niveles de cortisol"
      ],
      cta: "Probar una sesión",
      href: "#planes"
    },
    {
      id: 4,
      title: "Biohacking (Breathwork + HIIT + Ice Bath)",
      subtitle: "Explosión metabólica: 15 min respiración, circuito HIIT y baño de hielo.",
      image: "/lovable-uploads/bd41d348-08a8-468a-b986-090216e63e46.png",
      benefits: [
        "Acelera el metabolismo",
        "Optimiza la recuperación",
        "Maximiza la quema de grasa"
      ],
      cta: "Reservar tu spot",
      href: "#planes"
    }
  ]

  const stats = [
    { number: "9.9/10", caption: "satisfacción" },
    { number: "97%", caption: "menos estrés" },
    { number: "+2,000", caption: "participantes guiados" }
  ]

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <main className="min-h-screen" id="experiencias">
      {/* Hero Section */}
      <section 
        className="relative h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-cover bg-center"
        style={{
          backgroundImage: `var(--hero-overlay), url('/lovable-uploads/195023f2-6c17-433e-9e1d-e453eaede57a.png')`,
        }}
      >
        <h1 className="text-4xl md:text-5xl font-heading text-white mb-4 animate-fade-in">
          Explora nuestras experiencias
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-xl animate-fade-in">
          Frío, respiración, movimiento y ciencia para que estés sano, fuerte y feliz.
        </p>
        <Button
          onClick={() => scrollToSection('#grid-experiencias')}
          className="mt-8 bg-secondary hover:bg-primary text-white py-3 px-8 rounded-[10px] transition-all duration-200 hover:scale-105 animate-fade-in"
        >
          Ver experiencias
        </Button>
      </section>

      {/* Grid Experiencias */}
      <section id="grid-experiencias" className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading text-primary mb-4">
            Nuestras Metodologías
          </h2>
          <p className="text-lg text-neutral-mid max-w-2xl mx-auto">
            Cada experiencia está diseñada para transformar tu bienestar físico y mental
          </p>
        </div>

        {/* Desktop: Grid 2 columns alternating */}
        <div className="hidden lg:block space-y-16">
          {methods.map((method, index) => (
            <div
              key={method.id}
              className={`method-card grid grid-cols-2 gap-12 items-center opacity-0 translate-y-5 transition-all duration-500 ${
                index % 2 === 1 ? 'direction-rtl' : ''
              }`}
            >
              <div className={`${index % 2 === 1 ? 'order-2' : 'order-1'}`}>
                <img
                  src={method.image}
                  alt={method.title}
                  className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
              </div>
              <div className={`${index % 2 === 1 ? 'order-1' : 'order-2'}`}>
                <h3 className="text-2xl font-heading text-primary mb-3">
                  {method.title}
                </h3>
                <p className="text-neutral-mid mb-4 leading-relaxed">
                  {method.subtitle}
                </p>
                {method.note && (
                  <div className="bg-warm/20 text-warm p-3 rounded-lg mb-4 text-sm">
                    {method.note}
                  </div>
                )}
                <ul className="space-y-2 mb-6">
                  {method.benefits.map((benefit, i) => (
                    <li key={i} className="text-neutral-dark flex items-center">
                      <span className="text-secondary mr-2">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => scrollToSection(method.href)}
                  variant="secondary"
                  className="bg-secondary hover:bg-primary text-white px-6 py-2.5 rounded-[10px] transition-all duration-200 hover:scale-105"
                >
                  {method.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Tablet: Single column with image on top */}
        <div className="hidden md:block lg:hidden space-y-12">
          {methods.map((method) => (
            <div key={method.id} className="method-card opacity-0 translate-y-5 transition-all duration-500">
              <img
                src={method.image}
                alt={method.title}
                className="w-full h-64 object-cover rounded-xl shadow-lg mb-6"
              />
              <h3 className="text-2xl font-heading text-primary mb-3">
                {method.title}
              </h3>
              <p className="text-neutral-mid mb-4 leading-relaxed">
                {method.subtitle}
              </p>
              {method.note && (
                <div className="bg-warm/20 text-warm p-3 rounded-lg mb-4 text-sm">
                  {method.note}
                </div>
              )}
              <ul className="space-y-2 mb-6">
                {method.benefits.map((benefit, i) => (
                  <li key={i} className="text-neutral-dark flex items-center">
                    <span className="text-secondary mr-2">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => scrollToSection(method.href)}
                variant="secondary"
                className="bg-secondary hover:bg-primary text-white px-6 py-2.5 rounded-[10px] transition-all duration-200 hover:scale-105"
              >
                {method.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Mobile: Slider */}
        <div className="block md:hidden">
          <div className="flex overflow-x-auto gap-6 pb-6 snap-x snap-mandatory">
            {methods.map((method) => (
              <div
                key={method.id}
                className="method-card flex-none w-80 bg-white rounded-xl shadow-lg p-6 snap-start opacity-0 translate-y-5 transition-all duration-500"
              >
                <img
                  src={method.image}
                  alt={method.title}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h3 className="text-xl font-heading text-primary mb-2">
                  {method.title}
                </h3>
                <p className="text-neutral-mid mb-3 text-sm leading-relaxed">
                  {method.subtitle}
                </p>
                {method.note && (
                  <div className="bg-warm/20 text-warm p-2 rounded-lg mb-3 text-xs">
                    {method.note}
                  </div>
                )}
                <ul className="space-y-1 mb-4">
                  {method.benefits.map((benefit, i) => (
                    <li key={i} className="text-neutral-dark text-sm flex items-center">
                      <span className="text-secondary mr-2">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => scrollToSection(method.href)}
                  variant="secondary"
                  className="w-full bg-secondary hover:bg-primary text-white py-2 px-4 rounded-[10px] transition-all duration-200 hover:scale-105 text-sm"
                >
                  {method.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Requisito Ice Bath */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-warm/20 text-primary py-6 px-6 text-center rounded-lg">
            <p className="text-lg leading-relaxed">
              Para entrar al <strong>Ice Bath</strong> después de cualquier clase de Yoga debes completar primero 
              la sesión guiada del <strong>Método Wim Hof</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-neutral-light">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in">
                <div className="text-4xl md:text-5xl font-heading text-secondary mb-2">
                  {stat.number}
                </div>
                <div className="text-neutral-mid font-medium">
                  {stat.caption}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-6 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-heading text-primary mb-4">
            ¿Listo para vivir tu primera experiencia?
          </h2>
          <p className="text-neutral-mid mb-8 max-w-lg mx-auto leading-relaxed">
            Reserva ahora o explora nuestros planes para comenzar tu viaje en la Nave.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button
              onClick={() => scrollToSection('#planes')}
              className="bg-secondary hover:bg-primary text-white py-3 px-8 rounded-[10px] transition-all duration-200 hover:scale-105"
            >
              Ver planes
            </Button>
            <Button
              onClick={() => scrollToSection('#coaches')}
              variant="outline"
              className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white py-3 px-8 rounded-[10px] transition-all duration-200 hover:scale-105"
            >
              Conocer a los coaches
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Experiencias