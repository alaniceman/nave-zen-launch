import { Button } from "@/components/ui/button"
import heroYoga from "@/assets/nave-studio-hero.jpg"

export const PricingTrialYogaSection = () => {
  return (
    <section id="trial-yoga-pricing" className="py-16 md:py-20 bg-background animate-fade-in">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 items-center">
          {/* Text content */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl text-primary mb-4 font-space font-bold">
              Clase de prueba de Yoga — <span className="text-accent">GRATIS</span>
            </h2>
            <p className="text-neutral-mid mb-6 md:mb-8 max-w-prose font-inter">
              Vive una sesión de Yoga (Yin, Yang o Integral) para conocer la Nave, a tu profe y la energía del espacio.
            </p>

            <ul className="space-y-3 mb-6 md:mb-8">
              <li className="text-neutral-dark flex items-start font-inter">
                <span className="w-2 h-2 rounded-full bg-accent mr-3 mt-2" />
                Duración 60 min · nivel principiante bienvenido
              </li>
            </ul>

            <div className="bg-warm/15 text-primary rounded-[10px] p-4 mb-6 md:mb-8 border border-warm/30">
              <p className="font-inter text-sm">
                Para ingresar al hielo después de Yoga debes haber realizado <strong>una sesión guiada del Método Wim Hof</strong> (breathwork + ice bath).
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <a
                href="#"
                data-open-trial="true"
                className="w-full sm:w-auto bg-accent hover:bg-primary text-white rounded-[10px] px-6 py-3 font-medium transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-dashed focus-visible:outline-accent font-inter inline-flex items-center justify-center"
                aria-label="Agendar clase de prueba"
              >
                Agendar clase de prueba
              </a>
              
              <div className="flex flex-col sm:flex-row gap-4 text-sm">
                <a
                  href="/horarios"
                  className="text-accent underline-offset-4 hover:underline hover:text-primary transition-colors font-inter"
                >
                  Ver horarios de Yoga →
                </a>
                <a
                  href="/blog/metodo-wim-hof-respiracion-frio-mente"
                  className="text-accent underline-offset-4 hover:underline hover:text-primary transition-colors font-inter"
                >
                  ¿Aún no haces Wim Hof? Conócelo aquí →
                </a>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={heroYoga}
                alt="Sala de Yoga de Nave Studio"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingTrialYogaSection