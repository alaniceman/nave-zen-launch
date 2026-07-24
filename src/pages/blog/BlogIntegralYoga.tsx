import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import heroAsset from "@/assets/studio-meditacion-loto.webp.asset.json";

const heroImage = heroAsset.url;
const pubDate = "2026-07-04T00:00:00-04:00";

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Integral Yoga: el equilibrio perfecto entre fuerza, flexibilidad y meditación",
  "author": { "@type": "Person", "name": "Nave Studio", "description": "Centro de bienestar en Las Condes" },
  "datePublished": pubDate,
  "dateModified": pubDate,
  "image": "https://studiolanave.com" + heroImage,
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://studiolanave.com/blog/integral-yoga-equilibrio-meditacion" },
  "publisher": { "@type": "Organization", "name": "Nave Studio", "logo": { "@type": "ImageObject", "url": "https://studiolanave.com/favicon.ico" } },
  "inLanguage": "es-CL",
  "articleSection": "Yoga, Integral, Bienestar",
  "keywords": ["Integral Yoga", "equilibrio", "meditación activa", "fuerza", "flexibilidad", "Las Condes", "Nave Studio"]
};

export default function BlogIntegralYoga() {
  return (
    <>
      <Helmet>
        <title>Integral Yoga: equilibrio entre fuerza, flexibilidad y meditación | Nave Studio</title>
        <meta name="description" content="Descubre el Integral Yoga en Las Condes: una práctica completa que equilibra fuerza, flexibilidad y meditación activa para todos los niveles." />
        <link rel="canonical" href="https://studiolanave.com/blog/integral-yoga-equilibrio-meditacion" />
        <meta property="og:title" content="Integral Yoga: equilibrio entre fuerza, flexibilidad y meditación | Nave Studio" />
        <meta property="og:description" content="Descubre el Integral Yoga en Las Condes: una práctica completa que equilibra fuerza, flexibilidad y meditación activa para todos los niveles." />
        <meta property="og:image" content={"https://studiolanave.com" + heroImage} />
        <meta property="og:url" content="https://studiolanave.com/blog/integral-yoga-equilibrio-meditacion" />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="es_CL" />
        <meta property="article:published_time" content={pubDate} />
        <meta property="article:author" content="Nave Studio" />
        <meta property="article:section" content="Yoga, Integral, Bienestar" />
        <script type="application/ld+json">{JSON.stringify(jsonLdData)}</script>
      </Helmet>

      <main className="min-h-screen">
        <section className="relative h-[60vh] flex items-center justify-center">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImage})` }} />
          <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading mb-4">Integral Yoga: el equilibrio perfecto entre fuerza, flexibilidad y meditación</h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/80">
              <span>Por Nave Studio</span>
              <span className="hidden sm:inline">•</span>
              <span>4 de julio, 2026</span>
              <span className="hidden sm:inline">•</span>
              <span>Yoga, Integral, Bienestar</span>
            </div>
          </div>
        </section>

        <article className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-neutral-dark leading-relaxed mb-8 font-medium">
                El <strong>Integral Yoga</strong> nace de una premisa simple: el ser humano no se divide en compartimentos. No somos solo cuerpo, solo mente o solo espíritu. Somos todo eso a la vez, y una práctica de yoga verdadera debería honrar cada dimensión en cada sesión.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">¿Qué hace "integral" al Integral Yoga?</h2>
              <p className="mb-6">
                A diferencia de los estilos especializados —el Yin para flexibilidad, el Power para fuerza, el Vinyasa para el fluego— el Integral Yoga distribuye la energía de la clase entre varios objetivos. Una sesión típica incluye:
              </p>
              <ul className="space-y-2 mb-8">
                <li>• <strong>Centramiento y respiración</strong> para preparar mente y cuerpo.</li>
                <li>• <strong>Secuencias de calentamiento</strong> que articulan y movilizan.</li>
                <li>• <strong>Posturas de fuerza</strong> que estabilizan y tonifican.</li>
                <li>• <strong>Posturas de flexibilidad</strong> que abren y liberan.</li>
                <li>• <strong>Pranayama y meditación activa</strong> para cerrar con presencia.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Beneficios de una práctica que lo abarca todo</h2>
              <ul className="space-y-3 mb-8">
                <li><strong>Equilibrio físico completo:</strong> no desarrollas solo fuerza ni solo flexibilidad. Ambas crecen en proporción, reduciendo el riesgo de lesiones por desequilibrio muscular.</li>
                <li><strong>Meditación activa:</strong> la meditación no es solo sentarse en silencio. En el Integral Yoga, la atención plena se practica dentro del movimiento, preparando la mente para la quietud.</li>
                <li><strong>Adaptabilidad:</strong> como toca todas las bases, el Integral Yoga es ideal para principiantes que aún no saben qué estilo resuena con ellos. Es como un menú degustación del yoga.</li>
                <li><strong>Preparación para otros estilos:</strong> muchos alumnos usan el Integral como base semanal y complementan con Vinyasa, Yin o Power según el día y la energía.</li>
              </ul>

              <blockquote className="border-l-4 border-secondary pl-6 italic text-neutral-dark mb-8 bg-neutral-light/50 py-4">
                "El Integral Yoga no te pide que elijas entre fuerza y calma. Te enseña que ambas pueden coexistir en la misma respiración."
              </blockquote>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">¿Para quién es el Integral Yoga?</h2>
              <ul className="space-y-2 mb-8">
                <li>• Personas nuevas en yoga que quieren una visión panorámica antes de especializarse.</li>
                <li>• Practicantes que buscan una clase semanal de mantenimiento equilibrado.</li>
                <li>• Quienes sienten que se han vuelto demasiado rígidos o demasiado laxos y necesitan resetear.</li>
                <li>• Cualquiera que valore la estructura y la variedad en una misma sesión.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Cómo se diferencia del resto</h2>
              <p className="mb-6">
                El <a href="/blog/yin-yoga-beneficios-movilidad-flexibilidad" className="text-secondary underline">Yin Yoga</a> profundiza en la quietud. El <a href="/blog/vinyasa-yoga-flujo-respiracion-las-condes" className="text-secondary underline">Vinyasa</a> en el fluego. El <a href="/blog/power-yoga-fuerza-resistencia" className="text-secondary underline">Power Yoga</a> en la intensidad. El Integral no profundiza en una sola dirección; <strong>expande</strong> en todas. Es el yoga del equilibrio consciente.
              </p>
              <p className="mb-8">
                En Nave Studio, las clases de Integral Yoga son especialmente populares entre quienes practican durante la semana laboral: ofrecen un reset físico y mental que deja el cuerpo trabajado pero la mente calmada.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Qué esperar en tu primera clase</h2>
              <p className="mb-4">
                No necesitas experiencia previa. La instructora guía cada transición con opciones para diferentes cuerpos y niveles. La clase comienza suave, construye intensidad gradualmente, y baja consciente hacia una relajación integrada. Saldrás sintiendo que hiciste de todo, pero sin agotarte.
              </p>

              <div className="bg-neutral-light/50 rounded-lg p-8 my-12">
                <h3 className="text-xl font-heading text-primary mb-6 text-center">¿Listo para una práctica que lo abarca todo?</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-secondary hover:bg-primary text-white">
                    <a href="/yoga/integral-yoga-las-condes">Conoce las clases de Integral Yoga</a>
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
