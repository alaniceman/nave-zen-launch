import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";
import {
  Snowflake,
  Wind,
  ShieldCheck,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  Check,
  Gift,
  Heart,
  Brain,
  Flame,
} from "lucide-react";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";

const BAUTIZO_PACKAGE_ID = "2c2b4d9e-2a03-4fdf-a973-ab5529458eb7";

const BautizoHielo = () => {
  const { trackEvent } = useFacebookPixel();
  const [, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    trackEvent(
      "ViewContent",
      { content_name: "Bautizo de Hielo", content_category: "Promo" },
      eventId
    );
  }, []);

  const ctaHref = `/bonos?package=${BAUTIZO_PACKAGE_ID}`;
  const giftHref = `/giftcards?package=${BAUTIZO_PACKAGE_ID}`;

  return (
    <>
      <Helmet>
        <title>Bautizo de Hielo · Sesión guiada por $15.000 | Nave Studio</title>
        <meta
          name="description"
          content="Una inmersión guiada al hielo en Nave Studio por $15.000 (antes $30.000). Breathwork + 2 minutos en agua a 3°C con coach certificado. Vívelo o regálalo. Las Condes."
        />
        <link rel="canonical" href="https://studiolanave.com/bautizo-hielo" />
        <meta property="og:title" content="Bautizo de Hielo · $15.000 | Nave Studio" />
        <meta
          property="og:description"
          content="Una sesión guiada de Criomedicina (Método Wim Hof) por $15.000. Vívelo tú o regálalo como Gift Card."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://studiolanave.com/bautizo-hielo" />
      </Helmet>

      <main className="min-h-screen bg-background text-foreground">
        {/* HERO */}
        <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />

          <div className="relative z-10 container mx-auto px-4 py-16 text-center text-primary-foreground max-w-4xl">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur px-4 py-1.5 mb-6">
              🧊 Vívelo o regálalo 🎁
            </Badge>
            <h1 className="font-space text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Bautizo de Hielo<br />sin excusas
            </h1>
            <p className="font-inter text-lg md:text-2xl mb-4 opacity-95">
              Una sesión guiada de Criomedicina por
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="font-space text-5xl md:text-7xl font-bold">$15.000</span>
              <div className="text-left">
                <p className="line-through text-lg opacity-70">$30.000</p>
                <Badge className="bg-warm text-white">50% OFF</Badge>
              </div>
            </div>
            <p className="text-base md:text-lg max-w-2xl mx-auto mb-10 opacity-90">
              Breathwork + 2 minutos en agua a <strong>3°C</strong>, guiado por un coach certificado.
              Vívelo tú o <strong>regálalo</strong> a quien necesita el empujón.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={ctaHref}>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto text-base">
                  Comprar mi bautizo
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to={giftHref}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-primary"
                >
                  <Gift className="mr-2 w-4 h-4" />
                  Regalar como Gift Card
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm opacity-90">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>60 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Coach certificado</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Antares 259, Las Condes</span>
              </div>
            </div>
          </div>
        </section>

        {/* STORYTELLING */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="font-space text-3xl md:text-5xl font-bold mb-6 text-primary">
              Lo más difícil del agua fría es decidirse
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              Lo sabemos. Por eso creamos el <strong className="text-foreground">Bautizo de Hielo</strong>:
              una sesión introductoria pensada para que cruces la línea por primera vez,
              sin presión, sin perfomance y con alguien que te guía paso a paso.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Vas a respirar, vas a entrar al agua, vas a salir.
              Y vas a entender —en tu propio cuerpo— por qué esto se volvió la práctica
              favorita de quienes ya están adentro.
            </p>
          </div>
        </section>

        {/* WHAT'S INCLUDED */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <h2 className="font-space text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
              ¿Qué incluye tu bautizo?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 border-primary/20">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Wind className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-space text-xl font-bold mb-2">Breathwork guiado</h3>
                <p className="text-sm text-muted-foreground">
                  Tres rondas de respiración Wim Hof para preparar cuerpo y mente
                  antes de la inmersión.
                </p>
              </Card>

              <Card className="p-6 border-primary/20">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Snowflake className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-space text-xl font-bold mb-2">Inmersión a 3°C</h3>
                <p className="text-sm text-muted-foreground">
                  2 minutos en nuestra tina de hielo, acompañado por tu coach.
                  Sin heroísmos, solo presencia.
                </p>
              </Card>

              <Card className="p-6 border-primary/20">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-space text-xl font-bold mb-2">Cierre y comunidad</h3>
                <p className="text-sm text-muted-foreground">
                  Recalentamiento activo, integración y conversación con la
                  comunidad de Nave.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-space text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
              Lo que vas a sentir
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { icon: Brain, title: "Claridad mental", desc: "Picos de dopamina y noradrenalina que duran horas." },
                { icon: Heart, title: "Sistema nervioso regulado", desc: "Mejor manejo del estrés y respuesta calmada." },
                { icon: Flame, title: "Energía sostenida", desc: "Sin café, sin azúcar. Solo respiración y frío." },
                { icon: ShieldCheck, title: "Sistema inmune fortalecido", desc: "Activación del tejido adiposo marrón." },
              ].map((b, i) => (
                <Card key={i} className="p-6 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <b.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-space text-lg font-bold mb-1">{b.title}</h3>
                    <p className="text-sm text-muted-foreground">{b.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-space text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
              Cómo funciona
            </h2>

            <div className="space-y-6">
              {[
                { n: "1", title: "Compra tu bautizo", desc: "Pagas $15.000 y recibes un código por email al instante." },
                { n: "2", title: "Agenda tu sesión", desc: "Eliges el día y hora que mejor te acomode en nuestra agenda." },
                { n: "3", title: "Vives la experiencia", desc: "Llegas, te guían, respiras, te metes al hielo. Sales otra persona." },
              ].map((s) => (
                <div key={s.n} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                    {s.n}
                  </div>
                  <div>
                    <h3 className="font-space text-lg font-bold mb-1">{s.title}</h3>
                    <p className="text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GIFT CARD */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <Card className="p-8 md:p-10 bg-gradient-to-br from-accent/10 to-primary/10 border-primary/20 text-center">
              <Gift className="w-12 h-12 mx-auto text-primary mb-4" />
              <h2 className="font-space text-2xl md:text-3xl font-bold mb-3 text-primary">
                ¿Conoces a alguien que necesita este empujón?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Regala el Bautizo de Hielo. Recibirá un código único por email
                y podrá agendar cuando se sienta listo.
              </p>
              <Link to={giftHref}>
                <Button size="lg" variant="default">
                  <Gift className="mr-2 w-4 h-4" />
                  Regalar Bautizo
                </Button>
              </Link>
            </Card>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="font-space text-3xl md:text-5xl font-bold mb-6">
              Es solo una sesión.<br />Y puede cambiarlo todo.
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              $15.000 para vivir tu primera inmersión guiada. Después decides
              si quieres seguir.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                <Check className="w-4 h-4" /> Válido 60 días
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                <Check className="w-4 h-4" /> Coach certificado
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                <Check className="w-4 h-4" /> 1 por persona
              </div>
            </div>
            <Link to={ctaHref}>
              <Button size="lg" variant="secondary" className="text-base">
                Reservar mi bautizo · $15.000
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default BautizoHielo;
