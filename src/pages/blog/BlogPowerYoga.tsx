import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import heroAsset from "@/assets/studio-corazon.webp.asset.json";

const heroImage = heroAsset.url;
const pubDate = "2026-07-04T00:00:00-04:00";

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Power Yoga: fuerza, resistencia y foco en una sola práctica",
  "author": { "@type": "Person", "name": "Nave Studio", "description": "Centro de bienestar en Las Condes" },
  "datePublished": pubDate,
  "dateModified": pubDate,
  "image": "https://studiolanave.com" + heroImage,
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://studiolanave.com/blog/power-yoga-fuerza-resistencia" },
  "publisher": { "@type": "Organization", "name": "Nave Studio", "logo": { "@type": "ImageObject", "url": "https://studiolanave.com/favicon.ico" } },
  "inLanguage": "es-CL",
  "articleSection": "Yoga, Power Yoga, Bienestar",
  "keywords": ["Power Yoga", "fuerza", "resistencia", "tonificación", "Las Condes", "Nave Studio"]
};

export default function BlogPowerYoga() {
  return (
    <>
      <Helmet>
        <title>Power Yoga: fuerza, resistencia y foco | Nave Studio</title>
        <meta name="description" content="Descubre el Power Yoga en Las Condes: una práctica de alta intensidad que desarrolla fuerza muscular, resistencia y determinación. Plan de prueba 7 días." />
        <link rel="canonical" href="https://studiolanave.com/blog/power-yoga-fuerza-resistencia" />
        <meta property="og:title" content="Power Yoga: fuerza, resistencia y foco | Nave Studio" />
        <meta property="og:description" content="Descubre el Power Yoga en Las Condes: una práctica de alta intensidad que desarrolla fuerza muscular, resistencia y determinación." />
        <meta property="og:image" content={"https://studiolanave.com" + heroImage} />
        <meta property="og:url" content="https://studiolanave.com/blog/power-yoga-fuerza-resistencia" />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="es_CL" />
        <meta property="article:published_time" content={pubDate} />
        <meta property="article:author" content="Nave Studio" />
        <meta property="article:section" content="Yoga, Power Yoga, Bienestar" />
        <script type="application/ld+json">{JSON.stringify(jsonLdData)}</script>
      </Helmet>

      <main className="min-h-screen">
        <section className="relative h-[60vh] flex items-center justify-center">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImage})` }} />
          <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading mb-4">Power Yoga: fuerza, resistencia y foco en una sola práctica</h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/80">
              <span>Por Nave Studio</span>
              <span className="hidden sm:inline">•</span>
              <span>4 de julio, 2026</span>
              <span className="hidden sm:inline">•</span>
              <span>Yoga, Power Yoga, Bienestar</span>
            </div>
          </div>
        </section>

        <article className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-neutral-dark leading-relaxed mb-8 font-medium">
                El <strong>Power Yoga</strong> no pide permiso. Es una práctica que toma la estructura del yoga y la carga de intensidad, convirtiendo cada secuencia en un desafío físico y mental. Aquí no hay atajos: solo respiración, fuerza y la decisión de seguir cuando el cuerpo quiere parar.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">¿Qué es el Power Yoga exactamente?</h2>
              <p className="mb-6">
                Nacido como una versión occidental del Ashtanga Vinyasa, el Power Yoga mantiene la estructura de secuencias dinámicas pero libera la rigidez de la serie fija. Las clases varían, pero el objetivo es siempre el mismo: <strong>desarrollar fuerza, resistencia y estabilidad</strong> a través del propio peso corporal.
              </p>
              <p className="mb-8">
                En Nave Studio, el Power Yoga se practica con atención a la alineación y la progresión. No buscamos el colapso; buscamos el <strong>límite sostenible</strong>, ese punto donde el desafío es real pero la técnica se mantiene intacta.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Beneficios que notarás desde la primera semana</h2>
              <ul className="space-y-3 mb-8">
                <li><strong>Tonificación muscular profunda:</strong> los sostenes largos en posturas de fuerza —planchas, guerreros, equilibrios— activan fibras musculares que otros entrenamientos ignoran.</li>
                <li><strong>Resistencia cardiovascular:</strong> el ritmo sostenido mantiene la frecuencia cardíaca elevada de manera controlada, mejorando la capacidad pulmonar y la recuperación.</li>
                <li><strong>Foco mental inquebrantable:</strong> cuando el cuerpo exige atención, la mente no tiene espacio para divagar. El Power Yoga entrena la concentración bajo presión.</li>
                <li><strong>Confianza corporal:</strong> superar posturas que parecían imposibles cambia la relación con tu propio límite. Aprendes que el cuerpo responde a la constancia.</li>
              </ul>

              <blockquote className="border-l-4 border-secondary pl-6 italic text-neutral-dark mb-8 bg-neutral-light/50 py-4">
                "El Power Yoga no te pide flexibilidad extrema. Te pide que muestres con determinación."
              </blockquote>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">¿Es adecuado para principiantes?</h2>
              <p className="mb-6">
                El Power Yoga asume una base de condición física, pero no cierra la puerta a nadie. En Nave Studio, ofrecemos opciones en cada postura: versiones accesibles que construyen la base técnica, y versiones avanzadas para quienes ya tienen experiencia.
              </p>
              <p className="mb-8">
                Si nunca has hecho yoga, te recomendamos empezar con una clase de <a href="/yoga/vinyasa-yoga-las-condes" className="text-secondary underline">Vinyasa</a> o <a href="/yoga/integral-yoga-las-condes" className="text-secondary underline">Integral</a> antes de saltar al Power. Pero si vienes del mundo del fitness y buscas un desafío nuevo, el Power Yoga puede ser tu entrada perfecta.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Diferencias clave con el Vinyasa Yoga</h2>
              <p className="mb-8">
                Mientras el Vinyasa prioriza la fluidez y la expresión, el Power Yoga prioriza la <strong>carga y la resistencia</strong>. Las transiciones son más lentas, los sostenes más largos, y el componente de fuerza es protagonista. No es mejor ni peor; es diferente. Y como todo en el yoga, la clave está en la variedad.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Qué esperar en tu primera clase</h2>
              <p className="mb-4">
                Llegarás, respirarás, calentarás. Luego vendrá la secuencia principal: una serie de posturas de fuerza que se repiten, se sostienen y se superan. Sudarás. Quizás tiembles. Y al final, cuando caigas en Savasana, sentirás una calma que solo se gana a través del esfuerzo honesto.
              </p>
              <p className="mb-8">
                Trae una toalla, agua y la actitud de quien sabe que el desafío es el camino, no el obstáculo.
              </p>

              <div className="bg-neutral-light/50 rounded-lg p-8 my-12">
                <h3 className="text-xl font-heading text-primary mb-6 text-center">¿Listo para el desafío del Power Yoga?</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-secondary hover:bg-primary text-white">
                    <a href="/yoga/power-yoga-las-condes">Conoce las clases de Power Yoga</a>
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
