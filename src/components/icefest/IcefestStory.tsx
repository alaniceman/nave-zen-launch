import { lazy, Suspense } from "react";
import { Wind, Snowflake, Coffee, Music, Heart, Brain, Quote, Zap, Sparkles, PartyPopper, Users } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import breathImg from "@/assets/icefest/breathwork-dimension.webp";
import iceImg from "@/assets/icefest/ice-bath-dimension.webp";
import cacaoImg from "@/assets/icefest/cacao-dimension.webp";
import danceImg from "@/assets/icefest/dance-dimension.webp";
import breathPortrait from "@/assets/icefest/breathact-portrait.webp";
import alan from "@/assets/icefest/alan-iceman.jpg";
import ambar from "@/assets/icefest/ambar-doula.jpg";
import manu from "@/assets/icefest/manu-dabanda.jpg";
import sol from "@/assets/icefest/sol-evans.webp";
import maral from "@/assets/icefest/maral-hekmat.webp";
import rolo from "@/assets/icefest/rolo-varela.webp";
import pia from "@/assets/icefest/pia-medel.webp";

const IcefestGallery = lazy(() => import("./IcefestGallery"));

const card = "bg-card/60 border border-border rounded-2xl backdrop-blur-sm";
const glow = (pos: string, color: string) => (
  <div aria-hidden className={`pointer-events-none absolute ${pos} w-64 h-64 rounded-full blur-3xl opacity-20`} style={{ background: `radial-gradient(circle, hsl(var(--${color})), transparent)` }} />
);

const dimensions = [
  { img: breathImg, icon: Wind, title: "Respiración inmersiva The Breath Act", text: "Respiración, música y trabajo somático guiados por facilitadores certificados de The Breath Act. No es magia: es neurociencia." },
  { img: iceImg, icon: Snowflake, title: "Baños de Hielo", text: "Domina el frío, domina la mente. Inmersiones en hielo a 3°C que despiertan tu fuerza interior y te demuestran lo fuerte que eres." },
  { img: cacaoImg, icon: Coffee, title: "Ceremonia de Cacao", text: "Un espacio para compartir cacao ceremonial, integrar lo vivido y abrir el corazón antes del cierre con música y danza." },
  { img: danceImg, icon: Music, title: "Ecstatic Dance", text: "Bailar presente. Bailar sobrio. Bailar desde la energía, no desde el escape. Música en vivo para liberar el cuerpo y celebrar estar vivo." },
];
const pillars = [
  ["Tu ADN sabe cómo hacerlo", "Tus antepasados sobrevivieron a eras de hielo sin ropa térmica. Tu cuerpo está diseñado para esto."],
  ["La mente confunde", "Tu cerebro busca comodidad, pero hoy confundimos \"comodidad\" con \"bienestar\". No son lo mismo."],
  ["La respiración es la llave", "Es el control remoto de tu sistema nervioso. Con ella, tú dominas al frío — no al revés."],
  ["Te acompañamos", "No te lanzamos al agua. Te preparamos, te guiamos, te miramos a los ojos mientras respiras."],
];
const science = [
  { icon: Wind, title: "Tu sangre se alcaliniza", text: "Cuando respiras profundo, rítmico y circular, \"lavas\" el dióxido de carbono de tu sistema. Tu química interna cambia." },
  { icon: Brain, title: "El lóbulo frontal se apaga", text: "Ahí vive tu ego, tus pendientes, tu ansiedad por el futuro. Al respirar así, literalmente apagas la voz que no te deja en paz." },
  { icon: Sparkles, title: "La electricidad", text: "Sientes hormigueo, ligereza, elevación. No es magia. Es biología. Tu cuerpo tiene la farmacia interna; la respiración es simplemente la forma de abrir el frasco." },
];
const schedule = [
  [Users, "Bienvenida y Acreditación", "10:15 hrs · Registro y preparación para el viaje"],
  [Wind, "Respiración inmersiva The Breath Act", "Guiada por facilitadores certificados de The Breath Act"],
  [Snowflake, "Baño de Hielo", "Inmersión en hielo para activar tu poder interno"],
  [Coffee, "Ceremonia de Cacao", "En la tarde, cacao ceremonial para integrar la experiencia y abrir el corazón"],
  [Music, "Ecstatic Dance", "Movimiento consciente para integrar y celebrar"],
  [Sparkles, "Cierre", "17:30 hrs · Integración y despedida"],
] as const;
const facilitators = [
  { name: "Alan Iceman", role: "Fundador de La Nave • Instructor certificado Método Wim Hof", bio: "Creador de Criomedicina en Chile. Coach y guía en breathwork e inmersión en agua fría; ayuda a entrenar resiliencia y a reconectar con la fuerza interior.", img: alan },
  { name: "Facilitadores The Breath Act", role: "Invitados especiales • Respiración inmersiva", bio: "La respiración inmersiva será guiada por facilitadores certificados de The Breath Act, escuela que integra respiración, música y trabajo somático con base en la neurociencia.", img: breathPortrait },
  { name: "Ámbar Doula", role: "Ceremonia de cacao", bio: "Doula y guardiana de espacios sagrados. Conduce la ceremonia de cacao, sosteniendo el descanso del cuerpo entre la respiración y el hielo.", img: ambar },
  { name: "Manu Da Banda", role: "Música en vivo • Ecstatic Dance", bio: "Sostiene la respiración, las inmersiones y el cierre del día con música y selección en vivo.", img: manu },
  { name: "DJ Zalamandra", role: "DJ • Ecstatic Dance", bio: "Un viaje musical que crece desde la conexión interior hasta la expresión libre, para cerrar el día bailando con libertad y comunidad.", img: null },
];
const staff = [
  { name: "Sol Evans", role: "Instructora de Ice Yoga • Reikista • Crioguía de Inmersiones y Breathwork • Terapeuta Holística – Reiki Master", quote: "Te acompaño a encontrar calma y fortaleza a través del frío, la respiración y la energía.", img: sol },
  { name: "Maral Hekmat", role: "Yoga y Criomedicina", quote: "Profesora de yoga e instructora clave del equipo. Integra movimiento consciente y soporte en ice bath.", img: maral },
  { name: "Rolo Varela", role: "Instructor Certificado – Ice Yoga Method • Crioguía de Inmersiones y Breathwork", quote: "Te acompaño a fortalecer cuerpo y mente con frío, respiración y movimiento, cultivando foco y resiliencia sin burnout.", img: rolo },
  { name: "Pía Medel", role: "Producción y acompañamiento", quote: "Logística y experiencia de participantes; cuida que cada detalle fluya con cariño.", img: pia },
];
const faqs = [
  ["¿Necesito experiencia previa?", "No, el evento está diseñado tanto para principiantes como para personas con experiencia. Todo está guiado paso a paso por facilitadores expertos."],
  ["¿Qué debo traer?", "Ropa cómoda para movimiento, traje de baño, toalla, una muda de ropa seca, y una botella de agua."],
  ["¿Hay contraindicaciones para los baños de hielo?", "Sí, si tienes problemas cardíacos, presión alta no controlada, epilepsia o estás embarazada, consulta con tu médico antes de participar en las inmersiones en hielo."],
  ["¿El evento incluye comida?", "Sí, el evento incluye almuerzo."],
  ["¿Puedo ir solo/a?", "¡Por supuesto! Muchas personas vienen solas y es una excelente oportunidad para conocer gente nueva y conectar con la comunidad."],
  ["¿Cómo funciona el pago en cuotas?", "Al pagar con Mercado Pago, puedes elegir hasta 3 cuotas sin interés directamente en la plataforma de pago."],
];

export default function IcefestStory() {
  return (
    <>
      <section id="experiencia" className="py-20 md:py-24 scroll-mt-20">
        <div className="container max-w-6xl px-5">
          <p className="text-primary text-sm md:text-base font-semibold uppercase tracking-widest text-center mb-3">Lo que te espera en el Icefest</p>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16">Las Cuatro Dimensiones Sagradas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dimensions.map((d) => (
              <article key={d.title} className="group overflow-hidden rounded-2xl border border-border bg-card">
                <div className="relative h-48 overflow-hidden">
                  <img src={d.img} alt={d.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                </div>
                <div className="p-6">
                  <d.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-3">{d.title}</h3>
                  <p className="text-muted-foreground">{d.text}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-10 text-center text-lg font-semibold">El evento incluye almuerzo</p>
        </div>
      </section>

      <section className="py-20 md:py-24 festival-cosmic relative overflow-hidden">
        {glow("top-20 right-0", "primary")}
        <div className="container max-w-4xl px-5 relative">
          <div className="text-center mb-10">
            <Heart className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold mb-4">De un freezer en una terraza a esto</h2>
            <p className="text-muted-foreground text-lg">El origen de Icefest</p>
          </div>
          <div className={`${card} p-7 md:p-12`}>
            <div className="space-y-6 text-lg leading-relaxed">
              <p>Todo partió en la <span className="text-primary font-semibold">terraza de un departamento</span>. Un freezer usado, pagado en 6 cuotas, lleno de agua y hielo.</p>
              <p>Los amigos decían <span className="italic">"estás loco"</span>. Pero empezaron a ver el cambio. Y la curiosidad les ganó.</p>
              <p>Uno a uno fueron llegando. Y la <span className="text-secondary font-semibold">bola de nieve creció</span> hasta convertirse en esto.</p>
              <p>Del freezer pasamos a piscinas inflables. Del departamento a parques. De Santiago a recorrer Chile. Y hoy, esa bola de nieve es una <span className="text-accent font-semibold">tribu gigante</span>.</p>
            </div>
            <blockquote className="mt-10 pt-8 border-t border-border text-center">
              <Quote className="w-8 h-8 text-primary mx-auto mb-4 opacity-50" />
              <p className="text-2xl md:text-3xl font-semibold festival-spectrum italic">"Get high on your own supply"</p>
              <footer className="mt-4 text-muted-foreground">— Wim Hof</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 relative overflow-hidden">
        {glow("bottom-10 left-0", "accent")}
        <div className="container max-w-4xl px-5 relative">
          <div className="text-center mb-10">
            <Brain className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold mb-4">¿Muy friolento/a? Eso no existe.</h2>
            <p className="text-muted-foreground text-lg">Para los que creen que no pueden</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {pillars.map(([t, d], i) => (
              <div key={t} className={`${card} p-6 flex items-start gap-4`}>
                <span className="w-10 h-10 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <div><h3 className="font-semibold mb-2">{t}</h3><p className="text-muted-foreground">{d}</p></div>
              </div>
            ))}
          </div>
          <p className="mt-12 text-center text-xl max-w-2xl mx-auto">
            No existe el <span className="line-through text-muted-foreground">"soy friolento"</span>. Existe el <span className="text-primary font-semibold">"no estoy entrenado"</span>.
          </p>
        </div>
      </section>

      <section className="py-20 festival-cosmic relative overflow-hidden">
        <div className="container max-w-4xl px-5 text-center">
          <Quote className="w-14 h-14 text-primary mx-auto mb-8 opacity-50" />
          <blockquote className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight festival-spectrum italic">"The cold is your warm friend and one of the best teachers you will ever have"</blockquote>
          <p className="mt-8 text-xl text-muted-foreground">— Wim Hof</p>
        </div>
      </section>

      <section className="py-20 md:py-24 relative overflow-hidden">
        {glow("top-10 left-0", "secondary")}
        <div className="container max-w-4xl px-5 relative">
          <div className="text-center mb-10">
            <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Viajar a otro planeta</h2>
            <p className="text-muted-foreground text-lg">(sin moverte del suelo)</p>
          </div>
          <div className={`${card} p-7 md:p-12`}>
            <div className="space-y-8">
              {science.map((s) => (
                <div key={s.title} className="flex items-start gap-4">
                  <span className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0"><s.icon className="w-6 h-6 text-primary" /></span>
                  <div><h3 className="text-xl font-semibold mb-2">{s.title}</h3><p className="text-muted-foreground leading-relaxed">{s.text}</p></div>
                </div>
              ))}
            </div>
            <blockquote className="mt-10 pt-8 border-t border-border text-center">
              <p className="text-2xl md:text-3xl font-semibold festival-spectrum italic">"The soul is in the chemistry"</p>
              <footer className="mt-4 text-muted-foreground">— Wim Hof</footer>
            </blockquote>
          </div>
          <p className="mt-12 text-center text-xl max-w-2xl mx-auto italic">"Feeling is understanding" — Hay cosas que no se pueden explicar con palabras, solo se entienden cuando las vives.</p>
        </div>
      </section>

      <section className="py-20 md:py-24 festival-cosmic relative overflow-hidden">
        {glow("top-20 right-0", "accent")}
        <div className="container max-w-4xl px-5 relative">
          <div className="text-center mb-10">
            <Music className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Bailar tu libertad</h2>
            <p className="text-muted-foreground text-lg">El cierre con Ecstatic Dance</p>
          </div>
          <div className={`${card} p-7 md:p-12`}>
            <div className="space-y-6 text-lg leading-relaxed">
              <p>Ya respiraste. Ya venciste al frío. Tu cuerpo está <span className="text-primary font-semibold">vibrando</span>.</p>
              <p>Tienes una claridad mental absoluta y una energía que se te sale por los poros. Ese <span className="italic text-accent">high natural</span> del que hablamos.</p>
              <p className="text-2xl font-semibold text-center py-4">¿Qué hacemos con toda esa electricidad?<br /><span className="text-secondary">La celebramos.</span></p>
            </div>
            <div className="mt-8 p-6 rounded-xl bg-accent/10 border border-accent/30">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><PartyPopper className="w-5 h-5 text-accent" />¿Te da vergüenza bailar sobrio?</h3>
              <p className="font-semibold">Olvida eso. Esto no es una discoteca. Nadie te está juzgando.</p>
              <p className="text-muted-foreground mt-2">Te mueves como tu cuerpo te pide, no como "se supone" que debes bailar. Bailamos para soltar el estrés y agradecer que estamos vivos.</p>
            </div>
          </div>
          <p className="mt-12 text-center text-2xl font-bold festival-spectrum">Ven a bailar tu libertad.</p>
        </div>
      </section>

      <section id="dia" className="py-20 md:py-24 bg-card scroll-mt-20">
        <div className="container max-w-3xl px-5">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-5 text-primary">Cronograma del Día</h2>
          <p className="text-center text-muted-foreground mb-12">Domingo 13 de diciembre · 10:15 a 17:30 hrs · Parque Mahuida, La Reina</p>
          <ol className="space-y-4">
            {schedule.map(([Icon, title, desc], i) => (
              <li key={title} className="flex items-center gap-4 rounded-xl border border-border bg-background/60 p-5">
                <span className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0"><Icon className="w-6 h-6" /></span>
                <div><h3 className="text-lg font-semibold">{i + 1}. {title}</h3><p className="text-sm text-muted-foreground mt-1">{desc}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="facilitadores" className="py-20 md:py-24 scroll-mt-20">
        <div className="container max-w-6xl px-5">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">Facilitadores y Staff</h2>
          <p className="text-center text-muted-foreground mb-14">Quienes guiarán tu experiencia</p>
          <h3 className="text-2xl md:text-3xl font-semibold text-center mb-10 festival-spectrum">Facilitadores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-20">
            {facilitators.map((f) => (
              <article key={f.name} className="group overflow-hidden rounded-2xl border border-border bg-card">
                <div className="relative h-64 overflow-hidden bg-muted flex items-center justify-center">
                  {f.img ? (
                    <img src={f.img} alt={f.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : <Music className="w-16 h-16 text-accent" />}
                </div>
                <div className="p-5">
                  <h4 className="text-xl font-bold">{f.name}</h4>
                  <p className="text-sm font-semibold text-primary mt-1 mb-3">{f.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.bio}</p>
                </div>
              </article>
            ))}
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-center mb-3 festival-spectrum">Staff</h3>
          <p className="text-center text-muted-foreground mb-10">Quienes sostienen la Nave en cada detalle</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {staff.map((s) => (
              <article key={s.name} className="group overflow-hidden rounded-2xl border border-border bg-card">
                <div className="h-56 overflow-hidden"><img src={s.img} alt={s.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /></div>
                <div className="p-5">
                  <h4 className="text-lg font-bold">{s.name}</h4>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{s.role}</p>
                  <p className="text-xs text-muted-foreground mt-2 italic">{s.quote}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 md:py-24 festival-cosmic scroll-mt-20">
        <div className="container max-w-3xl px-5">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map(([q, a], i) => (
              <AccordionItem key={q} value={String(i)} className="bg-card/60 border border-border rounded-lg px-5">
                <AccordionTrigger className="text-left text-lg">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center mt-8">
            <a className="text-primary underline" href="https://wa.me/56946120426?text=Hola%2C%20tengo%20una%20consulta%20sobre%20Icefest%20Santiago" target="_blank" rel="noopener noreferrer">¿Otra duda? Escríbenos por WhatsApp</a>
          </div>
        </div>
      </section>

      <section id="fotos" className="py-16 md:py-24 bg-card scroll-mt-20">
        <div className="container max-w-6xl px-5">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Revive la Experiencia</h2>
            <p className="text-lg text-muted-foreground">Momentos de ediciones anteriores de ICEFEST</p>
          </div>
          <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[0,1,2,3].map((i) => <Skeleton key={i} className="aspect-[3/4] rounded-xl" />)}</div>}>
            <IcefestGallery />
          </Suspense>
        </div>
      </section>
    </>
  );
}
