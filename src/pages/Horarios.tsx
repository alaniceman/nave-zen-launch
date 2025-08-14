import { Helmet } from "react-helmet-async";
import { Calendar } from "lucide-react";
import { Footer } from "../components/Footer";
import { OpenTrialModalButton } from "../components/OpenTrialModalButton";
import ScheduleDayCards from "../components/ScheduleDayCards";
import { getTodayInSantiago } from "../data/schedule";

export default function Horarios() {
  const scrollToSchedule = () => {
    const element = document.getElementById('horarios');
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
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-20 pb-8 px-4 text-center bg-gradient-to-br from-background to-muted/30">
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

        {/* Schedule Day Cards */}
        <ScheduleDayCards />

        {/* Important Notices */}
        <section className="py-12 px-4 bg-[#C49A6C1F] border-t">
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#C49A6C]/10 border border-[#C49A6C]/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#2E4D3A] mb-4 flex items-center gap-2">
                Avisos importantes
              </h3>
              <div className="space-y-3 text-[#2E4D3A]">
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