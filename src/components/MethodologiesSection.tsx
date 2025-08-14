import { Waves, Wind, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MethodologiesSection = () => {
  const methodologies = [
    {
      icon: Waves,
      title: "Ice Bath",
      description: "Inmersión guiada a 3 °C que despierta los 100.000 km de tu sistema vascular, libera endorfinas naturales y reinicia tu sistema nervioso.",
      benefits: "Beneficios primeros 180 seg",
      benefitsList: [
        "Potente efecto anti-inflamatorio",
        "Recuperación muscular acelerada gracias al aumento del flujo sanguíneo",
        "Aumento de energía y enfoque al activar opioides y cannabinoides endógenos",
        "Refuerzo del sistema inmune y equilibrio simpático-parasimpático"
      ],
      ctaText: "Reservar Ice Bath"
    },
    {
      icon: Wind,
      title: "Breathwork Wim Hof",
      description: "30-40 respiraciones profundas con retención que oxigenan cada célula, elevan tu pH a alcalino y activan el sistema nervioso parasimpático para devolverte calma y energía en minutos.",
      benefits: "Beneficios primeros 11 min",
      benefitsList: [
        "Disuelve el estrés y te lleva al modo \"reposo-y-digestión\"",
        "Mejora la concentración y la claridad mental al aumentar la perfusión cerebral",
        "Alcaliniza la sangre y neutraliza la acidez metabólica",
        "Libera la ansiedad al regular hormonas y bioquímica cerebral"
      ],
      ctaText: "Aprender Técnica"
    },
    {
      icon: Heart,
      title: "Yoga Integral",
      description: "Flujo consciente que une posturas, respiración y mindfulness para alinear cuerpo-mente y devolverte ligereza física y claridad mental en una sola sesión",
      benefits: "Qué notarás en los primeros 20 min",
      benefitsList: [
        "Mejora flexibilidad y equilibrio corporal en pocas semanas",
        "Disminuye estrés y tensión al reducir los niveles de cortisol",
        "Equilibra emociones al aumentar el tono vagal y la autorregulación",
        "Fortalece el core y la estabilidad postural mediante asanas específicas"
      ],
      ctaText: "Unirse a Clase"
    },
    {
      icon: Zap,
      title: "Biohacking Session",
      description: "Breathwork · HIIT · Ice Bath en ese orden\nProtocolo triple que alterna sprints metabólicos, 3 rondas de respiración Wim Hof y un plunge a 3 °C. El combo dispara tu dopamina y noradrenalina, estimula la biogénesis mitocondrial y deja tu cuerpo en \"modo super-recuperación\".",
      benefits: "Qué sucede en 45 min",
      benefitsList: [
        "+10 % VO₂ max y capacidad cardiovascular en 4 semanas",
        "Triplica dopamina/noradrenalina → foco y motivación instantáneos",
        "Activa genes de mitocondrias y quema grasa incluso en reposo",
        "Acelera recuperación muscular y reduce inflamación post-entreno"
      ],
      ctaText: "Agendar Sesión"
    }
  ];

  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <h2 className="font-space-grotesk font-bold text-3xl md:text-4xl text-neutral-dark">
            Nuestras metodologías basadas en ciencia
          </h2>
          <p className="font-inter text-lg text-neutral-mid max-w-prose mx-auto leading-relaxed">
            Combinamos técnicas milenarias con investigación moderna para crear experiencias transformadoras 
            que regulan tu sistema nervioso y optimizan tu bienestar integral.
          </p>
        </div>

        {/* Methodologies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          {methodologies.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <div 
                key={index} 
                className="group relative bg-gradient-to-br from-neutral-light via-neutral-light to-primary/5 rounded-[var(--radius)] p-4 md:p-6 text-center animate-fade-in transition-all duration-300 shadow-light hover:shadow-medium hover:scale-105 flex flex-col min-h-[380px] md:min-h-[400px] border border-primary/10 hover:border-primary/20 mx-auto max-w-sm md:max-w-none"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-[var(--radius)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <IconComponent className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                  </div>

                  {/* Title */}
                  <h3 className="font-space-grotesk font-semibold text-lg md:text-xl text-primary mb-4 md:mb-6 group-hover:text-primary/90 transition-colors duration-300">
                    {method.title}
                  </h3>

                  {/* Description */}
                  <p className="font-inter text-xs md:text-sm text-neutral-mid leading-relaxed mb-6 md:mb-8 whitespace-pre-line px-2 md:px-0">
                    {method.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 flex-grow">
                    <div className="relative">
                      <h4 className="font-inter font-medium text-warm text-xs md:text-sm bg-warm/10 px-2 md:px-3 py-1.5 md:py-2 rounded-lg border border-warm/20">
                        {method.benefits}
                      </h4>
                    </div>
                    <ul className="text-left space-y-2 md:space-y-3 bg-background/50 p-3 md:p-4 rounded-lg border border-primary/10">
                      {method.benefitsList.map((benefit, idx) => (
                        <li key={idx} className="font-inter text-xs text-neutral-dark flex items-start">
                          <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-primary to-primary/60 rounded-full mr-2 md:mr-3 flex-shrink-0 mt-1.5 shadow-sm"></span>
                          <span className="leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Section CTA */}
        <div className="text-center">
          <p className="font-inter text-lg text-neutral-mid">
            ¿Listo para transformar tu bienestar? {" "}
            <a 
              href="https://wa.link/wh4f79" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium hover:text-primary/80 transition-colors duration-200 underline underline-offset-4"
            >
              Agenda tu llamada de descubrimiento gratuita
            </a>
          </p>
        </div>
      </div>

    </section>
  );
};