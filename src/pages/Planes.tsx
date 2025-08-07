import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckIcon, StarIcon } from "lucide-react"
import { useEffect, useState } from "react"

const Planes = () => {
  const [showStickyBanner, setShowStickyBanner] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section')
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight
        setShowStickyBanner(window.scrollY > heroBottom)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTable = () => {
    const tableSection = document.getElementById('pricing-table')
    if (tableSection) {
      tableSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Pricing Hero */}
      <section id="hero-section" className="h-[80vh] bg-primary relative flex items-center justify-center text-center px-6">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white font-space tracking-heading">
            Elige tu plan y despega en la Nave
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-inter max-w-2xl mx-auto">
            Flexible, sin contratos y con garantía de 14 días.
          </p>
          <Button 
            size="lg" 
            onClick={scrollToTable}
            className="bg-accent hover:bg-primary hover:scale-105 transition-all duration-300 text-white font-inter font-medium h-14 px-10 text-lg"
          >
            Ver planes
          </Button>
        </div>
      </section>

      {/* Tabla comparativa - Membresías principales */}
      <section id="pricing-table" className="py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-space">
              Membresías principales
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto font-inter">
              Elige la intensidad que mejor se adapte a tu ritmo de vida.
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Eclipse Plan */}
              <Card className="relative border-2 hover:shadow-light transition-all duration-300 animate-fade-in hover:-translate-y-1">
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
                      <CheckIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Yoga (Yin · Yang · Integral)</span>
                      <CheckIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Breathwork & Meditación</span>
                      <CheckIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Biohacking (Breathwork + HIIT + Ice Bath)</span>
                      <CheckIcon className="h-5 w-5 text-accent" />
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
                  <Button className="w-full mt-6 bg-accent hover:bg-primary hover:scale-105 transition-all duration-300 text-white font-inter font-medium">
                    Suscribirme
                  </Button>
                </CardContent>
              </Card>

              {/* Órbita Plan */}
              <Card className="relative border-2 hover:shadow-light transition-all duration-300 animate-fade-in hover:-translate-y-1">
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
                      <CheckIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Yoga (Yin · Yang · Integral)</span>
                      <CheckIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Breathwork & Meditación</span>
                      <CheckIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Biohacking (Breathwork + HIIT + Ice Bath)</span>
                      <CheckIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Comunidad online + mentorías</span>
                      <CheckIcon className="h-5 w-5 text-accent" />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="text-center space-y-2">
                      <span className="text-3xl font-bold text-foreground">$79.000</span>
                      <Badge className="bg-warm text-white text-xs">50% OFF 1° mes - código 1MES</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-accent hover:bg-primary hover:scale-105 transition-all duration-300 text-white font-inter font-medium">
                    Suscribirme
                  </Button>
                </CardContent>
              </Card>

              {/* Universo Plan - Most Popular */}
              <Card className="relative border-2 border-accent bg-neutral-light hover:shadow-light transition-all duration-300 animate-fade-in hover:-translate-y-1">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-white text-xs">
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
                      <CheckIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Yoga (Yin · Yang · Integral)</span>
                      <CheckIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Breathwork & Meditación</span>
                      <CheckIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Biohacking (Breathwork + HIIT + Ice Bath)</span>
                      <CheckIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Comunidad online + mentorías</span>
                      <CheckIcon className="h-5 w-5 text-accent" />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="text-center space-y-2">
                      <span className="text-3xl font-bold text-foreground">$95.000</span>
                      <Badge className="bg-warm text-white text-xs">50% OFF 1° mes - código 1MES</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-accent hover:bg-primary hover:scale-105 transition-all duration-300 text-white font-inter font-medium">
                    Suscribirme
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden space-y-6">
            {/* Universo Card - Featured First on Mobile */}
            <Card className="relative border-2 border-accent bg-neutral-light">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent text-white text-xs">
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
                    <CheckIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Yoga (Yin · Yang · Integral)</span>
                    <CheckIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Breathwork & Meditación</span>
                    <CheckIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Biohacking (Breathwork + HIIT + Ice Bath)</span>
                    <CheckIcon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Comunidad online + mentorías</span>
                    <CheckIcon className="h-5 w-5 text-accent" />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-center space-y-2">
                    <span className="text-3xl font-bold text-foreground">$95.000</span>
                    <Badge className="bg-warm text-white text-xs">50% OFF 1° mes - código 1MES</Badge>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-accent hover:bg-primary text-white font-inter font-medium">
                  Suscribirme
                </Button>
              </CardContent>
            </Card>

            {/* Órbita and Eclipse for mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="relative border-2">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold text-foreground font-space">Órbita</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Sesiones</span>
                      <span className="font-medium">2/sem</span>
                    </div>
                    <div className="text-center space-y-2">
                      <span className="text-2xl font-bold text-foreground">$79.000</span>
                      <Badge className="bg-warm text-white text-xs">50% OFF 1° mes</Badge>
                    </div>
                  </div>
                  <Button className="w-full bg-accent hover:bg-primary text-white font-inter font-medium">
                    Suscribirme
                  </Button>
                </CardContent>
              </Card>

              <Card className="relative border-2">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold text-foreground font-space">Eclipse</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Sesiones</span>
                      <span className="font-medium">1/sem</span>
                    </div>
                    <div className="text-center">
                      <span className="text-2xl font-bold text-foreground">$49.000</span>
                    </div>
                  </div>
                  <Button className="w-full bg-accent hover:bg-primary text-white font-inter font-medium">
                    Suscribirme
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Método Wim Hof */}
      <section className="py-20 bg-muted px-6">
        <div className="container mx-auto max-w-5xl">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12 font-space">
            Método Wim Hof
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 hover:shadow-light transition-all duration-300 hover:-translate-y-1">
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

            <Card className="border-2 hover:shadow-light transition-all duration-300 hover:-translate-y-1">
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
          <p className="text-center text-sm text-muted-foreground mt-6 italic max-w-2xl mx-auto">
            *Para entrar al Ice Bath tras Yoga debes completar al menos una sesión guiada del Método Wim Hof.
          </p>
        </div>
      </section>

      {/* Planes Especiales */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12 font-space">
            Planes Especiales
          </h3>
          
          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            <Card className="border-2 hover:shadow-light transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground font-space">Misión 90 Órbita</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">90 días · 2/sem</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">$219.000</span>
                  <Badge className="bg-warm text-white text-xs">Paga en 3 cuotas sin interés</Badge>
                </div>
                <Button className="w-full bg-accent hover:bg-primary hover:scale-105 transition-all duration-300 text-white font-inter font-medium">
                  Comenzar Misión
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-light transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground font-space">Drop-In Discovery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">3 sesiones en 60 días</p>
                <div className="text-2xl font-bold text-foreground">$59.000</div>
                <Button className="w-full bg-accent hover:bg-primary hover:scale-105 transition-all duration-300 text-white font-inter font-medium">
                  Descubrir
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-light transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground font-space">Membresía Yin-Yang Yoga</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">1 clase/sem</p>
                <div className="text-2xl font-bold text-foreground">$39.000</div>
                <Button className="w-full bg-accent hover:bg-primary hover:scale-105 transition-all duration-300 text-white font-inter font-medium">
                  Suscribirme
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-light transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground font-space">Yoga + Ice Bath</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Requiere Método Wim Hof previo</p>
                <div className="text-2xl font-bold text-foreground">$15.000</div>
                <Button className="w-full bg-accent hover:bg-primary hover:scale-105 transition-all duration-300 text-white font-inter font-medium">
                  Reservar
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Slider */}
          <div className="md:hidden">
            <div className="overflow-x-auto">
              <div className="flex space-x-4 pb-4" style={{ width: 'max-content' }}>
                <Card className="border-2 w-80 flex-shrink-0">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-foreground font-space">Misión 90 Órbita</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">90 días · 2/sem</p>
                    <div className="space-y-2">
                      <span className="text-2xl font-bold text-foreground">$219.000</span>
                      <Badge className="bg-warm text-white text-xs block w-fit">Paga en 3 cuotas</Badge>
                    </div>
                    <Button className="w-full bg-accent hover:bg-primary text-white font-inter font-medium">
                      Comenzar Misión
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 w-80 flex-shrink-0">
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

                <Card className="border-2 w-80 flex-shrink-0">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-foreground font-space">Yin-Yang Yoga</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">1 clase/sem</p>
                    <div className="text-2xl font-bold text-foreground">$39.000</div>
                    <Button className="w-full bg-accent hover:bg-primary text-white font-inter font-medium">
                      Suscribirme
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 w-80 flex-shrink-0">
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
          </div>
        </div>
      </section>

      {/* Beneficios cuantificables */}
      <section className="py-20 bg-muted px-6">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12 font-space">
            Resultados comprobados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-accent font-space">9.9/10</div>
              <p className="text-muted-foreground font-inter">satisfacción (400 encuestas)</p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-accent font-space">97%</div>
              <p className="text-muted-foreground font-inter">reporta menos estrés en 30 días</p>
            </div>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-accent font-space">+2.000</div>
              <p className="text-muted-foreground font-inter">personas ya regularon su sistema nervioso</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12 font-space">
            Preguntas frecuentes
          </h3>
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-inter font-medium hover:no-underline focus:outline-dashed focus:outline-2 focus:outline-accent">
                ¿Puedo congelar mi membresía?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-inter">
                Sí, puedes congelar tu membresía hasta por 30 días al mes, ideal para vacaciones o emergencias. Solo necesitas avisar con 24 horas de anticipación.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-inter font-medium hover:no-underline focus:outline-dashed focus:outline-2 focus:outline-accent">
                ¿Cómo funciona el 50% OFF?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-inter">
                El descuento se aplica automáticamente en tu primer mes usando el código "1MES" al suscribirte. Aplica solo para planes Órbita y Universo.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-inter font-medium hover:no-underline focus:outline-dashed focus:outline-2 focus:outline-accent">
                ¿Qué pasa si no asisto?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-inter">
                No hay penalizaciones por faltar. En planes limitados (Eclipse/Órbita), las sesiones no utilizadas se acumulan hasta el siguiente mes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-inter font-medium hover:no-underline focus:outline-dashed focus:outline-2 focus:outline-accent">
                Métodos de pago y cuotas
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-inter">
                Aceptamos efectivo, transferencia, tarjetas de débito/crédito. Planes especiales pueden pagarse en cuotas sin interés. Membresías mensuales se cobran automáticamente.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-inter font-medium hover:no-underline focus:outline-dashed focus:outline-2 focus:outline-accent">
                Política de devolución 14 días
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-inter">
                Si en los primeros 14 días no sientes los beneficios, te devolvemos el 100% de tu inversión, sin preguntas. Es nuestra garantía de confianza.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 bg-muted px-6">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center text-foreground mb-12 font-space">
            Lo que dicen nuestros miembros
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 border-2">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 fill-warm text-warm" />
                ))}
              </div>
              <p className="text-muted-foreground font-inter mb-4">
                "En 2 meses logré controlar mi ansiedad y mejorar mi concentración. El ROI en mi salud mental es invaluable."
              </p>
              <div className="font-medium text-foreground">— María González, Arquitecta</div>
            </Card>

            <Card className="p-6 border-2">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 fill-warm text-warm" />
                ))}
              </div>
              <p className="text-muted-foreground font-inter mb-4">
                "Mi energía se disparó desde la primera semana. Ahora duermo mejor y tengo más resistencia en el trabajo."
              </p>
              <div className="font-medium text-foreground">— Carlos Mendoza, Ejecutivo</div>
            </Card>

            <Card className="p-6 border-2">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 fill-warm text-warm" />
                ))}
              </div>
              <p className="text-muted-foreground font-inter mb-4">
                "El método Wim Hof cambió mi relación con el estrés. Ahora tengo herramientas reales para regularlo."
              </p>
              <div className="font-medium text-foreground">— Ana Silva, Médica</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Garantía & CTA Final */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <div className="bg-neutral-light rounded-lg p-8 max-w-2xl mx-auto">
            <p className="text-foreground font-medium font-inter text-lg">
              <strong>Garantía Nave:</strong> Prueba Nave 14 días o te devolvemos tu inversión.
            </p>
          </div>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-primary hover:scale-105 transition-all duration-300 text-white font-inter font-medium h-16 px-12 text-lg"
            asChild
          >
            <a href="https://wa.link/wh4f79" target="_blank" rel="noopener noreferrer">
              Comenzar ahora con 50% OFF
            </a>
          </Button>
        </div>
      </section>

      {/* Sticky Banner - Desktop only */}
      {showStickyBanner && (
        <div className="hidden lg:block fixed bottom-0 left-0 right-0 bg-accent text-white p-4 shadow-light z-50">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium font-inter">¡Oferta por tiempo limitado! 50% OFF en tu primer mes</p>
            </div>
            <Button 
              variant="outline" 
              className="bg-white text-accent border-white hover:bg-neutral-light font-inter font-medium"
              asChild
            >
              <a href="https://wa.link/wh4f79" target="_blank" rel="noopener noreferrer">
                Aprovechar ahora
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* Fixed Bottom CTA - Mobile only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-accent p-4 shadow-light z-50">
        <Button 
          size="lg" 
          className="w-full bg-primary hover:bg-primary/90 text-white font-inter font-medium h-12"
          asChild
        >
          <a href="https://wa.link/wh4f79" target="_blank" rel="noopener noreferrer">
            Comenzar con 50% OFF
          </a>
        </Button>
      </div>

      {/* Mobile bottom padding to avoid fixed button overlap */}
      <div className="h-20 lg:hidden"></div>
    </div>
  )
}

export default Planes