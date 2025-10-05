import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/blog-yin-vinyasa-hero.jpg";

const BlogYinVinyasa = () => {
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Yin Yoga y Vinyasa Yoga: dos caminos complementarios para regular tu cuerpo y tu mente",
    "author": {
      "@type": "Person",
      "name": "Alan Iceman Earle",
      "description": "Instructor Certificado del Método Wim Hof"
    },
    "datePublished": "2025-08-13T00:00:00-03:00",
    "dateModified": "2025-08-13T00:00:00-03:00",
    "image": "https://studiolanave.com" + heroImage,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://studiolanave.com/blog/yin-yoga-vinyasa-yoga-beneficios-como-combinarlos"
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
    "articleSection": "Yoga, Yin, Vinyasa, Regulación del estrés, Bienestar",
    "keywords": ["Yin Yoga", "Vinyasa Yoga", "regulación", "bienestar", "movilidad", "fuerza", "Las Condes"]
  };

  return (
    <>
      <Helmet>
        <title>Yin vs Vinyasa Yoga: beneficios y cómo combinarlos | Nave Studio</title>
        <meta 
          name="description" 
          content="Yin regula y abre espacio; Vinyasa activa y fortalece. Guía práctica para elegir y combinarlos con respiración y frío de forma segura." 
        />
        <link rel="canonical" href="https://studiolanave.com/blog/yin-yoga-vinyasa-yoga-beneficios-como-combinarlos" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Yin vs Vinyasa Yoga: beneficios y cómo combinarlos | Nave Studio" />
        <meta property="og:description" content="Yin regula y abre espacio; Vinyasa activa y fortalece. Guía práctica para elegir y combinarlos con respiración y frío de forma segura." />
        <meta property="og:image" content={"https://studiolanave.com" + heroImage} />
        <meta property="og:url" content="https://studiolanave.com/blog/yin-yoga-vinyasa-yoga-beneficios-como-combinarlos" />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="es_CL" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Yin vs Vinyasa Yoga: beneficios y cómo combinarlos | Nave Studio" />
        <meta name="twitter:description" content="Yin regula y abre espacio; Vinyasa activa y fortalece. Guía práctica para elegir y combinarlos con respiración y frío de forma segura." />
        <meta name="twitter:image" content={"https://studiolanave.com" + heroImage} />
        
        {/* Article specific */}
        <meta property="article:published_time" content="2025-08-13T00:00:00-03:00" />
        <meta property="article:author" content="Alan Iceman Earle" />
        <meta property="article:section" content="Yoga, Yin, Vinyasa, Regulación del estrés, Bienestar" />
        
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
              Yin Yoga y Vinyasa Yoga: dos caminos complementarios para regular tu cuerpo y tu mente
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-white/80">
              <span>Por Alan Iceman Earle</span>
              <span className="hidden sm:inline">•</span>
              <span>13 de agosto, 2025</span>
              <span className="hidden sm:inline">•</span>
              <span>Yoga, Yin, Vinyasa, Regulación del estrés, Bienestar</span>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <article className="py-16">
          <div className="container mx-auto px-6 max-w-4xl">
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-neutral-dark leading-relaxed mb-8 font-medium">
                En Nave Studio trabajamos el yoga como herramienta de regulación: bajar revoluciones cuando hace falta, activar cuando toca, y construir una relación más inteligente con el estrés. Dentro de las prácticas que ofrecemos, <strong>Yin Yoga</strong> y <strong>Vinyasa Yoga</strong> cumplen roles distintos y se potencian entre sí. Aquí te explico qué es cada uno, qué beneficios aporta, para quién es mejor y cómo combinarlos (incluso con respiración y agua fría, de forma opcional).
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Qué es Yin Yoga (y qué no)</h2>

              <p className="mb-4">
                Yin Yoga es una práctica lenta, contemplativa y predominantemente pasiva. Se sostienen posturas en el suelo entre 2 y 5 minutos (a veces más), con músculos relajados y respiración tranquila. El objetivo es estimular tejidos fascia, ligamentos y cápsulas articulares, mejorar rangos de movimiento y entrenar la quietud atencional.
              </p>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Beneficios típicos:</h3>
              <ul className="space-y-2 mb-6">
                <li>• Mejora de movilidad y sensación de espacio articular.</li>
                <li>• Bajada del tono simpático (estrés), favoreciendo descanso y sueño.</li>
                <li>• Entrenamiento de paciencia, escucha y aceptación de la incomodidad suave.</li>
                <li>• Excelente complemento para personas que hacen HIIT, running o fuerza.</li>
              </ul>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Para quién es ideal:</h3>
              <ul className="space-y-2 mb-6">
                <li>• Quienes sienten rigidez, sobrecarga muscular o aceleración mental.</li>
                <li>• Personas que buscan recuperación y mejor higiene del sueño.</li>
                <li>• Principiantes que desean una puerta de entrada amable al yoga.</li>
              </ul>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Qué esperar en clase:</h3>
              <ul className="space-y-2 mb-8">
                <li>• Inmersión lenta, uso de props (bolsters, bloques, mantas).</li>
                <li>• Instrucciones claras sobre límites seguros y variantes.</li>
                <li>• Enfoque en exhalaciones largas y respiración nasal.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Qué es Vinyasa Yoga</h2>

              <p className="mb-4">
                Vinyasa es una práctica dinámica: secuencias fluidas y coordinadas con la respiración ujjayi (nasal, constante). Trabaja fuerza, estabilidad, equilibrio y foco, elevando suavemente la temperatura corporal y la capacidad cardiorrespiratoria.
              </p>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Beneficios típicos:</h3>
              <ul className="space-y-2 mb-6">
                <li>• Mejora de fuerza funcional, estabilidad del core y propiocepción.</li>
                <li>• Aumento del VO₂ de forma amable y sostenida.</li>
                <li>• Más claridad mental y sensación de energía estable tras la clase.</li>
                <li>• Apoyo a la postura y a patrones de movimiento saludables.</li>
              </ul>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Para quién es ideal:</h3>
              <ul className="space-y-2 mb-6">
                <li>• Quienes buscan activar y "desatascarse" del sedentarismo.</li>
                <li>• Personas que aman fluir al ritmo de la respiración-movimiento.</li>
                <li>• Practicantes que quieren un puente hacia HIIT, trekking u otros deportes.</li>
              </ul>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Qué esperar en clase:</h3>
              <ul className="space-y-2 mb-8">
                <li>• Calentamiento progresivo, saludos al sol, secuencias con transiciones.</li>
                <li>• Opciones para todos los niveles con ajustes del instructor.</li>
                <li>• Cierre en Savasana para integración y calma.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Yin vs Vinyasa: no compiten, se complementan</h2>

              <p className="mb-4">
                Piensa Yin y Vinyasa como dos polos de autorregulación:
              </p>

              <ul className="space-y-2 mb-8">
                <li>• <strong>Yin → parasimpático:</strong> baja revoluciones, movilidad pasiva, introspección.</li>
                <li>• <strong>Vinyasa → activación regulada:</strong> fuerza y circulación, foco en movimiento.</li>
              </ul>

              <p className="mb-8">
                Combinarlos durante la semana entrena tu capacidad de subir y bajar marchas a voluntad, algo clave para la resiliencia y el bienestar a largo plazo.
              </p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Cómo combinarlos (3 planes simples)</h2>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Opción A — Recuperación y sueño (ideal si estás "a mil")</h3>
              <ul className="space-y-2 mb-6">
                <li>• Lun o Mar: Yin (45–60 min)</li>
                <li>• Jue o Vie: Yin + respiración 4-6 (5–8 min)</li>
                <li>• Sáb: Caminata al sol / movilidad suave</li>
              </ul>
              <p className="text-sm italic mb-8">Opcional: ducha fresca 60–90 s después del día de caminata, no tras Yin.</p>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Opción B — Energía estable (balance 50/50)</h3>
              <ul className="space-y-2 mb-6">
                <li>• Lun: Vinyasa (60 min)</li>
                <li>• Mié: Yin (60 min)</li>
                <li>• Sáb: Vinyasa (45–60 min) + Savasana largo</li>
              </ul>
              <p className="text-sm italic mb-8">Opcional: agua fría breve (1–2 min) tras Vinyasa si te sientes estable, con exhalaciones largas para salir en calma.</p>

              <h3 className="text-2xl font-heading text-primary mt-8 mb-4">Opción C — Deporte y rendimiento (activación + descarga)</h3>
              <ul className="space-y-2 mb-6">
                <li>• Mar: Vinyasa (45–60 min) como activación técnica.</li>
                <li>• Jue: Yin (60 min) para recuperar y ganar rango.</li>
                <li>• Dom: Vinyasa suave + respiración nasal consciente.</li>
              </ul>
              <p className="text-sm italic mb-8">Opcional: si haces HIIT en la semana, ubica Yin después del día más intenso.</p>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Yin/Vinyasa + respiración y agua fría (opcional y seguro)</h2>

              <ul className="space-y-2 mb-8">
                <li>• <strong>Antes de Vinyasa:</strong> 2–3 min de respiración nasal con exhalaciones más largas que las inhalaciones (p. ej., 4-6). Enciende foco sin sobreexcitar.</li>
                <li>• <strong>Después de Vinyasa:</strong> si optas por agua fría breve (1–2 min), entra regulando, no hiperventiles, hombros sueltos; sal y calienta de forma natural (movilidad suave, respiración nasal).</li>
                <li>• <strong>Antes de Yin:</strong> 1–2 min de respiración lenta (4-6) para aterrizar.</li>
                <li>• <strong>Después de Yin:</strong> evita el frío intenso inmediato; el objetivo es mantener el estado parasimpático.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Seguridad y contraindicaciones</h2>

              <ul className="space-y-2 mb-8">
                <li>• <strong>Yin:</strong> evita "forzar" el rango. Sensación de tensión tolerable sí; dolor agudo no. En lesiones articulares recientes, adapta con el instructor.</li>
                <li>• <strong>Vinyasa:</strong> prioriza técnica y alineación; opciones para muñecas, hombros y zona lumbar. Si tienes hipertensión no controlada o problemas cardiovasculares, trabaja a ritmo suave y avisa al instructor.</li>
                <li>• <strong>Respiración/Frío (opcional):</strong> no practiques retenciones de pie ni en el agua; evita frío intenso si estás enfermo, con falta de sueño o mareos.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Preguntas frecuentes</h2>

              <div className="space-y-4 mb-8">
                <div>
                  <strong>¿Puedo empezar desde cero?</strong>
                  <p>Sí. Ambas clases ofrecen variantes para principiantes y progresiones seguras.</p>
                </div>
                <div>
                  <strong>¿Cuántas veces por semana?</strong>
                  <p>Con 2–3 prácticas/sem ya notarás cambios; combinar 1 Yin + 1 Vinyasa funciona de maravilla.</p>
                </div>
                <div>
                  <strong>¿Necesito ser flexible para Vinyasa?</strong>
                  <p>No. La fuerza y la movilidad se construyen practicando. Para eso está Yin también.</p>
                </div>
                <div>
                  <strong>¿Duele el Yin?</strong>
                  <p>No debería. Busca una incomodidad suave y sostenible; ajusta con props.</p>
                </div>
              </div>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Cómo se vive en Nave Studio</h2>

              <ul className="space-y-2 mb-8">
                <li>• <strong>Yin Yoga + Ice Bath (opcional):</strong> primero regulamos y abrimos espacio; el frío (si eliges) es breve y consciente.</li>
                <li>• <strong>Vinyasa Yoga + Ice Bath (opcional):</strong> fluimos, activamos y cerramos con integración; el frío opcional se usa para entrenar la salida a la calma.</li>
                <li>• Instructores atentos, ajustes personalizados y un ambiente cálido y seguro.</li>
              </ul>

              <h2 className="text-3xl font-heading text-primary mt-12 mb-6">Empieza hoy</h2>

              <ul className="space-y-2 mb-8">
                <li>• Clase de prueba de Yoga: perfecta para sentir la diferencia entre Yin y Vinyasa.</li>
                <li>• Planes & Precios: elige 1 vez/semana, 2 veces/semana o ilimitado, según tu objetivo.</li>
              </ul>

              {/* CTAs */}
              <div className="bg-neutral-light/50 rounded-lg p-8 my-12">
                <h3 className="text-xl font-heading text-primary mb-6 text-center">
                  Siguiente paso:
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
                    <a href="/planes-precios">
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

export default BlogYinVinyasa;
