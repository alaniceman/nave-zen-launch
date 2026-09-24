import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ExternalLink, MapPin, MessageCircle, Play, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import heroAsset from "@/assets/studio-ice-medicina.webp.asset.json";
import alanAsset from "@/assets/alan-wim-hof.webp.asset.json";

const BOOKING_URL = "/agenda-nave-studio";
const WHATSAPP_URL = "https://wa.me/56946120426";
const CANONICAL = "https://studiolanave.com/wim-hof-todos-los-podcasts";

const videos = [
  ["The Diary of a CEO", "Conversación con Wim Hof", "_vX-_fq-c50"],
  ["Joe Rogan Experience", "Episodio 712", "Np0jGp6442A"],
  ["Joe Rogan Experience", "Episodio 865", "H2NtdOKn630"],
  ["The Tim Ferriss Show", "Entrevista con Wim Hof", "XiQ7ka11QnQ"],
  ["The Rich Roll Podcast", "Conversación con Wim Hof", "i3d3bwzQFgk"],
  ["On Purpose", "Jay Shetty conversa con Wim Hof", "WlOy1MtQ4Wg"],
  ["Tom Bilyeu", "Conversación con Wim Hof", "c7MseR-eDkg"],
  ["Feel Better, Live More", "Rangan Chatterjee y Wim Hof", "MYp5NmlEpIE"],
  ["Rangan Chatterjee", "Segunda conversación o selección", "xvMi1f99Y_s"],
  ["Impact Theory", "Tom Bilyeu y Wim Hof", "TM6WKeZ43s4"],
  ["Impact Theory", "Otra entrevista con Wim Hof", "n5j4d-OJcsw"],
  ["Under the Skin", "Russell Brand y Wim Hof", "JPPlicAEFec"],
  ["Aubrey Marcus Podcast", "Conversación con Wim Hof", "faEuWowzzg0"],
  ["Inspired Evolution", "Amrit Sandhu y Wim Hof", "CEA6sHEoxNs"],
  ["Think Tank", "Robert Edward Grant, episodio 64", "ral9Nx6R9Mc"],
  ["Inspire Me", "Stephen Olexy y Wim Hof", "rXyBbLW33IA"],
] as const;

function PodcastCard({ program, title, id }: { program: string; title: string; id: string }) {
  const [playing, setPlaying] = useState(false);
  const youtubeUrl = `https://www.youtube.com/watch?v=${id}`;

  return (
    <article className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="aspect-video bg-muted">
        {playing ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            title={`${program}: ${title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <Button
            type="button"
            variant="ghost"
            className="group relative h-full w-full rounded-none p-0"
            onClick={() => setPlaying(true)}
            aria-label={`Reproducir ${program}: ${title}`}
          >
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt={`Miniatura de ${program}: ${title}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-foreground/20 transition-colors group-hover:bg-foreground/30">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background text-primary shadow-lg">
                <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
              </span>
            </span>
          </Button>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold uppercase text-primary">{program}</p>
        <h3 className="mt-1 text-base font-semibold text-foreground">{title}</h3>
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          Ver en YouTube <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

const sectionClass = "mx-auto max-w-4xl px-5 py-12 md:px-6 md:py-16";
const headingClass = "font-heading text-3xl font-bold text-foreground md:text-4xl";
const subheadingClass = "mt-9 font-heading text-2xl font-semibold text-foreground";
const paragraphClass = "mt-4 leading-7 text-muted-foreground";

export default function WimHofTodosLosPodcasts() {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Wim Hof: podcasts, entrevistas y cómo practicar en Chile",
    description: "Selección de entrevistas de Wim Hof, explicación del método y opciones para practicar con guía en Santiago.",
    author: { "@type": "Organization", name: "Equipo de Nave Studio" },
    publisher: { "@type": "Organization", name: "Nave Studio" },
    datePublished: "2026-09-24",
    dateModified: "2026-09-24",
    mainEntityOfPage: CANONICAL,
    inLanguage: "es-CL",
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://studiolanave.com/" },
      { "@type": "ListItem", position: 2, name: "Recursos", item: "https://studiolanave.com/blog" },
      { "@type": "ListItem", position: 3, name: "Podcasts de Wim Hof", item: CANONICAL },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Wim Hof: podcasts y método en Chile | Nave Studio</title>
        <meta name="description" content="Escucha podcasts de Wim Hof con Joe Rogan, The Diary of a CEO y más. Conoce el método y agenda una sesión guiada en Nave Studio, Las Condes." />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Wim Hof: podcasts y método en Chile | Nave Studio" />
        <meta property="og:description" content="Escucha podcasts de Wim Hof con Joe Rogan, The Diary of a CEO y más. Conoce el método y agenda una sesión guiada en Nave Studio, Las Condes." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:type" content="article" />
        <meta property="og:locale" content="es_CL" />
        <meta property="og:site_name" content="Nave Studio" />
        <meta property="og:image" content={heroAsset.url} />
        <meta property="og:image:alt" content="Sesión guiada de frío en Nave Studio, Las Condes" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wim Hof: podcasts y método en Chile | Nave Studio" />
        <meta name="twitter:description" content="Escucha podcasts de Wim Hof con Joe Rogan, The Diary of a CEO y más. Conoce el método y agenda una sesión guiada en Nave Studio, Las Condes." />
        <meta name="twitter:image" content={heroAsset.url} />
        <link rel="alternate" hrefLang="es-CL" href={CANONICAL} />
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <main>
        <section className="relative flex min-h-[78vh] items-end overflow-hidden pb-12 pt-32 md:pb-16">
          <img src={heroAsset.url} alt="Sesión guiada de frío en Nave Studio, Las Condes" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-foreground/70" />
          <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-6">
            <div className="max-w-4xl text-primary-foreground">
              <p className="mb-4 text-sm font-semibold uppercase">Selección editorial · Nave Studio</p>
              <h1 className="font-heading text-4xl font-bold leading-tight md:text-6xl">Wim Hof: podcasts, entrevistas y cómo practicar en Chile</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-primary-foreground/90 md:text-xl">Explora conversaciones de Wim Hof con Joe Rogan, The Diary of a CEO y otros programas. Conoce su método y descubre cómo practicarlo con acompañamiento en Nave Studio, Las Condes, Santiago.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 bg-background px-6 text-primary hover:bg-background/90">
                  <Link to={BOOKING_URL}>Agendar mi sesión en Nave Studio</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 border-primary-foreground/60 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                  <a href="#podcasts">Explorar los podcasts</a>
                </Button>
              </div>
              <p className="mt-6 text-sm text-primary-foreground/80">Por Equipo de Nave Studio · Publicado el 24 de septiembre de 2026</p>
            </div>
          </div>
        </section>

        <nav aria-label="Índice del artículo" className="border-b border-border bg-muted/40">
          <div className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-5 py-4 text-sm font-medium md:px-6">
            <a href="#podcasts" className="whitespace-nowrap text-primary hover:underline">Podcasts</a>
            <a href="#metodo" className="whitespace-nowrap text-primary hover:underline">El método</a>
            <a href="#ciencia" className="whitespace-nowrap text-primary hover:underline">Ciencia</a>
            <a href="#precauciones" className="whitespace-nowrap text-primary hover:underline">Precauciones</a>
            <a href="#nave-studio" className="whitespace-nowrap text-primary hover:underline">Practicar en Santiago</a>
            <a href="#preguntas" className="whitespace-nowrap text-primary hover:underline">Preguntas frecuentes</a>
          </div>
        </nav>

        <section id="podcasts" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-12 md:px-6 md:py-16">
          <div className="max-w-3xl">
            <h2 className={headingClass}>Podcasts y entrevistas de Wim Hof</h2>
            <p className={paragraphClass}>Escuchar a Wim Hof conversar permite conocer su historia y las preguntas que el método ha inspirado. Esta es una selección de entrevistas en distintos programas, no un archivo exhaustivo.</p>
            <p className={paragraphClass}>Las entrevistas están principalmente en inglés. La disponibilidad de subtítulos en español depende de cada video. Las opiniones de sus participantes deben distinguirse de la investigación científica.</p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map(([program, title, id]) => <PodcastCard key={id} program={program} title={title} id={id} />)}
          </div>
        </section>

        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-5xl px-5 py-10 text-center md:px-6">
            <h2 className="font-heading text-2xl font-bold md:text-3xl">¿Quieres llevarlo a la práctica?</h2>
            <p className="mx-auto mt-3 max-w-3xl leading-7 text-primary-foreground/85">En Nave Studio puedes practicar el Método Wim Hof con sesiones guiadas de respiración y exposición progresiva al frío en Las Condes, Santiago.</p>
            <Button asChild size="lg" className="mt-6 bg-background text-primary hover:bg-background/90"><Link to={BOOKING_URL}>Agendar en Nave Studio</Link></Button>
          </div>
        </section>

        <article>
          <section id="metodo" className={`${sectionClass} scroll-mt-24`}>
            <h2 className={headingClass}>¿Quién es Wim Hof?</h2>
            <p className={paragraphClass}>Wim Hof es un deportista neerlandés conocido por sus desafíos de resistencia al frío. Su historia despertó interés por la relación entre respiración, atención y respuestas del cuerpo ante condiciones exigentes.</p>
            <p className={paragraphClass}>Con el tiempo, su práctica dio origen al Método Wim Hof, que se enseña mediante cursos y una red internacional de instructores certificados. Sus desafíos extremos no son una meta de iniciación: para comenzar, lo relevante es reconocer las propias respuestas, recibir orientación y avanzar progresivamente.</p>

            <h2 className={`${headingClass} mt-14`}>¿En qué consiste el Método Wim Hof?</h2>
            <p className={paragraphClass}>El método reúne tres pilares. Cada uno tiene un lugar dentro de la práctica y requiere entender sus indicaciones.</p>
            <h3 className={subheadingClass}>1. Respiración</h3>
            <p className={paragraphClass}>Incluye ejercicios específicos que alternan respiraciones y retenciones. Se realizan en un entorno seguro, sentados o recostados. Una sesión guiada permite conocer la técnica, plantear dudas y entender cuándo detenerse.</p>
            <h3 className={subheadingClass}>2. Exposición progresiva al frío</h3>
            <p className={paragraphClass}>Puede adoptar distintas formas, como duchas frías o inmersiones. Su intensidad debe adaptarse a la persona y al contexto. La temperatura más baja o el tiempo más largo no son una medida de una mejor práctica.</p>
            <h3 className={subheadingClass}>3. Atención y compromiso</h3>
            <p className={paragraphClass}>Se relaciona con la intención, la constancia y la capacidad de observar lo que ocurre durante la experiencia. En una práctica guiada también se aprende a reconocer límites y respetarlos.</p>
            <h3 className={subheadingClass}>¿Un baño de hielo es lo mismo que el Método Wim Hof?</h3>
            <p className={paragraphClass}>No. Un baño de hielo es una forma de exposición al frío; el Método Wim Hof incorpora además respiración y entrenamiento mental. Conviene revisar qué incluye una actividad, quién la facilita y cómo se adapta a quienes comienzan.</p>
          </section>

          <section id="ciencia" className="scroll-mt-24 bg-muted/40">
            <div className={sectionClass}>
              <h2 className={headingClass}>Beneficios del Método Wim Hof: ¿qué dice la ciencia?</h2>
              <p className={paragraphClass}>La investigación ha estudiado algunas respuestas fisiológicas relacionadas con la respiración y el entrenamiento del método. Es importante distinguir los resultados de un estudio de las experiencias personales relatadas en una entrevista.</p>
              <h3 className={subheadingClass}>Un estudio sobre respuesta inflamatoria</h3>
              <p className={paragraphClass}>En 2014, Kox y colaboradores observaron que voluntarios entrenados podían modificar su respuesta a una endotoxina administrada en un experimento controlado. Se registraron cambios en adrenalina y marcadores inflamatorios. Esto no demuestra que el método prevenga infecciones cotidianas o sustituya tratamientos médicos.</p>
              <a className="mt-3 inline-flex text-primary underline" href="https://pubmed.ncbi.nlm.nih.gov/24799686/" target="_blank" rel="noopener noreferrer">Leer el estudio de Kox y colaboradores en PNAS</a>
              <h3 className={subheadingClass}>Lo que encontró una revisión de estudios</h3>
              <p className={paragraphClass}>Una revisión sistemática publicada en PLOS ONE en 2024 reunió nueve artículos correspondientes a ocho ensayos. Encontró señales de posibles efectos sobre la inflamación y resultados mixtos en rendimiento físico. También señaló limitaciones y riesgos de sesgo que hacen necesaria más investigación.</p>
              <a className="mt-3 inline-flex text-primary underline" href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0286933" target="_blank" rel="noopener noreferrer">Leer la revisión sistemática de 2024</a>
              <h3 className={subheadingClass}>Cómo interpretar esta información</h3>
              <p className={paragraphClass}>El método puede explorarse como una práctica de bienestar. Las sensaciones varían entre personas; no permiten prometer resultados individuales ni afirmar que una enfermedad se resolverá mediante respiración o frío.</p>
            </div>
          </section>

          <section id="precauciones" className={`${sectionClass} scroll-mt-24`}>
            <div className="flex items-center gap-3"><ShieldCheck className="h-8 w-8 text-primary" aria-hidden="true" /><h2 className={headingClass}>Precauciones antes de practicar</h2></div>
            <p className={paragraphClass}>La respiración del método se practica fuera del agua, sentado o recostado, nunca mientras conduces, te duchas, estás en una tina o nadas. Durante una inmersión se respira normalmente: no se realizan retenciones.</p>
            <p className={paragraphClass}>La organización del Método Wim Hof desaconseja practicarlo durante el embarazo y en personas con epilepsia, y señala otras contraindicaciones. Si tienes una enfermedad cardiovascular, hipertensión tratada o una condición médica o psicológica importante, consulta con tu profesional de salud antes de participar.</p>
            <p className={paragraphClass}>Antes de una sesión, informa al equipo sobre tus antecedentes. La inmersión requiere progresión y supervisión; la guía no elimina todos los riesgos.</p>
            <a className="mt-4 inline-flex text-primary underline" href="https://www.wimhofmethod.com/faq" target="_blank" rel="noopener noreferrer">Consultar precauciones oficiales del Método Wim Hof</a>
          </section>

          <section id="nave-studio" className="scroll-mt-24 bg-muted/40">
            <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1.05fr_.95fr] md:px-6 md:py-16">
              <div>
                <h2 className={headingClass}>¿Dónde practicar el Método Wim Hof en Santiago?</h2>
                <p className={paragraphClass}>En Nave Studio realizamos sesiones de respiración y exposición al frío en <strong className="text-foreground">Antares 259, Las Condes, Santiago</strong>, cerca de Metro Los Dominicos.</p>
                <p className={paragraphClass}>Puedes consultar las actividades disponibles y conversar con el equipo para elegir una experiencia acorde con tu punto de partida. Si es tu primera vez, indícalo al reservar.</p>
                <h3 className={subheadingClass}>¿Cómo es una experiencia en Nave Studio?</h3>
                <p className={paragraphClass}>La propuesta incluye introducción, respiración guiada fuera del agua, inmersión progresiva cuando corresponde y recuperación e integración. La respiración y el frío son momentos distintos. No necesitas llegar con una meta de tiempo dentro del agua.</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg"><Link to={BOOKING_URL}>Ver horarios y reservar</Link></Button>
                  <Button asChild size="lg" variant="outline"><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><MessageCircle className="mr-2 h-4 w-4" />Tengo una pregunta</a></Button>
                </div>
                <Link to="/contacto" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary underline"><MapPin className="h-4 w-4" />Cómo llegar a Nave Studio</Link>
              </div>
              <img src={heroAsset.url} alt="Espacio de inmersión en frío de Nave Studio" loading="lazy" className="h-full min-h-80 w-full rounded-lg object-cover" />
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Elige cómo comenzar</h2>
            <div className="mt-7 overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-muted"><tr><th className="p-4">Opción</th><th className="p-4">Para quién puede ser útil</th><th className="p-4">Siguiente paso</th></tr></thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="p-4 font-semibold">Sesión guiada</td><td className="p-4">Quienes quieren conocer o retomar la experiencia</td><td className="p-4"><Link className="text-primary underline" to={BOOKING_URL}>Consultar y reservar</Link></td></tr>
                  <tr><td className="p-4 font-semibold">Taller de fundamentos</td><td className="p-4">Quienes buscan una introducción más extensa</td><td className="p-4"><Link className="text-primary underline" to="/talleres-y-retiros">Consultar fechas</Link></td></tr>
                  <tr><td className="p-4 font-semibold">Actividad avanzada</td><td className="p-4">Personas con experiencia previa y requisitos cumplidos</td><td className="p-4"><Link className="text-primary underline" to="/talleres-y-retiros">Revisar disponibilidad</Link></td></tr>
                </tbody>
              </table>
            </div>
            <p className={paragraphClass}>La disponibilidad, duración y precio dependen de la actividad elegida. Consulta la información vigente antes de reservar.</p>
          </section>

          <section className="bg-primary text-primary-foreground">
            <div className="mx-auto grid max-w-5xl items-center gap-8 px-5 py-12 md:grid-cols-[220px_1fr] md:px-6 md:py-16">
              <img src={alanAsset.url} alt="Alan Earle, instructor avanzado del Método Wim Hof" loading="lazy" className="aspect-square w-full max-w-[220px] rounded-lg object-cover" />
              <div><h2 className="font-heading text-3xl font-bold">Conoce a Alan Earle, instructor en Chile</h2><p className="mt-4 leading-7 text-primary-foreground/85">Alan Earle, también conocido como Alan Iceman, es fundador de Nave Studio e Instructor Avanzado del Método Wim Hof. Su camino con el frío comenzó como una búsqueda personal y hoy se traduce en una invitación a aprender, hacer preguntas y explorar la relación con el propio cuerpo.</p><div className="mt-5 flex flex-wrap gap-5 text-sm font-semibold"><Link className="underline" to="/instructor/alan">Conoce a Alan en Nave Studio</Link><a className="underline" href="https://activities.wimhofmethod.com/instructors/alan-earle-2" target="_blank" rel="noopener noreferrer">Ver certificación oficial</a></div></div>
            </div>
          </section>

          <section id="preguntas" className={`${sectionClass} scroll-mt-24`}>
            <h2 className={headingClass}>Preguntas frecuentes sobre Wim Hof en Chile</h2>
            <div className="mt-8 divide-y divide-border border-y border-border">
              {[
                ["¿Hay instructores certificados del Método Wim Hof en Chile?", "Sí. Puedes encontrarlos en el directorio oficial. Alan Earle figura como Instructor Avanzado en Santiago. Revisa quién facilita cada actividad y su certificación."],
                ["¿Wim Hof realiza personalmente las sesiones de Nave Studio?", "No. Las actividades habituales son facilitadas por el equipo local. Esta página no anuncia una visita de Wim Hof a Chile."],
                ["¿Necesito experiencia previa?", "Para comenzar, consulta por una sesión de iniciación o taller de fundamentos. Las actividades avanzadas pueden exigir experiencia y otros requisitos."],
                ["¿Puedo hacer solo un baño de hielo?", "Depende de la actividad disponible y sus requisitos. Si estás comenzando, consulta al equipo para elegir una experiencia guiada adecuada."],
                ["¿Se hace la respiración de Wim Hof dentro del agua?", "No. Los ejercicios de respiración y retención se realizan fuera del agua, sentado o recostado. Durante la inmersión se respira normalmente."],
                ["¿Cuánto tiempo tengo que estar en el agua fría?", "No existe una duración universal apropiada. Depende de las condiciones, antecedentes y respuesta individual. Sigue las indicaciones y comunica cualquier malestar."],
                ["¿El Método Wim Hof cura enfermedades?", "No debe presentarse como una cura ni reemplazar atención médica. La investigación sobre ciertos efectos fisiológicos no demuestra eficacia para tratar cualquier enfermedad."],
                ["¿Cuánto cuesta una sesión en Nave Studio?", "Consulta precios, horarios y opciones vigentes en nuestra agenda para elegir con información actualizada."],
                ["¿Dónde está Nave Studio?", "En Antares 259, Las Condes, Santiago, cerca de Metro Los Dominicos."],
                ["¿Hay podcasts de Wim Hof con subtítulos en español?", "Algunos videos pueden ofrecer subtítulos o traducción automática. La disponibilidad y precisión dependen de cada video."],
              ].map(([question, answer]) => <div key={question} className="py-5"><h3 className="font-semibold text-foreground">{question}</h3><p className="mt-2 leading-7 text-muted-foreground">{answer}</p></div>)}
            </div>
          </section>

          <section className="bg-muted/40">
            <div className={`${sectionClass} text-center`}>
              <h2 className={headingClass}>Da el siguiente paso en Nave Studio</h2>
              <p className="mx-auto mt-4 max-w-2xl leading-7 text-muted-foreground">Si te interesa conocer la respiración y la exposición al frío con acompañamiento, revisa nuestras próximas sesiones en Las Condes. Ven con tus preguntas: podemos orientarte para elegir cómo comenzar.</p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Button asChild size="lg"><Link to={BOOKING_URL}>Ver sesiones en Nave Studio</Link></Button><Button asChild size="lg" variant="outline"><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Consultar por WhatsApp</a></Button></div>
              <p className="mt-5 text-sm text-muted-foreground">Antares 259, Las Condes, Santiago · Cerca de Metro Los Dominicos</p>
            </div>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Fuentes y lecturas recomendadas</h2>
            <ul className="mt-6 space-y-3 text-primary">
              <li><a className="underline" href="https://www.wimhofmethod.com/faq" target="_blank" rel="noopener noreferrer">Preguntas frecuentes del Método Wim Hof</a></li>
              <li><a className="underline" href="https://activities.wimhofmethod.com/instructors/alan-earle-2" target="_blank" rel="noopener noreferrer">Directorio oficial: Alan Earle, Advanced Instructor</a></li>
              <li><a className="underline" href="https://pubmed.ncbi.nlm.nih.gov/24799686/" target="_blank" rel="noopener noreferrer">Kox y colaboradores, PNAS, 2014</a></li>
              <li><a className="underline" href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0286933" target="_blank" rel="noopener noreferrer">Almahayni y Hammond, revisión sistemática, PLOS ONE, 2024</a></li>
              <li><a className="underline" href="https://www.wimhofmethod.com/media" target="_blank" rel="noopener noreferrer">Podcasts y apariciones de Wim Hof en medios</a></li>
            </ul>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}