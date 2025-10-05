import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import heroImage from "@/assets/blog-agua-fria-guiado-hero.jpg";

const BlogAguaFriaGuiado = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Agua fría: la diferencia entre hacerlo solo y vivirlo guiado (y por qué nunca es lo mismo)",
    "author": {
      "@type": "Person",
      "name": "Alan Iceman Earle"
    },
    "datePublished": "2025-08-15T00:00:00-03:00",
    "image": "https://studiolanave.com/og-image.png",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://studiolanave.com/blog/agua-fria-guiado-vs-solo-experiencia-wim-hof"
    },
    "inLanguage": "es-CL"
  };

  return (
    <>
      <Helmet>
        <title>Agua fría: guiado vs solo | Nave Studio</title>
        <meta name="description" content="Descubre por qué no es lo mismo enfrentar el agua fría solo que vivirlo guiado. Técnica, seguridad y profundidad en Nave Studio Las Condes." />
        <link rel="canonical" href="https://studiolanave.com/blog/agua-fria-guiado-vs-solo-experiencia-wim-hof" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Agua fría: guiado vs solo | Nave Studio" />
        <meta property="og:description" content="Descubre por qué no es lo mismo enfrentar el agua fría solo que vivirlo guiado. Técnica, seguridad y profundidad en Nave Studio Las Condes." />
        <meta property="og:url" content="https://studiolanave.com/blog/agua-fria-guiado-vs-solo-experiencia-wim-hof" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://studiolanave.com/og-image.png" />
        <meta property="og:locale" content="es_CL" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Agua fría: guiado vs solo | Nave Studio" />
        <meta name="twitter:description" content="Descubre por qué no es lo mismo enfrentar el agua fría solo que vivirlo guiado. Técnica, seguridad y profundidad en Nave Studio Las Condes." />
        <meta name="twitter:image" content="https://studiolanave.com/og-image.png" />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] bg-primary/10">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Sesión guiada de inmersión en agua fría en Nave Studio Las Condes"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30" />
          </div>
          <div className="relative container mx-auto px-6 h-full flex items-center">
            <div className="max-w-4xl text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading mb-6">
                Agua fría: la diferencia entre hacerlo solo y vivirlo guiado (y por qué nunca es lo mismo)
              </h1>
              <div className="flex flex-wrap gap-4 text-sm">
                <span>Por Alan Iceman Earle</span>
                <span>•</span>
                <time dateTime="2025-08-15">15 de agosto, 2025</time>
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto prose prose-lg">
              <p className="lead text-xl text-neutral-mid mb-8">
                Muchos comienzan su camino con el agua fría abriendo la llave de la ducha y respirando hondo. Y eso está bien: es el primer paso hacia una relación diferente con el cuerpo, la mente y el miedo.
                Pero vivir el agua fría guiado —en un entorno seguro, acompañado y con una estructura consciente— es otra experiencia completamente distinta.
                La diferencia no está solo en la temperatura. Está en la profundidad con la que te encuentras contigo mismo.
              </p>

              <p>
                En este artículo te explico qué ocurre cuando lo haces solo, qué cambia cuando lo haces guiado, y por qué en Nave Studio decimos que el agua fría no se "hace": se vive.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">
                1) Hacerlo solo: autodisciplina y primeros pasos
              </h2>

              <p>
                Empezar solo tiene valor.<br />
                Es una práctica de coraje y constancia: demostrarte que puedes enfrentar el frío y sostener la incomodidad. Las duchas frías o inmersiones caseras son el primer contacto con la fisiología del método.
              </p>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">
                Beneficios de hacerlo solo (en casa o al aire libre):
              </h3>
              <ul className="space-y-2">
                <li>Refuerza tu autonomía y compromiso.</li>
                <li>Mejora la tolerancia al estrés diario.</li>
                <li>Incrementa la energía y el estado de alerta.</li>
                <li>Crea el hábito y la disciplina del "hazlo igual".</li>
              </ul>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">
                Limitaciones:
              </h3>
              <ul className="space-y-2">
                <li>Sin guía, es fácil quedarse en la superficie: entras, aguantas, sales rápido.</li>
                <li>No siempre aprendes a regular la respiración de forma correcta.</li>
                <li>Falta el componente de seguridad y progresión (muchos hiperventilan o se exponen de más).</li>
                <li>Te pierdes la parte mental y simbólica de la experiencia.</li>
              </ul>

              <blockquote className="border-l-4 border-secondary pl-6 my-8 italic text-neutral-mid">
                "El agua fría no es una competencia. Es una conversación con tu sistema nervioso." — Alan Iceman Earle
              </blockquote>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">
                2) Vivirlo guiado: ciencia, presencia y profundidad
              </h2>

              <p>
                Una inmersión guiada no se trata solo de resistir el frío.<br />
                Se trata de entrenar tu sistema nervioso, aprender a regular tu mente y liberar la tensión acumulada en un ambiente preparado y acompañado.
              </p>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">
                Qué cambia cuando lo haces guiado:
              </h3>

              <h4 className="text-xl font-heading text-primary mt-6 mb-3">
                a) Técnica de respiración correcta
              </h4>
              <p>
                Aprendes a entrar en el agua con regulación, no con hiperventilación.
                Respiras antes, entras presente y usas la exhalación como ancla.
                Esto transforma una reacción automática en una respuesta consciente.
              </p>

              <h4 className="text-xl font-heading text-primary mt-6 mb-3">
                b) Contención y seguridad
              </h4>
              <p>
                El guía te acompaña desde la entrada hasta la salida.
                Te observa, ajusta tiempos y evita que sobrepases tu límite fisiológico.
                Así, tu sistema asocia el frío con seguridad, no con trauma.
              </p>

              <h4 className="text-xl font-heading text-primary mt-6 mb-3">
                c) Contexto y sentido
              </h4>
              <p>
                Antes y después del baño hay intención y recuperación consciente: respiración, música, té caliente, integración.
                Esto le da al cuerpo una señal clara: "fue intenso, pero estoy a salvo".
                Ese contraste crea resiliencia emocional real.
              </p>

              <h4 className="text-xl font-heading text-primary mt-6 mb-3">
                d) Energía grupal
              </h4>
              <p>
                Compartir el agua con otros multiplica la experiencia.
                Hay algo profundamente humano en respirar juntos, gritar juntos y salir riendo.
                Tu mente entiende que no está sola, y eso cambia todo.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">
                3) Beneficios únicos de una inmersión guiada
              </h2>
              <ul className="space-y-2">
                <li>Aprendes técnica y fisiología: cuándo entrar, cómo respirar, cómo salir.</li>
                <li>Reduces el riesgo: no hay exposición excesiva ni mareos peligrosos.</li>
                <li>Profundizas en el proceso mental: aprendes a permanecer, no a aguantar.</li>
                <li>Integras emociones: el cuerpo libera tensiones y la mente suelta control.</li>
                <li>Conexión humana: lo compartes en un espacio seguro, acompañado por música y presencia.</li>
                <li>Transformación simbólica: cada inmersión es un recordatorio físico de que "puedes más de lo que crees".</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">
                4) Cuándo hacerlo solo y cuándo buscar guía
              </h2>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">
                Hazlo solo cuando:
              </h3>
              <ul className="space-y-2">
                <li>Ya tienes experiencia y conoces tu cuerpo.</li>
                <li>Buscas mantener la práctica diaria (duchas frías, exposiciones breves).</li>
                <li>Te sientes regulado y sin estrés excesivo.</li>
                <li>Puedes hacerlo de forma gradual y consciente.</li>
              </ul>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">
                Hazlo guiado cuando:
              </h3>
              <ul className="space-y-2">
                <li>Estás comenzando o sientes miedo.</li>
                <li>Quieres profundizar en la experiencia y entender la fisiología.</li>
                <li>Buscas un espacio emocional y simbólico más profundo.</li>
                <li>Deseas compartirlo con otros o conectar desde la respiración.</li>
                <li>Quieres hacerlo de forma segura, en agua a temperatura controlada (2–5 °C) con supervisión y recuperación consciente.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">
                5) En Nave Studio, lo guiamos así
              </h2>

              <p>
                Cada sesión es una ceremonia moderna de presencia.
                Integramos los tres pilares del Método Wim Hof: respiración, exposición al frío y compromiso mental, dentro de un entorno cuidado.
              </p>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">
                Estructura de la experiencia:
              </h3>
              <ol className="space-y-2">
                <li><strong>Preparación:</strong> respiración Wim Hof guiada + enfoque mental.</li>
                <li><strong>Inmersión:</strong> agua a 3–5 °C, con acompañamiento constante.</li>
                <li><strong>Integración:</strong> respiración, té caliente y movimiento consciente.</li>
              </ol>

              <p>
                Acompañamos el proceso con música en vivo, silencio respetuoso o canto armónico, según el grupo.
                Y te enseñamos lo más importante: cómo salir del agua en calma, no en huida.
              </p>

              <blockquote className="border-l-4 border-secondary pl-6 my-8 italic text-neutral-mid">
                "La verdadera maestría no está en soportar el frío, sino en estar presente en él." — Alan Iceman Earle
              </blockquote>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">
                6) Seguridad ante todo
              </h2>
              <ul className="space-y-2">
                <li>Nunca practiques solo si estás comenzando o si el agua está bajo 10 °C.</li>
                <li>No combines respiración intensa con inmersión.</li>
                <li>Evita el frío si estás enfermo, mareado o recién comiste.</li>
                <li>Sal si sientes confusión o entumecimiento excesivo.</li>
                <li>Siempre termina con calor natural (movimiento, respiración, no sauna inmediato).</li>
              </ul>

              <p>
                En una sesión guiada, el instructor controla la temperatura, el tiempo y tu respiración para que la experiencia sea segura y reparadora.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">
                7) Qué esperar después
              </h2>
              <ul className="space-y-2">
                <li>Sensación de claridad mental y energía limpia.</li>
                <li>Estado de calma profunda (por la activación parasimpática).</li>
                <li>Mayor tolerancia al estrés y a la incomodidad.</li>
                <li>Sueño reparador esa noche.</li>
                <li>Y, sobre todo, la certeza física de que tú puedes regularte.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">
                8) Tu siguiente paso
              </h2>

              <p>
                Si ya practicas agua fría en casa, ven a vivirla guiado:
                aprenderás técnica, integración y seguridad para avanzar más profundo.
              </p>

              <p>
                Y si nunca lo has hecho, empezar acompañado es la mejor decisión.
              </p>

              {/* CTAs */}
              <div className="mt-12 p-8 bg-secondary/5 rounded-2xl border border-secondary/20">
                <h3 className="text-2xl font-heading text-primary mb-6 text-center">
                  Tu siguiente paso
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/planes-precios"
                    className="inline-flex items-center justify-center px-8 py-3 bg-secondary hover:bg-primary text-white font-medium rounded-lg transition-colors"
                  >
                    Ver Planes & Precios
                  </a>
                  <a
                    href="/contacto"
                    className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-white font-medium rounded-lg transition-colors"
                  >
                    Contactar al equipo
                  </a>
                  <a
                    href="https://boxmagic.io/widget/f01JKRF7YHHEJFEGGJQVYPY3MD"
                    className="inline-flex items-center justify-center px-8 py-3 bg-primary hover:bg-secondary text-white font-medium rounded-lg transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Reservar clase
                  </a>
                </div>
              </div>

              {/* Author */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="text-xl font-heading text-primary mb-4">
                  Sobre el autor
                </h3>
                <p className="text-neutral-mid">
                  Alan Iceman Earle es Instructor Certificado del Método Wim Hof y fundador de Nave Studio.
                  Acompaña procesos de transformación a través de respiración, crioterapia y hábitos conscientes.
                  En diciembre de 2025 será certificado Advanced del Método Wim Hof.
                </p>
              </div>
            </div>
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
};

export default BlogAguaFriaGuiado;
