

export const PricingTrialMiniBar = () => {
  return (
    <aside aria-label="Aviso: clase de prueba de Yoga gratuita" className="w-full bg-card animate-fade-in mt-6 md:mt-8 mb-6 md:mb-8">
      <div className="container mx-auto px-6">
        <div className="h-12 md:h-14 flex items-center justify-center text-center">
          <p className="text-primary text-sm md:text-base">
            ¿Primera vez en la Nave? Clase de prueba <strong className="text-accent font-semibold">GRATIS</strong> de Yoga (Yin · Yang · Integral).{" "}
            <a 
              href="#" 
              data-open-trial="true"
              className="ml-2 inline-flex items-center text-accent hover:text-primary underline-offset-4 hover:underline transition-colors"
            >
              Agendar ahora →
            </a>
          </p>
        </div>
      </div>
    </aside>
  )
}

export default PricingTrialMiniBar