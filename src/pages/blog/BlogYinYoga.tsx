import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import heroAsset from "@/assets/studio-savasana.webp.asset.json";

const heroImage = heroAsset.url;
const pubDate = "2026-07-04T00:00:00-04:00";

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Yin Yoga: qué es, beneficios y por qué cambia tu cuerpo desde la primera clase",
  "author": { "@type": "Person", "name": "Nave Studio", "description": "Centro de bienestar en Las Condes" },
  "datePublished": pubDate,
  "dateModified": pubDate,
  "image": "https://studiolanave.com" + heroImage,
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://studiolanave.com/blog/yin-yoga-beneficios-movilidad-flexibilidad" },
  "publisher": { "@type": "Organization", "name": "Nave Studio", "logo": { "@type": "ImageObject", "url": "https://studiolanave.com/favicon.ico" } },
  "inLanguage": "es-CL",
  "articleSection": "Yoga, Yin, Bienestar",
  "keywords": ["Yin Yoga", "flexibilidad", "fascia", "sistema nervioso", "Las Condes", "Nave Studio"]
};

export default function BlogYinYoga() {
  return (
    <>
      <Helmet>
        <title>Yin Yoga: qué es, beneficios y por qué cambia tu cuerpo | Nave Studio</title>
        <meta name="description" content="Descubre qué es el Yin Yoga, sus beneficios para la flexibilidad y el sistema nervioso, y por qué una sola clase puede transformar tu relación con el cuerpo." />
        <link rel="canonical" href="https://studiolanave.com/blog/yin-yoga-beneficios-movilidad-flexibilidad" />
        <meta property="og:title" content="Yin Yoga: qué es, beneficios y por qué cambia tu cuerpo | Nave Studio" />
        <meta property="og:description" content="Descubre qué es el Yin Yoga, sus beneficios para la flexibilidad y el sistema nervioso, y por qué una sola clase puede transformar tu relación con el cuerpo." />
        <meta property="og:image" content={"https://studiolanave.com" + heroImage} />
        <meta property="og:url" content="https://studiolanave.com/blog/yin-yoga-beneficios-movilidad-flexibilidad" />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="es_CL" />
        <meta property="article:published_time" content={pubDate} />
        <meta property="article:author" content="Nave Studio" />
        <meta property="article:section" content="Yoga, Yin, Bienestar" />
        <script type="application/ld+json">{JSON.stringify(jsonLdData)}</script>
      </Helmet>

      <main className="min-h-screen">
        <section className="relative h-[60vh] flex items-center justify-center">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImage})` }} />
          <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading mb-4">Yin Yoga: qué es, beneficios y por qué cambia tu cuerpo desde la primera clase</h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/80">
              <span>Por Nave Studio</span>
              <span className="hidden sm:inline">•</span>
              <span>4 de julio, 2026</span>
              <span className="hidden sm:inline">•</span>
              <span>Yoga, Yin, Bienestar</span>
            </div>
          </div>
        </section>

        <article className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-neutral-dark leading-relaxed mb-8 font-medium">
                El <strong>Yin Yoga</strong> no se trata de estirar más. Se trata de <strong>soltar</strong>. De permitir que el cuerpo encuentre su propio ritmo de apertura, sin forzar, sin competir. En una práctica donde las posturas se mantienen entre 3 y 5 minutos, descubres que la flexibilidad real nace de la paciencia, no del esfuerzo.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">¿Qué es el Yin Yoga exactamente?</h2>
              <p className="mb-6">
                El Yin Yoga trabaja sobre el <strong>tejido conectivo</strong>: fascia, ligamentos y articulaciones. A diferencia del yoga dinámico (Yang), que fortalece músculos a través del movimiento repetido, el Yin aplica tensión suave y sostenida sobre estructuras más profundas. El resultado no es inmediato, pero es duradero.
              </p>
              <p className="mb-8">
                Cada postura se sostiene en calma, apoyada por respiración nasal y profunda. No buscas la perfección de la forma; buscas la <strong>sensación</strong> de apertura, la señal del cuerpo que te dice "aquí hay algo que puedo soltar".
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Beneficios que transforman desde la primera clase</h2>
              <ul className="space-y-3 mb-8">
                <li><strong>Flexibilidad real y sostenida:</strong> no la elasticidad momentánea de un calentamiento, sino una movilidad articular que mejora semana a semana.</li>
                <li><strong>Regulación del sistema nervioso:</strong> el simple acto de quedarse quieto, respirando, enseña al parasimpático a tomar el control. Menos estrés, mejor sueño.</li>
                <li><strong>Liberación de fascia:</strong> la fascia es el tejido que envuelve músculos y órganos. Cuando se acorta por estrés o sedentarismo, genera dolor difuso. El Yin la hidrata y restablece.</li>
                <li><strong>Conciencia corporal profunda:</strong> sin la distracción del movimiento rápido, percibes tensiones que ignorabas y aprendes a relacionarte con ellas.</li>
              </ul>

              <blockquote className="border-l-4 border-secondary pl-6 italic text-neutral-dark mb-8 bg-neutral-light/50 py-4">
                "El Yin no te pide que llegues más lejos. Te pide que te quedes donde estás, con atención."
              </blockquote>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">¿Cómo se diferencia del Vinyasa o Power Yoga?</h2>
              <p className="mb-6">
                Si el Vinyasa es como una conversación animada entre cuerpo y respiración, el Yin es una meditación en silencio. No hay calentamiento, no hay secuencia fluida, no hay sudor como objetivo. Hay <strong>presencia</strong>, hay <strong>permanencia</strong>, hay aprendizaje desde la quietud.
              </p>
              <p className="mb-8">
                Eso no lo hace "más fácil". De hecho, para muchas personas, quedarse quietos es el desafío más grande. El Yin Yoga entrena algo que el mundo moderno olvida: <strong>la capacidad de no hacer</strong>.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">¿A quién le recomendamos empezar con Yin?</h2>
              <ul className="space-y-2 mb-8">
                <li>• Personas con estrés crónico o ansiedad que necesitan un espacio de bajada.</li>
                <li>• Deportistas de alta exigencia que acumulan tensión y necesitan recuperación activa.</li>
                <li>• Quienes trabajan sentados y sienten rigidez en caderas, lumbar y hombros.</li>
                <li>• Cualquiera que quiera aprender a escuchar su cuerpo antes de exigirle más.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Qué esperar en tu primera clase en Nave Studio</h2>
              <p className="mb-4">
                Nuestras clases de Yin Yoga en Las Condes combinan la tradición de las posturas yin clásicas con un enfoque moderno de biomecánica segura. La instructora te guiará con opciones para cada cuerpo, usando props cuando sea necesario, para que la apertura sea real y no forzada.
              </p>
              <p className="mb-8">
                La sala está preparada con temperatura agradable, iluminación tenue y una atmósfera que invita a soltar. Trae ropa cómoda, una botella de agua y —lo más importante— la disposición de no apurarte.
              </p>

              <div className="bg-neutral-light/50 rounded-lg p-8 my-12">
                <h3 className="text-xl font-heading text-primary mb-6 text-center">¿Listo para sentir la diferencia del Yin Yoga?</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-secondary hover:bg-primary text-white">
                    <a href="/yoga/yin-yoga-las-condes">Conoce las clases de Yin Yoga</a>
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
