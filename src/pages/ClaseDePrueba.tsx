import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

const ClaseDePrueba = () => {
  useEffect(() => {
    const el = document.querySelector('#trial-embed iframe[src="https://boxmagic.cl/sp/NaveStudio"]') as HTMLIFrameElement;
    if (!el) return;
    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    const isTablet = window.matchMedia('(max-width: 1024px)').matches;
    el.style.height = isMobile ? '90vh' : (isTablet ? '1100px' : '1200px');
  }, []);

  return (
    <>
      <Helmet>
        <title>Clase de prueba — Nave Studio</title>
        <meta name="description" content="Agenda tu clase de prueba de Yoga o Respiración Wim Hof. Descubre la Nave y conoce al equipo." />
        <meta property="og:title" content="Clase de prueba — Nave Studio" />
        <meta property="og:description" content="Agenda tu clase de prueba de Yoga o Respiración Wim Hof. Descubre la Nave y conoce al equipo." />
        <meta property="og:image" content="/og/try-class.jpg" />
        <link rel="canonical" href="https://navestudio.cl/clase-de-prueba" />
        <style>{`
          /* Contenedor flexible para permitir alturas mayores */
          #trial-embed .iframe-shell { min-height: 1000px; }

          /* Override del alto del iframe por selector de atributo */
          #trial-embed iframe[src="https://boxmagic.cl/sp/NaveStudio"] {
            height: 1200px !important;
          }

          /* Tablet */
          @media (max-width: 1024px) {
            #trial-embed .iframe-shell { min-height: 1000px; }
            #trial-embed iframe[src="https://boxmagic.cl/sp/NaveStudio"] { height: 1100px !important; }
          }

          /* Móvil: alto adaptativo a la pantalla */
          @media (max-width: 640px) {
            #trial-embed .iframe-shell { min-height: 90vh; }
            #trial-embed iframe[src="https://boxmagic.cl/sp/NaveStudio"] { height: 90vh !important; }
          }
        `}</style>
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-10 md:py-12 text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-forest">Clase de prueba</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Elige <strong>Yoga</strong> (Yin · Yang · Integral) o <strong>Respiración Wim Hof</strong> para conocer la Nave y a tu instructor/a.
          </p>
          <div className="mt-4 text-xs text-forest max-w-2xl mx-auto bg-warm/10 rounded-lg p-3">
            <p><strong>Importante:</strong> Las clases de prueba <u>no incluyen</u> sesiones del <strong>Método Wim Hof</strong>.</p>
            <p className="mt-1">El <strong>Ice Bath es opcional</strong> después de Yoga, y solo si ya completaste previamente una sesión guiada del <strong>Método Wim Hof</strong>.</p>
          </div>
        </section>

        {/* Iframe Section */}
        <section className="px-4 md:px-6 pb-10">
          <div id="trial-embed" className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-sm bg-white p-0">
            <div className="iframe-shell">
              <iframe 
                src="https://boxmagic.cl/sp/NaveStudio" 
                width="100%" 
                height="900px" 
                frameBorder="0" 
                scrolling="yes" 
                allow="fullscreen"
                title="Formulario clase de prueba — Nave Studio"
              >
                Cargando Información...
              </iframe>
            </div>
          </div>

          {/* Fallback + soporte */}
          <div className="max-w-5xl mx-auto mt-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <a 
              href="https://boxmagic.cl/sp/NaveStudio" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-teal underline hover:text-forest transition-colors"
            >
              Si no ves el formulario, ábrelo aquí →
            </a>
            <a 
              href="https://wa.me/56946120426?text=Hola%21%20quiero%20agendar%20una%20clase%20de%20prueba%20en%20Nave%20Studio"
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block bg-teal text-white font-medium py-2.5 px-5 rounded-lg hover:bg-forest transition-colors"
              aria-label="Agendar clase de prueba por WhatsApp"
            >
              ¿Dudas? Escríbenos por WhatsApp
            </a>
          </div>
        </section>

        {/* Links útiles */}
        <section className="py-6 px-4 md:px-6">
          <div className="max-w-5xl mx-auto grid gap-3 sm:grid-cols-3">
            <a 
              href="/horarios#hoy" 
              className="rounded-xl border border-border p-4 hover:shadow-md transition-shadow bg-card"
            >
              <h4 className="font-semibold text-forest">Ver horarios</h4>
              <p className="text-sm text-muted-foreground mt-1">Revisa las próximas actividades.</p>
            </a>
            <a 
              href="/planes-precios" 
              className="rounded-xl border border-border p-4 hover:shadow-md transition-shadow bg-card"
            >
              <h4 className="font-semibold text-forest">Planes & precios</h4>
              <p className="text-sm text-muted-foreground mt-1">Sesiones sueltas y membresías.</p>
            </a>
            <a 
              href="/experiencias" 
              className="rounded-xl border border-border p-4 hover:shadow-md transition-shadow bg-card"
            >
              <h4 className="font-semibold text-forest">Explorar experiencias</h4>
              <p className="text-sm text-muted-foreground mt-1">Wim Hof, Yoga, Breathwork, Biohacking.</p>
            </a>
          </div>
        </section>
      </main>
    </>
  );
};

export default ClaseDePrueba;