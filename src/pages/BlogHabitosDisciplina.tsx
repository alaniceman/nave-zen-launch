import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import heroImage from "@/assets/blog-habitos-disciplina-hero.jpg";

const BlogHabitosDisciplina = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Hábitos y disciplina: el arte de construirte a ti mismo (paso a paso)",
    "author": {
      "@type": "Person",
      "name": "Alan Iceman Earle"
    },
    "datePublished": "2025-08-14T00:00:00-03:00",
    "image": "https://studiolanave.com/og-habitos-disciplina.jpg",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://studiolanave.com/blog/habitos-disciplina-como-construirte-a-ti-mismo"
    },
    "inLanguage": "es-CL"
  };

  return (
    <>
      <Helmet>
        <title>Hábitos y disciplina: cómo construirte paso a paso | Nave Studio</title>
        <meta name="description" content="La disciplina no es castigo, es amor propio. Aprende cómo crear hábitos sostenibles que transforman cuerpo, mente y espíritu." />
        <link rel="canonical" href="https://studiolanave.com/blog/habitos-disciplina-como-construirte-a-ti-mismo" />
        <meta property="og:title" content="Hábitos y disciplina: cómo construirte paso a paso | Nave Studio" />
        <meta property="og:description" content="La disciplina no es castigo, es amor propio. Aprende cómo crear hábitos sostenibles que transforman cuerpo, mente y espíritu." />
        <meta property="og:url" content="https://studiolanave.com/blog/habitos-disciplina-como-construirte-a-ti-mismo" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://studiolanave.com/og-habitos-disciplina.jpg" />
        <meta property="og:locale" content="es_CL" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hábitos y disciplina: cómo construirte paso a paso | Nave Studio" />
        <meta name="twitter:description" content="La disciplina no es castigo, es amor propio. Aprende cómo crear hábitos sostenibles que transforman cuerpo, mente y espíritu." />
        <meta name="twitter:image" content="https://studiolanave.com/og-habitos-disciplina.jpg" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Hábitos y disciplina en el camino del crecimiento personal"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
          </div>
          <div className="container mx-auto px-6 relative z-10 text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 text-sm">
              <span>Hábitos</span>
              <span>•</span>
              <span>Disciplina</span>
              <span>•</span>
              <span>Criocoaching</span>
              <span>•</span>
              <span>Crecimiento personal</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 max-w-4xl mx-auto leading-tight">
              Hábitos y disciplina: el arte de construirte a ti mismo (paso a paso)
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm md:text-base">
              <span>Por Alan Iceman Earle</span>
              <span>•</span>
              <time dateTime="2025-08-14">14 de agosto, 2025</time>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-4xl">
            {/* Introduction */}
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-xl text-neutral-mid leading-relaxed">
                La mayoría de la gente cree que necesita motivación para empezar. Pero la verdad —como repite Alan Iceman en sus sesiones de Criocoaching™— es que lo que realmente transforma tu vida es disciplina, no inspiración. La motivación es volátil; la disciplina se entrena.
              </p>
              <p className="text-xl text-neutral-mid leading-relaxed">
                Los hábitos son la estructura invisible que sostiene tu día. Si aprendes a diseñarlos de forma inteligente, dejan de ser una obligación y se vuelven parte de tu identidad. En este artículo exploramos cómo funcionan, por qué la disciplina no es rigidez, y cómo construir hábitos que te lleven a sentirte sano, fuerte y feliz.
              </p>
            </div>

            {/* Section 1 */}
            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">
                1) La verdad sobre la disciplina
              </h2>
              <p className="text-lg font-bold text-primary mb-4">
                La disciplina no es castigo.<br />
                Es una forma de amor propio.
              </p>
              <p className="text-lg text-neutral-mid mb-4 leading-relaxed">
                Es la decisión de cuidar tu energía, de decir "sí" a lo que te acerca a tu visión y "no" a lo que la sabotea. La disciplina no te quita libertad: te la devuelve, porque elimina el caos de tener que decidir mil veces lo mismo.
              </p>
              <blockquote className="border-l-4 border-primary pl-6 my-6 italic text-lg text-neutral-mid">
                "El cuerpo ama la rutina, la mente ama el orden y el alma ama la coherencia." — Wim Hof
              </blockquote>
              <p className="text-lg text-neutral-mid leading-relaxed">
                Ser disciplinado no significa ser perfecto. Significa ser constante incluso cuando no tienes ganas. Si aprendes a moverte en esos momentos, todo cambia.
              </p>
            </section>

            {/* Section 2 */}
            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">
                2) La fórmula de un hábito poderoso
              </h2>
              <p className="text-lg text-neutral-mid mb-4 leading-relaxed">
                Los hábitos no aparecen por fuerza de voluntad; se construyen con diseño. La ciencia del comportamiento (James Clear, BJ Fogg, Huberman) coincide en tres pilares:
              </p>
              <ol className="list-decimal list-inside space-y-3 text-lg text-neutral-mid mb-6">
                <li><strong>Señal</strong> — algo que dispare el hábito (hora, lugar, acción previa).</li>
                <li><strong>Rutina</strong> — la acción concreta.</li>
                <li><strong>Recompensa</strong> — el refuerzo (bienestar, dopamina, sentido de logro).</li>
              </ol>
              <div className="bg-muted/30 rounded-lg p-6 my-6">
                <h3 className="text-xl font-heading font-bold text-primary mb-4">
                  Ejemplo práctico (Nave Studio):
                </h3>
                <ul className="list-disc list-inside space-y-2 text-lg text-neutral-mid">
                  <li><strong>Señal</strong> → terminar tu ducha normal.</li>
                  <li><strong>Rutina</strong> → 60 segundos de agua fría.</li>
                  <li><strong>Recompensa</strong> → sensación de claridad, foco, energía.</li>
                </ul>
              </div>
              <p className="text-lg text-neutral-mid leading-relaxed">
                Si repites ese ciclo suficientes veces, el cuerpo empieza a pedir el hábito.
              </p>
            </section>

            {/* Section 3 */}
            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">
                3) Motivación vs consistencia
              </h2>
              <p className="text-lg font-bold text-primary mb-4">
                La motivación es como un fósforo: sirve para encender.<br />
                La disciplina es el fuego que mantiene la llama.
              </p>
              <p className="text-lg text-neutral-mid mb-4 leading-relaxed">
                No necesitas fuerza de voluntad infinita; necesitas reducir la fricción.
              </p>
              <p className="text-lg text-neutral-mid mb-4 leading-relaxed">
                Haz que tu hábito sea tan fácil de iniciar que no puedas fallar. Ejemplo: en lugar de decir "voy a meditar 20 minutos diarios", comienza con 1 minuto respirando consciente. Luego, el cuerpo y la mente se adaptan.
              </p>
            </section>

            {/* Section 4 */}
            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">
                4) El rol del entorno (tu tribu y tu espacio)
              </h2>
              <p className="text-lg text-neutral-mid mb-4 leading-relaxed">
                Tu entorno moldea tu comportamiento más que tu intención.
              </p>
              <ul className="list-disc list-inside space-y-2 text-lg text-neutral-mid mb-6">
                <li>Si tienes el celular junto a la cama, no ganarás la batalla del foco.</li>
                <li>Si dejas la ropa de entrenamiento lista, el hábito se activa solo.</li>
                <li>Si te rodeas de personas que cuidan su salud, tú también subirás el estándar.</li>
              </ul>
              <p className="text-lg font-bold text-primary mb-4">
                En Nave Studio decimos: "Encuentra tu tribu".<br />
                Si te rodeas de cinco personas disciplinadas, serás la sexta.
              </p>
            </section>

            {/* Section 5 */}
            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">
                5) Cómo crear disciplina sin agotarte
              </h2>
              <ol className="space-y-4">
                <li className="text-lg text-neutral-mid">
                  <strong className="text-primary">1. Define una sola cosa.</strong><br />
                  No intentes cambiar todo a la vez. Elige un hábito madre (por ejemplo, respirar 5 min cada mañana).
                </li>
                <li className="text-lg text-neutral-mid">
                  <strong className="text-primary">2. Hazlo visible.</strong><br />
                  Marca en tu calendario o usa recordatorios físicos.
                </li>
                <li className="text-lg text-neutral-mid">
                  <strong className="text-primary">3. Celebra lo pequeño.</strong><br />
                  Cada día que cumples, refuerzas tu identidad ("soy alguien que cumple lo que se propone").
                </li>
                <li className="text-lg text-neutral-mid">
                  <strong className="text-primary">4. Tolera los tropiezos.</strong><br />
                  Falla una vez, pero no dos seguidas. La consistencia gana al perfeccionismo.
                </li>
                <li className="text-lg text-neutral-mid">
                  <strong className="text-primary">5. Vuelve al cuerpo.</strong><br />
                  Si pierdes el foco, haz una ronda de respiración o una ducha fría. El cuerpo es el ancla.
                </li>
              </ol>
            </section>

            {/* Section 6 */}
            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">
                6) Hábitos para cuerpo, mente y espíritu
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="text-xl font-heading font-bold text-primary mb-4">Cuerpo</h3>
                  <ul className="list-disc list-inside space-y-2 text-neutral-mid">
                    <li>Despierta a la misma hora.</li>
                    <li>Bebe agua apenas despiertes.</li>
                    <li>Mueve tu cuerpo (caminar, yoga o HIIT).</li>
                    <li>Termina con 1 min de agua fría.</li>
                  </ul>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="text-xl font-heading font-bold text-primary mb-4">Mente</h3>
                  <ul className="list-disc list-inside space-y-2 text-neutral-mid">
                    <li>Respira consciente 5 min al día.</li>
                    <li>Anota 3 cosas por las que agradeces.</li>
                    <li>Reduce notificaciones y distracciones.</li>
                    <li>Lee o escucha algo que te inspire crecimiento.</li>
                  </ul>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="text-xl font-heading font-bold text-primary mb-4">Espíritu</h3>
                  <ul className="list-disc list-inside space-y-2 text-neutral-mid">
                    <li>Medita o contempla la naturaleza.</li>
                    <li>Haz algo sin expectativa de resultado.</li>
                    <li>Comparte (enseñar también refuerza tu disciplina).</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">
                7) La disciplina del frío
              </h2>
              <p className="text-lg text-neutral-mid mb-4 leading-relaxed">
                El agua fría es una metáfora viviente de la disciplina. Cada inmersión te enseña que puedes actuar aunque sientas resistencia.
              </p>
              <p className="text-lg text-neutral-mid mb-4 leading-relaxed">
                Entras, respiras, calmas tu mente y descubres que al otro lado del miedo hay energía. Practicarlo cada semana no solo fortalece el cuerpo: entrena la mente a no huir del desafío.
              </p>
              <blockquote className="border-l-4 border-primary pl-6 my-6 italic text-lg text-neutral-mid">
                "Haz cada día algo difícil." — Alan Iceman Earle
              </blockquote>
            </section>

            {/* Section 8 */}
            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">
                8) Cómo empezar hoy
              </h2>
              <ul className="space-y-3 text-lg text-neutral-mid mb-6">
                <li><strong>Paso 1:</strong> elige un hábito simple (por ejemplo: terminar tu ducha con 30 seg fríos).</li>
                <li><strong>Paso 2:</strong> vincúlalo a algo que ya haces.</li>
                <li><strong>Paso 3:</strong> escríbelo y cumple solo por hoy.</li>
                <li><strong>Paso 4:</strong> repite.</li>
              </ul>
              <p className="text-lg text-neutral-mid leading-relaxed">
                En pocas semanas, el hábito deja de ser esfuerzo y se vuelve identidad.
              </p>
            </section>

            {/* En Nave Studio */}
            <section className="mb-12 bg-muted/30 rounded-2xl p-8">
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">
                En Nave Studio lo practicamos así
              </h2>
              <p className="text-lg text-neutral-mid mb-4 leading-relaxed">
                Cada clase —de respiración, yoga o agua fría— es una práctica de disciplina encarnada. No te pedimos motivación: te guiamos a construir rituales sostenibles. Desde el primer día aprendes a responder, no a reaccionar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button asChild size="lg" className="bg-accent hover:bg-primary">
                  <a href="/planes-precios">Ver Planes & Precios</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="/contacto">Contactar al equipo</a>
                </Button>
              </div>
            </section>

            {/* Author Bio */}
            <section className="border-t border-border pt-12">
              <h3 className="text-2xl font-heading font-bold text-primary mb-4">
                Sobre el autor
              </h3>
              <p className="text-lg text-neutral-mid leading-relaxed">
                <strong>Alan Iceman Earle</strong> es Instructor Certificado del Método Wim Hof y creador del programa Criocoaching™, que integra hábitos, exposición al frío y respiración para entrenar cuerpo, mente y espíritu. En diciembre de 2025 será certificado Advanced del Método Wim Hof.
              </p>
            </section>

            {/* CTA Section */}
            <section className="mt-12 text-center">
              <h3 className="text-2xl font-heading font-bold text-primary mb-6">
                Siguiente paso
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-accent hover:bg-primary">
                  <a href="https://boxmagic.com/reservas/nave-studio" target="_blank" rel="noopener noreferrer">
                    Reservar clase
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="/blog">Ver más artículos</a>
                </Button>
              </div>
            </section>
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
};

export default BlogHabitosDisciplina;
