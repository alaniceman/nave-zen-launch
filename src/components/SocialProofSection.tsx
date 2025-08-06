import kikaImage from "@/assets/kika-silva.jpg";
import panchoImage from "@/assets/pancho-saavedra.jpg";
import drNeiraImage from "@/assets/dr-neira.jpg";
import nicoImage from "@/assets/nico-jarry.jpg";
const wimHofLogo = "/lovable-uploads/4237a4a8-4b67-4133-9d1e-5a134df22d8c.png";
import yogaAllianceLogo from "@/assets/yogaalliance-logo.png";
export const SocialProofSection = () => {
  const testimonials = [{
    name: "Kika Silva",
    role: "Influencer de Wellness",
    quote: "Nave me recordó lo importante que es escuchar a mi cuerpo.",
    image: kikaImage
  }, {
    name: "Pancho Saavedra",
    role: "Conductor de TV",
    quote: "Creí que el hielo sería imposible; ahora lo recomiendo.",
    image: panchoImage
  }, {
    name: "Dr. Rodolfo Neira",
    role: "Médico Metabólico - Cancer",
    quote: "Creo que todos deberían vivir esta experiencia.",
    image: drNeiraImage
  }, {
    name: "Nico Jarry",
    role: "Tenista ATP",
    quote: "El frío acelera mi recuperación entre torneos.",
    image: nicoImage
  }];
  const certifications = [{
    name: "Wim Hof Instructor",
    logo: wimHofLogo
  }, {
    name: "YogaAlliance",
    logo: yogaAllianceLogo
  }, {
    name: "IceYoga",
    logo: null
  }, {
    name: "Animal Flow",
    logo: null
  }];
  return <section className="py-16 md:py-24 bg-neutral-light">
      <div className="container mx-auto px-6">
        {/* Hook métrico */}
        <div className="text-center mb-16">
          <h2 className="font-space-grotesk font-bold text-3xl md:text-4xl text-neutral-dark mb-4">
            +2,000 personas han regulado su sistema nervioso con nosotros
          </h2>
        </div>

        {/* Grid de testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {testimonials.map((testimonial, index) => <div key={index} className="bg-background rounded-[var(--radius)] p-8 shadow-light text-center space-y-6">
              <div className="mx-auto w-32 h-32 rounded-full overflow-hidden shadow-medium">
                <img src={testimonial.image} alt={`${testimonial.name} - ${testimonial.role}`} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2">
                <h3 className="font-space-grotesk font-bold text-xl text-neutral-dark">
                  {testimonial.name}
                </h3>
                <p className="font-inter text-base text-neutral-mid">
                  {testimonial.role}
                </p>
              </div>
              <blockquote className="font-inter text-base text-neutral-dark italic leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
            </div>)}
        </div>

        {/* Certificaciones */}
        <div className="text-center mb-16">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-center h-16">
                {cert.logo ? (
                  <img 
                    src={cert.logo} 
                    alt={cert.name} 
                    className="h-12 w-auto object-contain"
                  />
                ) : (
                  <span className="font-inter text-sm text-neutral-mid font-medium">
                    {cert.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Métricas de calidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-8 bg-background rounded-[var(--radius)] shadow-light">
            <div className="space-y-2">
              <div className="font-space-grotesk font-bold text-4xl text-primary">9.8/10</div>
              <p className="font-inter text-neutral-mid">promedio en 477 encuestas</p>
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
    </section>;
};