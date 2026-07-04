import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import heroAsset from "@/assets/studio-yoga-perro.webp.asset.json";

const heroImage = heroAsset.url;
const pubDate = "2026-07-04T00:00:00-04:00";

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Vinyasa Yoga: el arte de moverte con la respiración en Las Condes",
  "author": { "@type": "Person", "name": "Nave Studio", "description": "Centro de bienestar en Las Condes" },
  "datePublished": pubDate,
  "dateModified": pubDate,
  "image": "https://studiolanave.com" + heroImage,
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://studiolanave.com/blog/vinyasa-yoga-flujo-respiracion-las-condes" },
  "publisher": { "@type": "Organization", "name": "Nave Studio", "logo": { "@type": "ImageObject", "url": "https://studiolanave.com/favicon.ico" } },
  "inLanguage": "es-CL",
  "articleSection": "Yoga, Vinyasa, Bienestar",
  "keywords": ["Vinyasa Yoga", "flujo", "respiración", "movimiento consciente", "Las Condes", "Nave Studio"]
};

export default function BlogVinyasaYoga() {
  return (
    <>
      <Helmet>
        <title>Vinyasa Yoga: el arte de moverte con la respiración | Nave Studio</title>
        <meta name="description" content="Descubre el Vinyasa Yoga en Las Condes: flujo continuo de posturas sincronizado con la respiración para ganar fuerza, resistencia y claridad mental." />
        <link rel="canonical" href="https://studiolanave.com/blog/vinyasa-yoga-flujo-respiracion-las-condes" />
        <meta property="og:title" content="Vinyasa Yoga: el arte de moverte con la respiración | Nave Studio" />
        <meta property="og:description" content="Descubre el Vinyasa Yoga en Las Condes: flujo continuo de posturas sincronizado con la respiración para ganar fuerza, resistencia y claridad mental." />
        <meta property="og:image" content={"https://studiolanave.com" + heroImage} />
        <meta property="og:url" content="https://studiolanave.com/blog/vinyasa-yoga-flujo-respiracion-las-condes" />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="es_CL" />
        <meta property="article:published_time" content={pubDate} />
        <meta property="article:author" content="Nave Studio" />
        <meta property="article:section" content="Yoga, Vinyasa, Bienestar" />
        <script type="application/ld+json">{JSON.stringify(jsonLdData)}</script>
      </Helmet>

      <main className="min-h-screen">
        <section className="relative h-[60vh] flex items-center justify-center">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImage})` }} />
          <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading mb-4">Vinyasa Yoga: el arte de moverte con la respiración en Las Condes</h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/80">
              <span>Por Nave Studio</span>
              <span className="hidden sm:inline">•</span>
              <span>4 de julio, 2026</span>
              <span className="hidden sm:inline">•</span>
              <span>Yoga, Vinyasa, Bienestar</span>
            </div>
          </div>
        </section>

        <article className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-neutral-dark leading-relaxed mb-8 font-medium">
                El <strong>Vinyasa Yoga</strong> es una conversación continua entre el cuerpo y la respiración. Cada inhalación abre, cada exhalación profundiza. No hay pausas innecesarias, solo un fluego que te lleva de una postura a la siguiente con gracia y atención.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">¿Qué significa Vinyasa?</h2>
              <p className="mb-6">
                La palabra <em>vinyasa</em> proviene del sánscrito y se traduce aproximadamente como "colocar de manera especial". En la práctica moderna, se refiere a la sincronización consciente del movimiento con la respiración. No se trata de moverse rápido; se trata de <strong>moverse con intención</strong>.
              </p>
              <p className="mb-8">
                En Nave Studio, practicamos un Vinyasa creativo donde la técnica se une a la expresión personal. Las secuencias varían según el día, la energía del grupo y la propuesta de la instructora, pero siempre mantienen un hilo conductor: la respiración como metrónomo interno.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Beneficios de practicar Vinyasa Yoga</h2>
              <ul className="space-y-3 mb-8">
                <li><strong>Coordinación cuerpo-mente:</strong> cuando cada movimiento depende de una inhalación o exhalación, la mente no puede divagar. El foco se vuelve natural.</li>
                <li><strong>Resistencia cardiovascular:</strong> el fluego continuo mantiene el corazón activo sin el impacto de un entrenamiento de alto impacto. Es cardio con consciencia.</li>
                <li><strong>Fuerza funcional:</strong> las transiciones entre posturas desarrollan estabilidad en el core, hombros y caderas de manera integral.</li>
                <li><strong>Creatividad y expresión:</strong> a diferencia de secuencias rígidas, el Vinyasa invita a explorar variantes, a encontrar tu versión de cada postura.</li>
              </ul>

              <blockquote className="border-l-4 border-secondary pl-6 italic text-neutral-dark mb-8 bg-neutral-light/50 py-4">
                "El Vinyasa no es yoga rápido. Es yoga fluido. La diferencia está en la atención, no en la velocidad."
              </blockquote>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Vinyasa vs. Power Yoga: ¿cuál elegir?</h2>
              <p className="mb-6">
                Ambos son dinámicos, pero el Vinyasa prioriza la <strong>fluidez y la respiración</strong>, mientras que el Power Yoga intensifica la <strong>exigencia física</strong> con sostenes más largos, más repeticiones y menos descanso entre posturas.
              </p>
              <p className="mb-8">
                Si buscas una práctica que se sienta como danza meditativa, el Vinyasa es tu camino. Si buscas desafío muscular intenso dentro del yoga, prueba el Power Yoga. Muchos de nuestros alumnos alternan ambos para equilibrar expresión y fuerza.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">¿Es para principiantes?</h2>
              <p className="mb-8">
                Sí, con la guía adecuada. En Nave Studio, cada clase de Vinyasa ofrece progresiones para diferentes niveles. La instructora indica opciones más accesibles y te invita a tomarlas sin presión. Lo importante no es hacer la postura más avanzada; es mantener la respiración como prioridad.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Qué esperar en tu primera clase</h2>
              <p className="mb-4">
                La clase comienza con un centramiento breve, seguido de un calentamiento progresivo. Luego entra el fluego principal: secuencias creativas que exploran diferentes planos de movimiento, direcciones y ritmos. Cerramos con una bajada consciente hacia Savasana.
              </p>
              <p className="mb-8">
                Trae ropa que permita moverte libremente, una toalla y curiosidad. Deja expectativas en la puerta; el Vinyasa se disfruta más cuando no se compite.
              </p>

              <div className="bg-neutral-light/50 rounded-lg p-8 my-12">
                <h3 className="text-xl font-heading text-primary mb-6 text-center">¿Listo para fluir con nosotros?</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-secondary hover:bg-primary text-white">
                    <a href="/yoga/vinyasa-yoga-las-condes">Conoce las clases de Vinyasa</a>
                  </Button>
                  <Button asChild variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                    <a href="/plan-de-prueba">Plan de prueba 7 días</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
}
