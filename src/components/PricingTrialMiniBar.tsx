import { Link } from "react-router-dom"

export const PricingTrialMiniBar = () => {
  return (
    <aside aria-label="Aviso: clase de prueba de Yoga gratuita" className="w-full bg-neutral-light animate-fade-in">
      <div className="container mx-auto px-6">
        <div className="h-12 md:h-14 flex items-center justify-center text-center">
          <p className="text-primary text-sm md:text-base">
            ¿Primera vez en la Nave? Clase de prueba <strong className="text-accent font-semibold">GRATIS</strong> de Yoga (Yin · Yang · Integral).{" "}
            <Link 
              to="#trial-yoga-pricing" 
              className="ml-2 inline-flex items-center text-accent hover:text-primary underline-offset-4 hover:underline transition-colors"
            >
              Agendar ahora →
            </Link>
          </p>
        </div>
      </div>
    </aside>
  )
}

export default PricingTrialMiniBar