import { lazy, Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Wind,
  Snowflake,
  Coffee,
  Music,
  ArrowUpRight,
  Ticket,
  ShieldCheck,
  Star,
  Heart,
  Waves,
  ShoppingBag,
  MessageCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useIcefestEvent } from "@/components/icefest/useIcefestEvent";
import { Skeleton } from "@/components/ui/skeleton";
const preloadCheckout = () => import("@/components/icefest/IcefestCheckout");
const IcefestCheckout = lazy(() =>
  preloadCheckout().then((m) => ({ default: m.IcefestCheckout })),
);
import { icefestDate, icefestMoney } from "@/lib/icefest";
import IcefestStory from "@/components/icefest/IcefestStory";
import { trackViewContentOnce } from "@/lib/metaTracking";
import breath from "@/assets/icefest/breathwork-new.webp";
import ice from "@/assets/icefest/ice-bath-new.webp";
import cacao from "@/assets/icefest/cacao-new.webp";
import dance from "@/assets/icefest/dance-new.webp";
import logo from "@/assets/icefest/breath-act-logo.png";
import alan from "@/assets/icefest/alan-iceman.jpg";
import manu from "@/assets/icefest/manu-dabanda.jpg";
import gallery1 from "@/assets/icefest/icefest-01.webp";
import gallery2 from "@/assets/icefest/icefest-03.webp";
import gallery3 from "@/assets/icefest/icefest-06.webp";
import gallery4 from "@/assets/icefest/icefest-17.webp";
import heroVideo from "@/assets/icefest/icefest_hero.mp4.asset.json";
import heroPoster from "@/assets/icefest/icefest_hero_poster.webp.asset.json";
import horizontalVideo from "@/assets/icefest/icefest_horizontal.mp4.asset.json";
import horizontalPoster from "@/assets/icefest/icefest_horizontal_poster.webp.asset.json";
const journey = [
  {
    title: "Respiración inmersiva The Breath Act",
    subtitle: "Baño de hielo",
    image: breath,
    icon: Wind,
    text: "Abrimos el día con un viaje de respiración consciente conectada, sonido envolvente y trabajo somático. Una experiencia inmersiva para entrar en el cuerpo, regular el sistema nervioso y llegar presentes a todo lo que viene.",
  },
  {
    title: "Ceremonia de cacao",
    subtitle: "Ecstatic Dance",
    image: ice,
    icon: Snowflake,
    text: "Con el cuerpo preparado, cruzamos el umbral del frío. Una inmersión guiada para atravesar la incomodidad con calma y descubrir la fuerza que aparece cuando respiras en lugar de resistir.",
  },
  {
    title: "Integra lo vivido",
    subtitle: "Tarde",
    image: cacao,
    icon: Coffee,
    text: "Compartiremos cacao ceremonial en un espacio de calma y presencia para integrar lo vivido en el hielo, abrir el corazón y prepararnos para el cierre con música y danza.",
  },
  {
    title: "Celebra en movimiento",
    subtitle: "Cierre",
    image: dance,
    icon: Music,
    text: "Terminamos bailando. Movimiento libre, sin alcohol, sin juicios y sin coreografías: solo música, cuerpo y comunidad celebrando el viaje del día.",
  },
];
export default function IcefestSantiago() {
  const [horizontalHero, setHorizontalHero] = useState(() =>
    window.matchMedia("(min-width: 768px)").matches,
  );
  useEffect(() => {
    const screen = window.matchMedia("(min-width: 768px)");
    const updateScreen = () => setHorizontalHero(screen.matches);
    screen.addEventListener("change", updateScreen);
    updateScreen();
    return () => screen.removeEventListener("change", updateScreen);
  }, []);
  const {
    event,
    tiers,
    tier,
    now,
    canBuy,
    isPending: loading,
    isError,
    refetch,
  } = useIcefestEvent();
  const [checkout, setCheckout] = useState(false),
    [checkoutLoaded, setCheckoutLoaded] = useState(false);
  const date = event
    ? icefestDate(event.date)
    : "Domingo 13 de diciembre de 2026";
  const error = isError
    ? "No se pudo actualizar la disponibilidad. Intenta nuevamente."
    : "";
  const openCheckout = () => {
    setCheckoutLoaded(true);
    setCheckout(true);
  };
  useEffect(() => {
    trackViewContentOnce("Icefest Santiago", { contentCategory: "icefest" });
  }, []);
  const remaining =
    tier?.stock != null ? Math.max(0, tier.stock - tier.stock_sold) : null;
  const eventSchema = event
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.name,
        startDate: event.date,
        description: event.description,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        location: {
          "@type": "Place",
          name: event.location,
          address: event.address,
        },
        organizer: {
          "@type": "Organization",
          name: "Nave Studio",
          url: "https://studiolanave.com",
        },
        offers: tier
          ? {
              "@type": "Offer",
              price: tier.price,
              priceCurrency: "CLP",
              url: "https://studiolanave.com/icefest-santiago",
              availability: canBuy
                ? "https://schema.org/InStock"
                : "https://schema.org/SoldOut",
            }
          : undefined,
      }
    : null;
  return (
    <>
      <Helmet>
        <title>Icefest Santiago + Breath Act · Nave Studio</title>
        <meta
          name="description"
          content="Icefest + Breath Act en Parque Mahuida. Respiración inmersiva, baño de hielo, cacao y Ecstatic Dance el 13 de diciembre de 2026. Entradas en Nave Studio."
        />
        <link
          rel="canonical"
          href="https://studiolanave.com/icefest-santiago"
        />
        <meta property="og:title" content="Icefest Santiago + Breath Act" />
        <meta
          property="og:description"
          content="Respira. Atraviesa el frío. Celebra. 13 de diciembre en Parque Mahuida."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <main className="icefest-theme bg-background text-foreground pb-24 sm:pb-0">
        <header className="border-b border-border bg-background">
          <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
            <a href="#top" className="font-bold text-lg">
              ICEFEST<span className="text-primary"> / SANTIAGO</span>
            </a>
            <Button
              variant="outline"
              size="sm"
              aria-label="Abrir carrito de entradas"
              onMouseEnter={() => void preloadCheckout()}
              onFocus={() => void preloadCheckout()}
              onClick={openCheckout}
              disabled={!canBuy}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Entradas
            </Button>
          </div>
        </header>
        <section
          id="top"
          className="festival-hero relative flex items-center justify-center overflow-hidden py-12 md:py-20"
        >
          <video
            key={horizontalHero ? "horizontal" : "mobile"}
            src={horizontalHero ? horizontalVideo.url : heroVideo.url}
            poster={horizontalHero ? horizontalPoster.url : heroPoster.url}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            className="festival-hero-photo festival-hero-video absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-10 max-w-5xl mx-auto px-5 text-center space-y-5 md:space-y-7">
            <p className="inline-flex gap-2 items-center text-secondary text-xs font-bold uppercase">
              <Star className="w-4 h-4" />
              Edición especial
            </p>
            <h1 className="festival-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              ICEFEST
            </h1>
            <div className="flex flex-col items-center gap-3">
              <p className="text-xs uppercase text-muted-foreground">
                Invitado especial
              </p>
              <img
                src={logo}
                alt="The Breath Act"
                width="180"
                height="80"
                className="w-44 h-20 object-contain"
              />
            </div>
            <p className="festival-spectrum text-2xl md:text-3xl font-bold">
              Respira. Atraviesa el frío. Celebra.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {[
                { icon: Calendar, text: date },
                { icon: Clock, text: event?.schedule || "10:15 – 17:30 hrs" },
                {
                  icon: MapPin,
                  text: event?.location || "Parque Mahuida, La Reina",
                },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="inline-flex gap-2 items-center">
                  <Icon className="text-primary w-4 h-4 shrink-0" />
                  {text}
                </span>
              ))}
            </div>
            <p className="max-w-2xl mx-auto text-muted-foreground text-base md:text-lg">
              Un día para entrar en tu cuerpo, regular tu sistema nervioso y descubrir de qué eres capaz.
              Respiración inmersiva The Breath Act, baño de hielo, ceremonia de
              cacao y Ecstatic Dance en la precordillera de Santiago.
            </p>
            <div className="space-y-3">
              <div className="min-h-7 flex justify-center">
                {loading ? (
                  <Skeleton className="h-6 w-56" />
                ) : (
                  <p className="text-secondary font-bold">
                    {canBuy
                      ? `${tier?.name}: ${icefestMoney(tier?.price || 0)}`
                      : "Venta no disponible"}
                  </p>
                )}
              </div>
              <Button
                size="lg"
                onMouseEnter={() => void preloadCheckout()}
                onFocus={() => void preloadCheckout()}
                onClick={openCheckout}
                disabled={!canBuy}
                className="festival-cta h-14 px-9 w-full sm:w-auto text-base"
              >
                <Ticket className="w-5 h-5 mr-2" />
                {loading ? "Cargando entradas…" : "Reservar mi entrada"}
              </Button>
              {remaining !== null && (
                <p className="text-sm text-secondary">
                  Quedan {remaining} de {tier?.stock} cupos
                </p>
              )}
              <p className="text-sm text-accent inline-flex gap-2 items-center">
                <Heart className="w-4 h-4" />
                Evento 100% sin alcohol ni drogas
              </p>
              {error && (
                <div role="alert">
                  <p className="text-destructive text-sm">{error}</p>
                  <Button variant="link" onClick={() => void refetch()}>
                    Reintentar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
        <nav
          aria-label="Secciones de Icefest"
          className="sticky top-0 z-30 border-y border-border bg-background overflow-x-auto"
        >
          <div className="max-w-6xl mx-auto flex gap-6 px-5 py-4 whitespace-nowrap text-sm text-muted-foreground">
            <a href="#edicion">Edición</a>
            <a href="#breath-act">Breath Act</a>
            <a href="#experiencia">El viaje</a>
            <a href="#dia">El día</a>
            <a href="#lugar">Lugar</a>
            <a href="#entradas">Entradas</a>
            <a href="#facilitadores">Facilitadores</a>
            <a href="#faq">Preguntas</a>
          </div>
        </nav>
        <section id="edicion" className="bg-card py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <p className="text-secondary text-sm mb-4">Una edición que no se repite</p>
            <h2 className="text-3xl md:text-5xl mb-6">
              Icefest × The Breath Act
            </h2>
            <p className="text-lg text-muted-foreground">
              Por primera vez, Icefest abre su jornada con el método The Breath Act, la escuela líder de breathwork y neurociencia aplicada en habla hispana. Fundada por Marta Planells y Juan D’Angelo, ha llevado su método a más de 85.000 personas en más de 15 países. Nos acompañarán miembros del equipo oficial The Breath Act en Chile. Juntos diseñamos un recorrido completo: primero preparamos el sistema nervioso con respiración inmersiva, luego lo ponemos a prueba en el hielo, y en la tarde elevamos la energía para terminar celebrando.
            </p>
            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-4">
              {[
                ["+85.000", "personas han respirado con The Breath Act"],
                ["+1.500", "facilitadores certificados"],
                ["+15", "países"],
              ].map(([number, label]) => (
                <div key={number}>
                  <p className="text-2xl md:text-4xl font-bold text-primary">{number}</p>
                  <p className="mt-1 text-xs md:text-sm text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="breath-act" className="py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-5">
            <h2 className="text-3xl md:text-4xl text-center mb-5">
              No es magia. Es neurociencia.
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              El método The Breath Act integra respiración consciente conectada, neurociencia aplicada, sonido y trabajo somático. Esto es lo que lo hace distinto:
            </p>
            <div className="grid md:grid-cols-2 gap-9">
              {[
                {
                  icon: Wind,
                  title: "Respiración y sistema nervioso",
                  text: "La respiración es una de las pocas funciones automáticas que también podemos dirigir a voluntad. Al cambiar su ritmo y profundidad, influimos directamente en el sistema nervioso autónomo: el mismo que regula el estrés, la calma y la respuesta emocional.",
                },
                {
                  icon: Waves,
                  title: "Sonido que modula el estado mental",
                  text: "The Breath Act integra música y diseño sonoro para acompañar cada fase del viaje. El sonido guía la atención, sostiene la intensidad y facilita estados de presencia más profundos que una práctica en silencio.",
                },
                {
                  icon: Heart,
                  title: "Trabajo somático y emocional",
                  text: "El cuerpo guarda lo que la mente no alcanza a procesar. Con respiración consciente conectada y técnicas somáticas, la experiencia invita a soltar tensiones acumuladas y a reconectar con lo que sientes, desde el cuerpo.",
                },
                {
                  icon: ShieldCheck,
                  title: "Método, no magia",
                  text: "Su lema lo resume: “No es magia. Es ciencia”. Una metodología estructurada, aplicada por más de 1.500 facilitadores certificados y vivida por más de 85.000 personas en más de 15 países.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="border-l-2 border-primary/50 pl-5"
                >
                  <Icon className="text-primary w-7 h-7 mb-3" />
                  <h3 className="text-xl mb-3">{title}</h3>
                  <p className="text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
            <p className="mx-auto mt-12 max-w-3xl text-center text-muted-foreground">
              La respiración será facilitada por <strong>facilitadores certificados de The Breath Act</strong>, formados en su metodología para guiar la experiencia con seguridad, contención y cuidado en cada momento.
            </p>
          </div>
        </section>
        <IcefestStory />
        <section id="entradas" className="bg-card py-16">
          <div className="container max-w-5xl px-5">
            <h2 className="text-3xl md:text-4xl mb-4">Entradas</h2>
            <p className="text-muted-foreground mb-8">
              Preventa limitada{tiers.find((t) => t.name.toLowerCase().includes("preventa") && t.stock !== null)?.stock != null
                ? ` a los primeros ${tiers.find((t) => t.name.toLowerCase().includes("preventa") && t.stock !== null)?.stock} cupos`
                : ""}. Al agotarse, la entrada pasa a su valor normal.
            </p>
            {error && (
              <div role="alert" className="mb-5">
                <p className="text-destructive">{error}</p>
                <Button variant="outline" onClick={() => void refetch()}>
                  Reintentar
                </Button>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-6">
              {loading &&
                [0, 1].map((i) => <Skeleton key={i} className="h-72 w-full" />)}
              {tiers
                .filter((t) => t.is_active)
                .map((t) => (
                  <article
                    key={t.id}
                    className={`bg-card border rounded-lg p-7 ${t.id === tier?.id ? "border-primary/60" : ""}`}
                  >
                    <p className="text-sm font-semibold text-primary mb-3">
                      {t.id === tier?.id
                        ? "Vigente"
                        : t.stock !== null && t.stock_sold >= t.stock
                          ? "Agotada"
                          : t.valid_until &&
                              new Date(t.valid_until).getTime() <= now
                            ? "Finalizada"
                            : "Próximamente"}
                    </p>
                    <h3 className="text-xl mb-4">{t.name}</h3>
                    <p className="text-4xl font-bold">
                      {icefestMoney(t.price)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      CLP por persona
                    </p>
                    <p className="my-5 text-sm">
                      {t.description ||
                        (t.stock !== null
                          ? `${Math.max(0, t.stock - t.stock_sold)} de ${t.stock} cupos disponibles`
                          : "Incluye las cuatro experiencias del día")}
                    </p>
                    <Button
                      size="lg"
                      className="festival-cta w-full"
                      disabled={!canBuy || t.id !== tier?.id}
                      onClick={openCheckout}
                    >
                      Reservar mi entrada
                    </Button>
                  </article>
                ))}
            </div>
            <Link
              to="/icefest-santiago/recuperar"
              className="inline-block mt-7 text-primary underline"
            >
              Ya compré: recuperar mis entradas
            </Link>
          </div>
        </section>
        <section className="bg-card text-center py-16 px-5">
          <h2 className="text-3xl md:text-4xl mb-5">Respira con nosotros este 13 de diciembre</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            {canBuy ? `${tier?.name} vigente: ${icefestMoney(tier?.price || 0)} por persona.` : "Venta no disponible"}
          </p>
          <Button className="festival-cta mb-6" size="lg" disabled={!canBuy} onClick={openCheckout}>Reservar mi entrada</Button>
          <div />
          <Button variant="outline" asChild>
            <Link to="/bonos">
              Ver sesiones de preparación
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </section>
        <footer className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row gap-5 justify-between text-sm text-muted-foreground">
          <p>Icefest + Breath Act · Nave Studio</p>
          <div className="flex flex-wrap gap-5">
            <Link to="/icefest-santiago/recuperar">Mis entradas</Link>
            <Link to="/terminos">Términos</Link>
            <Link to="/privacidad">Privacidad</Link>
            <Link to="/">Nave Studio</Link>
          </div>
        </footer>
        <div className="festival-bottom fixed bottom-0 inset-x-0 z-40 bg-background border-t px-5 pt-3 sm:hidden">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Tu entrada</p>
              <p className="font-bold text-secondary">
                {loading
                  ? "…"
                  : canBuy
                    ? icefestMoney(tier?.price || 0)
                    : "No disponible"}
              </p>
            </div>
            <Button
              className="festival-cta h-11"
              disabled={!canBuy}
              onClick={openCheckout}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Reservar
            </Button>
          </div>
        </div>
        <Button
          asChild
          variant="outline"
          size="icon"
          className="fixed right-5 bottom-6 hidden sm:flex z-40 rounded-full h-12 w-12 bg-card"
          aria-label="Consultar Icefest por WhatsApp"
        >
          <a
            href="https://wa.me/56946120426?text=Hola%2C%20tengo%20una%20consulta%20sobre%20Icefest%20Santiago"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
        </Button>
      </main>
      {eventSchema && (
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(eventSchema)}
          </script>
        </Helmet>
      )}
      {checkoutLoaded && (
        <Suspense
          fallback={
            checkout ? (
              <div
                className="icefest-theme fixed inset-0 z-50 bg-background/95 text-foreground flex flex-col items-center justify-center gap-4"
                role="status"
              >
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p>Abriendo tus entradas…</p>
                <Button variant="outline" onClick={() => setCheckout(false)}>
                  Cancelar
                </Button>
              </div>
            ) : null
          }
        >
          <IcefestCheckout
            tier={tier}
            event={event}
            canBuy={canBuy}
            open={checkout}
            onOpenChange={setCheckout}
          />
        </Suspense>
      )}
    </>
  );
}
