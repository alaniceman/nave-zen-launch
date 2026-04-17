import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { LocationGallerySection } from "@/components/LocationGallerySection";

const ConoceElLugar = () => {
  return (
    <>
      <Helmet>
        <title>Conoce el lugar | Nave Studio Las Condes</title>
        <meta
          name="description"
          content="Conoce Nave Studio en Antares 259, Las Condes. Galería del espacio, ubicación, horarios y contacto directo por WhatsApp."
        />
        <link rel="canonical" href="https://studiolanave.com/conoce-el-lugar" />
        <meta property="og:title" content="Conoce Nave Studio | Las Condes" />
        <meta
          property="og:description"
          content="Un espacio cálido y cuidado para Yoga, Ice Bath y Método Wim Hof en Las Condes."
        />
        <meta property="og:url" content="https://studiolanave.com/conoce-el-lugar" />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="min-h-screen">
        {/* Hero compacto */}
        <section className="bg-neutral-light py-14 md:py-20">
          <div className="container mx-auto px-6 max-w-4xl text-center animate-fade-in">
            <p className="font-inter text-sm uppercase tracking-[0.18em] text-warm mb-3">
              Agenda y horarios
            </p>
            <h1 className="font-heading text-4xl md:text-5xl text-primary mb-4">
              Conoce el lugar
            </h1>
            <p className="font-inter text-base md:text-lg text-neutral-mid max-w-2xl mx-auto leading-relaxed">
              Mira por dentro nuestro estudio en Las Condes y descubre cómo se siente
              entrar a Nave Studio antes de tu primera visita.
            </p>
          </div>
        </section>

        <LocationGallerySection />

        <Footer />
      </main>
    </>
  );
};

export default ConoceElLugar;
