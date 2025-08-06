import kikaImage from "@/assets/kika-silva.jpg"
import panchoImage from "@/assets/pancho-saavedra.jpg"
import drNeiraImage from "@/assets/dr-neira.jpg"
import nicoImage from "@/assets/nico-jarry.jpg"

export const SocialProofSection = () => {
  const testimonials = [
    {
      name: "Kika Silva",
      role: "Influencer",
      quote: "Nave me recordó lo importante que es escuchar a mi cuerpo.",
      image: kikaImage
    },
    {
      name: "Pancho Saavedra",
      role: "TV Host",
      quote: "Creí que el hielo sería imposible; ahora lo recomiendo.",
      image: panchoImage
    },
    {
      name: "Dr. Rodolfo Neira",
      role: "Médico",
      quote: "Creo que todos deberían vivir esta experiencia.",
      image: drNeiraImage
    },
    {
      name: "Nico Jarry",
      role: "Tenista ATP",
      quote: "El frío acelera mi recuperación entre torneos.",
      image: nicoImage
    }
  ]

  const certifications = [
    "Wim Hof Instructor",
    "YogaAlliance",
    "IceYoga",
    "Animal Flow"
  ]

  return (
    <section className="py-16 md:py-24 bg-neutral-light">
      <div className="container mx-auto px-6">
        {/* Hook métrico */}
        <div className="text-center mb-16">
          <h2 className="font-space-grotesk font-bold text-3xl md:text-4xl text-neutral-dark mb-4">
            +2,000 personas han regulado su sistema nervioso con nosotros
          </h2>
        </div>

        {/* Grid de testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="mx-auto w-24 h-24 rounded-full overflow-hidden shadow-light">
                <img 
                  src={testimonial.image} 
                  alt={`${testimonial.name} - ${testimonial.role}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-inter font-medium text-lg text-neutral-dark">
                  {testimonial.name}
                </h3>
                <p className="font-inter text-sm text-neutral-mid mb-3">
                  {testimonial.role}
                </p>
                <blockquote className="font-inter text-sm text-neutral-dark italic">
                  "{testimonial.quote}"
                </blockquote>
              </div>
            </div>
          ))}
        </div>

        {/* Certificaciones */}
        <div className="text-center mb-16">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
            {certifications.map((cert, index) => (
              <div key={index} className="px-4 py-2">
                <span className="font-inter font-medium text-neutral-mid text-sm">
                  {cert}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Métricas de calidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-8 bg-background rounded-[var(--radius)] shadow-light">
            <div className="space-y-2">
              <div className="font-space-grotesk font-bold text-4xl text-primary">
                9.9/10
              </div>
              <p className="font-inter text-neutral-mid">
                promedio en 400 encuestas
              </p>
            </div>
          </div>
          
          <div className="text-center p-8 bg-background rounded-[var(--radius)] shadow-light">
            <div className="space-y-2">
              <div className="font-space-grotesk font-bold text-4xl text-primary">
                97%
              </div>
              <p className="font-inter text-neutral-mid">
                de los miembros reporta menos estrés en 30 días
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}