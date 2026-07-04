import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/blog-protocolo-15-minutos-hero.jpg";

const BlogProtocolo15Minutos = () => {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Protocolo 15 Minutos: Respiración + Agua Fría para uso diario",
    "author": {
      "@type": "Person",
      "name": "Alan Iceman Earle",
      "description": "Instructor Certificado del Método Wim Hof"
    },
    "datePublished": "2026-01-08T09:00:00-03:00",
    "dateModified": "2026-01-08T09:00:00-03:00",
    "image": "https://studiolanave.com" + heroImage,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://studiolanave.com/blog/protocolo-15-minutos-respiracion-agua-fria"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Nave Studio",
      "logo": {
        "@type": "ImageObject",
        "url": "https://studiolanave.com/favicon.ico"
      }
    },
    "inLanguage": "es-CL",
    "articleSection": "Respiración, Agua fría, Wim Hof Method, Protocolo diario",
    "keywords": ["protocolo 15 minutos", "respiración Wim Hof", "agua fría", "ducha fría", "breathwork", "uso diario", "bienestar"]
  };

  return (
    <>
      <Helmet>
        <title>Protocolo 15 Minutos: Respiración + Agua Fría | Nave Studio</title>
        <meta 
          name="description" 
          content="Protocolo diario de 15 minutos que combina respiración consciente + exposición al frío para activar tu fisiología, entrenar tu mente y mejorar tu bienestar." 
        />
        <link rel="canonical" href="https://studiolanave.com/blog/protocolo-15-minutos-respiracion-agua-fria" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Protocolo 15 Minutos: Respiración + Agua Fría | Nave Studio" />
        <meta property="og:description" content="Protocolo diario de 15 minutos que combina respiración consciente + exposición al frío para activar tu fisiología, entrenar tu mente y mejorar tu bienestar." />
        <meta property="og:image" content={"https://studiolanave.com" + heroImage} />
        <meta property="og:url" content="https://studiolanave.com/blog/protocolo-15-minutos-respiracion-agua-fria" />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="es_CL" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Protocolo 15 Minutos: Respiración + Agua Fría | Nave Studio" />
        <meta name="twitter:description" content="Protocolo diario de 15 minutos que combina respiración consciente + exposición al frío para activar tu fisiología, entrenar tu mente y mejorar tu bienestar." />
        <meta name="twitter:image" content={"https://studiolanave.com" + heroImage} />
        
        {/* Article specific */}
        <meta property="article:published_time" content="2026-01-08T09:00:00-03:00" />
        <meta property="article:author" content="Alan Iceman Earle" />
        <meta property="article:section" content="Respiración, Agua fría, Wim Hof Method, Protocolo diario" />
        
        <script type="application/ld+json">
          {JSON.stringify(jsonLdData)}
        </script>
      </Helmet>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImage})`
            }}
          />
          <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading mb-4">
              🧊 Protocolo 15 Minutos: Respiración + Agua Fría
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4">
              Para uso diario
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/80">
              <span>Por Alan Iceman Earle</span>
              <span className="hidden sm:inline">•</span>
              <span>8 de enero, 2026</span>
              <span className="hidden sm:inline">•</span>
              <span>Respiración, Agua fría, Wim Hof Method</span>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-neutral-dark leading-relaxed mb-8 font-medium">
                Este protocolo combina <strong>respiración consciente + exposición al frío</strong> para activar tu fisiología, entrenar tu mente y mejorar tu bienestar general.
              </p>

              <div className="bg-secondary/10 rounded-lg p-6 mb-8">
                <p className="mb-2"><strong>⏱️ Duración total:</strong> 15 minutos</p>
                <p className="mb-0"><strong>📍 Frecuencia:</strong> 3–5 veces por semana (ideal diario)</p>
              </div>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">1️⃣ Respiración (10 minutos)</h2>

              <div className="bg-neutral-light/50 rounded-lg p-6 mb-6">
                <p className="mb-2">🔹 <strong>Postura:</strong> sentado o acostado, en un lugar seguro</p>
                <p className="mb-0 text-red-600 font-medium">🔹 Nunca practiques respiración en el agua ni manejando</p>
              </div>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Ronda (x3):</h3>

              <ol className="space-y-3 mb-6">
                <li><strong>1.</strong> Inhala profundo por la nariz o boca</li>
                <li><strong>2.</strong> Exhala sin forzar</li>
                <li><strong>3.</strong> Repite 30 respiraciones</li>
                <li><strong>4.</strong> Tras la última exhalación, retén sin aire 60 segundos (o lo que sea cómodo)</li>
                <li><strong>5.</strong> Inhala profundo, retén 15 segundos, suelta</li>
                <li><strong>6.</strong> Descansa 30 segundos y repite</li>
              </ol>

              <blockquote className="border-l-4 border-secondary pl-6 italic text-neutral-dark mb-8 bg-neutral-light/50 py-4">
                <strong>👉 Objetivo:</strong> oxigenar, regular el sistema nervioso y preparar el cuerpo para el frío.
              </blockquote>

              <div className="bg-primary/5 rounded-lg p-6 mb-8">
                <h4 className="font-heading text-primary mb-4">🎥 Videos de apoyo:</h4>
                <ul className="space-y-3">
                  <li>
                    <a 
                      href="https://youtu.be/6QfD1UY1weM" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-primary underline"
                    >
                      Video explicativo en profundidad →
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://youtu.be/OUCe2VjHyzg" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-primary underline"
                    >
                      Respiración Wim Hof guiada (para practicar) →
                    </a>
                  </li>
                </ul>
              </div>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">2️⃣ Agua Fría (2–3 minutos)</h2>

              <p className="mb-4">
                🚿 <strong>Ducha fría</strong> o 🧊 <strong>Tina con agua fría</strong>
              </p>

              <ul className="space-y-2 mb-6">
                <li>• Entra con respiración nasal lenta</li>
                <li>• Relaja hombros y mandíbula</li>
                <li>• Mantén la calma</li>
                <li>• No luches contra el frío, <strong>obsérvalo</strong></li>
              </ul>

              <blockquote className="border-l-4 border-secondary pl-6 italic text-neutral-dark mb-8 bg-neutral-light/50 py-4">
                <strong>👉 Objetivo:</strong> entrenar la respuesta al estrés y activar beneficios hormonales y mentales.
              </blockquote>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">3️⃣ Integración (2 minutos)</h2>

              <ul className="space-y-2 mb-6">
                <li>• Respira normal</li>
                <li>• Observa cómo te sientes</li>
                <li>• Nota el estado mental y corporal</li>
              </ul>

              <blockquote className="border-l-4 border-accent pl-6 italic text-neutral-dark mb-8 bg-accent/10 py-4">
                <strong>Este momento es clave para consolidar los beneficios.</strong>
              </blockquote>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">⚠️ Importante</h2>

              <ul className="space-y-2 mb-8">
                <li>• Si tienes condiciones médicas, <strong>consulta antes</strong></li>
                <li>• Siempre dentro de <strong>rangos seguros</strong></li>
                <li>• El frío no se trata de aguantar, se trata de <strong>regularte</strong></li>
              </ul>

              <div className="bg-primary/10 rounded-lg p-8 my-12 text-center">
                <h3 className="text-2xl font-heading text-primary mb-4">🧠 Recuerda</h3>
                <p className="text-lg text-neutral-dark mb-0">
                  Tu cuerpo ya sabe cómo hacerlo.<br />
                  <strong>La única barrera suele ser la mente y el discurso interno.</strong>
                </p>
              </div>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">🛸 Vívelo en la Nave ❄️🛸</h2>

              <p className="mb-4">
                Si quieres llevar esta experiencia al siguiente nivel, vivirla <strong>guiada, segura y profunda</strong>, puedes venir a una sesión presencial del <strong>Método Wim Hof en la Nave</strong> ❄️🛸.
              </p>

              <p className="mb-4">
                Ahí no solo respiras y entras al frío:
              </p>

              <ul className="space-y-2 mb-8">
                <li>• Aprendes la <strong>técnica correcta</strong></li>
                <li>• Entiendes la <strong>ciencia detrás del método</strong></li>
                <li>• Vives el hielo con <strong>contención y acompañamiento</strong></li>
                <li>• Accedes a <strong>estados meditativos profundos</strong> en el agua</li>
                <li>• Y entrenas tu mente para responder al <strong>estrés en la vida real</strong></li>
              </ul>

              {/* CTAs */}
              <div className="bg-neutral-light/50 rounded-lg p-8 my-12">
                <h3 className="text-xl font-heading text-primary mb-6 text-center">
                  👉 Reserva tu sesión presencial
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    asChild
                    className="bg-secondary hover:bg-primary text-white"
                  >
                    <a href="/criomedicina-metodo-wim-hof">
                      Ver sesiones Wim Hof
                    </a>
                  </Button>
                  <Button 
                    asChild
                    variant="outline"
                    className="border-secondary text-secondary hover:bg-secondary hover:text-white"
                  >
                    <a href="/planes-precios">
                      Ver Planes & Precios
                    </a>
                  </Button>
                  <Button 
                    asChild
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <a href="/contacto">
                      Contactar
                    </a>
                  </Button>
                </div>
              </div>

              <div className="text-center text-lg text-neutral-dark mt-12">
                <p className="mb-0">🫶 <strong>La medicina se comparte.</strong></p>
              </div>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Sobre el autor</h2>

              <div className="bg-neutral-light/30 rounded-lg p-6 mb-8">
                <p className="mb-0">
                  <strong>Alan Iceman Earle</strong> es <strong>Instructor Certificado del Método Wim Hof</strong> y fundador de Nave Studio. Guía sesiones de respiración, agua fría y bienestar para ayudar a las personas a conectar con su potencial interior.
                </p>
              </div>

              {/* Related */}
              <div className="mt-12 pt-8 border-t">
                <p className="text-sm text-neutral-mid mb-2">Lectura relacionada:</p>
                <a href="/blog/beneficios-del-ice-bath" className="text-secondary hover:text-primary underline">
                  Beneficios del Ice Bath: cuerpo, mente y ciencia →
                </a>
              </div>

              {/* Back to blog */}
              <div className="mt-12 pt-8 border-t">
                <Button asChild variant="outline">
                  <a href="/blog">← Volver al Blog</a>
                </Button>
              </div>

            </div>
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
};

export default BlogProtocolo15Minutos;
