import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ExternalLink, Headphones, MapPin } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import coverAsset from "@/assets/alan-earle-alan-iceman-nave-studio.webp.asset.json";

const CANONICAL = "https://studiolanave.com/blog/alan-earle-alan-iceman-podcasts-entrevistas";
const BOOKING_URL = "/agenda-nave-studio";

type LinkItem = { label: string; url: string };
type MediaItem = { program: string; title: string; links: LinkItem[] };

const podcasts: MediaItem[] = [
  { program: "El Podcast de Nico Orellana", title: "E36: Alan Earle, beneficios del agua fría", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=iIDZBGB3p6w" }, { label: "Spotify", url: "https://open.spotify.com/episode/29UD4I62hQaQynzkY02H6x" }] },
  { program: "Ni Tan Financieros", title: "Alan Earle | Iceman: Cómo el agua fría transformó mi vida", links: [{ label: "Spotify", url: "https://open.spotify.com/episode/6imWdSKWfH8PM7RJByGKcc" }] },
  { program: "Cristóbal Carrasco", title: "Cómo el agua fría puede cambiar tu vida, con Alan “Iceman” Earle", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=LbTykzGs7Hs" }, { label: "Spotify", url: "https://open.spotify.com/episode/6S4Eku2hKN9irtDA2HBzk5" }] },
  { program: "Anatomía Creativa / El Podcast de eSponsor", title: "Alan Iceman: criomedicina, emprendimiento y creación de contenido", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=JoC4RjlgBeg" }] },
  { program: "Chile Huerta", title: "T4:E2: Terapia de Hielo", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=I40ZwOoDjjI" }, { label: "Spotify", url: "https://open.spotify.com/episode/4McWs8BSjs6mUOZnGArBsH" }] },
  { program: "Iki, con Kika Silva", title: "El poder del hielo. Con participación de Alan Earle y Nico Jarry", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=FZcJf90cYjk" }] },
  { program: "Gabriel Lama", title: "Recuperación de alto impacto: el poder del agua fría y la respiración", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=7lsRR2Ccqo0" }] },
  { program: "Saludtech", title: "T2, EP12: El poder sanador del agua fría, con Alan Earle", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=bCgjZA1P7sI" }] },
  { program: "Estado de Flow", title: "De la quiebra a la sanación: Alan Iceman, Método Wim Hof y crioterapia", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=pA5eCJEgs0Q" }] },
  { program: "Despeinando el Tercer Ojo", title: "#21: El poder del hielo y los baños de agua fría", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=EnUHNojLJLA" }] },
  { program: "El Inversionista Interior", title: "Foco, atención y respiración: conversando con Alan Iceman", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=20ha5TisG-s" }] },
  { program: "Reprogramación Metabólica", title: "Criomedicina con Alan Iceman: beneficios revelados", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=DQZCMMGu97I" }] },
  { program: "Benditos Cambios, con Marietta Vallespir", title: "Episodio 5: Alan Earle", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=dDIfzwEd78Q" }] },
  { program: "Radio La Clave", title: "El mundo del hielo con la criomedicina o crioterapia", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=FPnRRGGgluE" }] },
  { program: "TVMÁS", title: "Tu Rumbo Verde, capítulo del 24 de noviembre de 2024", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=ir9MV1Ubvzc" }] },
];

const entrepreneurship: MediaItem[] = [
  { program: "Con Todas las de la Ley", title: "Lo que me hizo perder el miedo a volver a emprender no fue la necesidad, fue el agua fría", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=3L_-0PlFRBI" }] },
  { program: "Reboot", title: "Episodio 02: Alan Earle, el fracaso de Manga Corta", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=jmdZCo50Cvg" }] },
  { program: "Fracasa Conmigo", title: "Episodio 01: Alan Earle, caso Manga Corta", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=b4IognUU30E" }, { label: "Spotify", url: "https://open.spotify.com/episode/3YCWseQqjjk5GsXVObG3yV" }] },
  { program: "ComunidadFeliz", title: "Hablando de Growth con Cracks #8: Alan Earle", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=st2OzrWK-UM" }] },
  { program: "Vibe Builders, con Francisco Kemeny", title: "Vibe Coding para emprender más rápido con Alan Earle", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=OlHhqeCaTX8" }] },
  { program: "Big Radio", title: "No Somos Nada: Alan Earle de Manga Corta", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=1RpiA-4pSJM" }] },
  { program: "NicoLate Show", title: "Alan Earle nos cuenta sobre Manga Corta", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=glTlbYxXDEU" }] },
  { program: "Webprendedor Santiago 2018", title: "Alan Earle", links: [{ label: "YouTube", url: "https://www.youtube.com/watch?v=XCwDnoz28N8" }] },
];

const archive: MediaItem[] = [
  { program: "Nota TVN a Manga Corta", title: "Nota televisiva publicada en el canal de Manga Corta", links: [{ label: "Ver nota", url: "https://www.youtube.com/watch?v=Hw2gjPqEzRo" }] },
  { program: "Fuckup Nights", title: "La historia del fracaso de Manga Corta", links: [{ label: "Ver charla", url: "https://www.youtube.com/watch?v=ZbwPYQ9C_Po" }] },
  { program: "Quiero Ser Ingeniero", title: "Alan Earle, fundador de Manga Corta", links: [{ label: "Ver entrevista", url: "https://www.youtube.com/watch?v=BJj5ksmxaLE" }] },
  { program: "MiPymeInnova", title: "Alan Earle: “Emprendan desde la universidad”", links: [{ label: "Ver charla", url: "https://www.youtube.com/watch?v=7cw3try3lrI" }] },
  { program: "Manga Corta / Startup Chile", title: "Cumplir un sueño", links: [{ label: "Ver video", url: "https://www.youtube.com/watch?v=nHWehv4s0Hw" }] },
  { program: "Manga Corta en Broota", title: "Video de la campaña de crowdfunding", links: [{ label: "Ver campaña", url: "https://www.youtube.com/watch?v=G1vX50VqARM" }] },
  { program: "Big Radio", title: "Mangacorta consigue levantar $84 millones en menos de 24 horas", links: [{ label: "Ver nota", url: "https://www.youtube.com/watch?v=W3R2-JuqW8U" }] },
  { program: "Manga Corta en Idea.me", title: "Video de la primera campaña de financiamiento", links: [{ label: "Ver campaña", url: "https://www.youtube.com/watch?v=leN0Br-kMUE" }] },
  { program: "Radio Ucentral", title: "Actores y Noticias: Alan Earle / Manga Corta", links: [{ label: "Ver entrevista", url: "https://www.youtube.com/watch?v=-jIk3wld_Fw" }] },
  { program: "InnovaRock / Radio Futuro", title: "Promocional de la entrevista, no episodio completo", links: [{ label: "Ver promocional", url: "https://www.youtube.com/watch?v=EqcXlX4BHJ8" }] },
  { program: "Reboot", title: "Adelanto de la entrevista, no episodio adicional", links: [{ label: "Ver adelanto", url: "https://www.youtube.com/watch?v=HmxcLc02CgI" }] },
];

function MediaList({ items }: { items: MediaItem[] }) {
  return <div className="mt-7 grid gap-4 md:grid-cols-2">{items.map((item) => (
    <article key={`${item.program}-${item.title}`} className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <p className="text-sm font-semibold text-primary">{item.program}</p>
      <h3 className="mt-1 text-lg font-semibold leading-6 text-foreground">{item.title}</h3>
      <div className="mt-4 flex flex-wrap gap-3">{item.links.map((link) => (
        <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline">
          {link.label} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      ))}</div>
    </article>
  ))}</div>;
}

const sectionClass = "mx-auto max-w-5xl scroll-mt-24 px-5 py-12 md:px-6 md:py-16";
const headingClass = "font-heading text-3xl font-bold text-foreground md:text-4xl";
const paragraphClass = "mt-4 text-base leading-8 text-muted-foreground md:text-lg";

export default function BlogAlanEarlePodcasts() {
  const article = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: "Alan Earle, Alan Iceman: podcasts, entrevistas y su historia",
    description: "Conoce a Alan Earle, Alan Iceman, en podcasts y entrevistas sobre su historia, respiración y agua fría. Descubre Nave Studio en Las Condes.",
    image: coverAsset.url, author: { "@type": "Organization", name: "Nave Studio" },
    publisher: { "@type": "Organization", name: "Nave Studio", url: "https://studiolanave.com" },
    datePublished: "2026-09-25", dateModified: "2026-09-25", mainEntityOfPage: CANONICAL, inLanguage: "es-CL",
    articleSection: "Comunidad e historias",
  };
  const breadcrumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://studiolanave.com/" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://studiolanave.com/blog" },
    { "@type": "ListItem", position: 3, name: "Alan Earle: podcasts y entrevistas", item: CANONICAL },
  ] };

  return <div className="min-h-screen bg-background">
    <Helmet>
      <title>Alan Earle (Alan Iceman): podcasts y entrevistas | Nave</title>
      <meta name="description" content="Conoce a Alan Earle, Alan Iceman, en podcasts y entrevistas sobre su historia, respiración y agua fría. Descubre Nave Studio en Las Condes." />
      <link rel="canonical" href={CANONICAL} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta property="og:title" content="Alan Earle (Alan Iceman): podcasts y entrevistas | Nave" />
      <meta property="og:description" content="Conoce a Alan Earle, Alan Iceman, en podcasts y entrevistas sobre su historia, respiración y agua fría. Descubre Nave Studio en Las Condes." />
      <meta property="og:url" content={CANONICAL} /><meta property="og:type" content="article" /><meta property="og:locale" content="es_CL" />
      <meta property="og:image" content={coverAsset.url} /><meta property="og:image:alt" content="Retrato de Alan Earle con una mano sobre el pecho" />
      <meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="Alan Earle (Alan Iceman): podcasts y entrevistas | Nave" />
      <meta name="twitter:description" content="Conoce la historia de Alan Earle en podcasts y entrevistas sobre emprendimiento, respiración y agua fría." /><meta name="twitter:image" content={coverAsset.url} />
      <script type="application/ld+json">{JSON.stringify(article)}</script><script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
    </Helmet>
    <main>
      <header className="mx-auto max-w-6xl px-5 pb-10 pt-28 md:px-6 md:pb-14 md:pt-32">
        <Link to="/blog" className="text-sm font-semibold text-primary hover:underline">Blog de Nave Studio</Link>
        <div className="mt-5 overflow-hidden rounded-lg bg-muted"><img src={coverAsset.url} width="1440" height="810" alt="Retrato de Alan Earle con una mano sobre el pecho" className="aspect-video h-auto w-full object-cover object-center" /></div>
        <div className="mx-auto mt-9 max-w-4xl">
          <p className="text-sm font-semibold uppercase text-primary">Comunidad e historias</p>
          <h1 className="mt-3 font-heading text-4xl font-bold leading-tight text-foreground md:text-6xl">Alan Earle, Alan Iceman: podcasts, entrevistas y su historia</h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground">Si llegaste buscando a Alan Earle, Alan Iceman o alguna de sus entrevistas, aquí encontrarás una selección de podcasts, conversaciones y apariciones en medios para conocer su historia.</p>
          <p className="mt-5 text-sm text-muted-foreground">Por Nave Studio · 25 de septiembre de 2026</p>
        </div>
      </header>

      <nav aria-label="Índice del artículo" className="border-y border-border bg-muted/40"><div className="mx-auto flex max-w-5xl gap-5 overflow-x-auto px-5 py-4 text-sm font-medium md:px-6">
        <a href="#quien-es" className="whitespace-nowrap text-primary hover:underline">Quién es Alan</a><a href="#podcasts" className="whitespace-nowrap text-primary hover:underline">Podcasts</a><a href="#manga-corta" className="whitespace-nowrap text-primary hover:underline">Manga Corta</a><a href="#archivo" className="whitespace-nowrap text-primary hover:underline">Archivo</a><a href="#nave-studio" className="whitespace-nowrap text-primary hover:underline">Nave Studio</a><a href="#preguntas" className="whitespace-nowrap text-primary hover:underline">Preguntas</a>
      </div></nav>

      <article>
        <section className={sectionClass}>
          <p className={paragraphClass}>Alan es fundador de Nave Studio e Instructor Avanzado del Método Wim Hof. Su recorrido reúne etapas muy distintas: el emprendimiento con Manga Corta, los desafíos de volver a empezar y el desarrollo de un espacio dedicado a la respiración, el yoga y las experiencias guiadas de inmersión en agua fría en Santiago.</p>
          <p className={paragraphClass}>Esta página reúne enlaces a YouTube y Spotify, junto con registros de televisión, charlas y campañas de su etapa emprendedora.</p>
          <aside className="mt-8 rounded-lg border border-border bg-muted/40 p-6 md:flex md:items-center md:justify-between md:gap-8"><div><h2 className="font-heading text-2xl font-bold text-foreground">¿Quieres conocer la experiencia en persona?</h2><p className="mt-2 leading-7 text-muted-foreground">En Nave Studio puedes participar en sesiones guiadas de respiración y agua fría en Las Condes.</p></div><Button asChild size="lg" className="mt-5 shrink-0 md:mt-0"><Link to={BOOKING_URL}>Ver horarios y agendar</Link></Button></aside>
        </section>

        <section id="quien-es" className="bg-muted/30"><div className={sectionClass}><h2 className={headingClass}>¿Quién es Alan Earle, conocido como Alan Iceman?</h2>
          <p className={paragraphClass}>Alan Earle es ingeniero civil de la Pontificia Universidad Católica de Chile, emprendedor e Instructor Avanzado del Método Wim Hof. También es conocido como Alan Iceman por su trabajo facilitando experiencias de respiración e inmersión en agua fría.</p>
          <p className={paragraphClass}>Antes de Nave Studio estuvo detrás de Manga Corta, una plataforma que conectaba diseños de una comunidad creativa con la producción y venta de poleras. En distintas entrevistas comparte los aprendizajes de esa etapa, el cierre de su empresa y su posterior cambio de rumbo.</p>
          <p className={paragraphClass}>Hoy desarrolla su trabajo en Nave Studio, ubicado en Antares 259, Las Condes, cerca de Metro Los Dominicos. Allí, la respiración, el yoga y el contacto guiado con el frío forman parte de una propuesta de práctica y comunidad.</p>
        </div></section>

        <section id="podcasts" className={sectionClass}><h2 className={headingClass}>Podcasts de Alan Iceman sobre respiración, agua fría y su historia</h2><p className={paragraphClass}>Estas conversaciones permiten conocer a Alan desde distintos ángulos: su experiencia personal, su forma de acompañar a otras personas y el lugar que la respiración y el agua fría ocupan en su vida.</p><MediaList items={podcasts} /></section>

        <section id="manga-corta" className="bg-muted/30"><div className={sectionClass}><h2 className={headingClass}>Emprendimiento, Manga Corta y volver a empezar</h2><p className={paragraphClass}>La historia de Alan Earle también puede recorrerse a través de sus conversaciones sobre negocios. Estas entrevistas abordan su experiencia con Manga Corta, los aprendizajes del emprendimiento y las herramientas que utiliza en nuevos proyectos.</p><MediaList items={entrepreneurship} /></div></section>

        <section id="archivo" className={sectionClass}><h2 className={headingClass}>Archivo: televisión, charlas y crowdfunding de Manga Corta</h2><p className={paragraphClass}>Estos registros muestran etapas anteriores de su recorrido. Incluyen notas breves, una charla y videos de campañas de financiamiento; no todos son podcasts.</p><MediaList items={archive} /><a href="https://inversion.broota.com/campaign/manga-corta" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 font-medium text-primary hover:underline">Consultar la campaña histórica de Manga Corta en Broota <ExternalLink className="h-4 w-4" /></a></section>

        <section className="bg-muted/30"><div className={sectionClass}><h2 className={headingClass}>Más contenido de Alan Iceman</h2><div className="mt-7 grid gap-4 md:grid-cols-3">
          {[
            ["Canal de Alan Iceman en YouTube", "https://www.youtube.com/@alan_iceman"],
            ["Podcast La Nave por Alan Iceman en Spotify", "https://open.spotify.com/show/1oXU1ORsTRCN3nh5m5twmq"],
            ["Criomedicina con Alan Iceman a 1 °C, por Cristian Mesa Silva", "https://www.youtube.com/watch?v=QHgKoYywrPM"],
          ].map(([label, url]) => <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 rounded-lg border border-border bg-card p-5 font-semibold text-foreground shadow-sm hover:border-primary"><Headphones className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{label}<ExternalLink className="ml-auto h-4 w-4 shrink-0 text-primary" /></a>)}
        </div></div></section>

        <section id="nave-studio" className={sectionClass}><div className="flex items-center gap-3"><MapPin className="h-7 w-7 text-primary" /><h2 className={headingClass}>De escuchar un podcast a conocer Nave Studio</h2></div>
          <p className={paragraphClass}>Escuchar una entrevista puede abrir preguntas. Vivir una experiencia guiada permite explorar la práctica con acompañamiento, conocer el espacio y decidir cómo incorporarla a tu rutina.</p>
          <p className={paragraphClass}>En Nave Studio ofrecemos clases de yoga, sesiones de respiración e inmersión en agua fría y talleres del Método Wim Hof. Si es tu primera experiencia, cuéntanos al reservar para orientarte sobre la actividad adecuada y sus requisitos.</p>
          <p className={paragraphClass}>La respiración y la inmersión se realizan en momentos separados. Nunca practiques hiperventilación ni retenciones de respiración dentro del agua.</p>
          <p className={paragraphClass}>Nos encuentras en Antares 259, Las Condes, Santiago, cerca de Metro Los Dominicos.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Button asChild size="lg"><Link to={BOOKING_URL}>Ver horarios y agendar</Link></Button><Button asChild size="lg" variant="outline"><Link to="/talleres-y-retiros">Conocer los talleres Wim Hof</Link></Button><Button asChild size="lg" variant="outline"><Link to="/plan-de-prueba">Ver el plan de prueba</Link></Button></div>
        </section>

        <section id="preguntas" className="bg-muted/30"><div className={sectionClass}><h2 className={headingClass}>Preguntas frecuentes</h2><div className="mt-8 space-y-4">
          {[
            ["¿Alan Earle y Alan Iceman son la misma persona?", "Sí. Alan Iceman es el nombre con el que Alan Earle es conocido por su trabajo relacionado con la respiración y las experiencias de inmersión en agua fría."],
            ["¿Dónde puedo escuchar los podcasts de Alan Earle?", "En esta página encontrarás enlaces a episodios de YouTube y Spotify, incluyendo conversaciones con Nico Orellana, Cristóbal Carrasco, Ni Tan Financieros y otros programas."],
            ["¿Qué relación tiene Alan Earle con Manga Corta?", "Alan fue fundador de Manga Corta. Parte de sus entrevistas y charlas cuentan la historia de esa empresa y los aprendizajes de su etapa emprendedora."],
            ["¿Dónde puedo practicar con Alan Iceman en Santiago?", "Puedes consultar las sesiones y los talleres de Nave Studio en Las Condes. Revisa la agenda para conocer las actividades disponibles y quién facilita cada una."],
            ["¿Necesito experiencia para ir a Nave Studio?", "Existen actividades para comenzar y otras que requieren experiencia previa. Consulta la descripción de la sesión o taller antes de reservar."],
          ].map(([question, answer]) => <details key={question} className="rounded-lg border border-border bg-card p-5"><summary className="cursor-pointer font-semibold text-foreground">{question}</summary><p className="mt-3 leading-7 text-muted-foreground">{answer}</p></details>)}
        </div><Link to="/blog" className="mt-9 inline-flex font-medium text-primary hover:underline">Volver al blog de Nave Studio</Link></div></section>
      </article>
    </main><Footer />
  </div>;
}