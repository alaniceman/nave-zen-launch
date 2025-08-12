import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/blog-biohacking-hero.jpg";

const BlogBiohacking = () => {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Biohacking para longevidad: HIIT + Breathwork + Agua fría (la tríada que entrena tu futuro)",
    "author": {
      "@type": "Person",
      "name": "Alan Iceman Earle",
      "description": "Instructor Certificado del Método Wim Hof"
    },
    "datePublished": "2025-08-12T09:00:00-03:00",
    "dateModified": "2025-08-12T09:00:00-03:00",
    "image": "https://studiolanave.com" + heroImage,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://studiolanave.com/blog/biohacking-hiit-breathwork-agua-fria-longevidad"
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
    "articleSection": "Biohacking, HIIT, Respiración WHM, Longevidad",
    "keywords": ["biohacking", "HIIT", "breathwork", "agua fría", "longevidad", "VO2 máx", "hormesis"]
  };

  return (
    <>
      <Helmet>
        <title>Biohacking: HIIT, breathwork y agua fría para longevidad | Nave Studio</title>
        <meta 
          name="description" 
          content="La tríada HIIT + breathwork + agua fría mejora VO₂ máx, regula el estrés y afina el metabolismo. Guía segura y práctica para longevidad." 
        />
        <link rel="canonical" href="https://studiolanave.com/blog/biohacking-hiit-breathwork-agua-fria-longevidad" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Biohacking: HIIT, breathwork y agua fría para longevidad | Nave Studio" />
        <meta property="og:description" content="La tríada HIIT + breathwork + agua fría mejora VO₂ máx, regula el estrés y afina el metabolismo. Guía segura y práctica para longevidad." />
        <meta property="og:image" content={"https://studiolanave.com" + heroImage} />
        <meta property="og:url" content="https://studiolanave.com/blog/biohacking-hiit-breathwork-agua-fria-longevidad" />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="es_CL" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Biohacking: HIIT, breathwork y agua fría para longevidad | Nave Studio" />
        <meta name="twitter:description" content="La tríada HIIT + breathwork + agua fría mejora VO₂ máx, regula el estrés y afina el metabolismo. Guía segura y práctica para longevidad." />
        <meta name="twitter:image" content={"https://studiolanave.com" + heroImage} />
        
        {/* Article specific */}
        <meta property="article:published_time" content="2025-08-12T09:00:00-03:00" />
        <meta property="article:author" content="Alan Iceman Earle" />
        <meta property="article:section" content="Biohacking, HIIT, Respiración WHM, Longevidad" />
        
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
              Biohacking para longevidad: HIIT + Breathwork + Agua fría (la tríada que entrena tu futuro)
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/80">
              <span>Por Alan Iceman Earle</span>
              <span className="hidden sm:inline">•</span>
              <span>12 de agosto, 2025</span>
              <span className="hidden sm:inline">•</span>
              <span>Biohacking, HIIT, Respiración WHM, Longevidad</span>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-neutral-dark leading-relaxed mb-8 font-medium">
                Vivir más <strong>y</strong> mejor no depende de un truco, sino de <strong>hábitos que entrenan tus sistemas</strong>. Tres de los más potentes —y accesibles— son: <strong>HIIT (entrenamiento por intervalos de alta intensidad)</strong>, <strong>breathwork</strong> y <strong>exposición al frío</strong>. Juntos crean una respuesta hormética ("estrés bueno, bien dosificado") que mejora tu capacidad aeróbica, regula tu sistema nervioso, incrementa la flexibilidad metabólica y afina la inflamación. Todo eso está directamente relacionado con <strong>salud a largo plazo</strong>.
              </p>

              <p className="mb-8">
                A continuación te explico <strong>qué aporta cada pilar</strong>, <strong>por qué funcionan mejor combinados</strong> y <strong>cómo implementarlos con seguridad</strong> en una rutina semanal realista.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">1) HIIT: capacidad aeróbica y mitocondrias</h2>

              <p className="mb-4">
                El <strong>VO₂ máx</strong> (tu capacidad de usar oxígeno) es uno de los predictores más sólidos de salud futura. El HIIT lo eleva con dosis cortas:
              </p>

              <ul className="space-y-2 mb-6">
                <li>• <strong>Corazón y vasos sanguíneos</strong>: mejora el gasto cardíaco y la elasticidad arterial.</li>
                <li>• <strong>Mitocondrias</strong>: impulsa biogénesis (más "motores" celulares).</li>
                <li>• <strong>Metabolismo</strong>: sube la sensibilidad a la insulina y la tolerancia a la glucosa.</li>
                <li>• <strong>Eficiencia del tiempo</strong>: 10–20 minutos bien diseñados rinden mucho.</li>
              </ul>

              <p className="mb-4"><strong>Dosis mínima eficaz (2–3×/sem):</strong></p>

              <ul className="space-y-2 mb-6">
                <li>• 6×(30 s fuerte / 90 s suave), o</li>
                <li>• 10×(20 s muy fuerte / 40 s suave), o</li>
                <li>• 4×4 min a ritmo alto (con 3 min suaves entre bloques).</li>
              </ul>

              <p className="mb-8">Regla de oro: <strong>técnica perfecta &gt; intensidad</strong>. Deja 1–2 repeticiones "en el tanque".</p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">2) Breathwork: regula estrés, atención y sueño</h2>

              <p className="mb-4">
                Respirar <strong>mejor</strong> (no solo "más") es la vía rápida para modular el sistema nervioso:
              </p>

              <ul className="space-y-2 mb-6">
                <li>• <strong>Vagal/parasimpático</strong>: exhalaciones largas y respiración nasal aumentan HRV, mejorando resiliencia al estrés.</li>
                <li>• <strong>Atención</strong>: alternar ciclos de activación con <strong>retenciones controladas</strong> entrena foco y calma.</li>
                <li>• <strong>Sueño</strong>: un par de rondas suaves en la tarde "bajan revoluciones".</li>
              </ul>

              <p className="mb-4"><strong>Protocolos útiles (elige 1 según objetivo):</strong></p>

              <ul className="space-y-2 mb-6">
                <li>• <strong>Activar AM</strong>: 2–3 rondas de 30–35 respiraciones profundas + retención suave.</li>
                <li>• <strong>Calmar PM</strong>: 5–10 min de respiración 4-6 (inhala 4 s, exhala 6 s).</li>
                <li>• <strong>Tolerancia al CO₂</strong>: 3–5 rondas de exhalación larga + pausa al final de la exhalación.</li>
              </ul>

              <blockquote className="border-l-4 border-secondary pl-6 italic text-neutral-dark mb-8 bg-neutral-light/50 py-4">
                Seguridad: practica <strong>sentado o acostado</strong>, <strong>nunca</strong> en agua, conduciendo ni de pie.
              </blockquote>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">3) Agua fría: hormesis bien dosificada</h2>

              <p className="mb-4">
                El frío agudo y controlado genera una liberación de catecolaminas (noradrenalina), activa <strong>grasa parda</strong> (termogénesis) y afina reflejos vasomotores:
              </p>

              <ul className="space-y-2 mb-6">
                <li>• <strong>Estado de alerta</strong> estable, sin "pico de azúcar/café".</li>
                <li>• <strong>Inflamación</strong> más "inteligente" (mejor control post-ejercicio).</li>
                <li>• <strong>Metabolismo</strong> más flexible (mejor manejo de combustible).</li>
              </ul>

              <p className="mb-4"><strong>Progresión simple (3–5×/sem):</strong></p>

              <ul className="space-y-2 mb-6">
                <li>• Semana 1: 30–45 s al final de la ducha.</li>
                <li>• Semana 2: 60–90 s.</li>
                <li>• Semana 3–4: 2–3 min (continuos o acumulados).</li>
                <li>• Inmersión en hielo: <strong>guiada</strong> cuando ya regulas bien tu respiración.</li>
              </ul>

              <blockquote className="border-l-4 border-secondary pl-6 italic text-neutral-dark mb-8 bg-neutral-light/50 py-4">
                Regla de oro: <strong>no hiperventiles</strong> en el agua. Mantén <strong>exhalaciones largas</strong> y hombros relajados.
              </blockquote>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">¿Por qué funcionan mejor juntos?</h2>

              <ul className="space-y-2 mb-8">
                <li>• <strong>HIIT mejora VO₂ máx</strong> → más "motor" para todo: trabajo, juego, recuperación.</li>
                <li>• <strong>Breathwork</strong> baja la <strong>rumiación</strong> y enseña a "bajar marchas" tras el HIIT o el trabajo.</li>
                <li>• <strong>Frío</strong> fortalece tu "termostato" y <strong>acorta el tiempo</strong> para volver a la calma.</li>
                <li>• El combo crea <strong>tolerancia al estrés + recuperación</strong>: clave de longevidad.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Rutina semanal sugerida (4 semanas)</h2>

              <blockquote className="border-l-4 border-secondary pl-6 mb-6 bg-neutral-light/50 py-4">
                Objetivo: consistencia. Tiempo total/día: 20–35 min.
              </blockquote>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Día 1 – HIIT + frío + breathwork corto</h3>
              <ul className="space-y-2 mb-6">
                <li>• Calentamiento 5 min.</li>
                <li>• HIIT: 6×(30 s fuerte / 90 s suave).</li>
                <li>• Ducha fría 1–2 min.</li>
                <li>• 1 ronda de respiración con exhalaciones largas (2–3 min).</li>
              </ul>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Día 2 – Regulación</h3>
              <ul className="space-y-2 mb-6">
                <li>• 10–15 min movilidad/yoga suave.</li>
                <li>• 5–8 min respiración 4-6.</li>
                <li>• Ducha fresca 60–90 s.</li>
              </ul>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Día 3 – HIIT "4×4"</h3>
              <ul className="space-y-2 mb-6">
                <li>• 4×4 min ritmo alto / 3 min suave.</li>
                <li>• Frío 2–3 min (opcional si te sientes bien).</li>
                <li>• 1 ronda de respiración calmante.</li>
              </ul>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Día 4 – Recuperación activa</h3>
              <ul className="space-y-2 mb-6">
                <li>• Caminata nasal 30–40 min o yoga suave.</li>
                <li>• Ducha fría 1–2 min.</li>
              </ul>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Día 5 – Sprints cortos</h3>
              <ul className="space-y-2 mb-6">
                <li>• 10×(20 s muy fuerte / 40 s suave) o bici/remo equivalente.</li>
                <li>• Frío 2 min + calentamiento natural (movimiento).</li>
              </ul>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Día 6 – Breathwork + inmersión guiada (si corresponde)</h3>
              <ul className="space-y-2 mb-6">
                <li>• 3–4 rondas de respiración estructurada.</li>
                <li>• Inmersión (si ya tienes base y guía).</li>
                <li>• Té/calor natural; evita extremos de sauna inmediato.</li>
              </ul>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Día 7 – Descanso</h3>
              <ul className="space-y-2 mb-6">
                <li>• Sol suave, paseo, buena comida, sueño.</li>
              </ul>

              <blockquote className="border-l-4 border-secondary pl-6 italic text-neutral-dark mb-8 bg-neutral-light/50 py-4">
                <strong>Deload</strong>: cada 4ª semana, baja volumen del HIIT un 30–40% y deja el frío en 1–2 min.
              </blockquote>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Seguridad (importante)</h2>

              <ul className="space-y-2 mb-8">
                <li>• <strong>Contraindicaciones</strong>: embarazo, epilepsia, cardiopatías graves o HTA no controlada → <strong>consulta médica</strong>.</li>
                <li>• <strong>Breathwork</strong>: si hay mareo, reduce intensidad; practica sentado/acostado.</li>
                <li>• <strong>Frío</strong>: nunca combines hiperventilación con agua; no te inmerses solo.</li>
                <li>• <strong>HIIT</strong>: progresa gradualmente y prioriza técnica.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Marcadores simples que vale la pena mirar</h2>

              <ul className="space-y-2 mb-8">
                <li>• <strong>VO₂ máx estimado</strong>.</li>
                <li>• <strong>FC en reposo</strong> y <strong>HRV</strong> (tendencias).</li>
                <li>• <strong>Sueño</strong> (duración/calidad).</li>
                <li>• <strong>Perímetro de cintura</strong> y <strong>energía estable</strong>.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Nutrición y estilo de vida que apoyan la tríada</h2>

              <ul className="space-y-2 mb-8">
                <li>• <strong>Proteína adecuada</strong> (1.6–2.2 g/kg/d).</li>
                <li>• <strong>Verduras y agua</strong> a diario.</li>
                <li>• <strong>Luz de mañana</strong>, rutina de sueño y pausas activas.</li>
                <li>• Alcohol mínimo.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Cómo lo hacemos en Nave Studio</h2>

              <p className="mb-4">
                Integramos las tres prácticas en sesiones guiadas para que <strong>aprendas técnica y regulación</strong>:
              </p>

              <ul className="space-y-2 mb-8">
                <li>• <strong>HIIT inteligente</strong> (adaptado a tu nivel).</li>
                <li>• <strong>Breathwork</strong> para activar o calmar según el momento.</li>
                <li>• <strong>Inmersión en frío</strong> a <strong>3–5 °C</strong> con seguridad, salida consciente y calentamiento natural.</li>
              </ul>

              {/* CTAs */}
              <div className="bg-neutral-light/50 rounded-lg p-8 my-12">
                <h3 className="text-xl font-heading text-primary mb-6 text-center">
                  ¿Listo para empezar tu práctica de biohacking?
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

export default BlogBiohacking;