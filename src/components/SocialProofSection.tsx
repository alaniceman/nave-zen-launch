import { Star } from "lucide-react";
import { ReviewsTrustBar } from "@/components/ReviewsTrustBar";
const wimHofLogo = "/lovable-uploads/4237a4a8-4b67-4133-9d1e-5a134df22d8c.png";
const yogaAllianceLogo = "/lovable-uploads/cdad4a3b-fb0e-4d9c-8089-e085dbc1c718.png";
export const SocialProofSection = () => {
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

        <ReviewsTrustBar />

        {/* Certificaciones */}
        <div className="text-center mb-8 md:mb-16">
          <div className="flex flex-wrap justify-center items-center gap-16 md:gap-24 opacity-80">
            {certifications.map((cert, index) => <div key={index} className="flex items-center justify-center h-40">
                {cert.logo ? <img src={cert.logo} alt={cert.name} className="h-36 w-auto object-contain" loading="lazy" /> : <span className="font-inter text-lg text-neutral-mid font-medium">
                    {cert.name}
                  </span>}
              </div>)}
          </div>
        </div>

        {/* Métrica de reseñas */}
        <div className="max-w-md mx-auto">
          <div className="group relative text-center p-10 bg-gradient-to-br from-background via-background to-primary/5 rounded-[var(--radius)] shadow-light border border-primary/10 hover:shadow-medium hover:scale-105 transition-all duration-300 hover:border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-[var(--radius)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative space-y-3">
              <div className="font-space-grotesk font-bold text-5xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                5.0
              </div>
              <div className="flex items-center justify-center gap-1" aria-label="5 de 5 estrellas">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={20} className="fill-warm text-warm" strokeWidth={0} />
                ))}
              </div>
              <p className="font-inter text-neutral-mid font-medium">
                +200 reseñas reales
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};