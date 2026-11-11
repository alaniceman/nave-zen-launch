import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { icefestBlogArticles, getIcefestArticleBySlug } from "@/data/icefestBlog";
import { icefestBlogImages } from "@/data/icefestBlogImages";

const ORIGIN = "https://studiolanave.com";
const fmt = (d: string) =>
  new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Santiago" }).format(new Date(`${d}T12:00:00-03:00`));

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="icefest-theme min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <Link to="/icefest-santiago" className="font-bold text-lg">
            ICEFEST<span className="text-primary"> / SANTIAGO</span>
          </Link>
          <Button asChild size="sm" variant="outline">
            <Link to="/icefest-santiago#entradas"><Ticket className="w-4 h-4 mr-2" />Entradas</Link>
          </Button>
        </div>
      </header>
      {children}
      <footer className="max-w-6xl mx-auto px-5 py-10 flex flex-wrap gap-5 justify-between text-sm text-muted-foreground border-t border-border">
        <p>Icefest + Breath Act · Nave Studio</p>
        <div className="flex gap-5">
          <Link to="/icefest-santiago">Icefest</Link>
          <Link to="/icefest-santiago/blog">Blog</Link>
          <Link to="/">Nave Studio</Link>
        </div>
      </footer>
    </main>
  );
}

function List() {
  const url = `${ORIGIN}/icefest-santiago/blog`;
  return (
    <Shell>
      <Helmet>
        <title>Blog Icefest Santiago | Hielo, respiración y comunidad</title>
        <meta name="description" content="Historias y guías del Icefest: qué vives en el festival, por qué nos metemos al hielo y la historia detrás de la tribu." />
        <link rel="canonical" href={url} />
        <meta property="og:title" content="Blog Icefest Santiago" />
        <meta property="og:url" content={url} />
      </Helmet>
      <section className="max-w-6xl mx-auto px-5 py-14 md:py-20">
        <p className="text-primary text-sm uppercase tracking-widest mb-3">Blog</p>
        <h1 className="text-4xl md:text-6xl mb-10">Historias del Icefest</h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {icefestBlogArticles.map((a) => (
            <Link key={a.slug} to={`/icefest-santiago/blog/${a.slug}`} className="group border border-border rounded-lg overflow-hidden bg-card flex flex-col">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={icefestBlogImages[a.slug]} alt={a.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <span className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="w-4 h-4" />{fmt(a.date)}</span>
                <h2 className="text-xl leading-tight group-hover:text-primary transition-colors">{a.title}</h2>
                <p className="text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-primary text-sm">Leer artículo <ArrowRight className="w-4 h-4" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Shell>
  );
}

function Post({ slug }: { slug: string }) {
  const a = getIcefestArticleBySlug(slug);
  if (!a) return <Navigate to="/icefest-santiago/blog" replace />;
  const url = `${ORIGIN}/icefest-santiago/blog/${a.slug}`;
  return (
    <Shell>
      <Helmet>
        <title>{a.metaTitle}</title>
        <meta name="description" content={a.metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={a.metaTitle} />
        <meta property="og:description" content={a.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
      </Helmet>
      <article className="max-w-3xl mx-auto px-5 py-10 md:py-16">
        <Link to="/icefest-santiago/blog" className="inline-flex items-center gap-1 text-primary text-sm mb-8"><ArrowLeft className="w-4 h-4" />Volver al blog</Link>
        <h1 className="text-3xl md:text-5xl leading-tight mb-4">{a.title}</h1>
        <p className="flex items-center gap-2 text-sm text-muted-foreground mb-8"><CalendarDays className="w-4 h-4" /><time dateTime={a.date}>{fmt(a.date)}</time></p>
        <img src={icefestBlogImages[a.slug]} alt={a.title} className="w-full aspect-[16/10] object-cover rounded-lg mb-10" />
        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          {a.content.map((s, i) =>
            s.type === "heading" ? <h2 key={i} className="text-2xl md:text-3xl text-foreground pt-6">{s.text}</h2>
            : s.type === "subheading" ? <h3 key={i} className="text-xl md:text-2xl text-foreground pt-3">{s.text}</h3>
            : s.type === "list" ? <ul key={i} className="list-disc pl-6 space-y-2">{s.items?.map((it, j) => <li key={j}>{it}</li>)}</ul>
            : <p key={i}>{s.text}</p>
          )}
        </div>
        <div className="mt-14 p-8 border border-border rounded-lg bg-card text-center">
          <p className="text-2xl mb-5">Vive el Icefest este 13 de diciembre</p>
          <Button asChild size="lg" className="festival-cta"><Link to="/icefest-santiago#entradas"><Ticket className="w-5 h-5 mr-2" />Ver entradas</Link></Button>
        </div>
      </article>
    </Shell>
  );
}

export default function IcefestBlog() {
  const { slug } = useParams<{ slug: string }>();
  return slug ? <Post slug={slug} /> : <List />;
}
