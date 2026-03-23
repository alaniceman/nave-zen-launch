import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { getCoachBySlug, BOOKABLE_SLUGS } from "@/data/coaches";
import { Award, Heart, MessageCircle, Calendar } from "lucide-react";

const InstructorProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const coach = slug ? getCoachBySlug(slug) : undefined;

  if (!coach) {
    return <Navigate to="/coaches" replace />;
  }

  const isBookable = BOOKABLE_SLUGS.includes(coach.slug);
  const bookingUrl = `/agenda-nave-studio/${coach.slug}`;
  const whatsappUrl = `https://wa.me/56946120426?text=Hola%21%20quiero%20reservar%20con%20${encodeURIComponent(coach.name)}%20en%20Nave%20Studio`;
  const ctaUrl = isBookable ? bookingUrl : whatsappUrl;
  const firstName = coach.name.split(" ")[0];

  return (
    <>
      <Helmet>
        <title>{coach.name} — Instructor en Nave Studio</title>
        <meta
          name="description"
          content={`Conoce a ${coach.name}, ${coach.role} en Nave Studio. ${coach.purpose}`}
        />
        <link rel="canonical" href={`https://studiolanave.com/instructor/${coach.slug}`} />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative bg-primary overflow-hidden">
          <div className="container mx-auto px-6 py-16 md:py-24">
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
              {/* Photo */}
              <div className="relative flex-shrink-0">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl ring-4 ring-secondary/30">
                  <img
                    src={coach.image}
                    alt={`${coach.name} — ${coach.role}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {coach.isFounder && (
                  <span className="absolute top-4 right-4 bg-warm text-white text-xs px-3 py-1 rounded-full uppercase tracking-wide font-medium shadow-md">
                    Fundador
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl md:text-5xl font-heading text-white mb-3">
                  {coach.name}
                </h1>
                <p className="text-lg md:text-xl text-white/80 font-medium mb-6">
                  {coach.role}
                </p>
                <p className="text-white/70 text-base mb-8 max-w-lg italic">
                  "{coach.purpose}"
                </p>

                {isBookable ? (
                  <Link to={ctaUrl}>
                    <Button className="bg-secondary hover:bg-secondary/90 text-white py-3 px-8 rounded-[10px] text-lg transition-all duration-200 hover:scale-105 gap-2">
                      <Calendar className="w-5 h-5" />
                      Agendar con {firstName}
                    </Button>
                  </Link>
                ) : (
                  <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-secondary hover:bg-secondary/90 text-white py-3 px-8 rounded-[10px] text-lg transition-all duration-200 hover:scale-105 gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Reservar con {firstName}
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Bio */}
        <section className="py-16 px-6">
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-secondary" />
              <h2 className="text-2xl md:text-3xl font-heading text-primary">
                Sobre {firstName}
              </h2>
            </div>
            <p className="text-neutral-dark text-lg leading-relaxed mb-8">
              {coach.bio}
            </p>
          </div>
        </section>

        {/* Credentials */}
        <section className="py-16 px-6 bg-muted/50">
          <div className="container mx-auto max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-6 h-6 text-secondary" />
              <h2 className="text-2xl md:text-3xl font-heading text-primary">
                Certificaciones y formación
              </h2>
            </div>
            <div className="grid gap-4">
              {coach.credentials.split(" · ").map((cred, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-background rounded-lg p-4 shadow-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0" />
                  <span className="text-neutral-dark">{cred}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery placeholder */}
        {coach.galleryImages.length > 0 && (
          <section className="py-16 px-6">
            <div className="container mx-auto max-w-5xl">
              <h2 className="text-2xl md:text-3xl font-heading text-primary mb-8 text-center">
                {firstName} en acción
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {coach.galleryImages.map((img, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden shadow-md">
                    <img
                      src={img}
                      alt={`${coach.name} en acción ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="py-16 px-6 bg-primary text-center">
          <div className="container mx-auto max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-heading text-white mb-4">
              ¿Listo para entrenar con {firstName}?
            </h2>
            <p className="text-white/70 mb-8 text-lg">
              Reserva tu sesión y vive la experiencia Nave Studio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isBookable ? (
                <Link to={ctaUrl}>
                  <Button className="bg-secondary hover:bg-secondary/90 text-white py-3 px-8 rounded-[10px] text-lg transition-all duration-200 hover:scale-105 gap-2">
                    <Calendar className="w-5 h-5" />
                    Agendar con {firstName}
                  </Button>
                </Link>
              ) : (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-secondary hover:bg-secondary/90 text-white py-3 px-8 rounded-[10px] text-lg transition-all duration-200 hover:scale-105 gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Reservar por WhatsApp
                  </Button>
                </a>
              )}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-2 border-white text-white bg-transparent hover:bg-white/10 py-3 px-8 rounded-[10px] text-lg transition-all duration-200 gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Consultar por WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default InstructorProfile;
