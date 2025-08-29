import { Helmet } from "react-helmet-async";

const ClaseDePrueba = () => {
  return (
    <>
      <Helmet>
        <title>Clase de prueba — Nave Studio</title>
        <meta name="description" content="Agenda tu clase de prueba de Yoga o Respiración Wim Hof. Descubre la Nave y conoce al equipo." />
        <meta property="og:title" content="Clase de prueba — Nave Studio" />
        <meta property="og:description" content="Agenda tu clase de prueba de Yoga o Respiración Wim Hof. Descubre la Nave y conoce al equipo." />
        <meta property="og:image" content="/og/try-class.jpg" />
        <link rel="canonical" href="https://navestudio.cl/clase-de-prueba" />
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
      </main>
    </>
  );
};

export default ClaseDePrueba;