import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";
import {
  Snowflake,
  Wind,
  Users,
  Gift,
  Check,
  Calendar,
  Sparkles,
  Heart,
  ChevronDown,
  ExternalLink,
  CreditCard,
} from "lucide-react";

const scrollToPlans = () => {
  document.getElementById("planes")?.scrollIntoView({ behavior: "smooth" });
};

const PlanAnual2026 = () => {
  return (
    <>
      <Helmet>
        <title>Plan Anual 2026 - Nave Studio</title>
        <meta
          name="description"
          content="Plan Anual 2026 en Nave Studio. Método Wim Hof, Yoga y comunidad. 2 meses gratis, entradas Icefest incluidas y pago en 12 cuotas sin interés."
        />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        {/* HERO */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('/lovable-uploads/82672388-9723-4aee-a1f2-ac72618cd26a.png')",
            }}
          />
          <div className="absolute inset-0 bg-primary/80" />

          <div className="relative z-10 container mx-auto px-4 py-20 text-center text-primary-foreground">
            <h1 className="font-space text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
              Empieza el 2026 como nunca antes
            </h1>
            <h2 className="font-space text-xl md:text-2xl lg:text-3xl font-medium mb-8 opacity-90">
              Tu año de respiración, hielo y comunidad comienza aquí
            </h2>
            <p className="font-inter text-lg md:text-xl max-w-2xl mx-auto mb-8 opacity-85">
              Un año completo en Nave Studio para construir un cuerpo fuerte,
              una mente clara y una rutina que sí se sostiene.
            </p>

            <div className="flex flex-col items-center gap-3 mb-10 text-left max-w-md mx-auto">
              <div className="flex items-center gap-3 w-full">
                <Wind className="w-5 h-5 flex-shrink-0" />
                <span>Método Wim Hof (Breathwork + Ice Bath)</span>
              </div>
              <div className="flex items-center gap-3 w-full">
                <Sparkles className="w-5 h-5 flex-shrink-0" />
                <span>Yoga y nuevas disciplinas 2026</span>
              </div>
              <div className="flex items-center gap-3 w-full">
                <Users className="w-5 h-5 flex-shrink-0" />
                <span>Comunidad real + beneficios exclusivos</span>
              </div>
              <div className="flex items-center gap-3 w-full">
                <Gift className="w-5 h-5 flex-shrink-0" />
                <span>Entradas a Icefest 2026 según tu plan (transferibles)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button
                size="lg"
                className="bg-background text-primary hover:bg-background/90 font-semibold text-lg px-8"
                onClick={scrollToPlans}
              >
                Quiero mi Plan Anual 2026
              </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground/10 text-lg px-8"
            onClick={scrollToPlans}
          >
                Ver planes y beneficios
                <ChevronDown className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <p className="text-sm opacity-75">
              Cupos limitados · Beneficios exclusivos 2026 · Pagos en 12 cuotas
              disponibles
            </p>
          </div>
        </section>

        {/* POR QUÉ ANUAL */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="font-space text-3xl md:text-4xl font-bold mb-6 text-foreground">
              El cambio real no ocurre en una sesión
            </h2>
            <p className="font-inter text-lg md:text-xl text-muted-foreground mb-10">
              Ocurre cuando te comprometes con el proceso.
              <br />
              El Plan Anual 2026 es tu sistema para sostener constancia:
              entrenas tu respiración, tu relación con el frío y tu disciplina,
              con una comunidad que te acompaña.
            </p>

            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8 mb-10">
              <p className="font-space text-xl md:text-2xl font-semibold text-primary leading-relaxed">
                No es motivación.
                <br />
                Es sistema.
                <br />
                Es hábito.
                <br />
                Es comunidad.
              </p>
            </div>

            <Button size="lg" onClick={scrollToPlans}>
              Quiero asegurar mi plan
            </Button>
          </div>
        </section>

        {/* NOVEDADES 2026 */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="font-space text-3xl md:text-4xl font-bold mb-6 text-foreground">
              El 2026 viene con Novedades en Nave Studio ❄️
            </h2>
            <p className="font-inter text-lg md:text-xl text-muted-foreground mb-10">
              Este 2026 se viene con todo.
              <br />
              Se sumarán nuevas disciplinas, un evento exclusivo de la comunidad
              y más beneficios para miembros anuales.
            </p>

            <div className="flex flex-col items-center gap-4 mb-10 text-left max-w-md mx-auto">
              <div className="flex items-center gap-3 w-full">
                <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Nuevas disciplinas y experiencias (próximamente)</span>
              </div>
              <div className="flex items-center gap-3 w-full">
                <Users className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Evento de la comunidad (exclusivo miembros)</span>
              </div>
              <div className="flex items-center gap-3 w-full">
                <Gift className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Beneficios y sorpresas durante el año</span>
              </div>
              <div className="flex items-center gap-3 w-full">
                <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Acceso y prioridad en experiencias seleccionadas</span>
              </div>
            </div>

            <Button size="lg" onClick={scrollToPlans}>
              Ver planes anuales
            </Button>
          </div>
        </section>

        {/* MENSAJE DEL EQUIPO */}
        <section className="py-20 bg-warm/10">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <Heart className="w-12 h-12 text-warm mx-auto mb-6" />
            <h2 className="font-space text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Gracias por ser parte de esto
            </h2>
            <p className="font-inter text-lg md:text-xl text-muted-foreground leading-relaxed">
              Llevamos 4 meses y estamos muy felices de lo que hemos creado.
              <br />
              Muchas gracias por la confianza, por su buena onda y entrega.
              <br />
              <span className="font-semibold text-foreground">
                El equipo de Nave Studio les da las gracias y un feliz año 2026.
              </span>
            </p>
          </div>
        </section>

        {/* PLANES ANUALES */}
        <section id="planes" className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="font-space text-3xl md:text-4xl font-bold mb-4 text-center text-foreground">
              Planes Anuales 2026
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              Elige el plan que mejor se adapte a tu ritmo. Todos incluyen
              beneficios exclusivos.
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* PLAN 1X SEMANA */}
              <Card className="bg-card border-border relative">
                <CardHeader className="text-center pb-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Plan 1 vez por semana
                  </p>
                  <p className="text-lg line-through text-muted-foreground">
                    $588.000 anual
                  </p>
                  <p className="font-space text-4xl font-bold text-foreground">
                    $490.000
                  </p>
                  <p className="text-sm text-muted-foreground">anual</p>
                  <Badge
                    variant="secondary"
                    className="mt-3 bg-primary/10 text-primary"
                  >
                    2 meses gratis · $98.000 de ahorro
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="relative border border-dashed border-primary/40 rounded-lg p-4 bg-primary/5">
                    <Badge className="absolute -top-2.5 left-3 bg-primary text-primary-foreground text-xs px-2">
                      🎁 BONUS
                    </Badge>
                    <div className="space-y-3 text-sm pt-1">
                      <div className="flex items-start gap-2">
                        <Snowflake className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">1 entrada a Icefest 2026</p>
                          <p className="text-muted-foreground text-xs">
                            Transferible · Valor $70.000
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Gift className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">5% dcto Retiro Guatemala</p>
                          <p className="text-muted-foreground text-xs">
                            Valor $100.000
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button asChild className="w-full" size="lg">
                      <a
                        href="https://boxmagic.cl/market/plan/oV4d9wz0r2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Suscribirme por BoxMagic
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <a
                        href="https://mpago.li/2iWEW6R"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <CreditCard className="mr-2 w-4 h-4" />
                        Págalo en 12 cuotas sin interés
                      </a>
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">vía Mercado Pago</p>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    Puedes compartir tu entrada a Icefest con quien tú quieras.
                  </p>
                </CardContent>
              </Card>

              {/* PLAN 2X SEMANA - RECOMENDADO */}
              <Card className="bg-card border-primary border-2 relative shadow-lg scale-[1.02]">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    RECOMENDADO
                  </Badge>
                </div>
                <CardHeader className="text-center pb-4 pt-8">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Plan 2 veces por semana
                  </p>
                  <p className="text-lg line-through text-muted-foreground">
                    $948.000 anual
                  </p>
                  <p className="font-space text-4xl font-bold text-primary">
                    $790.000
                  </p>
                  <p className="text-sm text-muted-foreground">anual</p>
                  <Badge
                    variant="secondary"
                    className="mt-3 bg-primary/10 text-primary"
                  >
                    2 meses gratis · $158.000 de ahorro
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="relative border border-dashed border-primary/40 rounded-lg p-4 bg-primary/5">
                    <Badge className="absolute -top-2.5 left-3 bg-primary text-primary-foreground text-xs px-2">
                      🎁 BONUS
                    </Badge>
                    <div className="space-y-3 text-sm pt-1">
                      <div className="flex items-start gap-2">
                        <Snowflake className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">2 entradas a Icefest 2026</p>
                          <p className="text-muted-foreground text-xs">
                            Transferibles · Valor $140.000
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Gift className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">7% dcto Retiro Guatemala</p>
                          <p className="text-muted-foreground text-xs">
                            Valor $140.000
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button asChild className="w-full" size="lg">
                      <a
                        href="https://boxmagic.cl/market/plan/AvLXgdpDEK"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Suscribirme por BoxMagic
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <a
                        href="https://mpago.li/1vhEQuN"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <CreditCard className="mr-2 w-4 h-4" />
                        Págalo en 12 cuotas sin interés
                      </a>
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">vía Mercado Pago</p>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    Este plan es el equilibrio perfecto entre constancia y
                    flexibilidad.
                  </p>
                </CardContent>
              </Card>

              {/* PLAN ILIMITADO */}
              <Card className="bg-card border-border relative">
                <CardHeader className="text-center pb-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Plan Ilimitado
                  </p>
                  <p className="text-lg line-through text-muted-foreground">
                    $1.140.000 anual
                  </p>
                  <p className="font-space text-4xl font-bold text-foreground">
                    $950.000
                  </p>
                  <p className="text-sm text-muted-foreground">anual</p>
                  <Badge
                    variant="secondary"
                    className="mt-3 bg-primary/10 text-primary"
                  >
                    2 meses gratis · $190.000 de ahorro
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="relative border border-dashed border-primary/40 rounded-lg p-4 bg-primary/5">
                    <Badge className="absolute -top-2.5 left-3 bg-primary text-primary-foreground text-xs px-2">
                      🎁 BONUS
                    </Badge>
                    <div className="space-y-3 text-sm pt-1">
                      <div className="flex items-start gap-2">
                        <Snowflake className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">3 entradas a Icefest 2026</p>
                          <p className="text-muted-foreground text-xs">
                            Transferibles · Valor $210.000
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Gift className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">10% dcto Retiro Guatemala</p>
                          <p className="text-muted-foreground text-xs">
                            Valor $200.000
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button asChild className="w-full" size="lg">
                      <a
                        href="https://boxmagic.cl/market/plan/Vx0J5xA4vB"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Suscribirme por BoxMagic
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <a
                        href="https://mpago.li/25GsW6S"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <CreditCard className="mr-2 w-4 h-4" />
                        Págalo en 12 cuotas sin interés
                      </a>
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">vía Mercado Pago</p>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    Para quienes quieren acceso total y vivir Nave Studio como
                    estilo de vida.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* QUÉ INCLUYE */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="font-space text-3xl md:text-4xl font-bold mb-10 text-foreground">
              Lo que estás comprando realmente
            </h2>

            <div className="flex flex-col items-center gap-4 mb-10 text-left max-w-lg mx-auto">
              <div className="flex items-center gap-3 w-full">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Energía y claridad para tu día a día</span>
              </div>
              <div className="flex items-center gap-3 w-full">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>Mejor relación con el estrés y la incomodidad</span>
              </div>
              <div className="flex items-center gap-3 w-full">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>
                  Comunidad que te sostiene cuando baja la motivación
                </span>
              </div>
              <div className="flex items-center gap-3 w-full">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>
                  Un espacio para entrenar cuerpo y mente con intención
                </span>
              </div>
              <div className="flex items-center gap-3 w-full">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span>
                  Beneficios exclusivos 2026 (disciplinas + evento + sorpresas)
                </span>
              </div>
            </div>

            <Button size="lg" onClick={scrollToPlans}>
              Quiero entrar al Plan Anual
            </Button>
          </div>
        </section>

        {/* URGENCIA */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="font-space text-3xl md:text-4xl font-bold mb-6">
              Esto es por tiempo limitado
            </h2>
            <p className="font-inter text-lg md:text-xl opacity-90 mb-10">
              Los planes anuales 2026 vienen con beneficios especiales (Icefest
              + descuento al Retiro Guatemala).
              <br />
              Cuando se cierran, se cierran.
            </p>

            <div className="flex flex-col items-center gap-3 mb-10 text-left max-w-md mx-auto">
              <div className="flex items-center gap-3 w-full">
                <Sparkles className="w-5 h-5 flex-shrink-0" />
                <span>Beneficios exclusivos solo Plan Anual 2026</span>
              </div>
              <div className="flex items-center gap-3 w-full">
                <Snowflake className="w-5 h-5 flex-shrink-0" />
                <span>Entradas Icefest transferibles incluidas</span>
              </div>
              <div className="flex items-center gap-3 w-full">
                <CreditCard className="w-5 h-5 flex-shrink-0" />
                <span>Opción de pago en 12 cuotas sin interés</span>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-background text-primary hover:bg-background/90 font-semibold text-lg px-8"
              onClick={scrollToPlans}
            >
              Asegurar mi cupo ahora
            </Button>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="font-space text-3xl md:text-4xl font-bold mb-10 text-center text-foreground">
              Preguntas frecuentes
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem
                value="cuotas"
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-medium">
                  ¿Puedo pagar en cuotas?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Sí. Puedes pagar en 12 cuotas sin interés vía Mercado Pago
                  desde los botones "Pagar en 12 cuotas".
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="icefest"
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-medium">
                  ¿La entrada a Icefest 2026 se puede compartir?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Sí. Las entradas incluidas son transferibles, puedes
                  compartirlas con quien quieras.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="atraso"
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-medium">
                  ¿Qué pasa si me atraso o pierdo una semana?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  No pasa nada. La idea es construir constancia en el tiempo. Tu
                  plan anual es una invitación a volver al hábito.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="guatemala"
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-medium">
                  ¿Qué incluye el descuento a Guatemala?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Es un beneficio exclusivo para miembros anuales (5%, 7% o 10%
                  según tu plan) para el Retiro a Guatemala.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="font-space text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Este puede ser el año donde todo cambia
            </h2>
            <p className="font-inter text-xl text-muted-foreground mb-10 leading-relaxed">
              No por magia.
              <br />
              Por constancia.
              <br />
              Por comunidad.
              <br />
              Por decidir hoy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={scrollToPlans}>
                Ver planes
              </Button>
              <Button size="lg" variant="outline" onClick={scrollToPlans}>
                Quiero suscribirme ahora
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-10">
              Nave Studio · Plan Anual 2026 · Beneficios sujetos a
              cupos/condiciones del evento
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default PlanAnual2026;
