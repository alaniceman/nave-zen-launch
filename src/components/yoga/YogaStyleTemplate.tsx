import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useScheduleEntries } from "@/hooks/useScheduleEntries";
import { CoachesSection } from "@/components/CoachesSection";
import { ReviewsTrustBar } from "@/components/ReviewsTrustBar";
import { SocialProofStrip } from "@/components/SocialProofStrip";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { coachIdsFromScheduleItems } from "@/lib/coachSync";
import { yogaReviewsForCoaches } from "@/lib/reviewFilters";
import {
  YOGA_HERO_IMAGE,
  YOGA_OG_IMAGE,
  otherYogaStyles,
  type YogaStyle,
} from "@/data/yogaStyles";
import { Check, ArrowRight, MapPin, Clock, Users, MessageCircle, Snowflake } from "lucide-react";

const DAY_ORDER = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] as const;
const DAY_NAMES: Record<string, string> = {
  lunes: "Lunes", martes: "Martes", miercoles: "Miércoles",
  jueves: "Jueves", viernes: "Viernes", sabado: "Sábado", domingo: "Domingo",
};

const WHATSAPP_BASE = "https://wa.me/56946120426?text=";

type Block = { day: string; dayName: string; items: any[] };

const buildBlocks = (scheduleData: any, match: RegExp): Block[] => {
  if (!scheduleData) return [];
  return DAY_ORDER.map((day) => {
    const items = (scheduleData.scheduleData[day] || [])
      .filter((item: any) => match.test(item.title))
      .sort((a: any, b: any) => a.time.localeCompare(b.time));
    if (items.length === 0) return null;
    return { day, dayName: DAY_NAMES[day], items };
  }).filter(Boolean) as Block[];
};

export const YogaStyleTemplate = ({ style }: { style: YogaStyle }) => {
  const { data: scheduleData, isLoading } = useScheduleEntries();

  const canonical = `https://studiolanave.com/yoga/${style.slug}`;

  const schedule = useMemo(
    () => buildBlocks(scheduleData, style.serviceMatch),
    [scheduleData, style.serviceMatch]
  );

  const related = useMemo(
    () => (style.relatedMatch ? buildBlocks(scheduleData, style.relatedMatch) : []),
    [scheduleData, style.relatedMatch]
  );

  const coachIds = useMemo(
    () => coachIdsFromScheduleItems(schedule.flatMap((b) => b.items), style.fallbackCoachIds),
    [schedule, style.fallbackCoachIds]
  );

  const reviewSet = useMemo(() => yogaReviewsForCoaches(coachIds, 6), [coachIds]);
  const styleReviews = reviewSet.items;
  const yogaReviewCount = reviewSet.total;

  const coachNames = useMemo(
    () =>
      Array.from(
        new Set(
          schedule.flatMap((b) => b.items.map((i: any) => i.instructor).filter(Boolean))
        )
      ) as string[],
    [schedule]
  );

  const totalClasses = schedule.reduce((acc, b) => acc + b.items.length, 0);

  const waHorarios = `${WHATSAPP_BASE}${encodeURIComponent(
    `Hola! Quiero saber los horarios de ${style.name} en Nave Studio.`
  )}`;

  const jsonLd = useMemo(() => {
    const localBusiness: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "SportsActivityLocation"],
      "@id": "https://studiolanave.com/#organization",
      name: `Nave Studio — ${style.name} en Las Condes`,
      description: style.description,
      url: canonical,
      telephone: "+56946120426",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Antares 259",
        addressLocality: "Las Condes",
        addressRegion: "Región Metropolitana",
        postalCode: "7550000",
        addressCountry: "CL",
      },
      geo: { "@type": "GeoCoordinates", latitude: -33.4172, longitude: -70.5885 },
      openingHours: ["Mo-Fr 06:00-22:00", "Sa-Su 07:00-20:00"],
      priceRange: "$$",
      image: YOGA_OG_IMAGE,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `Clases de ${style.name}`,
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: style.name,
              description: style.intro,
            },
          },
        ],
      },
    };

    if (styleReviews.length > 0) {
      localBusiness.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: "5",
        bestRating: "5",
        reviewCount: yogaReviewCount,
      };
      localBusiness.review = styleReviews.slice(0, 3).map((r) => ({
        "@type": "Review",
        reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
        author: { "@type": "Person", name: r.author },
        reviewBody: r.text,
      }));
    }

    const faqPage = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: style.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    };

    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: "https://studiolanave.com/" },
        { "@type": "ListItem", position: 2, name: "Yoga en Las Condes", item: "https://studiolanave.com/yoga-las-condes" },
        { "@type": "ListItem", position: 3, name: style.name, item: canonical },
      ],
    };

    return { localBusiness, faqPage, breadcrumb };
  }, [style, canonical, styleReviews, yogaReviewCount]);

  return (
    <>
      <Helmet>
        <title>{style.title}</title>
        <meta name="description" content={style.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={style.title} />
        <meta property="og:description" content={style.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={YOGA_OG_IMAGE} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={style.title} />
        <meta name="twitter:description" content={style.description} />
        <script type="application/ld+json">{JSON.stringify(jsonLd.localBusiness)}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLd.faqPage)}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLd.breadcrumb)}</script>
      </Helmet>

      <main>
        {/* Hero compacto: la respuesta (qué, dónde, cuándo, cuánto) sin scroll */}
        <section className="relative flex items-center justify-center overflow-hidden min-h-[62vh] md:min-h-[68vh]">
          <img
            src={YOGA_HERO_IMAGE}
            alt={`Clase de ${style.name} en Nave Studio, Las Condes`}
            className="absolute inset-0 w-full h-full object-cover"
            width={1600}
            height={900}
            {...({ fetchpriority: "high" } as any)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/75 via-primary/55 to-primary/80" />
          <div className="relative z-10 text-center px-6 max-w-3xl mx-auto py-16 md:py-20">
            <p className="text-white/70 font-inter text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              <Link to="/yoga-las-condes" className="hover:text-white transition-colors">
                Yoga en Las Condes
              </Link>
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-white font-space mb-4 leading-[1.1] tracking-tight">
              {style.name} en Las Condes
            </h1>
            <p className="text-base md:text-lg text-white/80 font-inter mb-6">
              {style.tagline}
            </p>

            {/* Datos duros: presencial, horarios reales, precio de entrada */}
            <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-8 text-white/85 font-inter text-xs md:text-sm">
              <li className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> Antares 259, Las Condes
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Clases de 60 min
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {totalClasses > 0
                  ? `${totalClasses} ${totalClasses === 1 ? "clase" : "clases"} por semana`
                  : "Clases toda la semana"}
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/plan-de-prueba"
                className="bg-accent hover:bg-accent/90 text-white rounded-full px-8 py-3.5 font-semibold transition-all duration-300 hover:scale-105 shadow-lg font-inter inline-flex items-center justify-center"
              >
                Plan de prueba desde $9.900
              </Link>
              <a
                href="#horarios"
                className="border-2 border-white/40 text-white hover:bg-white/10 rounded-full px-8 py-3.5 font-medium transition-all duration-300 font-inter inline-flex items-center justify-center backdrop-blur-sm"
              >
                Ver horarios reales
              </a>
            </div>
          </div>
        </section>

        {/* Prueba social alta en la página */}
        <SocialProofStrip items={styleReviews} total={yogaReviewCount} />

        {/* Qué es */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <p className="text-accent font-medium font-inter text-sm uppercase tracking-widest mb-3">
              Encuentra tu práctica
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-space mb-5">
              ¿Qué es el {style.name}?
            </h2>
            <p className="text-muted-foreground font-inter text-lg leading-relaxed">
              {style.intro}
            </p>
          </div>
        </section>

        {/* Horarios reales + relacionados */}
        <section id="horarios" className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12">
              <p className="text-accent font-medium font-inter text-sm uppercase tracking-widest mb-3">
                Planifica tu semana
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-primary font-space mb-4">
                Horarios de {style.name}
              </h2>
              <p className="text-muted-foreground font-inter">
                Horarios actualizados desde nuestra agenda. Reserva online o escríbenos si necesitas otro horario.
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-44 w-full rounded-2xl" />
                ))}
              </div>
            ) : schedule.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {schedule.map((block) => (
                  <div
                    key={block.day}
                    className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-lg transition-all duration-300"
                  >
                    <h3 className="text-lg font-bold text-primary font-space mb-4 pb-3 border-b border-border/50">
                      {block.dayName}
                    </h3>
                    <ul className="space-y-3">
                      {block.items.map((item: any, i: number) => (
                        <li key={i} className="text-sm font-inter flex items-start gap-3">
                          <span className="font-bold text-accent min-w-[48px]">{item.time}</span>
                          <div>
                            <span className="text-foreground font-medium">{item.title}</span>
                            {item.instructor && (
                              <span className="text-muted-foreground text-xs block mt-0.5">
                                con {item.instructor}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/agenda-nave-studio"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-inter font-semibold text-accent hover:text-primary transition-colors"
                    >
                      Reservar <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-2xl p-8 border border-border/50 text-center max-w-xl mx-auto">
                <p className="text-muted-foreground font-inter mb-5">
                  Esta semana no hay bloques fijos de {style.name} publicados. Escríbenos y te avisamos en cuanto se abra un horario.
                </p>
                <a
                  href={waHorarios}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white rounded-full px-7 py-3 font-inter font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Consultar por WhatsApp
                </a>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Link
                to="/horarios"
                className="inline-flex items-center gap-2 text-accent hover:text-primary transition-colors font-inter font-semibold group"
              >
                Ver todos los horarios
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={waHorarios}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-inter font-medium"
              >
                <MessageCircle className="w-4 h-4" /> ¿Necesitas otro horario? Escríbenos
              </a>
            </div>

            {/* Clases relacionadas del mismo universo */}
            {related.length > 0 && (
              <div className="mt-14 pt-10 border-t border-border/50">
                <h3 className="text-xl font-bold text-primary font-space mb-5 text-center">
                  Clases relacionadas que también te pueden servir
                </h3>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {related.flatMap((block) =>
                    block.items.map((item: any, i: number) => (
                      <span
                        key={`${block.day}-${i}`}
                        className="inline-flex items-center gap-2 bg-card border border-border/50 rounded-full px-4 py-2 text-xs md:text-sm font-inter"
                      >
                        <span className="font-semibold text-accent">{block.dayName}</span>
                        <span className="text-primary font-medium">{item.time}</span>
                        <span className="text-muted-foreground">{item.title}</span>
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Beneficios */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-space mb-4">
                Beneficios del {style.name}
              </h2>
              <p className="text-muted-foreground font-inter text-lg">{style.benefitsSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {style.benefits.map((b) => (
                <div
                  key={b}
                  className="bg-card rounded-2xl p-7 border border-border/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                    <Check className="w-6 h-6 text-accent" />
                  </div>
                  <p className="text-foreground font-inter font-medium">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Para quién */}
        <section className="py-16 md:py-20 bg-muted">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-space mb-10 text-center">
              ¿Para quién es el {style.name}?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {style.audience.map((a) => (
                <div
                  key={a}
                  className="flex items-start gap-3 bg-card rounded-xl p-5 border border-border/50"
                >
                  <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-foreground font-inter text-sm">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instructoras que realmente dan estas clases */}
        <CoachesSection filterIds={coachIds} />

        {/* Reseñas filtradas por instructora */}
        <section className="py-14 md:py-16 bg-neutral-light">
          <div className="container mx-auto px-6">
            <ReviewsTrustBar
              items={styleReviews}
              hideFilters
              title={
                reviewSet.matched >= 3 && coachNames.length > 0
                  ? `Lo que dicen las alumnas de ${coachNames.slice(0, 2).join(" y ")}`
                  : `Lo que dicen nuestras alumnas de yoga`
              }
              subtitle="Reseñas reales de nuestra comunidad en Las Condes"
            />
          </div>
        </section>

        {/* Centro presencial + Ice Bath opcional */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-card rounded-3xl border border-border/50 p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-primary font-space mb-4">
                Un centro presencial en Las Condes, no una app
              </h2>
              <p className="text-muted-foreground font-inter leading-relaxed mb-4">
                Todas las clases de {style.name} son presenciales en Antares 259, Las Condes,
                a pasos del Metro Los Domínicos. Grupos reducidos, mats y props incluidos y una
                instructora corrigiendo tu postura en la sala.
              </p>
              <p className="text-muted-foreground font-inter leading-relaxed mb-6 inline-flex items-start gap-2">
                <Snowflake className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                <span>
                  Si quieres, puedes complementar tu práctica con Ice Bath a 3 °C. Es totalmente
                  opcional y requiere una sesión previa guiada de Método Wim Hof por seguridad.
                </span>
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/conoce-el-lugar"
                  className="inline-flex items-center gap-2 text-accent hover:text-primary font-inter font-semibold transition-colors"
                >
                  Conoce el lugar <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contacto"
                  className="inline-flex items-center gap-2 text-primary hover:text-accent font-inter font-medium transition-colors"
                >
                  Cómo llegar
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20 bg-muted">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-space mb-10 text-center">
              Preguntas frecuentes de {style.name}
            </h2>
            <div className="space-y-3">
              {style.faqs.map((f, i) => (
                <details
                  key={i}
                  className="group bg-card rounded-2xl border border-border/50 hover:border-accent/30 transition-colors overflow-hidden"
                >
                  <summary className="cursor-pointer list-none p-6 flex items-start justify-between gap-4 font-space font-semibold text-primary text-base md:text-lg">
                    <span className="flex-1">{f.q}</span>
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center text-lg leading-none group-open:rotate-45 transition-transform duration-300">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-muted-foreground font-inter leading-relaxed">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Otros estilos + artículo */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-primary font-space mb-8 text-center">
              Otros estilos de yoga en Nave Studio
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherYogaStyles(style.slug).map((s) => (
                <Link
                  key={s.slug}
                  to={`/yoga/${s.slug}`}
                  className="group bg-card rounded-2xl p-6 border border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300"
                >
                  <h3 className="text-base font-bold text-primary font-space mb-2">{s.name}</h3>
                  <p className="text-sm text-muted-foreground font-inter mb-4 leading-snug">
                    {s.tagline}
                  </p>
                  <span className="text-sm text-accent font-inter font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    Ver clases <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
            {style.article && (
              <div className="text-center mt-10">
                <Link
                  to={style.article.href}
                  className="inline-flex items-center gap-2 text-accent hover:text-primary font-inter font-semibold transition-colors"
                >
                  Leer: {style.article.title} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* CTA final */}
        <section className="py-16 md:py-20 bg-muted">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-space mb-4">
              Prueba el {style.name} esta semana
            </h2>
            <p className="text-muted-foreground font-inter text-lg mb-8">
              Tu primera semana desde $9.900, con acceso a todas nuestras clases de yoga.
              Sin compromiso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/plan-de-prueba"
                className="bg-accent hover:bg-accent/90 text-white rounded-full px-9 py-4 font-semibold transition-all duration-300 hover:scale-105 shadow-lg font-inter inline-flex items-center justify-center text-lg"
              >
                Activa tu plan de prueba
              </Link>
              <Link
                to="/yoga-las-condes#membresias-yoga"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full px-9 py-4 font-medium transition-all duration-300 font-inter inline-flex items-center justify-center"
              >
                Ver membresías de yoga
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <StickyMobileCTA />
    </>
  );
};

export default YogaStyleTemplate;
