import kikaImage from "@/assets/kika-silva.jpg";
import panchoImage from "@/assets/pancho-saavedra.jpg";
import drNeiraImage from "@/assets/dr-neira.jpg";
import nicoImage from "@/assets/nico-jarry.jpg";
const wimHofLogo = "/lovable-uploads/4237a4a8-4b67-4133-9d1e-5a134df22d8c.png";
const yogaAllianceLogo = "/lovable-uploads/cdad4a3b-fb0e-4d9c-8089-e085dbc1c718.png";

export const SocialProofSection = () => {
  const testimonials = [{
    name: "Kika Silva",
    role: "Influencer de Wellness",
    quote: "Nave me recordó lo importante que es escuchar a mi cuerpo.",
    image: "/lovable-uploads/36038e1c-8f1a-4986-b800-057928669d24.png"
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
  }];

  return <section className="py-16 md:py-24 bg-neutral-light">
      <div className="container mx-auto px-6">
        {/* Hook métrico */}
        <div className="text-center mb-16">
          <h2 className="font-space-grotesk font-bold text-3xl md:text-4xl text-neutral-dark mb-4">
            +2,000 personas han regulado su sistema nervioso con nosotros
          </h2>
        </div>

        {/* Grid de testimonios - Desktop & Tablet */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
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

        {/* Testimonios Slider - Mobile */}
        <div className="md:hidden mb-16">
          <div className="flex overflow-x-auto gap-4 pb-4 px-4 -mx-4" style={{scrollSnapType: 'x mandatory'}}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex-none w-80 max-w-[calc(100vw-2rem)]" style={{scrollSnapAlign: 'center'}}>
                <div className="bg-background rounded-[var(--radius)] p-8 shadow-light text-center space-y-6">
                  <div className="mx-auto w-24 h-24 rounded-full overflow-hidden shadow-medium">
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
                </div>
              </div>
            ))}
          </div>
          {/* Mobile scroll indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, index) => (
              <div key={index} className="w-2 h-2 rounded-full bg-neutral-light"></div>
            ))}
          </div>
        </div>

        {/* Certificaciones */}
        <div className="text-center mb-16">
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-80">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center justify-center h-40">
                {cert.logo ? (
                  <img 
                    src={cert.logo} 
                    alt={cert.name} 
                    className="h-36 w-auto object-contain"
                  />
                ) : (
                  <span className="font-inter text-lg text-neutral-mid font-medium">
                    {cert.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Métricas de calidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="group relative text-center p-10 bg-gradient-to-br from-background via-background to-primary/5 rounded-[var(--radius)] shadow-light border border-primary/10 hover:shadow-medium hover:scale-105 transition-all duration-300 hover:border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-[var(--radius)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative space-y-3">
              <div className="font-space-grotesk font-bold text-5xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                9.8/10
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-primary to-primary/60 mx-auto rounded-full"></div>
              <p className="font-inter text-neutral-mid font-medium">
                promedio en 477 encuestas
              </p>
            </div>
          </div>
          
          <div className="group relative text-center p-10 bg-gradient-to-br from-background via-background to-secondary/5 rounded-[var(--radius)] shadow-light border border-secondary/10 hover:shadow-medium hover:scale-105 transition-all duration-300 hover:border-secondary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent rounded-[var(--radius)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative space-y-3">
              <div className="font-space-grotesk font-bold text-5xl bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent">
                97%
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-secondary to-secondary/60 mx-auto rounded-full"></div>
              <p className="font-inter text-neutral-mid font-medium">
                de los miembros reporta menos estrés en 30 días
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
