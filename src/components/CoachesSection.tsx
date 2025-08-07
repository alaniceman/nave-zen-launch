import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Coach {
  name: string;
  role: string;
  description: string;
  image: string;
  badge?: string;
}

const coaches: Coach[] = [
  {
    name: "Alan Iceman",
    role: "Coach Ontológico & Instructor Wim Hof",
    description: "+114 k seguidores; criocoaching y mindset para resultados medibles.",
    image: "/lovable-uploads/4237a4a8-4b67-4133-9d1e-5a134df22d8c.png",
    badge: "Fundador"
  },
  {
    name: "Gastón Serrano",
    role: "Coach de Alimentación Funcional",
    description: "Planes nutricionales que potencian hormesis y rendimiento.",
    image: "/lovable-uploads/b0ce44f8-4dbd-4c17-87ad-1026f3a0b43d.png"
  },
  {
    name: "Valentina (Vale)",
    role: "Psicóloga Clínica",
    description: "Terapia cognitivo-conductual para resiliencia emocional.",
    image: "/lovable-uploads/2d68d2b6-677d-403e-ae7f-60367ea2147c.png"
  },
  {
    name: "Maral Hekmat",
    role: "FisioYoga & IceBath Guide",
    description: "Yoga terapéutico y exposición al frío segura.",
    image: "/lovable-uploads/923c01f2-ceec-42a1-8418-1da57f72fb81.png"
  },
  {
    name: "Sol Evans",
    role: "Reiki & Criomedicina",
    description: "Energía y recuperación guiada en la Nave.",
    image: "/lovable-uploads/b0ce44f8-4dbd-4c17-87ad-1026f3a0b43d.png"
  }
];

export const CoachesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading text-primary mb-6">
            Conoce al equipo que te acompañará
          </h2>
          <p className="text-lg text-neutral-mid max-w-2xl mx-auto">
            Expertos en frío, movimiento, mente y nutrición comprometidos con tu longevidad.
          </p>
        </div>

        {/* Coaches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {coaches.map((coach, index) => (
            <Card 
              key={index}
              className="relative group bg-white border-0 shadow-light hover:shadow-lg transition-all duration-300 hover:scale-[1.03] rounded-lg overflow-hidden"
            >
              {/* Badge */}
              {coach.badge && (
                <div className="absolute top-4 left-4 z-10 bg-warm text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide font-medium">
                  {coach.badge}
                </div>
              )}
              
              <CardContent className="p-8 text-center">
                {/* Profile Image */}
                <div className="mb-6">
                  <img
                    src={coach.image}
                    alt={`${coach.name} – ${coach.role.split('&')[0].trim()}`}
                    className="w-30 h-30 rounded-full mx-auto object-cover shadow-light"
                  />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-heading text-primary">
                    {coach.name}
                  </h3>
                  
                  <p className="text-sm font-medium text-secondary uppercase tracking-wide">
                    {coach.role}
                  </p>
                  
                  <p className="text-neutral-mid text-sm leading-relaxed">
                    {coach.description}
                  </p>
                  
                  <Button 
                    variant="outline"
                    className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded-lg py-2 px-5"
                  >
                    Reservar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-lg text-neutral-mid">
            ¿No sabes con quién empezar?{" "}
            <a 
              href="#contacto" 
              className="text-secondary underline hover:text-primary font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 rounded"
            >
              Agenda una llamada de descubrimiento gratuita →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};