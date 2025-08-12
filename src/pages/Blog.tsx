import { Footer } from "@/components/Footer";

const Blog = () => {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-primary mb-6">
              Blog: Ciencia del Bienestar
            </h1>
            <p className="text-lg md:text-xl text-neutral-mid mb-8 max-w-3xl mx-auto">
              Artículos con ciencia aplicada a Ice Bath, WHM y bienestar. Aprende y mejora tu energía con nuestras guías basadas en evidencia.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-8 shadow-light border border-border">
              <h2 className="text-2xl font-heading text-primary mb-4">
                Próximamente
              </h2>
              <p className="text-neutral-mid mb-6">
                Estamos preparando contenido de alta calidad sobre respiración consciente, 
                terapia de frío, yoga y optimización del rendimiento. 
              </p>
              <p className="text-sm text-neutral-mid">
                Mientras tanto, te invitamos a experimentar nuestras clases presenciales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-heading text-primary mb-4">
            ¿Listo para experimentar?
          </h2>
          <p className="text-neutral-mid mb-8 max-w-2xl mx-auto">
            No esperes más artículos. Ven y vive la experiencia completa en nuestro estudio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/planes-precios"
              className="inline-flex items-center justify-center px-8 py-3 bg-secondary hover:bg-primary text-white font-medium rounded-lg transition-colors"
            >
              Ver planes
            </a>
            <a
              href="/contacto"
              className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-white font-medium rounded-lg transition-colors"
            >
              Contactar
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Blog;