import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Snowflake, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CyberCountdown, CyberLayout, CyberSeal } from "@/components/cyber/CyberShared";
import { CYBER_IMAGES, CYBER_ROUTES } from "@/lib/cyberNave";

const CyberNaveStudio = () => (
  <CyberLayout>
    <Helmet>
      <title>Cyber Nave Studio | Hielo, yoga y membresías con descuento</title>
      <meta name="description" content="Cyber Nave Studio: bautizo de hielo desde $15.000, packs con invitaciones y membresías con descuento y meses de regalo en Las Condes." />
      <link rel="canonical" href="https://studiolanave.com/cyber-nave-studio" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Cyber Nave Studio · Activa tu poder" />
      <meta property="og:description" content="Experiencias desde $15.000 y beneficios para comenzar o renovar tu práctica. Últimos días." />
      <meta property="og:url" content="https://studiolanave.com/cyber-nave-studio" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>

    <section className="relative overflow-hidden">
      <img src={CYBER_IMAGES.iceSonrisa} alt="Persona sonriendo en el baño de hielo de Nave Studio" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/60 to-background" />
      <div className="relative container mx-auto max-w-3xl px-4 pt-14 pb-10 text-center">
        <CyberSeal>Cyber Nave Studio</CyberSeal>
        <h1 className="mt-5 font-space-grotesk font-bold text-background text-[clamp(2rem,8vw,3.75rem)] leading-[1.05]">
          Activa tu poder. Dale espacio a tu crecimiento.
        </h1>
        <p className="mt-5 font-inter text-base sm:text-lg text-background/90 leading-relaxed">
          Este Cyber, vuelve al movimiento, descubre tu respiración y encuentra en el hielo una oportunidad para
          desafiarte. Experiencias desde $15.000 y beneficios para comenzar o renovar tu práctica.
        </p>
      </div>
    </section>

    <section className="relative z-10 container mx-auto max-w-3xl px-4 mt-4">
      <CyberCountdown />
      <p className="mt-4 text-center font-inter text-sm text-muted-foreground">
        Packs y membresías trimestrales, semestrales y anuales en hasta 3 cuotas sin interés.
      </p>
    </section>

    <section className="container mx-auto max-w-5xl px-4 mt-10 grid gap-5 md:grid-cols-2">
      <article className="rounded-3xl overflow-hidden border border-border bg-card flex flex-col">
        <img src={CYBER_IMAGES.respira} alt="Grupo respirando antes del hielo" loading="lazy" className="h-48 sm:h-56 w-full object-cover" />
        <div className="p-6 flex flex-col flex-1">
          <Snowflake className="h-6 w-6 text-accent mb-3" />
          <h2 className="font-space-grotesk text-2xl font-bold text-primary leading-tight">
            Respira. Entra al hielo. Descubre de qué eres capaz.
          </h2>
          <p className="font-inter text-muted-foreground mt-3 leading-relaxed">
            Bautizo de hielo desde <strong className="text-foreground">$15.000</strong> y packs con invitaciones de regalo para compartir la experiencia.
          </p>
          <Button asChild size="lg" className="mt-6 h-14 rounded-full text-base w-full">
            <Link to={CYBER_ROUTES.packs}>Ver experiencias de hielo <ArrowRight className="h-4 w-4 ml-2" /></Link>
          </Button>
        </div>
      </article>

      <article className="rounded-3xl overflow-hidden border border-border bg-card flex flex-col">
        <img src={CYBER_IMAGES.yoga} alt="Clase de yoga en Nave Studio" loading="lazy" className="h-48 sm:h-56 w-full object-cover" />
        <div className="p-6 flex flex-col flex-1">
          <Sprout className="h-6 w-6 text-accent mb-3" />
          <h2 className="font-space-grotesk text-2xl font-bold text-primary leading-tight">
            Tu crecimiento necesita espacio y continuidad.
          </h2>
          <p className="font-inter text-muted-foreground mt-3 leading-relaxed">
            Si eres nuevo, <strong className="text-foreground">50% por 3 meses</strong>. Planes largos con descuento y meses de regalo.
          </p>
          <Button asChild size="lg" className="mt-6 h-14 rounded-full text-base w-full">
            <Link to={CYBER_ROUTES.memberships}>Ver membresías Cyber <ArrowRight className="h-4 w-4 ml-2" /></Link>
          </Button>
        </div>
      </article>
    </section>
  </CyberLayout>
);

export default CyberNaveStudio;
