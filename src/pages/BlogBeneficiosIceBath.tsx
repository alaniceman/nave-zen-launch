import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/blog-beneficios-ice-bath-hero.jpg";

const BlogBeneficiosIceBath = () => {
  const url = "https://studiolanave.com/blog/beneficios-del-ice-bath";
  const image = "https://studiolanave.com" + heroImage;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Beneficios del Ice Bath: qué le pasa a tu cuerpo y tu mente con el frío",
    description:
      "Guía completa sobre los beneficios del ice bath (baño de hielo): recuperación muscular, energía, foco, regulación del estrés y salud metabólica, con evidencia y protocolo seguro.",
    author: {
      "@type": "Person",
      name: "Alan Iceman Earle",
      description: "Instructor Certificado del Método Wim Hof",
    },
    datePublished: "2026-07-04T09:00:00-03:00",
    dateModified: "2026-07-04T09:00:00-03:00",
    image,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    publisher: {
      "@type": "Organization",
      name: "Nave Studio",
      logo: { "@type": "ImageObject", url: "https://studiolanave.com/favicon.ico" },
    },
    inLanguage: "es-CL",
    articleSection: "Ice Bath, Agua fría, Wim Hof Method, Recuperación",
    keywords: [
      "beneficios del ice bath",
      "baño de hielo",
      "ice bath Chile",
      "agua fría beneficios",
      "método Wim Hof",
      "recuperación muscular",
      "regulación del estrés",
      "salud metabólica",
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cuáles son los principales beneficios del ice bath?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Recuperación muscular más rápida, reducción de la inflamación, mejor regulación del sistema nervioso, más energía y foco por la liberación de noradrenalina y dopamina, mejor calidad de sueño y mayor resiliencia al estrés.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto tiempo debe durar un baño de hielo?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Para principiantes, 30 a 60 segundos ya generan adaptaciones. El rango efectivo y seguro está entre 2 y 3 minutos. En Nave Studio trabajamos con un límite máximo de 2 minutos por inmersión.",
        },
      },
      {
        "@type": "Question",
        name: "¿A qué temperatura debe estar el agua?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Entre 2°C y 10°C. En Nave Studio la tina llega a 3°C, considerado el rango óptimo para activar los beneficios hormonales y neurofisiológicos del frío.",
        },
      },
      {
        "@type": "Question",
        name: "¿El ice bath ayuda a bajar de peso?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El frío activa la grasa parda (BAT), que quema calorías para generar calor. No es una solución mágica, pero acompañado de buena alimentación y ejercicio contribuye a mejorar la flexibilidad metabólica.",
        },
      },
      {
        "@type": "Question",
        name: "¿Quién no debería hacer ice bath?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Personas con condiciones cardiovasculares, hipertensión no controlada, embarazo, epilepsia o antecedentes de arritmias deben consultar a su médico antes. Nunca se practica respiración Wim Hof dentro del agua.",
        },
      },
    ],
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://studiolanave.com/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://studiolanave.com/blog" },
      { "@type": "ListItem", position: 3, name: "Beneficios del Ice Bath", item: url },
    ],
  };

  return (
    <>
      <Helmet>
        <title>Beneficios del Ice Bath: cuerpo, mente y ciencia | Nave Studio</title>
        <meta
          name="description"
          content="Beneficios del ice bath respaldados por ciencia: recuperación, energía, foco, menos estrés y mejor sueño. Guía práctica y protocolo seguro para empezar hoy."
        />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Beneficios del Ice Bath: cuerpo, mente y ciencia | Nave Studio" />
        <meta
          property="og:description"
          content="Guía completa sobre los beneficios del baño de hielo: recuperación, foco, energía y regulación del estrés."
        />
        <meta property="og:image" content={image} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="es_CL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Beneficios del Ice Bath | Nave Studio" />
        <meta
          name="twitter:description"
          content="Recuperación, energía, foco y menos estrés: qué hace el frío en tu cuerpo y tu mente."
        />
        <meta name="twitter:image" content={image} />
        <meta property="article:published_time" content="2026-07-04T09:00:00-03:00" />
        <meta property="article:author" content="Alan Iceman Earle" />
        <meta property="article:section" content="Ice Bath, Agua fría, Wim Hof Method" />
        <script type="application/ld+json">{JSON.stringify(articleLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>

      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative h-[60vh] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${heroImage})`,
            }}
          />
          <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading mb-4">
              🧊 Beneficios del Ice Bath: cuerpo, mente y ciencia
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-4">
              Qué hace el frío en tu fisiología y cómo empezar sin miedo
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/80">
              <span>Por Alan Iceman Earle</span>
              <span className="hidden sm:inline">•</span>
              <span>4 de julio, 2026</span>
              <span className="hidden sm:inline">•</span>
              <span>Ice Bath · Wim Hof · Bienestar</span>
            </div>
          </div>
        </section>

        {/* Article */}
        <article className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-neutral-dark leading-relaxed mb-8 font-medium">
                El <strong>ice bath</strong> (o baño de hielo) dejó de ser una moda para
                convertirse en una herramienta seria de <strong>recuperación, salud mental y
                longevidad</strong>. En este artículo te contamos, con evidencia y sin humo,
                qué hace el frío en tu cuerpo, cuáles son sus beneficios reales y cómo empezar
                de forma segura.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">
                ¿Qué es un ice bath?
              </h2>
              <p className="mb-6">
                Un <strong>baño de hielo</strong> es una inmersión breve y controlada en agua
                fría (idealmente entre <strong>2°C y 10°C</strong>) durante 1 a 3 minutos. En
                <a href="/" className="text-secondary hover:text-primary underline"> Nave Studio </a>
                trabajamos con tinas a <strong>3°C</strong>, con un máximo de <strong>2
                minutos</strong> por inmersión y siempre acompañado por un instructor
                certificado.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">
                Los 7 beneficios del ice bath (con base científica)
              </h2>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">
                1. Recuperación muscular y menos inflamación
              </h3>
              <p className="mb-6">
                La vasoconstricción y posterior vasodilatación mejora el drenaje de metabolitos
                (lactato, citoquinas inflamatorias) tras entrenamientos intensos. Ideal para
                deportistas y personas activas.
              </p>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">
                2. Más energía y foco mental
              </h3>
              <p className="mb-6">
                La exposición al frío puede aumentar la <strong>noradrenalina hasta 5x</strong> y
                la <strong>dopamina hasta 2,5x</strong> (Šrámek et al., 2000). Traducido:
                claridad, foco y sensación de "reset" que puede durar horas.
              </p>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">
                3. Regulación del sistema nervioso y menos estrés
              </h3>
              <p className="mb-6">
                Practicar el frío entrena tu <strong>respuesta al estrés</strong>. Aprendes a
                mantener respiración nasal lenta bajo un estímulo intenso — y esa habilidad se
                transfiere a la vida diaria: entrevistas, presentaciones, discusiones.
              </p>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">
                4. Mejor calidad de sueño y estado de ánimo
              </h3>
              <p className="mb-6">
                Al bajar el cortisol reactivo y equilibrar el sistema nervioso autónomo, muchas
                personas reportan un sueño más profundo y menos rumiación nocturna.
              </p>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">
                5. Activación del sistema inmune
              </h3>
              <p className="mb-6">
                Estudios sobre exposición al frío (Buijze et al., 2016) muestran una reducción
                significativa en licencias por enfermedad en quienes tomaban duchas frías
                regularmente.
              </p>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">
                6. Salud metabólica y grasa parda
              </h3>
              <p className="mb-6">
                El frío activa la <strong>grasa parda (BAT)</strong>, que quema glucosa y lípidos
                para generar calor. No es una pastilla mágica, pero mejora la flexibilidad
                metabólica.
              </p>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">
                7. Fortaleza mental y disciplina
              </h3>
              <p className="mb-6">
                Cada inmersión es un pequeño "sí" a lo incómodo. Entrenas la voluntad y la
                capacidad de sostener presencia cuando el discurso interno grita que salgas.
              </p>

              <div className="bg-secondary/10 rounded-lg p-6 my-10">
                <p className="mb-2">
                  <strong>⏱️ Duración ideal:</strong> 1 a 3 minutos (máx. 2 min en Nave)
                </p>
                <p className="mb-2">
                  <strong>🌡️ Temperatura:</strong> 2°C – 10°C (Nave: 3°C)
                </p>
                <p className="mb-0">
                  <strong>📅 Frecuencia:</strong> 2 a 4 veces por semana
                </p>
              </div>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">
                Cómo empezar: protocolo seguro
              </h2>
              <ol className="space-y-3 mb-8">
                <li><strong>1.</strong> Empieza con duchas frías de 30 s al final de tu ducha habitual.</li>
                <li><strong>2.</strong> Aprende a respirar nasal, lenta y profunda dentro del frío.</li>
                <li><strong>3.</strong> Nunca combines respiración Wim Hof con inmersión sin supervisión.</li>
                <li><strong>4.</strong> Sale caliente por dentro: mueve el cuerpo, no uses ducha caliente inmediata.</li>
                <li><strong>5.</strong> Si tienes condiciones médicas, consulta antes de comenzar.</li>
              </ol>

              <blockquote className="border-l-4 border-secondary pl-6 italic text-neutral-dark mb-8 bg-neutral-light/50 py-4">
                El frío no se aguanta, se <strong>regula</strong>. Cuando aprendes a respirar en
                el frío, el frío deja de ser el enemigo.
              </blockquote>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">
                Ice Bath en Las Condes: vívelo guiado en Nave Studio
              </h2>
              <p className="mb-4">
                En <strong>Nave Studio</strong> (Las Condes, Santiago) integramos ice bath a 3°C
                con <strong>Método Wim Hof</strong>, yoga y respiración consciente. Nuestras
                sesiones grupales están diseñadas para que vivas el frío con contención,
                seguridad y guía profesional.
              </p>

              <div className="bg-neutral-light/50 rounded-lg p-8 my-12">
                <h3 className="text-xl font-heading text-primary mb-6 text-center">
                  👉 Empieza tu experiencia
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-secondary hover:bg-primary text-white">
                    <a href="/criomedicina-metodo-wim-hof">Ver sesiones Wim Hof + Ice Bath</a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-secondary text-secondary hover:bg-secondary hover:text-white"
                  >
                    <a href="/clase-de-prueba">Reservar clase de prueba</a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <a href="/planes-precios">Ver planes</a>
                  </Button>
                </div>
              </div>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">
                Lecturas relacionadas
              </h2>
              <ul className="space-y-2 mb-8">
                <li>
                  <a
                    className="text-secondary hover:text-primary underline"
                    href="/blog/metodo-wim-hof-respiracion-frio-mente"
                  >
                    Método Wim Hof: respiración, frío y mente
                  </a>
                </li>
                <li>
                  <a
                    className="text-secondary hover:text-primary underline"
                    href="/blog/protocolo-seguro-agua-fria-respiracion"
                  >
                    Protocolo seguro de agua fría y respiración
                  </a>
                </li>
                <li>
                  <a
                    className="text-secondary hover:text-primary underline"
                    href="/blog/agua-fria-guiado-vs-solo-experiencia-wim-hof"
                  >
                    Agua fría guiada vs. solo: la diferencia
                  </a>
                </li>
                <li>
                  <a
                    className="text-secondary hover:text-primary underline"
                    href="/blog/protocolo-15-minutos-respiracion-agua-fria"
                  >
                    Protocolo diario de 15 minutos
                  </a>
                </li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Sobre el autor</h2>
              <div className="bg-neutral-light/30 rounded-lg p-6 mb-8">
                <p className="mb-0">
                  <strong>Alan Iceman Earle</strong> es <strong>Instructor Certificado del
                  Método Wim Hof</strong> y fundador de Nave Studio. Guía sesiones de
                  respiración, agua fría y bienestar en Las Condes, Santiago.
                </p>
              </div>

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

export default BlogBeneficiosIceBath;
