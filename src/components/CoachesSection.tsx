import { Button } from "./ui/button";
import { OptimizedImage } from "@/components/OptimizedImage";

interface Coach {
  id: string;
  name: string;
  role: string;
  credentials: string;
  purpose: string;
  isFounder?: boolean;
  image: string;
}

const coaches: Coach[] = [
  {
    id: "alan",
    name: "Alan Iceman Earle",
    role: "Fundador – Crioguía de Inmersiones y Breathwork",
    credentials: "Instructor Certificado Método Wim Hof · Coach Ontológico · Ingeniero Civil PUC",
    purpose: "Ayudo a las personas a vivir con la certeza de que pueden lograr lo que se propongan, sin sacrificar su bienestar.",
    isFounder: true,
    image: "/lovable-uploads/d4e6319c-db70-4990-9f8d-ef7f76f87b6d.png"
  },
  {
    id: "maral",
    name: "Maral Hekmat",
    role: "Instructora de Yoga y Movimiento Consciente – Kinesióloga en formación",
    credentials: "Crioguía de Inmersiones, Power Yoga e Yoga Integral · Biomecánica & prevención de lesiones",
    purpose: "Guío prácticas que cultivan fuerza y flexibilidad sin perder el equilibrio interno.",
    image: "/lovable-uploads/16afe771-f09d-472a-bc9d-ae33af798cc9.png"
  },
  {
    id: "gaston",
    name: "Gastón Serrano Horton",
    role: "Coach de Hábitos Saludables y Movimiento Consciente",
    credentials: "Crioguía de Biohacking: Respiración + HIIT + Chi Kung + Agua Fría",
    purpose: "Impulso tu vitalidad con hábitos simples y poderosos, para que vivas en plena coherencia física, mental y emocional.",
    image: "/lovable-uploads/6dafbe55-50e1-4124-9e81-2e1c5ccfdc02.png"
  },
  {
    id: "sol",
    name: "Sol Evans",
    role: "Instructora de Ice Yoga · Reikista",
    credentials: "Crioguía de Inmersiones y Breathwork · Terapeuta Holística – Reiki Master",
    purpose: "Te acompaño a encontrar calma y fortaleza a través del frío, la respiración y la energía.",
    image: "/lovable-uploads/f65792e3-e19c-49b3-a7fc-ce59b6a20ed3.png"
  },
  {
    id: "mar",
    name: "Mar Carrasco",
    role: "Instructora de Vinyasa Yoga, Inside Flow y Danza",
    credentials: "Especialista en Conexión Movimiento–Respiración · Bailarina Profesional",
    purpose: "Guío secuencias fluidas que despiertan tu creatividad, presencia corporal y conexión interior, para habitarte con más amor, libertad y conciencia.",
    image: "/lovable-uploads/8e3c9f77-5221-40ea-91f2-0a59bd9fbbd0.png"
  },
  {
    id: "val",
    name: "Val Medina",
    role: "Instructora de Yin Yoga · Actriz",
    credentials: "Facilitadora de Meditación y Mindfulness · Exploradora del movimiento lento y la introspección",
    purpose: "Te invito a habitar tu cuerpo con suavidad y consciencia profunda.",
    image: "/lovable-uploads/56138f79-7a92-46b6-8fdf-8bff1ef72d26.png"
  },
  {
    id: "amber",
    name: "Ámbar Vidal",
    role: "Instructora de Yoga · Doula · Reikista",
    credentials: "Crioguía de Inmersiones y Yoga Integral · Facilitadora de Círculos Femeninos y Ceremonias de Cacao",
    purpose: "Te acompaño a transitar etapas de cambio con serenidad, cuerpo y corazón alineados.",
    image: "/lovable-uploads/1f80e046-a0e6-4b38-a2b1-73c27384f85a.png"
  }
];

export const CoachesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary font-space mb-6">
            Conoce al equipo que te acompañará
          </h2>
          <p className="text-xl text-neutral-mid font-inter max-w-3xl mx-auto">
            Expertos en frío, movimiento, mente y nutrición comprometidos con tu longevidad.
          </p>
        </div>

        {/* Coaches Grid - Desktop & Tablet */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} isMobile={false} />
          ))}
        </div>

        {/* Coaches Slider - Mobile */}
        <div className="sm:hidden mb-12">
          <div className="flex overflow-x-auto gap-4 pb-4 px-4 -mx-4" style={{scrollSnapType: 'x mandatory'}}>
            {coaches.map((coach, index) => (
              <div key={coach.id} className="flex-none w-80 max-w-[calc(100vw-2rem)]" style={{scrollSnapAlign: 'center'}}>
                <CoachCard coach={coach} isMobile={true} />
              </div>
            ))}
          </div>
          {/* Mobile scroll indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {coaches.map((_, index) => (
              <div key={index} className="w-2 h-2 rounded-full bg-neutral-light"></div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-neutral-mid font-inter">
            ¿No sabes con quién empezar?{" "}
            <a 
              href="https://wa.link/wh4f79" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary underline hover:text-primary font-medium transition-colors duration-300"
            >
              Agenda una llamada de descubrimiento gratuita →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

const CoachCard = ({ coach, isMobile = false }: { coach: Coach; isMobile?: boolean }) => {
  return (
    <div className="relative bg-card rounded-xl p-6 shadow-[0_4px_10px_rgba(0,0,0,0.08)] hover:scale-105 hover:shadow-lg transition-all duration-300">
      {/* Founder Badge */}
      {coach.isFounder && (
        <div className="absolute top-4 left-4 bg-warm text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide font-medium">
          Fundador
        </div>
      )}
      
      {/* Profile Image */}
      <div className="text-center mb-6">
        <div className={`${isMobile ? 'w-48 h-48' : 'w-40 h-40'} mx-auto mb-4 rounded-full overflow-hidden shadow-md`}>
          <OptimizedImage
            srcBase={coach.image.replace(/\.(jpg|jpeg|png|webp)$/i, '')}
            alt={`${coach.name} — ${coach.role.split(' –')[0]}`}
            width={320}
            height={320}
            sizes="(max-width: 640px) 192px, 160px"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Name */}
        <h3 className="text-xl font-bold text-primary font-space mb-2">
          {coach.name}
        </h3>
        
        {/* Role */}
        <h4 className="text-sm font-semibold text-neutral-dark font-inter mb-3">
          {coach.role}
        </h4>
        
        {/* Credentials */}
        <p className="text-xs text-neutral-mid font-inter mb-4 leading-relaxed">
          {coach.credentials}
        </p>
        
        {/* Purpose */}
        <p className="text-sm text-neutral-dark font-inter mb-6 italic leading-relaxed">
          "{coach.purpose}"
        </p>
      </div>
      
      {/* CTA Button */}
      <div className="text-center">
        <Button 
          variant="outline" 
          className="border-2 border-secondary text-secondary py-2 px-5 rounded-lg font-medium font-inter transition-all duration-300 hover:bg-secondary hover:text-white focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-opacity-50"
        >
          Reservar
        </Button>
      </div>
    </div>
  );
};