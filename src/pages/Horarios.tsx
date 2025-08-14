import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Calendar } from "lucide-react";
import { Footer } from "../components/Footer";
import { OpenTrialModalButton } from "../components/OpenTrialModalButton";
import ScheduleDayCards from "../components/ScheduleDayCards";

const filters = [
  "Todos",
  "Método Wim Hof",
  "Yoga",
  "Breathwork & Meditación",
  "Biohacking",
  "Personalizado"
];

export default function Horarios() {
  const [activeFilters, setActiveFilters] = useState<string[]>(["Todos"]);

  const toggleFilter = (filter: string) => {
    if (filter === "Todos") {
      setActiveFilters(["Todos"]);
    } else {
      const newFilters = activeFilters.includes(filter)
        ? activeFilters.filter(f => f !== filter)
        : [...activeFilters.filter(f => f !== "Todos"), filter];
      
      if (newFilters.length === 0) {
        setActiveFilters(["Todos"]);
      } else {
        setActiveFilters(newFilters);
      }
    }
  };

  const scrollToSchedule = () => {
    const element = document.getElementById('horarios-cards');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Horarios - Nave Studio</title>
        <meta name="description" content="Horarios de clases de Método Wim Hof, Yoga, Breathwork y Biohacking. Programa tu semana y vive nuestras experiencias en Nave Studio." />
        <meta property="og:title" content="Horarios - Nave Studio" />
        <meta property="og:description" content="Horarios de clases de Método Wim Hof, Yoga, Breathwork y Biohacking. Programa tu semana y vive nuestras experiencias en Nave Studio." />
        <link rel="canonical" href="https://studiolanave.com/horarios" />
        <style>{`
          :root {
            --header-h: 56px;
            --daybar-h: 48px;
          }
          html {
            scroll-padding-top: calc(var(--header-h) + var(--daybar-h) + 8px);
          }
        `}</style>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center bg-gradient-to-br from-background to-muted/30">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Horarios de Nave Studio
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Programa tu semana y vive nuestras experiencias.
            </p>
            <button
              onClick={scrollToSchedule}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Ver el día de hoy
            </button>
          </div>
        </section>

        {/* Filters */}
        <section className="py-4 md:py-8 px-4 border-b">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all h-9 ${
                    activeFilters.includes(filter)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Schedule Day Cards */}
        <ScheduleDayCards activeFilters={activeFilters} />

        {/* Important Notices */}
        <section className="py-12 px-4 bg-[#C49A6C1F] border-t">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#C49A6C1F] border border-[#C49A6C] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Avisos importantes
              </h3>
              <div className="space-y-3 text-foreground">
                <p>
                  <strong>Clase de prueba:</strong> Yoga (Yin · Yang · Integral) o Respiración Wim Hof.
                </p>
                <p>
                  Las clases de prueba no incluyen sesiones del <strong>Método Wim Hof</strong>. Para ingresar al Ice Bath después de Yoga debes haber realizado una sesión guiada del <strong>Método Wim Hof</strong> (breathwork + ice bath).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cross CTAs */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-8 text-foreground">
              ¿Listo para comenzar tu experiencia?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/planes-precios"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Ver planes y precios
              </a>
              <a
                href="/coaches"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-8 py-4 rounded-lg hover:bg-primary/10 transition-colors font-medium"
              >
                Conocer a los coaches
              </a>
              <OpenTrialModalButton className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors font-medium">
                Agendar clase de prueba (Yoga)
              </OpenTrialModalButton>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
}