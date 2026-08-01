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
        <section className="bg-background pt-24 pb-4 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-heading text-3xl md:text-5xl text-primary mb-4">
              Conoce Nave Studio en Las Condes
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Un espacio cálido y cuidado en Antares 259 para Yoga, Ice Bath y Método Wim Hof.
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
