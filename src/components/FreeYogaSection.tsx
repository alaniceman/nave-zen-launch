import { Button } from "@/components/ui/button"

const FreeYogaSection = () => {
  return (
    <section className="py-20 bg-neutral-50 text-center">
      <div className="container mx-auto px-6">
        <h2 className="text-primary text-3xl font-bold mb-4 font-space-grotesk">
          ¿Te gustaría conocer la Nave y empezar con una clase{" "}
          <span className="text-accent">gratuita</span> de Yoga?
        </h2>
        <p className="max-w-xl mx-auto text-muted-foreground mb-8 font-inter">
          Vive la energía del estudio, respira profundo y prueba nuestras prácticas sin costo.
        </p>
        <Button 
          asChild
          className="bg-accent text-white font-medium py-3 px-8 rounded-lg hover:bg-primary transition-colors duration-300 font-inter"
        >
          <a href="#reserva-gratis">
            Agenda tu clase de prueba
          </a>
        </Button>
      </div>
    </section>
  )
}

export { FreeYogaSection }