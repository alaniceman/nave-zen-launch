import { Button } from "@/components/ui/button"

const FreeYogaSection = () => {
  return (
    <section className="py-20 bg-neutral-50 text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-primary text-3xl font-bold mb-4 font-space-grotesk">
          ¿Quieres vivir Nave Studio con{" "}
          <span className="text-accent">acceso ilimitado</span>?
        </h2>
        <p className="max-w-xl mx-auto text-muted-foreground mb-8 font-inter">
          Activa tu Plan de Prueba de 7 o 15 días: Yoga, Breathwork, Criomedicina y Método Wim Hof — ilimitado. Tú eliges la fecha de inicio.
        </p>
        <Button
          asChild
          className="bg-accent text-white font-medium py-3 px-8 rounded-lg hover:bg-primary transition-colors duration-300 font-inter"
        >
          <a href="/plan-de-prueba">
            Ver planes de prueba
          </a>
        </Button>
        <p className="text-xs text-muted-foreground mt-4 font-inter">
          Desde $9.900 · 7 días · acceso a todas las experiencias
        </p>
      </div>
    </section>
  )
}

export { FreeYogaSection }
