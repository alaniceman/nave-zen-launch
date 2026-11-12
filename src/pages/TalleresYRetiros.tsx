import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { Link } from "@/lib/router-compat";
import { Calendar, MapPin, ArrowRight, Wind, Mountain, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { activeIcefestTier, icefestDate, icefestMoney } from "@/lib/icefest";

type Item = {
  tag: string;
  title: string;
  date: string;
  location: string;
  description: string;
  highlights: string[];
  url: string;
  icon: React.ReactNode;
  accent: string;
  soldOut?: boolean;
};

const TalleresYRetiros = () => {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    async function load() {
      const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
      const { data: event } = await supabase.from("icefest_events").select("*").eq("slug", "icefest-santiago").eq("is_active", true).gte("date", today).maybeSingle();
      if (!event) return;
      const { data: tiers } = await supabase.from("icefest_ticket_types").select("*").eq("event_id", event.id);
      const active = activeIcefestTier(tiers || []);
      setItems([{ tag: "Festival · Santiago", title: event.name, date: icefestDate(event.date), location: event.location, description: event.description, highlights: [event.schedule, "Respiración inmersiva · Hielo · Cacao · Ecstatic Dance", ...(active && event.sales_open ? [`${active.name} · ${icefestMoney(active.price)}`] : ["Ver detalles del evento"])], url: "/icefest-santiago", icon: <Wind className="w-5 h-5" />, accent: "from-primary/10 to-primary/5" }]);
    }
    void load();
  }, []);
  return (
    <>
      <Helmet>
        <title>Talleres y Retiros · Nave Studio</title>
        <meta
          name="description"
          content="Próximos talleres y retiros de Nave Studio: Icefest Santiago + Breath Act en Parque Mahuida. Respiración, hielo, cacao y Ecstatic Dance."
        />
        <link rel="canonical" href="https://studiolanave.com/talleres-y-retiros" />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-primary/5 via-background to-background pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <Badge variant="outline" className="mb-5 border-primary/30 text-primary">
              Experiencias Inmersivas
            </Badge>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-5">
              Talleres y Retiros
            </h1>
            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Experiencias inmersivas para profundizar en la práctica del frío, la respiración y la presencia. Cupos limitados en cada uno.
            </p>
          </div>
        </section>

        {/* Items */}
        <section className="py-10 md:py-16">
          <div className="container mx-auto px-4 max-w-5xl space-y-8">
            {items.map((item) => (
              <Card
                key={item.title}
                className={`overflow-hidden border-border/60 bg-gradient-to-br ${item.accent}`}
              >
                <CardContent className="p-6 md:p-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground">
                      {item.icon}
                    </span>
                    <span className="font-body text-xs md:text-sm tracking-wider uppercase text-primary font-semibold">
                      {item.tag}
                    </span>
                    {item.soldOut && <Badge variant="destructive">Agotado · ambas fechas</Badge>}
                  </div>

                  <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-4">
                    {item.title}
                  </h2>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-5 text-sm text-foreground/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-medium">{item.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <p className="font-body text-base text-foreground/85 mb-5 leading-relaxed">
                    {item.description}
                  </p>

                  <ul className="space-y-2 mb-7">
                    {item.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    asChild
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {item.url.startsWith("/") ? (
                      <Link to={item.url}>
                        {item.soldOut ? "Ver detalles" : "Ver más e inscribirme"}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    ) : (
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        Ver más e inscribirme
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </a>
                    )}
                  </Button>

                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Closing */}
        <section className="py-14 md:py-20 bg-primary/5">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <Mountain className="w-10 h-10 mx-auto text-primary mb-4" />
            <h2 className="font-heading text-2xl md:text-3xl text-foreground mb-4">
              ¿Tienes dudas sobre cuál es para ti?
            </h2>
            <p className="font-body text-base md:text-lg text-muted-foreground mb-7">
              Escríbenos por WhatsApp y conversamos qué experiencia se ajusta mejor a tu momento.
            </p>
            <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <a href="https://wa.me/56946120426" target="_blank" rel="noopener noreferrer">
                Escribir por WhatsApp
              </a>
            </Button>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default TalleresYRetiros;
