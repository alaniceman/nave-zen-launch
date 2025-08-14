import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckoutRedirectButton } from "@/components/CheckoutRedirectButton"

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
                 <Button
                   className="w-full mt-6 bg-accent hover:bg-primary text-white font-inter font-medium"
                   data-plan="Eclipse"
                   data-checkout-url="https://boxmagic.cl/market/plan_subscription/VrD8wRx0Qz"
                 >
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
                <Button
                  className="w-full mt-6 bg-accent hover:bg-primary text-white font-inter font-medium"
                  data-plan="Órbita"
                  data-checkout-url="https://boxmagic.cl/market/plan_subscription/ev4VPzOD9A"
                >
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
                <CheckoutRedirectButton
                  url="https://boxmagic.cl/market/plan_subscription/j80p5OdDW6"
                  plan="Universo"
                  className="w-full mt-6 bg-accent hover:bg-primary text-white font-inter font-medium"
                >
                  Suscribirme
                </CheckoutRedirectButton>
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
            <Card className="border hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in rounded-[16px] bg-white">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-bold text-primary font-space-grotesk">Grupal (máx 6) — 1 sesión</CardTitle>
                <Badge className="bg-warm text-white mx-auto">Duración 1 h</Badge>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground font-inter text-sm">
                  Breathwork Wim Hof + Ice Bath guiado y sostenido. Ideal para quienes quieren vivir un baño de hielo con acompañamiento experto.
                </p>
                <div className="mt-4">
                  <p className="text-4xl font-bold text-primary">$30.000</p>
                  <p className="text-sm md:text-base text-muted-foreground md:inline md:ml-2">/ sesión por persona</p>
                </div>
                <a
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full font-inter font-medium"
                  href="https://boxmagic.link/checkout/wimhof-grupal"
                  data-checkout-url="https://boxmagic.link/checkout/wimhof-grupal"
                  data-plan="Wim Hof (Grupal) — 1 sesión"
                  aria-label="Comprar 1 sesión Wim Hof grupal"
                >
                  Comprar 1 sesión
                </a>
              </CardContent>
            </Card>

            <Card className="border hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in rounded-[16px] bg-white">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-bold text-primary font-space-grotesk">Personalizado (máx 2) — 1 sesión</CardTitle>
                <Badge className="bg-warm text-white mx-auto">Duración 1 h</Badge>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground font-inter text-sm">
                  Respiración en pareja (máx 2) y entrada al hielo por separado, guiada y sostenida acorde a tu objetivo.
                </p>
                <div className="mt-4">
                  <p className="text-4xl font-bold text-primary">$40.000</p>
                  <p className="text-sm md:text-base text-muted-foreground md:inline md:ml-2">/ sesión por persona</p>
                </div>
                <a
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full font-inter font-medium"
                  href="https://boxmagic.link/checkout/wimhof-personalizado"
                  data-checkout-url="https://boxmagic.link/checkout/wimhof-personalizado"
                  data-plan="Wim Hof (Personalizado) — 1 sesión"
                  aria-label="Comprar 1 sesión Wim Hof personalizada"
                >
                  Comprar 1 sesión
                </a>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-primary mt-8">
            ¿Quieres venir varias veces? → 
            <a href="/planes#membresias" className="text-accent underline hover:text-primary">
              Ver planes y membresías
            </a>
          </p>
          <p className="text-center text-sm text-muted-foreground mt-6 font-inter">
            Completa esta sesión guiada para habilitar tu ingreso al Ice Bath post-yoga.
          </p>
        </div>

        {/* Planes Teaser */}
        <section id="planes-teaser" className="py-16 mb-20">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary font-space-grotesk">Planes para cada ritmo</h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto font-inter">
              Desde sesiones sueltas hasta membresías ilimitadas. Elige cómo empezar y mejora tu energía, foco y bienestar.
            </p>

            {/* highlights mínimos */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-neutral-50 rounded-lg py-3 px-4 font-inter">Membresías desde <strong>$49.000</strong></div>
              <div className="bg-neutral-50 rounded-lg py-3 px-4 font-inter">Misión 90 · <strong>27 sesiones/90 días</strong></div>
              <div className="bg-neutral-50 rounded-lg py-3 px-4 font-inter">Drop-In Discovery · <strong>3 sesiones/60 días</strong></div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/planes-precios" 
                className="inline-block bg-accent text-white font-medium py-3 px-8 rounded-lg hover:bg-primary transition font-inter"
                aria-label="Ver todos los planes y precios"
              >
                Ver todos los planes →
              </a>
              <a 
                href="/horarios#hoy" 
                className="inline-block border-2 border-accent text-accent font-medium py-3 px-8 rounded-lg hover:bg-accent hover:text-white transition font-inter"
                aria-label="Ver horarios de clases"
              >
                Ver horarios
              </a>
              <a 
                href="#" 
                data-open-trial="true" 
                className="inline-block text-accent underline hover:text-primary font-inter"
                aria-label="Agendar clase de prueba de Yoga"
              >
                Clase de prueba de Yoga
              </a>
            </div>

            {/* micro nota opcional */}
            <p className="text-xs text-muted-foreground mt-3 font-inter">50% OFF el primer mes con código <strong>1MES</strong> (aplica a Universo y Órbita).</p>
          </div>
        </section>

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