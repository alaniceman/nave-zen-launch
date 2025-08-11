import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import heroYoga from "@/assets/nave-studio-hero.jpg"

export const TrialYogaSection = () => {
  return (
    <section id="trial-yoga" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Text content */}
          <div className="order-2 lg:order-1 animate-fade-in">
            <h2 className="text-3xl md:text-4xl text-primary mb-4">
              Clase de prueba de Yoga — <span className="text-accent">GRATIS</span>
            </h2>
            <p className="text-neutral-mid mb-6 md:mb-8 max-w-prose">
              Vive una sesión de Yoga (Yin, Yang o Integral) para conocer la Nave, a tu profesor/a y la energía del espacio.
            </p>

            <ul className="space-y-3 mb-4 md:mb-6">
              <li className="text-neutral-dark flex items-start">
                <span className="w-2 h-2 rounded-full bg-accent mr-3 mt-2" />
                Duración: 60 minutos · nivel principiante bienvenido
              </li>
            </ul>
            <p className="text-neutral-dark mb-6 md:mb-8">
              <strong>Ice Bath opcional</strong> al finalizar solo si ya completaste el Método Wim Hof.
            </p>

            <div className="bg-warm/20 text-primary rounded-[10px] p-4 mb-6 md:mb-8 border border-warm/30">
              Para ingresar al hielo después de Yoga debes haber realizado <strong>una sesión guiada del Método Wim Hof</strong> (breathwork + ice bath).
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
              <Button
                asChild
                className="w-full sm:w-auto bg-accent hover:bg-primary text-white rounded-[10px] px-6 py-3 font-medium transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Agendar clase de prueba por WhatsApp"
              >
                <a href="https://wa.me/56985273088" target="_blank" rel="noopener noreferrer">
                  Agendar clase de prueba
                </a>
              </Button>
              <a
                href="/#planes"
                className="text-accent underline-offset-4 hover:underline hover:text-primary transition-colors"
              >
                Ver planes de membresía →
              </a>
            </div>

            <div className="mt-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">¿La clase de prueba es gratuita?</AccordionTrigger>
                  <AccordionContent>
                    Sí, solo para Yoga (Yin, Yang o Integral).
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">¿Incluye Ice Bath?</AccordionTrigger>
                  <AccordionContent>
                    El Ice Bath es opcional y solo si ya completaste el Método Wim Hof.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">¿Qué llevo?</AccordionTrigger>
                  <AccordionContent>
                    Ropa cómoda y botella de agua. Mat disponible en el estudio.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Image / gallery */}
          <div className="order-1 lg:order-2 animate-fade-in">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={heroYoga}
                alt="Sala de Yoga de Nave Studio"
                className="w-full aspect-[4/3] object-cover"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrialYogaSection
