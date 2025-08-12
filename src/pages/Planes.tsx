import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Footer } from "@/components/Footer"
import { PricingTrialMiniBar } from "@/components/PricingTrialMiniBar"
import { PricingTrialYogaSection } from "@/components/PricingTrialYogaSection"

const Planes = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Pricing Hero */}
      <section className="h-[80vh] relative flex items-center justify-center text-center px-6" style={{backgroundImage: 'url(/lovable-uploads/51817e71-ea71-4488-955a-3a4d82d001f6.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0 bg-primary opacity-55"></div>
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-white font-space tracking-heading">
            ¿Quieres vivir la experiencia?
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-inter max-w-2xl mx-auto">
            Elige el plan que mejor se ajuste a tu ritmo, entra en la Nave y siente el cambio desde la primera sesión.
          </p>
        </div>
      </section>

      {/* Trial Mini Bar */}
      <PricingTrialMiniBar />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          {/* Main Pricing Table */}
          <div className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Eclipse Plan */}
              <Card id="eclipse" className="relative border-2 hover:shadow-lg transition-all duration-300 animate-fade-in">
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
                  <Button 
                    className="w-full mt-6 bg-accent hover:bg-primary text-white font-inter font-medium"
                    data-plan="Eclipse"
                    data-checkout-url="https://boxmagic.cl/market/plan_subscription/VrD8wRx0Qz"
                  >
                    Suscribirme
                  </Button>
                  {/* B) Contextual link within plan card */}
                  <a 
                    href="/horarios#hoy" 
                    className="inline-block mt-2 text-accent underline hover:text-primary transition-colors text-sm"
                  >
                    Ver horarios de clases →
                  </a>
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
                  <Button 
                    className="w-full mt-6 bg-accent hover:bg-primary text-white font-inter font-medium"
                    data-plan="Órbita"
                    data-checkout-url="https://boxmagic.cl/market/plan_subscription/ev4VPzOD9A"
                  >
                    Suscribirme
                  </Button>
                  {/* B) Contextual link within plan card */}
                  <a 
                    href="/horarios#hoy" 
                    className="inline-block mt-2 text-accent underline hover:text-primary transition-colors text-sm"
                  >
                    Ver horarios de clases →
                  </a>
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
                    data-checkout-url="https://boxmagic.cl/market/plan_subscription/universo"
                  >
                    Suscribirme
                  </Button>
                  {/* B) Contextual link within plan card */}
                  <a 
                    href="/horarios#hoy" 
                    className="inline-block mt-2 text-accent underline hover:text-primary transition-colors text-sm"
                  >
                    Ver horarios de clases →
                  </a>
                </CardContent>
              </Card>
            </div>
            
            {/* A) Main button below membership table */}
            <div className="mt-8 text-center">
              <a 
                href="/horarios" 
                className="inline-block border-2 border-accent text-accent py-3 px-6 rounded-lg hover:bg-accent hover:text-white transition-all duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
                aria-label="Ver horarios de Nave Studio"
              >
                Ver horarios de clases
              </a>
              <p className="text-xs text-muted-foreground mt-2 font-inter">
                Mira el día de hoy y planifica tu semana.
              </p>
            </div>
            
            {/* Contextual link below pricing table */}
            <div className="text-center mt-8 mb-12">
              <p className="text-sm text-muted-foreground font-inter">
                ¿Solo te interesa Yoga? Empieza con una{" "}
                <a 
                  href="#trial-yoga-pricing"
                  className="text-accent hover:text-primary underline-offset-4 hover:underline transition-colors font-medium"
                >
                  clase de prueba gratuita
                </a>
                .
              </p>
            </div>
          </div>

          {/* Trial Yoga Section */}
          <PricingTrialYogaSection />

          {/* Wim Hof Method Section */}
          <div className="mb-20" id="wim-hof-section">
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
                  <Button 
                    variant="secondary" 
                    className="w-full font-inter font-medium"
                    data-checkout-url="https://boxmagic.cl/market/plan/RZ0vlQyLQ6"
                    data-plan="Wim Hof Grupal"
                  >
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
                  <Button 
                    variant="secondary" 
                    className="w-full font-inter font-medium"
                    data-checkout-url="https://boxmagic.cl/market/plan/j80pKrK4W6"
                    data-plan="Wim Hof Personalizado"
                  >
                    Agendar sesión
                  </Button>
                </CardContent>
              </Card>
            </div>
            {/* C) Link in Método Wim Hof section */}
            <p className="text-center mt-6">
              <a 
                href="/horarios#hoy" 
                className="text-accent underline hover:text-primary transition-colors"
              >
                Ver próximos horarios de Wim Hof →
              </a>
            </p>
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
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white font-inter font-medium"
                    data-checkout-url="https://boxmagic.cl/market/plan/WkD17d743z"
                    data-plan="Misión 90 Órbita"
                  >
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
                  <Button 
                    variant="secondary" 
                    className="w-full font-inter font-medium"
                    data-checkout-url="https://boxmagic.cl/market/plan/bQDN8Jq4M7"
                    data-plan="Drop-In Discovery"
                  >
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
                  <Button 
                    variant="secondary" 
                    className="w-full font-inter font-medium"
                    data-checkout-url="https://boxmagic.cl/market/plan_subscription/95DrVeqDpY"
                    data-plan="Membresía Yin-Yang Yoga"
                  >
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
                  <Button 
                    variant="secondary" 
                    className="w-full font-inter font-medium"
                    data-checkout-url="https://boxmagic.cl/market/plan/jwDyZPALqv"
                    data-plan="Yoga + Ice Bath"
                  >
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
              <a href="/planes-precios#eclipse">
                Comienza hoy con 50% OFF
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default Planes