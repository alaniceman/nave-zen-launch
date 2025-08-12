import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/blog-wim-hof-hero.jpg";

const BlogWimHof = () => {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Método Wim Hof: respiración, frío y mente — lo esencial (y cómo empezar hoy)",
    "author": {
      "@type": "Person",
      "name": "Alan Iceman Earle",
      "description": "Instructor Certificado del Método Wim Hof"
    },
    "datePublished": "2025-08-12T00:00:00-03:00",
    "dateModified": "2025-08-12T00:00:00-03:00",
    "image": "https://studiolanave.com" + heroImage,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://studiolanave.com/blog/metodo-wim-hof-respiracion-frio-mente"
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
    "articleSection": "Ice Bath, Respiración WHM, Ciencia del bienestar",
    "keywords": ["Método Wim Hof", "respiración", "baño de hielo", "frío", "mindset", "Las Condes"]
  };

  return (
    <>
      <Helmet>
        <title>Método Wim Hof: respiración, frío y mente | Nave Studio Las Condes</title>
        <meta 
          name="description" 
          content="Guía práctica del Método Wim Hof: respiración, frío y mindset. Beneficios, seguridad y protocolo de 4 semanas. Empieza hoy en Nave Studio, Las Condes." 
        />
        <link rel="canonical" href="https://studiolanave.com/blog/metodo-wim-hof-respiracion-frio-mente" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Método Wim Hof: respiración, frío y mente | Nave Studio Las Condes" />
        <meta property="og:description" content="Guía práctica del Método Wim Hof: respiración, frío y mindset. Beneficios, seguridad y protocolo de 4 semanas. Empieza hoy en Nave Studio, Las Condes." />
        <meta property="og:image" content={"https://studiolanave.com" + heroImage} />
        <meta property="og:url" content="https://studiolanave.com/blog/metodo-wim-hof-respiracion-frio-mente" />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="es_CL" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Método Wim Hof: respiración, frío y mente | Nave Studio Las Condes" />
        <meta name="twitter:description" content="Guía práctica del Método Wim Hof: respiración, frío y mindset. Beneficios, seguridad y protocolo de 4 semanas. Empieza hoy en Nave Studio, Las Condes." />
        <meta name="twitter:image" content={"https://studiolanave.com" + heroImage} />
        
        {/* Article specific */}
        <meta property="article:published_time" content="2025-08-12T00:00:00-03:00" />
        <meta property="article:author" content="Alan Iceman Earle" />
        <meta property="article:section" content="Ice Bath, Respiración WHM, Ciencia del bienestar" />
        
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
              Método Wim Hof: respiración, frío y mente — lo esencial (y cómo empezar hoy)
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/80">
              <span>Por Alan Iceman Earle</span>
              <span className="hidden sm:inline">•</span>
              <span>12 de agosto, 2025</span>
              <span className="hidden sm:inline">•</span>
              <span>Ice Bath, Respiración WHM, Ciencia del bienestar</span>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-neutral-dark leading-relaxed mb-8 font-medium">
                <strong>Sano, fuerte y feliz.</strong> Esa es la promesa que Wim Hof repite en sus libros: <em>Becoming the Iceman</em>, <em>The Way of the Iceman</em> y <em>The Wim Hof Method</em>. No es un slogan vacío; es una dirección. Tres pilares sencillos —<strong>respiración</strong>, <strong>exposición al frío</strong> y <strong>compromiso mental</strong>— para entrenar tu fisiología y tu carácter.
              </p>

              <p className="mb-8">
                En este artículo te cuento, con un lenguaje claro y práctico, qué propone el Método Wim Hof (MWH), qué ocurre en tu cuerpo cuando lo practicas, cómo empezar con seguridad y cómo integrarlo a tu vida sin volverlo una "hazaña" de fin de semana.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Los 3 pilares según Wim Hof</h2>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">1) Respiración</h3>
              <p className="mb-4">
                Protocolos de respiración cíclica que combinan ventilaciones profundas con retenciones. La práctica produce un estado de calma alerta: foco mental con cuerpo relajado.
              </p>
              <p className="mb-6">
                <strong>Idea central del libro:</strong> tu respiración es una palanca directa sobre tu sistema nervioso. Aprendes a modular estrés y energía "a voluntad".
              </p>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">2) Frío</h3>
              <p className="mb-4">
                Exposición gradual y controlada (duchas frías, baños de hielo). "El frío es un maestro honesto": te muestra tus límites y te enseña a regular tu respuesta.
              </p>
              <p className="mb-6">
                <strong>Idea central del libro:</strong> el frío despierta adaptaciones ancestrales —desde grasa parda hasta mejor tolerancia al estrés— y fortalece la mente.
              </p>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">3) Compromiso (mindset)</h3>
              <p className="mb-8">
                No es motivación pasajera, es <strong>decisión</strong>. Wim repite que el método es simple, pero requiere <strong>constancia</strong>. La práctica diaria, corta y bien hecha, supera sesiones esporádicas y épicas.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Qué pasa en tu cuerpo (explicado fácil)</h2>

              <ul className="space-y-4 mb-8">
                <li>
                  <strong>Respiración cíclica:</strong> baja momentáneamente el CO₂ y sube el pH (alcalinización transitoria). Disminuye la sensación de "ahogo", facilita la retención y dispara una <strong>respuesta adrenérgica controlada</strong> (más noradrenalina): te sientes despierto, con foco y calma.
                </li>
                <li>
                  <strong>Exposición al frío:</strong> activa receptores cutáneos y sistema simpático. Se liberan catecolaminas, aumenta la <strong>termogénesis</strong> y, con práctica, se activa la <strong>grasa parda</strong>. Mejoran los <strong>reflejos vasomotores</strong>.
                </li>
                <li>
                  <strong>Estrés e inmunidad:</strong> la tríada respiración + frío + mindset entrena tu <strong>respuesta al estrés</strong> (hormesis). Menos rumiación, más ecuanimidad; mejor tolerancia a la incomodidad y recuperación más rápida.
                </li>
              </ul>

              <blockquote className="border-l-4 border-secondary pl-6 italic text-neutral-dark mb-8 bg-neutral-light/50 py-4">
                En palabras de Wim: el método no te hace "invencible"; te hace <strong>entrenable</strong>, y ese es el superpoder.
              </blockquote>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Beneficios que suelen reportar los practicantes</h2>

              <ul className="space-y-2 mb-8">
                <li>• Energía estable y mejor foco.</li>
                <li>• Mayor resiliencia y menos ansiedad ante desafíos.</li>
                <li>• Recuperación más rápida tras entrenar.</li>
                <li>• Sueño más profundo.</li>
                <li>• Mejor relación con el estrés (respondes, no reaccionas).</li>
              </ul>

              <blockquote className="border-l-4 border-secondary pl-6 italic text-neutral-dark mb-8 bg-neutral-light/50 py-4">
                Nota honesta: los efectos varían por persona. La clave no es perseguir sensaciones, sino practicar con regularidad.
              </blockquote>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Seguridad primero (como insiste Wim)</h2>

              <ul className="space-y-2 mb-8">
                <li>• Practica la <strong>respiración siempre sentado o acostado</strong>, <strong>nunca</strong> en el agua, conduciendo o de pie.</li>
                <li>• <strong>Embarazo, epilepsia o antecedentes cardiovasculares graves:</strong> consulta a tu médico.</li>
                <li>• No te metas solo al agua fría. Sin alcohol ni sustancias. Progresión <strong>gradual</strong>.</li>
                <li>• Si te mareas, reduce intensidad o rondas.</li>
                <li>• En el frío, busca <strong>temblores controlados</strong> (señal de adaptación), no heroísmo.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Protocolo básico para empezar (4 semanas)</h2>

              <blockquote className="border-l-4 border-secondary pl-6 mb-6 bg-neutral-light/50 py-4">
                Objetivo: construir <strong>consistencia</strong> y una base segura. Tiempo total/día: 15–25 min.
              </blockquote>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Semana 1 — Respiración + duchas templadas</h3>
              <ul className="space-y-2 mb-6">
                <li>
                  <strong>Respiración (mañana, en ayunas o 2 h post comida):</strong> 3 rondas de 30–35 respiraciones profundas.
                  <ul className="ml-6 mt-2 space-y-1">
                    <li>• Exhala suave y <strong>retén sin aire</strong> 45–90 s (o hasta primer impulso).</li>
                    <li>• Inhala, retén <strong>con aire</strong> 10–15 s y suelta.</li>
                  </ul>
                </li>
                <li><strong>Ducha:</strong> termina con <strong>30–45 s</strong> de agua fresca. Exhala largo y relaja hombros.</li>
              </ul>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Semana 2 — Progresión al frío</h3>
              <ul className="space-y-2 mb-6">
                <li>• Igual respiración.</li>
                <li>• Aumenta el cierre frío a <strong>60–90 s</strong>. Entra con pecho y espalda; cabeza al final (opcional).</li>
              </ul>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Semana 3 — Regulación y presencia</h3>
              <ul className="space-y-2 mb-6">
                <li>• Sube a <strong>3–5 min</strong> de agua fría <strong>acumulada</strong> (puedes entrar y salir).</li>
                <li>• Añade <strong>movilidad o yoga suave</strong> post-ducha para calentar naturalmente.</li>
              </ul>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Semana 4 — Primera inmersión guiada</h3>
              <ul className="space-y-2 mb-6">
                <li>• Si toleras 2–3 min de ducha fría regulando la respiración, agenda tu <strong>inmersión guiada</strong> (baño de hielo): técnica, seguridad y salida consciente.</li>
              </ul>

              <blockquote className="border-l-4 border-secondary pl-6 italic text-neutral-dark mb-8 bg-neutral-light/50 py-4">
                Pro tip de Wim: "La respiración es tu termostato". Una exhalación larga le comunica seguridad al sistema.
              </blockquote>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Rutina AM/PM (cuando ya tienes base)</h2>

              <ul className="space-y-2 mb-8">
                <li>• <strong>AM (activar):</strong> 3–4 rondas + 2–3 min de frío. Calor natural al salir (movimiento).</li>
                <li>• <strong>PM (calmar):</strong> 1–2 rondas suaves con exhalaciones largas. Evita frío intenso cerca del sueño.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Preguntas frecuentes</h2>

                <div className="space-y-4 mb-8">
                  <div>
                    <strong>¿Cuántos días a la semana?</strong> 4–6 días de respiración y 3–5 exposiciones al frío funcionan muy bien.
                  </div>
                  <div>
                    <strong>¿Nariz o boca?</strong> Prioriza <strong>nariz</strong>; alterna nariz/boca solo si es necesario.
                  </div>
                  <div>
                    <strong>¿Tiempo ideal de baño de hielo?</strong> Para la mayoría, <strong>2–3 min</strong> bien hechos. Calidad &gt; cantidad.
                  </div>
                  <div>
                    <strong>¿Cómo sé si voy bien?</strong> Calma, claridad y "cuerpo despierto". Si sales exhausto o con temblores excesivos, reduce.
                  </div>
                </div>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Integrar el Método Wim Hof con movimiento y vida real</h2>

              <p className="mb-4">
                La <strong>vida</strong> es la práctica: escaleras, sol, respiración entre reuniones. En La Nave combinamos:
              </p>

              <ul className="space-y-2 mb-8">
                <li>• <strong>Breathwork + movilidad</strong> antes del frío.</li>
                <li>• <strong>Inmersión guiada</strong> con foco en técnica (entrada, permanencia, salida).</li>
                <li>• <strong>Integración:</strong> caminata al sol, té caliente, respiración nasal.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Qué esperar (y qué no)</h2>

              <ul className="space-y-2 mb-8">
                <li>• Espera <strong>progresos discretos pero consistentes</strong>.</li>
                <li>• No esperes soluciones mágicas: el método es un <strong>entrenador</strong>.</li>
                <li>• La magia no es aguantar más frío: es <strong>sentirte más dueño de ti</strong>.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Cómo empezar en Nave Studio</h2>

              <ul className="space-y-2 mb-8">
                <li>• <strong>Sesión guiada MWH</strong> (grupal o personalizada): respiración, técnica de frío e integración.</li>
                <li>• <strong>Planes & Precios:</strong> desde 1 sesión/semana a ilimitado.</li>
                <li>• <strong>Clase de prueba de Yoga:</strong> regula cuerpo y mente.</li>
              </ul>

              {/* CTAs */}
              <div className="bg-neutral-light/50 rounded-lg p-8 my-12">
                <h3 className="text-xl font-heading text-primary mb-6 text-center">
                  ¿Listo para empezar tu práctica del Método Wim Hof?
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    asChild
                    className="bg-secondary hover:bg-primary text-white"
                  >
                    <a href="{{boxmagic_url_reserva}}">
                      Reservar clase
                    </a>
                  </Button>
                  <Button 
                    asChild
                    variant="outline"
                    className="border-secondary text-secondary hover:bg-secondary hover:text-white"
                  >
                    <a href="/planes">
                      Ver Planes & Precios
                    </a>
                  </Button>
                  <Button 
                    asChild
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <a href="/contacto">
                      Contactar al equipo
                    </a>
                  </Button>
                </div>
              </div>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Sobre el autor</h2>

              <div className="bg-neutral-light/30 rounded-lg p-6 mb-8">
                <p className="mb-4">
                  <strong>Alan Iceman Earle</strong> es <strong>Instructor Certificado del Método Wim Hof</strong>. Y <strong>en diciembre de 2025 será certificado Advanced del Método Wim Hof</strong>.
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

export default BlogWimHof;