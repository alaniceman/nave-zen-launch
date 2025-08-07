import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const PricingSection = () => {
  return (
    <section className="py-20 bg-background">
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
                <Button className="w-full mt-6 bg-accent hover:bg-primary text-white font-inter font-medium">
                  Suscribirme
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Wim Hof Method Section */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8 font-space">
            Método Wim Hof
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 hover:shadow-lg transition-all duration-300 animate-fade-in">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-bold text-foreground font-space">Grupal</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  1 h Breathwork + Ice Bath guiado
                </p>
                <div className="text-2xl font-bold text-foreground">$30.000</div>
                <Button variant="outline" className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-white font-inter font-medium">
                  Agendar sesión
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all duration-300 animate-fade-in">
              <CardHeader className="text-center">
                <CardTitle className="text-lg font-bold text-foreground font-space">Personalizada</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Igual, máx 2 personas (inmersión individual)
                </p>
                <div className="text-2xl font-bold text-foreground">$40.000</div>
                <Button variant="outline" className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-white font-inter font-medium">
                  Agendar sesión
                </Button>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4 italic">
            *Nota: para hacer Ice Bath post-yoga se requiere completar esta sesión guiada.
          </p>
        </div>

        {/* Special Plans */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8 font-space">
            Planes Especiales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="border-2 hover:shadow-lg transition-all duration-300 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground font-space">Misión 90 Órbita</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">90 días · 2/sem</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">$219.000</span>
                  <Badge className="bg-warm text-white">Paga en 3 cuotas</Badge>
                </div>
                <Button className="w-full bg-accent hover:bg-primary text-white font-inter font-medium">
                  Comenzar Misión
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all duration-300 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground font-space">Drop-In Discovery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">3 sesiones en 60 días</p>
                <div className="text-2xl font-bold text-foreground">$59.000</div>
                <Button className="w-full bg-accent hover:bg-primary text-white font-inter font-medium">
                  Descubrir
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all duration-300 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground font-space">Membresía Yin-Yang Yoga</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">1 clase/sem</p>
                <div className="text-2xl font-bold text-foreground">$39.000</div>
                <Button className="w-full bg-accent hover:bg-primary text-white font-inter font-medium">
                  Suscribirme
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-all duration-300 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground font-space">Yoga + Ice Bath</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Requiere Método Wim Hof previo</p>
                <div className="text-2xl font-bold text-foreground">$15.000</div>
                <Button className="w-full bg-accent hover:bg-primary text-white font-inter font-medium">
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