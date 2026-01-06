import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { PricingTrialMiniBar } from "@/components/PricingTrialMiniBar";
import { PricingTrialYogaSection } from "@/components/PricingTrialYogaSection";
import { CheckoutRedirectButton } from "@/components/CheckoutRedirectButton";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import { PlanesAnualesPromo } from "@/components/PlanesAnualesPromo";
const Planes = () => {
  const {
    trackViewContent,
    trackInitiateCheckout
  } = useFacebookPixel();
  useEffect(() => {
    // Track ViewContent event for pricing page
    trackViewContent({
      content_name: 'Pricing Plans',
      content_category: 'E-commerce',
      content_ids: ['eclipse', 'orbita', 'universo'],
      content_type: 'product_group'
    });

    // Add event listeners for InitiateCheckout on all buttons
    const handleCheckoutClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const button = target.closest('[data-checkout-url]') as HTMLElement;
      if (button) {
        const plan = button.getAttribute('data-plan') || 'Unknown Plan';
        trackInitiateCheckout({
          content_name: plan,
          content_category: 'Subscription',
          currency: 'CLP'
        });
      }
    };

    // Add listeners to WhatsApp links
    const handleWhatsAppClick = () => {
      trackInitiateCheckout({
        content_name: 'WhatsApp Contact',
        content_category: 'Lead Generation'
      });
    };
    document.addEventListener('click', handleCheckoutClick);

    // WhatsApp links
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
      link.addEventListener('click', handleWhatsAppClick);
    });
    return () => {
      document.removeEventListener('click', handleCheckoutClick);
      whatsappLinks.forEach(link => {
        link.removeEventListener('click', handleWhatsAppClick);
      });
    };
  }, [trackViewContent, trackInitiateCheckout]);
  return <main className="min-h-screen bg-background">
      {/* Pricing Hero */}
      <section className="h-[80vh] relative flex items-center justify-center text-center px-6" style={{
      backgroundImage: 'url(/lovable-uploads/ef74bdd8-fac8-490a-80e9-61b767656331.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
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

      {/* Planes Anuales Promo - Oferta Enero */}
      <PlanesAnualesPromo />

      {/* Menú de Intención */}
      <section id="intent-menu" className="py-16 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary text-center font-space">Elige cómo quieres empezar</h1>
          <p className="text-muted-foreground text-center mt-2 font-inter">Selecciona tu objetivo y te mostramos el plan ideal.</p>
          <div className="grid gap-4 mt-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Hábito Semanal */}
            <a href="#habito-semanal" className="group rounded-2xl p-6 bg-white hover:bg-gradient-to-br hover:from-white hover:to-neutral-50 hover:shadow-lg transition-all duration-300 border border-neutral-200 hover:border-accent">
              <h3 className="font-semibold text-primary font-space text-lg">Mantener mi hábito semanal</h3>
              <p className="text-sm text-muted-foreground mt-2 font-inter">Quiero venir todas las semanas y construir consistencia.</p>
              <span className="inline-block mt-4 text-accent group-hover:underline font-medium">Ver membresías →</span>
            </a>
            
            {/* Personalizado */}
            <a href="#personalizado" className="group rounded-2xl p-6 bg-white hover:bg-gradient-to-br hover:from-white hover:to-neutral-50 hover:shadow-lg transition-all duration-300 border border-neutral-200 hover:border-accent">
              <h3 className="font-semibold text-primary font-space text-lg">Sesión personalizada 1:1 / 1:2</h3>
              <p className="text-sm text-muted-foreground mt-2 font-inter">Quiero una guía privada para avanzar más rápido.</p>
              <span className="inline-block mt-4 text-accent group-hover:underline font-medium">Ver personalizado →</span>
            </a>
            
            {/* Sesión Única */}
            <a href="#sesion-unica" className="group rounded-2xl p-6 bg-white hover:bg-gradient-to-br hover:from-white hover:to-neutral-50 hover:shadow-lg transition-all duration-300 border border-neutral-200 hover:border-accent">
              <h3 className="font-semibold text-primary font-space text-lg">Probar el Ice Bath una sola vez</h3>
              <p className="text-sm text-muted-foreground mt-2 font-inter">Quiero vivir la experiencia de hielo + respiración.</p>
              <span className="inline-block mt-4 text-accent group-hover:underline font-medium">Ver sesión única →</span>
            </a>
            
            {/* Solo Yoga */}
            <a href="#solo-yoga" className="group rounded-2xl p-6 bg-white hover:bg-gradient-to-br hover:from-white hover:to-neutral-50 hover:shadow-lg transition-all duration-300 border border-neutral-200 hover:border-accent">
              <h3 className="font-semibold text-primary font-space text-lg">Solo Yoga</h3>
              <p className="text-sm text-muted-foreground mt-2 font-inter">Busco practicar Yoga sin compromiso.</p>
              <span className="inline-block mt-4 text-accent group-hover:underline font-medium">Ver Yoga →</span>
            </a>
          </div>
        </div>
      </section>

      {/* Trial Mini Bar */}
      <PricingTrialMiniBar />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          {/* HÁBITO SEMANAL - Membresías */}
          <section id="habito-semanal" className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-space">Mantener mi hábito semanal</h2>
              <p className="text-muted-foreground mt-2 font-inter text-lg">Membresías para consistencia y resultados sostenibles.</p>
            </div>
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
                  <Button className="w-full mt-6 bg-accent hover:bg-primary text-white font-inter font-medium" data-plan="Eclipse" data-checkout-url="https://boxmagic.cl/market/plan_subscription/VrD8wRx0Qz">
                    Suscribirme
                  </Button>
                  <a href="/horarios#hoy" className="inline-block mt-2 text-accent underline hover:text-primary transition-colors text-sm">
                    Ver horarios de clases →
                  </a>
                </CardContent>
              </Card>

              {/* Órbita Plan */}
              <Card className="relative border-2 hover:shadow-lg transition-all duration-300 animate-fade-in">
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-warm text-white">
                  Más popular
                </Badge>
                <CardHeader className="text-center pb-4 pt-8">
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
                      <Badge className="bg-warm text-white">30% OFF 1° mes - código 1MES</Badge>
                    </div>
                  </div>
                  <Button className="w-full mt-6 bg-accent hover:bg-primary text-white font-inter font-medium" data-plan="Órbita" data-checkout-url="https://boxmagic.cl/market/plan_subscription/ev4VPzOD9A">
                    Suscribirme
                  </Button>
                  <a href="/horarios#hoy" className="inline-block mt-2 text-accent underline hover:text-primary transition-colors text-sm">
                    Ver horarios de clases →
                  </a>
                </CardContent>
              </Card>

              {/* Universo Plan */}
              <Card className="relative border-2 border-accent bg-neutral-50/50 hover:shadow-lg transition-all duration-300 animate-fade-in">
                <CardHeader className="text-center pb-4">
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
                      <Badge className="bg-warm text-white">30% OFF 1° mes - código 1MES</Badge>
                    </div>
                  </div>
                  <CheckoutRedirectButton url="https://boxmagic.cl/market/plan_subscription/j80p5OdDW6" plan="Universo" className="w-full mt-6 bg-accent hover:bg-primary text-white font-inter font-medium">
                    Suscribirme
                  </CheckoutRedirectButton>
                  <a href="/horarios#hoy" className="inline-block mt-2 text-accent underline hover:text-primary transition-colors text-sm">
                    Ver horarios de clases →
                  </a>
                </CardContent>
              </Card>
            </div>
            
            {/* Misión 90 Órbita en hábito semanal */}
            <div className="mt-12 max-w-md mx-auto">
              <Card className="border-2 border-warm hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in rounded-[16px]">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold text-primary font-space">Misión 90 Órbita</CardTitle>
                  <Badge className="bg-warm text-white mx-auto">Paga en 3 cuotas sin interés</Badge>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <p className="text-muted-foreground font-inter text-sm">
                    27 sesiones en 90 días · 2/sem · plan trimestral con ahorro — ¡la mejor oferta!
                  </p>
                  <div className="text-3xl font-bold text-foreground">$199.000</div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-inter font-medium" data-checkout-url="https://boxmagic.cl/market/plan/WkD17d743z" data-plan="Misión 90 Órbita">
                    Comenzar misión
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* PERSONALIZADO - Sesión privada */}
          <section id="personalizado" className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-space">Sesión personalizada 1:1 / 1:2</h2>
              <p className="text-muted-foreground mt-2 font-inter text-lg">Sesión privada con acompañamiento experto.</p>
            </div>
            <div className="max-w-md mx-auto">
              <Card className="relative border-2 border-accent hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in rounded-[16px] bg-white">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold text-primary font-space">Personalizado Método Wim Hof</CardTitle>
                  <Badge className="bg-warm text-white mx-auto">máx 2 personas · inmersión individual</Badge>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground font-inter text-sm">
                    Respiración en pareja (máx 2) y entrada al hielo por separado, guiada y sostenida acorde a tu objetivo.
                  </p>
                  <div className="mt-4">
                    <p className="text-4xl font-bold text-primary">$40.000</p>
                    <p className="text-sm text-muted-foreground">/ sesión por persona</p>
                  </div>
                  <a className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full font-inter font-medium" href="https://boxmagic.cl/market/plan/j80pKrK4W6" data-checkout-url="https://boxmagic.cl/market/plan/j80pKrK4W6" data-plan="Wim Hof (Personalizado) — 1 sesión" aria-label="Comprar 1 sesión Wim Hof personalizada">
                    Comprar 1 sesión
                  </a>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* SESIÓN ÚNICA - Probar Ice Bath */}
          <section id="sesion-unica" className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-space">Probar el Ice Bath una o más veces</h2>
              <p className="text-muted-foreground mt-2 font-inter text-lg">Vive la experiencia completa de hielo + respiración.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="relative border hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in rounded-[16px] bg-white">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg font-bold text-primary font-space">1 Sesión Método Wim Hof (Grupal)</CardTitle>
                  <Badge className="bg-warm text-white mx-auto">Breathwork + Ice Bath guiado · 60 min</Badge>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground font-inter text-sm">
                    Breathwork Wim Hof + Ice Bath guiado y sostenido. Ideal para quienes quieren vivir un baño de hielo con acompañamiento experto.
                  </p>
                  <div className="mt-4">
                    <p className="text-4xl font-bold text-primary">$30.000</p>
                    <p className="text-sm text-muted-foreground">/ sesión por persona</p>
                  </div>
                  <a className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full font-inter font-medium" href="https://boxmagic.link/checkout/wimhof-grupal" data-checkout-url="https://boxmagic.cl/market/plan/RZ0vlQyLQ6" data-plan="Wim Hof (Grupal) — 1 sesión" aria-label="Comprar 1 sesión Wim Hof grupal">
                    Comprar 1 sesión
                  </a>
                  <p className="text-xs text-muted-foreground mt-2 font-inter">
                    Incluye Breathwork Wim Hof + 1 inmersión guiada (60 min). No es una membresía.
                  </p>
                </CardContent>
              </Card>

              <Card className="border hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in rounded-[16px]">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg font-bold text-primary font-space">Drop-In Discovery</CardTitle>
                  <Badge className="bg-accent text-white mx-auto">3 sesiones en 60 días</Badge>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground font-inter text-sm">Elige la disciplina que quieras (Método Wim Hof, Ice Bath, Yoga, Breathwork, Biohacking) y descubre tu fórmula.</p>
                  <div className="text-3xl font-bold text-foreground">$59.000</div>
                  <Button variant="secondary" className="w-full font-inter font-medium" data-checkout-url="https://boxmagic.cl/market/plan/bQDN8Jq4M7" data-plan="Drop-In Discovery">
                    Descubrir
                  </Button>
                </CardContent>
              </Card>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6 font-inter">
              Completa esta sesión guiada para habilitar tu ingreso al Ice Bath post-yoga.
            </p>
          </section>

          {/* SOLO YOGA - Planes de Yoga */}
          <section id="solo-yoga" className="mb-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary font-space">Solo Yoga</h2>
              <p className="text-muted-foreground mt-2 font-inter text-lg">Planes de Yoga sin compromiso.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in rounded-[16px]">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg font-bold text-primary font-space">Membresía Yin-Yang Yoga</CardTitle>
                  <Badge className="bg-accent text-white mx-auto">1 clase/sem</Badge>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground font-inter text-sm">
                    1 clase semanal de Yoga (Yin, Yang o Integral). Sin inmersión obligatoria.
                  </p>
                  <div className="text-3xl font-bold text-foreground">$39.000</div>
                  <Button variant="secondary" className="w-full font-inter font-medium" data-checkout-url="https://boxmagic.cl/market/plan_subscription/95DrVeqDpY" data-plan="Membresía Yin-Yang Yoga">
                    Suscribirme
                  </Button>
                </CardContent>
              </Card>

              <Card className="border hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in rounded-[16px]">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg font-bold text-primary font-space">Yoga + Ice Bath</CardTitle>
                  <Badge className="bg-warm text-white mx-auto">1 sesión con opción Ice Bath</Badge>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-muted-foreground font-inter text-sm">
                    1 sesión de Yoga con opción de Ice Bath al final.
                  </p>
                  <div className="text-3xl font-bold text-foreground">$15.000</div>
                  <Button variant="secondary" className="w-full font-inter font-medium" data-checkout-url="https://boxmagic.cl/market/plan/jwDyZPALqv" data-plan="Yoga + Ice Bath">
                    Reservar
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 font-inter">
                    Para ingresar al <strong>Ice Bath</strong> después de Yoga debes haber completado previamente una sesión guiada del <strong>Método Wim Hof</strong>.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Trial Yoga Section */}
          <PricingTrialYogaSection />

          {/* Guarantee & Final CTA */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="bg-neutral-50 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-foreground font-medium font-inter">
                <strong>Garantía Nave:</strong> si en los primeros 14 días no sientes la diferencia, te devolvemos tu inversión.
              </p>
            </div>
            <Button size="lg" className="bg-accent hover:bg-primary text-white font-inter font-medium hover:scale-105 transition-transform duration-300 h-14 px-10 text-base" asChild>
              <a href="#habito-semanal">
                Comienza hoy con 30% OFF
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>;
};
export default Planes;