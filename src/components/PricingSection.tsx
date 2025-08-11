import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const PricingSection = () => {
  return (
    <section id="planes" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Title Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-space">
            ¿Quieres vivir la experiencia?
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-inter">
            Elige el plan que mejor se ajuste a tu ritmo, entra en la Nave y siente el cambio desde la primera sesión.
          </p>
        </div>

        {/* Main Pricing Table */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Eclipse Plan */}
            <Card className="relative border-2 hover:shadow-lg transition-all duration-300 animate-fade-in">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-foreground font-space">Eclipse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sesiones presenciales</span>
                    <span className="font-medium">1 / sem</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Método Wim Hof</span>
                    <span className="text-accent">✔</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Yoga (Yin · Yang · Integral)</span>
                    <span className="text-accent">✔</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Breathwork & Meditación</span>
                    <span className="text-accent">✔</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Biohacking (Breathwork + Hiit + Ice Bath)</span>
                    <span className="text-accent">✔</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Comunidad online + mentorías</span>
                    <span className="text-muted-foreground">—</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-center space-y-2">
                    <span className="text-3xl font-bold text-foreground">$49.000</span>
                    <div className="h-6"></div>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-accent hover:bg-primary text-white font-inter font-medium">
                  Suscribirme
                </Button>
              </CardContent>
            </Card>

            {/* Órbita Plan */}
            <Card className="relative border-2 hover:shadow-lg transition-all duration-300 animate-fade-in">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-foreground font-space">Órbita</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sesiones presenciales</span>
                    <span className="font-medium">2 / sem</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Método Wim Hof</span>
                    <span className="text-accent">✔</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Yoga (Yin · Yang · Integral)</span>
                    <span className="text-accent">✔</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Breathwork & Meditación</span>
                    <span className="text-accent">✔</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Biohacking (Breathwork + Hiit + Ice Bath)</span>
                    <span className="text-accent">✔</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Comunidad online + mentorías</span>
                    <span className="text-accent">✔</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-center space-y-2">
                    <span className="text-3xl font-bold text-foreground">$79.000</span>
                    <Badge className="bg-warm text-white">50% OFF 1° mes - código 1MES</Badge>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-accent hover:bg-primary text-white font-inter font-medium">
                  Suscribirme
                </Button>
              </CardContent>
            </Card>

            {/* Universo Plan - Most Popular */}
            <Card className="relative border-2 border-accent bg-neutral-50/50 hover:shadow-lg transition-all duration-300 animate-fade-in">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-white">
                Más popular
              </Badge>
              <CardHeader className="text-center pb-4 pt-8">
                <CardTitle className="text-xl font-bold text-foreground font-space">Universo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sesiones presenciales</span>
                    <span className="font-medium">Ilimitadas</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Método Wim Hof</span>
                    <span className="text-accent">✔</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Yoga (Yin · Yang · Integral)</span>
                    <span className="text-accent">✔</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Breathwork & Meditación</span>
                    <span className="text-accent">✔</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Biohacking (Breathwork + Hiit + Ice Bath)</span>
                    <span className="text-accent">✔</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Comunidad online + mentorías</span>
                    <span className="text-accent">✔</span>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-center space-y-2">
                    <span className="text-3xl font-bold text-foreground">$95.000</span>
                    <Badge className="bg-warm text-white">50% OFF 1° mes - código 1MES</Badge>
                  </div>
                </div>
                <Button
                  className="w-full mt-6 bg-accent hover:bg-primary text-white font-inter font-medium"
                  data-plan="Universo"
                  data-checkout-url="https://boxmagic.cl/market/plan_subscription/j80p5OdDW6"
                >
                  Suscribirme
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Wim Hof Method Section */}
        <div className="mb-20">
          <h3 className="text-center text-primary text-2xl font-bold mb-8 font-space-grotesk">
            Método Wim Hof – Respira, sumérgete, renace
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in rounded-[10px]">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-bold text-primary font-space-grotesk">Grupal (máx 6)</CardTitle>
                <Badge className="bg-warm text-white mx-auto">Duración 1 h</Badge>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground font-inter text-sm">
                  Breathwork Wim Hof + Ice Bath guiado y sostenido<br />
                  Ideal para quienes quieren vivir un baño de hielo con acompañamiento experto.
                </p>
                <div className="text-2xl font-bold text-foreground">$30.000</div>
                <Button variant="secondary" className="w-full font-inter font-medium">
                  Agendar sesión
                </Button>
              </CardContent>
            </Card>

            <Card className="border hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in rounded-[10px]">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-bold text-primary font-space-grotesk">Personalizado (máx 2)</CardTitle>
                <Badge className="bg-warm text-white mx-auto">Duración 1 h</Badge>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground font-inter text-sm">
                  Respiración de a pares (máx 2) y entrada al hielo por separado, guiado y sostenido acorde a tu intensión de la sesión.
                </p>
                <div className="text-2xl font-bold text-foreground">$40.000</div>
                <Button variant="secondary" className="w-full font-inter font-medium">
                  Agendar sesión
                </Button>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6 font-inter">
            Completa esta sesión guiada para habilitar tu ingreso al Ice Bath post-yoga.
          </p>
        </div>

        {/* Special Plans */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center text-primary mb-8 font-space-grotesk">
            Planes Especiales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="border hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in rounded-[10px]">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-primary font-space-grotesk">Misión 90 Órbita</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground font-inter text-sm">
                  27 sesiones en 90 días · 2/sem · plan trimestral con ahorro — ¡la mejor oferta!
                </p>
                <div className="text-2xl font-bold text-foreground">$219.000</div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-inter font-medium">
                  Comenzar misión
                </Button>
              </CardContent>
            </Card>

            <Card className="border hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in rounded-[10px]">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-primary font-space-grotesk">Drop-In Discovery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground font-inter text-sm">
                  3 sesiones en 60 días. Elige la disciplina que quieras (Ice Bath, Yoga, Breathwork, Biohacking) y descubre tu fórmula.
                </p>
                <div className="text-2xl font-bold text-foreground">$59.000</div>
                <Button variant="secondary" className="w-full font-inter font-medium">
                  Descubrir
                </Button>
              </CardContent>
            </Card>

            <Card className="border hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in rounded-[10px]">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-primary font-space-grotesk">Membresía Yin-Yang Yoga</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground font-inter text-sm">
                  1 clase semanal de Yoga (Yin, Yang o Integral). Sin inmersión obligatoria.
                </p>
                <div className="text-2xl font-bold text-foreground">$39.000</div>
                <Button variant="secondary" className="w-full font-inter font-medium">
                  Suscribirme
                </Button>
              </CardContent>
            </Card>

            <Card className="border hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in rounded-[10px]">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-primary font-space-grotesk">Yoga + Ice Bath</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground font-inter text-sm">
                  1 sesión de Yoga con opción de Ice Bath al final.<br />
                  Requiere haber completado previamente una sesión guiada de agua fría.
                </p>
                <div className="text-2xl font-bold text-foreground">$15.000</div>
                <Button variant="secondary" className="w-full font-inter font-medium">
                  Reservar
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Guarantee & Final CTA */}
        <div className="text-center space-y-6 animate-fade-in">
          <div className="bg-neutral-50 rounded-lg p-6 max-w-2xl mx-auto">
            <p className="text-foreground font-medium font-inter">
              <strong>Garantía Nave:</strong> si en los primeros 14 días no sientes la diferencia, te devolvemos tu inversión.
            </p>
          </div>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-primary text-white font-inter font-medium hover:scale-105 transition-transform duration-300 h-14 px-10 text-base"
            asChild
          >
            <a href="https://wa.link/wh4f79" target="_blank" rel="noopener noreferrer">
              Comienza hoy con 50% OFF
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

export { PricingSection }