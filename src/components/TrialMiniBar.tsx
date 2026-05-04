import { Link } from "react-router-dom"

export const TrialMiniBar = () => {
  return (
    <aside aria-label="Aviso: Plan de prueba Nave Studio" className="w-full bg-neutral-light">
      <div className="container mx-auto px-6">
        <div className="h-12 md:h-14 flex items-center justify-center text-center animate-fade-in">
          <p className="text-primary text-sm md:text-base transform translate-y-1 md:translate-y-0">
            ¿Primera vez en la Nave? Plan de prueba desde <strong className="text-accent font-semibold">$9.900</strong> (7 o 15 días).{" "}
            <Link 
              to="/plan-de-prueba" 
              className="ml-2 inline-flex items-center text-accent hover:text-primary underline-offset-4 hover:underline transition-colors"
            >
              Ver planes →
            </Link>
          </p>
        </div>
      </div>
    </aside>
  )
}

export default TrialMiniBar
