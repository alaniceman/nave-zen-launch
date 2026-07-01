import { Helmet } from "react-helmet-async";
import {
  Shield,
  Thermometer,
  Clock,
  HandHeart,
  Sparkles,
  Droplets,
  VolumeX,
  Users,
  Footprints,
  BookOpen,
  Coffee,
  Check,
} from "lucide-react";
import { Footer } from "@/components/Footer";

const rules = [
  {
    icon: Shield,
    text: "Sigue siempre las indicaciones del instructor o instructora.",
  },
  {
    icon: Thermometer,
    text: "Para entrar al hielo después de yoga, debes haber realizado al menos una clase del Método Wim Hof antes.",
  },
  {
    icon: Clock,
    text: "Después de yoga, el tiempo máximo en el hielo es de 2 minutos. Respetemos los tiempos indicados.",
  },
  {
    icon: HandHeart,
    text: "Si alguien está en el agua fría, respeta su momento de introspección, meditación y conexión.",
  },
  {
    icon: Sparkles,
    text: "Después de las clases de yoga, limpia tu mat y deja todo el material en su lugar.",
  },
  {
    icon: Droplets,
    text: "Ayúdanos a mantener el espacio ordenado y seco usando las toallas indicadas.",
  },
  {
    icon: Footprints,
    text: "Después de una inmersión en agua fría, sal de la zona negra con los pies completamente secos.",
  },
  {
    icon: VolumeX,
    text: "Si llegas tarde a una clase, entra en silencio para no interrumpir la experiencia de los demás.",
  },
  {
    icon: Users,
    text: "Si hay otra clase en recepción o en espacios cercanos, respetemos el ambiente de calma y silencio.",
  },
  {
    icon: Shield,
    text: "Respeta siempre el espacio personal de cada persona.",
  },
  {
    icon: Footprints,
    text: "Al llegar, deja tus zapatillas en el lugar destinado junto al baño, no en recepción.",
  },
  {
    icon: BookOpen,
    text: "Si llegas temprano, disfruta la recepción, los libros y los oráculos.",
  },
  {
    icon: Coffee,
    text: "Puedes prepararte un tecito cuando quieras. Si usas una taza, lávala y devuélvela a su lugar.",
  },
];

export default function ReglasNaveStudio() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Reglas Nave Studio — Código de convivencia</title>
        <meta
          name="description"
          content="Conoce las reglas de Nave Studio. Respeto, orden y cuidado mutuo para que todos disfruten de la experiencia."
        />
        <link rel="canonical" href="https://studiolanave.com/reglas-nave-studio" />
        <meta property="og:title" content="Reglas Nave Studio — Código de convivencia" />
        <meta
          property="og:description"
          content="Reglas de convivencia y seguridad en Nave Studio."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-12 md:pt-24 md:pb-16">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-[#EAF3EC] via-[#F4F9F5] to-background"
        />
        <div
          aria-hidden
          className="absolute -z-10 top-10 -left-20 w-72 h-72 rounded-full bg-[#2E4D3A]/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -z-10 top-40 right-0 w-80 h-80 rounded-full bg-[#5B8C6B]/15 blur-3xl"
        />

        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-[#2E4D3A]/15 text-[#2E4D3A] px-4 py-1.5 rounded-full text-sm font-medium shadow-sm mb-6">
            <Shield className="w-4 h-4" />
            Código de convivencia
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1F3A2A] mb-5 leading-[1.05] tracking-tight">
            Reglas Nave Studio
          </h1>
          <p className="text-lg md:text-xl text-[#4A4A4A] max-w-xl mx-auto leading-relaxed">
            Un espacio creado para entrenar cuerpo, mente y sistema nervioso.
            Estas reglas nos ayudan a cuidarnos entre todos.
          </p>
        </div>
      </section>

      {/* Rules List */}
      <section className="py-10 md:py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="grid gap-4">
            {rules.map((rule, index) => {
              const Icon = rule.icon;
              return (
                <div
                  key={index}
                  className="flex gap-4 items-start bg-[#F8FAFB] border border-[#E8ECF0] rounded-2xl p-5 transition-all hover:border-[#2E4D3A]/30 hover:shadow-sm"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#2E4D3A]/10 flex items-center justify-center mt-0.5">
                    <Icon className="w-5 h-5 text-[#2E4D3A]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2E4D3A] text-white flex items-center justify-center text-xs font-bold mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-[#2A2A2A] leading-relaxed font-medium">
                        {rule.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-[#1F3A2A] text-white relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#5B8C6B]/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-[#2E4D3A]/40 blur-3xl"
        />
        <div className="container mx-auto px-4 max-w-2xl text-center relative">
          <Shield className="w-8 h-8 mx-auto mb-5 text-white/70" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            ¿Tienes dudas sobre alguna regla?
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Escríbenos por WhatsApp y te ayudamos con cualquier pregunta.
          </p>
          <a
            href="https://wa.me/56946120426"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-[#1F3A2A] hover:bg-white/90 font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
