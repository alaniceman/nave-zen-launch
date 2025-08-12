import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import heroImage from "@/assets/blog-biohacking-hero.jpg";

export default function BlogBiohacking() {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Biohacking para longevidad: HIIT + Breathwork + Agua fría (la tríada que entrena tu futuro)",
    "author": {
      "@type": "Person",
      "name": "Alan Iceman Earle"
    },
    "datePublished": "2025-08-12T09:00:00-03:00",
    "dateModified": "2025-08-12T09:00:00-03:00",
    "image": "https://studiolanave.com/blog-biohacking-hero.jpg",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://studiolanave.com/blog/biohacking-hiit-breathwork-agua-fria-longevidad"
    },
    "inLanguage": "es-CL",
    "keywords": ["biohacking", "HIIT", "breathwork", "agua fría", "longevidad", "VO2 máx", "hormesis"]
  };

  return (
    <>
      <Helmet>
        <title>Biohacking: HIIT, breathwork y agua fría para longevidad | Nave Studio</title>
        <meta name="description" content="La tríada HIIT + breathwork + agua fría mejora VO₂ máx, regula el estrés y afina el metabolismo. Guía segura y práctica para longevidad." />
        <link rel="canonical" href="https://studiolanave.com/blog/biohacking-hiit-breathwork-agua-fria-longevidad" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Biohacking: HIIT, breathwork y agua fría para longevidad | Nave Studio" />
        <meta property="og:description" content="La tríada HIIT + breathwork + agua fría mejora VO₂ máx, regula el estrés y afina el metabolismo. Guía segura y práctica para longevidad." />
        <meta property="og:image" content="https://studiolanave.com/blog-biohacking-hero.jpg" />
        <meta property="og:url" content="https://studiolanave.com/blog/biohacking-hiit-breathwork-agua-fria-longevidad" />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="es_CL" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Biohacking: HIIT, breathwork y agua fría para longevidad | Nave Studio" />
        <meta name="twitter:description" content="La tríada HIIT + breathwork + agua fría mejora VO₂ máx, regula el estrés y afina el metabolismo. Guía segura y práctica para longevidad." />
        <meta name="twitter:image" content="https://studiolanave.com/blog-biohacking-hero.jpg" />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLdData)}
        </script>
      </Helmet>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section 
          className="relative h-[60vh] flex items-center justify-center text-white"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Biohacking para longevidad: HIIT + Breathwork + Agua fría
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              La tríada que entrena tu futuro
            </p>
          </div>
        </section>

        {/* Article Content */}
        <article className="container mx-auto px-4 py-16 max-w-4xl prose prose-lg prose-gray mx-auto">
          <p className="lead text-xl text-gray-600 mb-8">
            Vivir más <strong>y</strong> mejor no depende de un truco, sino de <strong>hábitos que entrenan tus sistemas</strong>. Tres de los más potentes —y accesibles— son: <strong>HIIT (entrenamiento por intervalos de alta intensidad)</strong>, <strong>breathwork</strong> y <strong>exposición al frío</strong>. Juntos crean una respuesta hormética ("estrés bueno, bien dosificado") que mejora tu capacidad aeróbica, regula tu sistema nervioso, incrementa la flexibilidad metabólica y afina la inflamación. Todo eso está directamente relacionado con <strong>salud a largo plazo</strong>.
          </p>

          <p>
            A continuación te explico <strong>qué aporta cada pilar</strong>, <strong>por qué funcionan mejor combinados</strong> y <strong>cómo implementarlos con seguridad</strong> en una rutina semanal realista.
          </p>

          <h2>1) HIIT: capacidad aeróbica y mitocondrias</h2>

          <p>
            El <strong>VO₂ máx</strong> (tu capacidad de usar oxígeno) es uno de los predictores más sólidos de salud futura. El HIIT lo eleva con dosis cortas:
          </p>

          <ul>
            <li><strong>Corazón y vasos sanguíneos</strong>: mejora el gasto cardíaco y la elasticidad arterial.</li>
            <li><strong>Mitocondrias</strong>: impulsa biogénesis (más "motores" celulares).</li>
            <li><strong>Metabolismo</strong>: sube la sensibilidad a la insulina y la tolerancia a la glucosa.</li>
            <li><strong>Eficiencia del tiempo</strong>: 10–20 minutos bien diseñados rinden mucho.</li>
          </ul>

          <p><strong>Dosis mínima eficaz (2–3×/sem):</strong></p>

          <ul>
            <li>6×(30 s fuerte / 90 s suave), o</li>
            <li>10×(20 s muy fuerte / 40 s suave), o</li>
            <li>4×4 min a ritmo alto (con 3 min suaves entre bloques).</li>
          </ul>

          <p>Regla de oro: <strong>técnica perfecta &gt; intensidad</strong>. Deja 1–2 repeticiones "en el tanque".</p>

          <h2>2) Breathwork: regula estrés, atención y sueño</h2>

          <p>
            Respirar <strong>mejor</strong> (no solo "más") es la vía rápida para modular el sistema nervioso:
          </p>

          <ul>
            <li><strong>Vagal/parasimpático</strong>: exhalaciones largas y respiración nasal aumentan HRV, mejorando resiliencia al estrés.</li>
            <li><strong>Atención</strong>: alternar ciclos de activación con <strong>retenciones controladas</strong> entrena foco y calma.</li>
            <li><strong>Sueño</strong>: un par de rondas suaves en la tarde "bajan revoluciones".</li>
          </ul>

          <p><strong>Protocolos útiles (elige 1 según objetivo):</strong></p>

          <ul>
            <li><strong>Activar AM</strong>: 2–3 rondas de 30–35 respiraciones profundas + retención suave.</li>
            <li><strong>Calmar PM</strong>: 5–10 min de respiración 4-6 (inhala 4 s, exhala 6 s).</li>
            <li><strong>Tolerancia al CO₂</strong>: 3–5 rondas de exhalación larga + pausa al final de la exhalación.</li>
          </ul>

          <blockquote>
            <p>Seguridad: practica <strong>sentado o acostado</strong>, <strong>nunca</strong> en agua, conduciendo ni de pie.</p>
          </blockquote>

          <h2>3) Agua fría: hormesis bien dosificada</h2>

          <p>
            El frío agudo y controlado genera una liberación de catecolaminas (noradrenalina), activa <strong>grasa parda</strong> (termogénesis) y afina reflejos vasomotores:
          </p>

          <ul>
            <li><strong>Estado de alerta</strong> estable, sin "pico de azúcar/café".</li>
            <li><strong>Inflamación</strong> más "inteligente" (mejor control post-ejercicio).</li>
            <li><strong>Metabolismo</strong> más flexible (mejor manejo de combustible).</li>
          </ul>

          <p><strong>Progresión simple (3–5×/sem):</strong></p>

          <ul>
            <li>Semana 1: 30–45 s al final de la ducha.</li>
            <li>Semana 2: 60–90 s.</li>
            <li>Semana 3–4: 2–3 min (continuos o acumulados).</li>
            <li>Inmersión en hielo: <strong>guiada</strong> cuando ya regulas bien tu respiración.</li>
          </ul>

          <blockquote>
            <p>Regla de oro: <strong>no hiperventiles</strong> en el agua. Mantén <strong>exhalaciones largas</strong> y hombros relajados.</p>
          </blockquote>

          <h2>¿Por qué funcionan mejor juntos?</h2>

          <ul>
            <li><strong>HIIT mejora VO₂ máx</strong> → más "motor" para todo: trabajo, juego, recuperación.</li>
            <li><strong>Breathwork</strong> baja la <strong>rumiación</strong> y enseña a "bajar marchas" tras el HIIT o el trabajo.</li>
            <li><strong>Frío</strong> fortalece tu "termostato" y <strong>acorta el tiempo</strong> para volver a la calma.</li>
            <li>El combo crea <strong>tolerancia al estrés + recuperación</strong>: clave de longevidad.</li>
          </ul>

          <h2>Rutina semanal sugerida (4 semanas)</h2>

          <blockquote>
            <p>Objetivo: consistencia. Tiempo total/día: 20–35 min.</p>
          </blockquote>

          <h3>Día 1 – HIIT + frío + breathwork corto</h3>

          <ul>
            <li>Calentamiento 5 min.</li>
            <li>HIIT: 6×(30 s fuerte / 90 s suave).</li>
            <li>Ducha fría 1–2 min.</li>
            <li>1 ronda de respiración con exhalaciones largas (2–3 min).</li>
          </ul>

          <h3>Día 2 – Regulación</h3>

          <ul>
            <li>10–15 min movilidad/yoga suave.</li>
            <li>5–8 min respiración 4-6.</li>
            <li>Ducha fresca 60–90 s.</li>
          </ul>

          <h3>Día 3 – HIIT "4×4"</h3>

          <ul>
            <li>4×4 min ritmo alto / 3 min suave.</li>
            <li>Frío 2–3 min (opcional si te sientes bien).</li>
            <li>1 ronda de respiración calmante.</li>
          </ul>

          <h3>Día 4 – Recuperación activa</h3>

          <ul>
            <li>Caminata nasal 30–40 min o yoga suave.</li>
            <li>Ducha fría 1–2 min.</li>
          </ul>

          <h3>Día 5 – Sprints cortos</h3>

          <ul>
            <li>10×(20 s muy fuerte / 40 s suave) o bici/remo equivalente.</li>
            <li>Frío 2 min + calentamiento natural (movimiento).</li>
          </ul>

          <h3>Día 6 – Breathwork + inmersión guiada (si corresponde)</h3>

          <ul>
            <li>3–4 rondas de respiración estructurada.</li>
            <li>Inmersión (si ya tienes base y guía).</li>
            <li>Té/calor natural; evita extremos de sauna inmediato.</li>
          </ul>

          <h3>Día 7 – Descanso</h3>

          <ul>
            <li>Sol suave, paseo, buena comida, sueño.</li>
          </ul>

          <blockquote>
            <p><strong>Deload</strong>: cada 4ª semana, baja volumen del HIIT un 30–40% y deja el frío en 1–2 min.</p>
          </blockquote>

          <h2>Seguridad (importante)</h2>

          <ul>
            <li><strong>Contraindicaciones</strong>: embarazo, epilepsia, cardiopatías graves o HTA no controlada → <strong>consulta médica</strong>.</li>
            <li><strong>Breathwork</strong>: si hay mareo, reduce intensidad; practica sentado/acostado.</li>
            <li><strong>Frío</strong>: nunca combines hiperventilación con agua; no te inmerses solo.</li>
            <li><strong>HIIT</strong>: progresa gradualmente y prioriza técnica.</li>
          </ul>

          <h2>Marcadores simples que vale la pena mirar</h2>

          <ul>
            <li><strong>VO₂ máx estimado</strong>.</li>
            <li><strong>FC en reposo</strong> y <strong>HRV</strong> (tendencias).</li>
            <li><strong>Sueño</strong> (duración/calidad).</li>
            <li><strong>Perímetro de cintura</strong> y <strong>energía estable</strong>.</li>
          </ul>

          <h2>Nutrición y estilo de vida que apoyan la tríada</h2>

          <ul>
            <li><strong>Proteína adecuada</strong> (1.6–2.2 g/kg/d).</li>
            <li><strong>Verduras y agua</strong> a diario.</li>
            <li><strong>Luz de mañana</strong>, rutina de sueño y pausas activas.</li>
            <li>Alcohol mínimo.</li>
          </ul>

          <h2>Cómo lo hacemos en Nave Studio</h2>

          <p>
            Integramos las tres prácticas en sesiones guiadas para que <strong>aprendas técnica y regulación</strong>:
          </p>

          <ul>
            <li><strong>HIIT inteligente</strong> (adaptado a tu nivel).</li>
            <li><strong>Breathwork</strong> para activar o calmar según el momento.</li>
            <li><strong>Inmersión en frío</strong> a <strong>3–5 °C</strong> con seguridad, salida consciente y calentamiento natural.</li>
          </ul>

          <p><strong>Siguiente paso:</strong></p>

          <div className="flex flex-col sm:flex-row gap-4 my-8">
            <a href="/planes" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Ver Planes & Precios
            </a>
            <a href="/contacto" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Contactar al equipo
            </a>
            <a href="{{boxmagic_url_reserva}}" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Reservar clase
            </a>
          </div>

          <h2>Sobre el autor</h2>

          <p>
            <strong>Alan Iceman Earle</strong> es <strong>Instructor Certificado del Método Wim Hof</strong>. Y <strong>en diciembre de 2025 será certificado Advanced del Método Wim Hof</strong>.
          </p>
        </article>
      </main>

      <Footer />
    </>
  );
}