import { Helmet } from "react-helmet-async";
import { CheckoutRedirectButton } from "@/components/CheckoutRedirectButton";
import { Footer } from "@/components/Footer";
import { weeklyByExperience } from "@/lib/scheduleByExperience";

const CriomedicinIceBathEnGrupo = () => {
  const wimHofSchedule = weeklyByExperience("wim-hof-group");

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Criomedicina en grupo — Ice Bath grupal | Nave Studio Las Condes</title>
        <meta name="description" content="Experiencia grupal de criomedicina (Método Wim Hof) en Santiago. Descuentos especiales para grupos de 3-10 personas. Reserva tu cupo grupal." />
        <meta property="og:title" content="Criomedicina en grupo — Ice Bath grupal | Nave Studio Las Condes" />
        <meta property="og:description" content="Experiencia grupal de criomedicina (Método Wim Hof) en Santiago. Descuentos especiales para grupos de 3-10 personas. Reserva tu cupo grupal." />
        <meta property="og:image" content="/og/wimhof-grupo.jpg" />
        <meta property="og:url" content="https://studiolanave.com/criomedicina-ice-bath-en-grupo" />
        <link rel="canonical" href="https://studiolanave.com/criomedicina-ice-bath-en-grupo" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Nave Studio",
            "description": "Experiencias grupales de criomedicina (Método Wim Hof) en Las Condes, Santiago. Descuentos especiales para grupos de 3-10 personas.",
            "url": "https://studiolanave.com/criomedicina-ice-bath-en-grupo",
            "telephone": "+56 9 4612 0426",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Antares 259",
              "addressLocality": "Las Condes",
              "addressRegion": "RM",
              "addressCountry": "CL"
            },
            "image": "https://studiolanave.com/og/wimhof-grupo.jpg",
            "sameAs": ["https://www.instagram.com/nave.icestudio"]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://studiolanave.com/" },
              { "@type": "ListItem", "position": 2, "name": "Criomedicina (Método Wim Hof)", "item": "https://studiolanave.com/criomedicina-metodo-wim-hof" },
              { "@type": "ListItem", "position": 3, "name": "Criomedicina en grupo", "item": "https://studiolanave.com/criomedicina-ice-bath-en-grupo" }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Experiencia grupal Criomedicina (Método Wim Hof)",
            "brand": "Nave Studio",
            "description": "Sesiones grupales de criomedicina con descuentos especiales para grupos de 3-10 personas",
            "offers": [
              {
                "@type": "Offer",
                "name": "Grupo 3 personas",
                "priceCurrency": "CLP",
                "price": "84000",
                "availability": "https://schema.org/InStock"
              },
              {
                "@type": "Offer",
                "name": "Grupo 6 personas",
                "priceCurrency": "CLP",
                "price": "144000",
                "availability": "https://schema.org/InStock"
              }
            ]
          })}
        </script>
      </Helmet>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 md:py-16 text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-primary">
            Criomedicina en grupo — Vive el hielo acompañado
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
            ¿Quieres venir en grupo al agua fría? Tenemos paquetes con descuento para ti y tu equipo.
          </p>
        </section>

        {/* Step by Step Process */}
        <section className="py-10 px-4 md:px-6">
          <div className="max-w-5xl mx-auto space-y-12">
            
            {/* Step 1 - Horarios */}
            <div className="bg-card rounded-2xl p-6 md:p-8 border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</div>
                <h2 className="text-xl md:text-2xl font-bold text-primary">Revisa horarios</h2>
              </div>
              <p className="text-foreground mb-6">
                Nuestros grupos se realizan en los mismos horarios de Método Wim Hof. Revisa los horarios disponibles aquí ↓
              </p>
              
              {/* Dynamic Schedule Display */}
              {wimHofSchedule.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2 mb-6">
                  {wimHofSchedule.map((dayBlock) => (
                    <div key={dayBlock.day} className="rounded-xl border bg-background p-4">
                      <h3 className="font-semibold text-primary capitalize">{dayBlock.dayName}</h3>
                      <ul className="mt-2 space-y-1">
                        {dayBlock.items.map((item, index) => (
                          <li key={index} className="text-foreground text-sm">
                            {item.time} — {item.title}
                            {item.instructor && (
                              <span className="text-muted-foreground"> • {item.instructor}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="bg-accent/50 p-4 rounded-lg">
                <p className="text-sm text-foreground">
                  <strong>Nota:</strong> Para grupos de 5 o más personas, también podemos coordinar un horario especial fuera de la agenda establecida.
                </p>
              </div>
            </div>

            {/* Step 2 - Pricing */}
            <div className="bg-card rounded-2xl p-6 md:p-8 border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</div>
                <h2 className="text-xl md:text-2xl font-bold text-primary">Realiza la compra de tu grupo</h2>
              </div>
              <p className="text-foreground mb-6">
                Selecciona tu paquete grupal y asegura tu cupo.
              </p>
              
              {/* Pricing Table */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="border rounded-xl p-4 bg-background">
                  <h3 className="font-semibold text-primary">3 personas</h3>
                  <p className="text-2xl font-bold text-primary mt-1">$84.000 total</p>
                  <p className="text-sm text-muted-foreground">$28.000 por persona</p>
                </div>
                
                <div className="border rounded-xl p-4 bg-background">
                  <h3 className="font-semibold text-primary">4 personas</h3>
                  <p className="text-2xl font-bold text-primary mt-1">$108.000 total</p>
                  <p className="text-sm text-muted-foreground">$27.000 por persona</p>
                </div>
                
                <div className="border rounded-xl p-4 bg-background">
                  <h3 className="font-semibold text-primary">5 personas</h3>
                  <p className="text-2xl font-bold text-primary mt-1">$125.000 total</p>
                  <p className="text-sm text-muted-foreground">$25.000 por persona</p>
                </div>
                
                <div className="border-2 border-primary rounded-xl p-4 bg-background relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                      Más popular
                    </span>
                  </div>
                  <h3 className="font-semibold text-primary">6 personas</h3>
                  <p className="text-2xl font-bold text-primary mt-1">$144.000 total</p>
                  <p className="text-sm text-muted-foreground">$24.000 por persona</p>
                </div>
                
                <div className="border rounded-xl p-4 bg-background sm:col-span-2 lg:col-span-2">
                  <h3 className="font-semibold text-primary">7–10 personas</h3>
                  <p className="text-2xl font-bold text-primary mt-1">$23.000 por persona</p>
                  <p className="text-sm text-muted-foreground">Se organiza en 2 rondas consecutivas</p>
                </div>
              </div>
            </div>

            {/* Step 3 - WhatsApp Contact */}
            <div className="bg-card rounded-2xl p-6 md:p-8 border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</div>
                <h2 className="text-xl md:text-2xl font-bold text-primary">Contáctanos por WhatsApp</h2>
              </div>
              <p className="text-foreground">
                Una vez realizada tu compra, escríbenos a WhatsApp al{" "}
                <a 
                  href="https://wa.me/56946120426" 
                  target="_blank" 
                  rel="noopener"
                  className="text-primary underline hover:text-primary/80 font-medium"
                >
                  +56 9 4612 0426
                </a>
                {" "}para confirmar. Si no nos contactas, nosotros te escribiremos 😊.
              </p>
            </div>

            {/* Step 4 - Booking Coordination */}
            <div className="bg-card rounded-2xl p-6 md:p-8 border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">4</div>
                <h2 className="text-xl md:text-2xl font-bold text-primary">Nosotros agendamos por ti</h2>
              </div>
              <p className="text-foreground">
                Nosotros coordinaremos la reserva grupal en el horario que escojan. Así no tienen que agendar uno a uno.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-4 md:px-6 bg-muted/30">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
              ¿Listos para la experiencia grupal?
            </h2>
            <p className="text-muted-foreground mb-8">
              Reserva tu experiencia grupal ahora y disfruta del descuento especial para grupos.
            </p>
            
            <CheckoutRedirectButton
              url="https://boxmagic.cl/market/plan/RZ0vlQyLQ6"
              plan="Criomedicina — Experiencia grupal"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-xl text-lg font-semibold"
            >
              Reserva tu experiencia grupal ahora
            </CheckoutRedirectButton>
            
            <p className="text-sm text-muted-foreground mt-4">
              ¿Tienes dudas? Escríbenos por{" "}
              <a 
                href="https://wa.me/56946120426" 
                target="_blank" 
                rel="noopener"
                className="text-primary underline hover:text-primary/80"
              >
                WhatsApp
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CriomedicinIceBathEnGrupo;