import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  ChevronRight,
  Award,
  Shield,
  Wind,
  Snowflake,
  Heart,
  Check,
  AlertCircle,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";
import Footer from "@/components/Footer";
import heroAsset from "@/assets/alan-ice-bath-smile.webp.asset.json";
import alanWhmAsset from "@/assets/alan-wim-hof.webp.asset.json";

type TallerKey = "fundamentos" | "avanzado";

const TALLERES = {
  fundamentos: {
    nombre: "Fundamentos Wim Hof",
    nombreCorto: "Fundamentos",
    fecha: "Sábado 27 de junio",
    fechaLarga: "Sábado 27 de junio de 2026",
    horario: "11:30 a 15:00",
    duracion: "3 horas y media",
    valor: 50000,
    valorTxt: "$50.000",
    cupos: 15,
    nivel: "Principiante / intermedio",
    eventId: "santiago_fundamentos_2026_06_27",
    tabla: "taller_santiago_fundamentos" as const,
    pagoUrl: "https://mpago.la/2c9NhLM",
    isoStart: "2026-06-27T11:30:00-04:00",
    isoEnd: "2026-06-27T15:00:00-04:00",
  },
  avanzado: {
    nombre: "Avanzado Wim Hof",
    nombreCorto: "Avanzado",
    fecha: "Domingo 28 de junio",
    fechaLarga: "Domingo 28 de junio de 2026",
    horario: "11:30 a 15:00",
    duracion: "3 horas y media",
    valor: 60000,
    valorTxt: "$60.000",
    cupos: 15,
    nivel: "Avanzado · requiere experiencia previa",
    eventId: "santiago_avanzado_2026_06_28",
    tabla: "taller_santiago_avanzado" as const,
    pagoUrl: "https://mpago.la/1edQqad",
    isoStart: "2026-06-28T11:30:00-04:00",
    isoEnd: "2026-06-28T15:00:00-04:00",
  },
};

const MAPS_URL = "https://maps.app.goo.gl/oW6G58gLd5oYWmGn8";
const WHATSAPP_NUMBER = "56946120426";
const WHATSAPP_TEXT =
  "Hola, tengo una duda sobre los talleres Wim Hof de junio en Nave Studio.";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_TEXT)}`;

const TallerSantiago = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reservaTaller, setReservaTaller] = useState<TallerKey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ nombre: "", apellido: "", celular: "", email: "" });
  const [cupos, setCupos] = useState<Record<TallerKey, { total: number; vendidos: number }>>({
    fundamentos: { total: 15, vendidos: 0 },
    avanzado: { total: 15, vendidos: 0 },
  });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);

    (async () => {
      const { data } = await supabase
        .from("event_cupos")
        .select("event_id, cupos_total, cupos_vendidos")
        .in("event_id", [TALLERES.fundamentos.eventId, TALLERES.avanzado.eventId]);
      if (data) {
        setCupos((prev) => {
          const next = { ...prev };
          for (const row of data) {
            if (row.event_id === TALLERES.fundamentos.eventId) {
              next.fundamentos = { total: row.cupos_total, vendidos: row.cupos_vendidos };
            } else if (row.event_id === TALLERES.avanzado.eventId) {
              next.avanzado = { total: row.cupos_total, vendidos: row.cupos_vendidos };
            }
          }
          return next;
        });
      }
    })();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cuposDisponibles = (k: TallerKey) =>
    Math.max(0, cupos[k].total - cupos[k].vendidos);
  const isSoldOut = (k: TallerKey) => cuposDisponibles(k) <= 0;
  const pctOcupado = (k: TallerKey) =>
    cupos[k].total > 0 ? (cupos[k].vendidos / cupos[k].total) * 100 : 0;

  const openReserva = (k: TallerKey) => {
    setReservaTaller(k);
    setForm({ nombre: "", apellido: "", celular: "", email: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservaTaller) return;
    const t = TALLERES[reservaTaller];

    const nombre = form.nombre.trim();
    const apellido = form.apellido.trim();
    const celular = form.celular.trim();
    const email = form.email.trim().toLowerCase();
    const emailOk = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);

    if (!nombre || !apellido || !celular || !emailOk) {
      toast({
        title: "Revisa tus datos",
        description: "Necesitamos nombre, apellido, celular y un email válido.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await supabase.from(t.tabla).insert({
        name: `${nombre} ${apellido}`.slice(0, 200),
        phone: celular.slice(0, 50),
        email: email.slice(0, 255),
        consent: true,
      });

      try {
        await supabase.functions.invoke("send-santiago-confirmation", {
          body: { nombre, apellido, celular, email, taller: reservaTaller },
        });
      } catch (err) {
        console.error("Email send failed:", err);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
      window.location.href = t.pagoUrl;
    }
  };

  const faqs = [
    {
      q: "¿Puedo ir al avanzado si nunca he hecho Wim Hof?",
      a: "No. Para el avanzado necesitas haber vivido antes una experiencia Wim Hof o una práctica guiada con respiración e hielo. Si es tu primera vez, el taller correcto es Fundamentos.",
    },
    {
      q: "¿Qué pasa si ya fui a Nave Studio?",
      a: "Si ya hiciste una sesión Wim Hof en Nave Studio, un retiro, Icefest o un taller anterior, puedes reservar el Avanzado.",
    },
    {
      q: "¿En Fundamentos se explica todo desde cero?",
      a: "Sí. En Fundamentos veremos la técnica paso a paso, desde la respiración hasta la preparación para el hielo.",
    },
    {
      q: "¿El taller avanzado es más intenso?",
      a: "Sí. La respiración será más profunda y el desafío con el frío será mayor. Por eso necesitas conocerte previamente en el hielo.",
    },
    {
      q: "¿Necesito experiencia previa para Fundamentos?",
      a: "No. Puedes venir aunque nunca hayas hecho una inmersión en hielo.",
    },
    {
      q: "¿Qué debo llevar?",
      a: "Traje de baño, toalla, ropa cómoda, una muda seca, botella de agua y una actitud abierta para practicar.",
    },
    {
      q: "¿Hay contraindicaciones?",
      a: "Si tienes una condición médica importante, problemas cardiovasculares, epilepsia, embarazo, hipertensión no controlada u otra condición relevante, consulta con tu médico antes de participar y avísanos antes de reservar.",
    },
  ];

  const reservaActual = reservaTaller ? TALLERES[reservaTaller] : null;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Taller Wim Hof Fundamentos – Santiago",
      startDate: TALLERES.fundamentos.isoStart,
      endDate: TALLERES.fundamentos.isoEnd,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: "Nave Studio",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Antares 259",
          addressLocality: "Las Condes",
          addressRegion: "Santiago",
          addressCountry: "CL",
        },
      },
      description:
        "Taller del Método Wim Hof nivel Fundamentos. Respiración, preparación e inmersión en hielo guiada en Nave Studio.",
      organizer: { "@type": "Organization", name: "Nave Studio" },
      offers: {
        "@type": "Offer",
        price: "50000",
        priceCurrency: "CLP",
        url: TALLERES.fundamentos.pagoUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Taller Wim Hof Avanzado – Santiago",
      startDate: TALLERES.avanzado.isoStart,
      endDate: TALLERES.avanzado.isoEnd,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: "Nave Studio",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Antares 259",
          addressLocality: "Las Condes",
          addressRegion: "Santiago",
          addressCountry: "CL",
        },
      },
      description:
        "Taller del Método Wim Hof nivel Avanzado. Práctica profunda de respiración y mayor desafío con el frío. Requiere experiencia previa.",
      organizer: { "@type": "Organization", name: "Nave Studio" },
      offers: {
        "@type": "Offer",
        price: "60000",
        priceCurrency: "CLP",
        url: TALLERES.avanzado.pagoUrl,
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background font-body">
      <Helmet>
        <title>Taller Wim Hof Santiago · Fundamentos y Avanzado | Nave Studio</title>
        <meta
          name="description"
          content="Aprende o profundiza la técnica Wim Hof con respiración, hielo y guía presencial en Nave Studio. Taller Fundamentos sábado 27 de junio y Taller Avanzado domingo 28 de junio. Cupos limitados."
        />
        <link
          rel="canonical"
          href="https://studiolanave.com/taller-wim-hof-santiago-fundamentales-avanzado"
        />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Reserva Dialog */}
      <Dialog open={!!reservaTaller} onOpenChange={(open) => !open && setReservaTaller(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">
              Reservar {reservaActual ? reservaActual.nombre : ""}
            </DialogTitle>
            <DialogDescription>
              {reservaActual?.fechaLarga} · {reservaActual?.horario} · {reservaActual?.valorTxt}.
              Al continuar te llevamos al pago seguro por Mercado Pago.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} maxLength={100} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" value={form.apellido} onChange={(e) => setForm({ ...form, apellido: e.target.value })} maxLength={100} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="celular">Celular</Label>
              <Input id="celular" type="tel" value={form.celular} onChange={(e) => setForm({ ...form, celular: e.target.value })} placeholder="+56 9 1234 5678" maxLength={30} required />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Procesando..." : "Continuar al pago"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Serás redirigido a Mercado Pago para completar tu reserva.
            </p>
          </form>
        </DialogContent>
      </Dialog>

      {/* Nav */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <nav className="max-w-[1100px] mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-heading text-foreground">
            Nave Studio
          </a>
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openReserva("fundamentos")}
              disabled={isSoldOut("fundamentos")}
            >
              {isSoldOut("fundamentos") ? "Fundamentos agotado" : "Fundamentos"}
            </Button>
            <Button
              size="sm"
              onClick={() => openReserva("avanzado")}
              disabled={isSoldOut("avanzado")}
            >
              {isSoldOut("avanzado") ? "Avanzado agotado" : "Avanzado"}
            </Button>
          </div>
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
        {mobileOpen && (
          <div className="md:hidden bg-background border-t">
            <div className="px-4 py-4 space-y-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  openReserva("fundamentos");
                  setMobileOpen(false);
                }}
                disabled={isSoldOut("fundamentos")}
              >
                Reservar Fundamentos
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  openReserva("avanzado");
                  setMobileOpen(false);
                }}
                disabled={isSoldOut("avanzado")}
              >
                Reservar Avanzado
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-32 md:pb-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1100px] mx-auto relative grid lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left animate-fade-in">
            <Badge variant="outline" className="mb-5 border-primary/30 text-primary">
              Santiago · 27 y 28 de junio
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-5 leading-[1.05]">
              Dos talleres Wim Hof.{" "}
              <span className="text-primary">Dos niveles de profundidad.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Elige tu camino: aprende la técnica desde cero o lleva tu práctica al siguiente nivel.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-5 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={() => openReserva("fundamentos")}
                className="shadow-lg"
                disabled={isSoldOut("fundamentos")}
              >
                {isSoldOut("fundamentos") ? "Fundamentos agotado" : "Quiero ir al Fundamentos"}
                {!isSoldOut("fundamentos") && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => openReserva("avanzado")}
                disabled={isSoldOut("avanzado")}
              >
                {isSoldOut("avanzado") ? "Avanzado agotado" : "Quiero ir al Avanzado"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2 justify-center lg:justify-start">
              <Shield className="w-4 h-4 text-primary" /> Solo 15 cupos por taller.
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square max-w-md mx-auto w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none" />
            <img
              src={heroAsset.url}
              alt="Práctica del Método Wim Hof guiada en Nave Studio"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute bottom-4 left-4 z-20">
              <Badge variant="secondary" className="bg-background/90 text-foreground backdrop-blur-sm">
                Presencial · Nave Studio, Las Condes
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 1: ¿Cuál taller es para ti? */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-3">
              ¿Cuál taller es para ti?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dos formatos pensados para dos momentos distintos de tu práctica.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {(["fundamentos", "avanzado"] as TallerKey[]).map((k) => {
              const t = TALLERES[k];
              const sold = isSoldOut(k);
              const incluye =
                k === "fundamentos"
                  ? [
                      "Técnica explicada desde cero",
                      "Respiración guiada paso a paso",
                      "Preparación para el frío",
                      "Inmersión en hielo con acompañamiento",
                      "Ideal para principiantes o para ordenar tu práctica",
                    ]
                  : [
                      "No se explica la técnica básica desde cero",
                      "Prácticas más profundas de respiración",
                      "Mayor desafío con el frío",
                      "Requiere experiencia previa",
                      "Ideal si ya fuiste a Nave Studio, retiros, Icefest o talleres",
                    ];
              return (
                <Card
                  key={k}
                  className="border-border/60 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6 md:p-8 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={k === "avanzado" ? "default" : "secondary"}>
                        {k === "fundamentos" ? "Nivel 1" : "Nivel 2"}
                      </Badge>
                      {sold && <Badge variant="destructive">Cupos agotados</Badge>}
                    </div>
                    <h3 className="font-heading text-2xl text-foreground mb-2">{t.nombre}</h3>
                    <p className="text-muted-foreground mb-5">
                      {k === "fundamentos"
                        ? "Para quienes quieren aprender la técnica paso a paso, desde la respiración hasta la entrada consciente al hielo."
                        : "Para quienes ya han tenido experiencias previas y quieren profundizar en la respiración, la exposición al frío y el dominio interno."}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {incluye.map((line) => (
                        <li key={line} className="flex gap-2 text-sm text-foreground/90">
                          <Check className="w-4 h-4 text-primary mt-1 shrink-0" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="grid grid-cols-2 gap-2 mb-5 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" /> {t.fecha}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" /> {t.horario}
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" /> {t.valorTxt}
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" /> {cuposDisponibles(k)} / {t.cupos} cupos
                      </div>
                    </div>

                    <div className="mb-5">
                      <Progress value={pctOcupado(k)} className="h-2" />
                    </div>

                    <div className="mt-auto">
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => openReserva(k)}
                        disabled={sold}
                      >
                        {sold ? "Cupos agotados" : `Reservar ${t.nombreCorto} — ${t.valorTxt}`}
                        {!sold && <ChevronRight className="w-4 h-4 ml-1" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detalle Fundamentos */}
      <DetalleSection
        titulo="Fundamentos: aprende la técnica desde la base"
        texto="Este taller está diseñado para que entiendas y practiques la respiración Wim Hof de forma clara, segura y guiada. Vamos a revisar la técnica paso a paso, el rol de la respiración, la preparación mental y corporal para el frío, y cómo entrar al hielo sin pelear con la experiencia."
        cta="Reservar mi cupo en Fundamentos"
        sold={isSoldOut("fundamentos")}
        onReserve={() => openReserva("fundamentos")}
      />

      {/* Detalle Avanzado */}
      <DetalleSection
        titulo="Avanzado: profundiza tu práctica"
        texto="Este taller es para quienes ya conocen la experiencia Wim Hof y quieren ir más profundo. No partiremos desde cero: iremos directo a prácticas más avanzadas de respiración y a un desafío mayor con el frío. Para participar, debes haber vivido antes alguna experiencia Wim Hof guiada, como sesiones en Nave Studio, retiros, Icefest o talleres anteriores."
        cta="Reservar mi cupo en Avanzado"
        sold={isSoldOut("avanzado")}
        onReserve={() => openReserva("avanzado")}
        dark
      />

      {/* Quién te guía */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-[1100px] mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square max-w-md mx-auto w-full md:mx-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 pointer-events-none" />
            <img
              src={alanWhmAsset.url}
              alt="Alan Earle con Wim Hof — Instructor Avanzado del Método Wim Hof"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              Tu instructor
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-2 leading-tight">
              Quién te guía
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Experiencia real, formación directa y guía consciente.
            </p>
            <div className="space-y-4 mb-8 text-muted-foreground leading-relaxed">
              <p>
                Soy Alan Earle, fundador de Nave Studio. Soy Instructor Avanzado del Método Wim Hof
                y actualmente el único en Chile con este nivel de certificación.
              </p>
              <p>
                Me formé como Instructor Nivel Fundamentos en México y como Instructor Avanzado en
                Polonia, aprendiendo la respiración y el trabajo con frío directamente con Wim Hof
                y su equipo.
              </p>
              <p>
                Mi enfoque no es llevarte al límite por ego, sino enseñarte cómo entrenar tu mente
                y sistema nervioso para que puedas atravesar el frío y la respiración con
                presencia, control y propósito.
              </p>
              <p>
                He guiado a miles de personas en experiencias de respiración y hielo, desde quienes
                llegan con miedo o ansiedad, hasta quienes buscan profundizar en estados
                meditativos y de expansión consciente.
              </p>
              <p>
                En este taller no solo vivirás la experiencia: entenderás qué estás haciendo, por
                qué funciona y cómo repetirlo de forma segura en tu vida diaria.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { icon: Award, t: "Instructor Avanzado del Método Wim Hof" },
                { icon: Shield, t: "Formación directa con Wim Hof" },
                { icon: Heart, t: "Enfoque en seguridad, ciencia y experiencia real" },
                { icon: MessageCircle, t: "Guía clara, cercana y sin exageraciones" },
              ].map(({ icon: Icon, t }) => (
                <div key={t} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{t}</h4>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm pt-4">
              <a
                href="https://activities.wimhofmethod.com/instructors/alan-earle-2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Ver mi perfil oficial en Wim Hof Method →
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Respiración, hielo, presencia */}
      <section className="py-16 px-4">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-3">
              Respiración, hielo y presencia
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tres pilares que vas a entrenar en cualquiera de los dos talleres.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Wind,
                title: "Respiración",
                text: "Vas a aprender o profundizar en una técnica respiratoria poderosa para conectar con tu cuerpo, tu energía y tu sistema nervioso.",
              },
              {
                icon: Snowflake,
                title: "Frío",
                text: "El hielo será una herramienta para observar tu mente, regular tu respiración y entrenar calma bajo presión.",
              },
              {
                icon: Heart,
                title: "Integración",
                text: "No se trata solo de resistir. Se trata de aprender a entrar, respirar, sentir y volver al equilibrio.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <Card key={title} className="border-border/60 shadow-sm">
                <CardContent className="p-6">
                  <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl text-foreground mb-2">{title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Para quién es */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-8 text-center">
            Este taller es para ti si…
          </h2>
          <ul className="space-y-3">
            {[
              "Quieres aprender la técnica Wim Hof de forma guiada",
              "Quieres entender cómo usar la respiración y el frío con más seguridad",
              "Buscas regular tu sistema nervioso y entrenar presencia",
              "Ya has vivido experiencias con hielo y quieres profundizar",
              "Quieres compartir una práctica intensa, cuidada y transformadora",
            ].map((line) => (
              <li
                key={line}
                className="flex gap-3 items-start bg-card border rounded-xl p-4 shadow-sm"
              >
                <Check className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <span className="text-foreground/90">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Antes de reservar */}
      <section className="py-16 px-4">
        <div className="max-w-[900px] mx-auto">
          <div className="bg-card border-2 border-amber-200 dark:border-amber-900/40 rounded-2xl p-6 md:p-10 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="font-heading text-2xl md:text-3xl text-foreground">
                Lee esto antes de elegir tu taller
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              El taller <strong className="text-foreground">Fundamentos</strong> es abierto para
              personas nuevas o con poca experiencia. El taller{" "}
              <strong className="text-foreground">Avanzado</strong> requiere experiencia previa. Si
              nunca has hecho una sesión Wim Hof, una inmersión guiada o una experiencia similar,
              elige Fundamentos.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 md:p-5 mb-6">
              <p className="text-foreground font-medium">
                Si tienes dudas sobre cuál taller elegir, escríbenos antes de reservar.
              </p>
            </div>
            <Button asChild variant="outline" size="lg">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-1" />
                Preguntar por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Cupos y reserva */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 border-primary/30 text-primary">
              Cupos limitados
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-3">
              15 cupos por taller
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trabajamos con grupos pequeños para acompañar bien la respiración, la entrada al
              hielo y el proceso de cada persona.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {(["fundamentos", "avanzado"] as TallerKey[]).map((k) => {
              const t = TALLERES[k];
              const sold = isSoldOut(k);
              return (
                <Card key={k} className="border-border/60 shadow-md">
                  <CardContent className="p-6 md:p-8">
                    <h3 className="font-heading text-xl text-foreground mb-1">{t.nombre}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{t.nivel}</p>
                    <div className="space-y-2 text-sm mb-5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" /> {t.fecha}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" /> {t.horario}
                      </div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" /> {t.valorTxt}
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" /> {cuposDisponibles(k)} /{" "}
                        {t.cupos} cupos
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />{" "}
                        <a
                          href={MAPS_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Nave Studio, Antares 259, Las Condes
                        </a>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => openReserva(k)}
                      disabled={sold}
                    >
                      {sold ? "Cupos agotados" : `Reservar ${t.nombreCorto}`}
                      {!sold && <ChevronRight className="w-4 h-4 ml-1" />}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3">
              Preguntas frecuentes
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl text-foreground">
              Resuelve tus dudas
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-border/50 rounded-lg px-5 bg-card shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-5">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-5xl text-foreground mb-4">
            Elige tu taller y reserva tu cupo
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Fundamentos si quieres aprender desde cero. Avanzado si ya conoces la técnica y quieres
            ir más profundo.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              variant="outline"
              onClick={() => openReserva("fundamentos")}
              disabled={isSoldOut("fundamentos")}
            >
              {isSoldOut("fundamentos") ? "Fundamentos agotado" : "Reservar Fundamentos"}
            </Button>
            <Button
              size="lg"
              onClick={() => openReserva("avanzado")}
              disabled={isSoldOut("avanzado")}
            >
              {isSoldOut("avanzado") ? "Avanzado agotado" : "Reservar Avanzado"}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

interface DetalleProps {
  titulo: string;
  texto: string;
  cta: string;
  sold: boolean;
  onReserve: () => void;
  dark?: boolean;
}

const DetalleSection = ({ titulo, texto, cta, sold, onReserve, dark }: DetalleProps) => (
  <section className={`py-16 px-4 ${dark ? "bg-primary/5" : ""}`}>
    <div className="max-w-[900px] mx-auto text-center">
      <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-5">{titulo}</h2>
      <p className="text-lg text-muted-foreground leading-relaxed mb-8">{texto}</p>
      <Button size="lg" onClick={onReserve} disabled={sold}>
        {sold ? "Cupos agotados" : cta}
        {!sold && <ChevronRight className="w-4 h-4 ml-1" />}
      </Button>
    </div>
  </section>
);

export default TallerSantiago;
