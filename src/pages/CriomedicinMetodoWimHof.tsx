import { Helmet } from "react-helmet-async";
import { CheckoutRedirectButton } from "@/components/CheckoutRedirectButton";
import { CoachesSection } from "@/components/CoachesSection";
import { Footer } from "@/components/Footer";
import { GiftCardSection } from "@/components/GiftCardSection";

const CriomedicinMetodoWimHof = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Criomedicina (Método Wim Hof) en Chile — Ice Bath & Breathwork | Nave Studio</title>
        <meta name="description" content="Sesiones guiadas de Método Wim Hof en Santiago (Las Condes): respiración + baño de hielo a 3 °C. Horarios, precios y reserva online." />
        <meta property="og:title" content="Criomedicina (Método Wim Hof) en Chile — Ice Bath & Breathwork | Nave Studio" />
        <meta property="og:description" content="Sesiones guiadas de Método Wim Hof en Santiago (Las Condes): respiración + baño de hielo a 3 °C. Horarios, precios y reserva online." />
        <meta property="og:image" content="/og/wimhof.jpg" />
        <meta property="og:url" content="https://studiolanave.com/criomedicina-metodo-wim-hof" />
        <link rel="canonical" href="https://studiolanave.com/criomedicina-metodo-wim-hof" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Nave Studio",
            "description": "Criomedicina (Método Wim Hof) en Santiago, Chile: respiración Wim Hof + baño de hielo guiado. Horarios y reservas online.",
            "url": "https://studiolanave.com/criomedicina-metodo-wim-hof",
            "telephone": "+56 9 4612 0426",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Antares 259",
              "addressLocality": "Las Condes",
              "addressRegion": "RM",
              "addressCountry": "CL"
            },
            "image": "https://studiolanave.com/og/wimhof.jpg",
            "sameAs": ["https://www.instagram.com/nave.icestudio"]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://studiolanave.com/" },
              { "@type": "ListItem", "position": 2, "name": "Criomedicina (Método Wim Hof)", "item": "https://studiolanave.com/criomedicina-metodo-wim-hof" }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Qué es el Método Wim Hof y la Criomedicina?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Es la combinación de respiración Wim Hof y exposición al frío (ice bath) en un protocolo seguro y guiado."
                }
              },
              {
                "@type": "Question",
                "name": "¿Cuánto cuesta una sesión en Chile?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "1 sesión grupal $30.000, pack 3 sesiones $59.000, personalizado (1–2) $40.000. También disponible en membresías."
                }
              },
              {
                "@type": "Question",
                "name": "¿Dónde está Nave Studio?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Antares 259, Las Condes, Santiago de Chile."
                }
              },
              {
                "@type": "Question",
                "name": "¿Es seguro?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Seguimos protocolos guiados, personalizamos tiempos y contraindicaciones. Consulta a tu médico si tienes condiciones preexistentes."
                }
              },
              {
                "@type": "Question",
                "name": "¿Qué debo llevar a mi primera clase?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Para Ice Bath: traje de baño, toalla y ropa cómoda para después. Para Yoga: ropa deportiva cómoda y botella de agua. Nosotros proporcionamos esterillas y todo el equipamiento necesario."
                }
              }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Sesión Método Wim Hof (Criomedicina) — Grupal",
            "brand": "Nave Studio",
            "offers": {
              "@type": "Offer",
              "priceCurrency": "CLP",
              "price": "30000",
              "availability": "https://schema.org/InStock",
              "url": "https://boxmagic.cl/market/plan/RZ0vlQyLQ6"
            }
          })}
        </script>
      </Helmet>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 md:py-16 text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-primary">
            Criomedicina (Método Wim Hof) en Chile — Santiago
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-2">
            Respiración Wim Hof + Ice Bath guiado (60 min). Regula tu sistema nervioso, gana foco y energía.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <CheckoutRedirectButton
              url="https://boxmagic.cl/market/plan/RZ0vlQyLQ6"
              plan="Criomedicina / Wim Hof — 1 sesión grupal"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-xl text-lg font-semibold"
            >
              Agendar 1 sesión — $30.000
            </CheckoutRedirectButton>
            
            <a
              href="/criomedicina-ice-bath-en-grupo"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-4 rounded-xl text-lg font-semibold inline-flex items-center justify-center transition-colors"
            >
              Agenda grupal
            </a>
          </div>

          <p className="text-base text-muted-foreground mt-4 text-center">
            <a href="#precios-criomedicina" className="underline text-primary hover:text-primary/80">
              Explora las membresías y paquetes de sesiones
            </a>
          </p>
        </section>

        {/* What is Criomedicina Section */}
        <section className="px-4 md:px-6 pb-6">
          <div className="max-w-5xl mx-auto grid gap-4 sm:grid-cols-3">
            <div className="bg-card rounded-xl p-5 border">
              <h2 className="font-semibold text-primary">Exposición al frío guiada (Ice Bath)</h2>
              <p className="text-sm text-muted-foreground mt-1">Inmersión a ~3 °C con protocolo seguro. Entrenas respuesta al estrés, circulación y recuperación.</p>
            </div>
            <div className="bg-card rounded-xl p-5 border">
              <h3 className="font-semibold text-primary">Respiración Wim Hof (Breathwork)</h3>
              <p className="text-sm text-muted-foreground mt-1">3 rondas guiadas que preparan tu sistema nervioso para el baño de hielo.</p>
            </div>
            <div className="bg-card rounded-xl p-5 border">
              <h3 className="font-semibold text-primary">Sesión de 60 minutos</h3>
              <p className="text-sm text-muted-foreground mt-1">Guía experto, tiempos personalizados y contención. *No constituye consejo médico.*</p>
            </div>
          </div>
        </section>

        {/* Schedule Section */}
        <section id="horarios-criomedicina" className="py-10 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">Horarios Método Wim Hof (Criomedicina)</h2>
            <p className="text-muted-foreground text-center mt-1">Elige tu horario (grupal o personalizado) y asegura tu cupo.</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-primary">Lunes</h3>
                <ul className="mt-2 text-foreground">
                  <li>09:15 — Wim Hof (Breathwork + Ice Bath)</li>
                </ul>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-primary">Martes</h3>
                <ul className="mt-2 text-foreground">
                  <li>10:00 — Personalizado (1–2)</li>
                  <li>11:15 — Wim Hof (Breathwork + Ice Bath)</li>
                  <li>19:15 — Wim Hof (Breathwork + Ice Bath)</li>
                </ul>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-primary">Miércoles</h3>
                <ul className="mt-2 text-foreground">
                  <li>09:15 — Wim Hof (Breathwork + Ice Bath)</li>
                </ul>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-primary">Jueves</h3>
                <ul className="mt-2 text-foreground">
                  <li>10:00 — Personalizado (1–2)</li>
                  <li>11:15 — Wim Hof (Breathwork + Ice Bath)</li>
                  <li>18:00 — Wim Hof (Breathwork + Ice Bath)</li>
                </ul>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-primary">Viernes</h3>
                <ul className="mt-2 text-foreground">
                  <li>07:00 — Wim Hof (Breathwork + Ice Bath)</li>
                </ul>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="font-semibold text-primary">Sábado</h3>
                <ul className="mt-2 text-foreground">
                  <li>09:00 — Wim Hof (Breathwork + Ice Bath)</li>
                  <li>11:45 — Wim Hof (Breathwork + Ice Bath)</li>
                </ul>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center mt-3">
              ¿No encuentras horario? Escríbenos por <a className="underline text-primary hover:text-primary/80" href="https://wa.me/56946120426" target="_blank" rel="noopener">WhatsApp</a>.
            </p>
            <p className="text-center mt-2">
              <a className="text-primary underline hover:text-primary/80" href="/horarios#hoy">Ver todos los horarios →</a>
            </p>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="precios-criomedicina" className="py-10 px-4 md:px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">Precios y planes</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {/* Single Session */}
              <div className="rounded-2xl border bg-card p-5">
                <h3 className="font-semibold text-primary">1 sesión — Grupal (máx 6)</h3>
                <p className="text-4xl font-bold text-primary mt-1">$30.000 <span className="text-base text-muted-foreground">/ sesión</span></p>
                <p className="text-sm text-muted-foreground mt-2">Breathwork Wim Hof + Ice Bath guiado (60 min).</p>
                <CheckoutRedirectButton
                  url="https://boxmagic.cl/market/plan/RZ0vlQyLQ6"
                  plan="Criomedicina — 1 sesión grupal"
                  className="mt-4 bg-primary text-primary-foreground px-5 py-3 rounded-lg hover:bg-primary/90 w-full font-medium"
                >
                  Agendar 1 sesión
                </CheckoutRedirectButton>
              </div>

              {/* Pack 3 Sessions */}
              <div className="rounded-2xl border bg-card p-5">
                <h3 className="font-semibold text-primary">Pack 3 sesiones</h3>
                <p className="text-4xl font-bold text-primary mt-1">$59.000</p>
                <p className="text-sm text-muted-foreground mt-2">Usa 3 sesiones en 60 días. Ideal para consolidar el hábito.</p>
                <CheckoutRedirectButton
                  url="https://boxmagic.cl/market/plan/bQDN8Jq4M7"
                  plan="Criomedicina — Pack 3 sesiones"
                  className="mt-4 bg-primary text-primary-foreground px-5 py-3 rounded-lg hover:bg-primary/90 w-full font-medium"
                >
                  Comprar pack
                </CheckoutRedirectButton>
              </div>

              {/* Personal Session */}
              <div className="rounded-2xl border bg-card p-5">
                <h3 className="font-semibold text-primary">Personalizado (1–2)</h3>
                <p className="text-4xl font-bold text-primary mt-1">$40.000 <span className="text-base text-muted-foreground">/ sesión</span></p>
                <p className="text-sm text-muted-foreground mt-2">Respiración en pareja (máx 2) y entrada al hielo por separado, guiada.</p>
                <CheckoutRedirectButton
                  url="https://boxmagic.cl/market/plan/j80pKrK4W6"
                  plan="Criomedicina — Personalizado (1–2)"
                  className="mt-4 bg-primary text-primary-foreground px-5 py-3 rounded-lg hover:bg-primary/90 w-full font-medium"
                >
                  Agendar personalizado
                </CheckoutRedirectButton>
              </div>
            </div>

            {/* Memberships */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border bg-card p-5">
                <h3 className="font-semibold text-primary">Universo — Ilimitado</h3>
                <p className="text-4xl font-bold text-primary mt-1">$95.000</p>
                <p className="text-sm text-muted-foreground mt-2">Incluye Criomedicina, Yoga, Breathwork, Biohacking, Ice Bath.</p>
                <p className="text-xs text-muted-foreground mt-1">50% OFF 1er mes con código <strong>1MES</strong>.</p>
                <CheckoutRedirectButton
                  url="https://boxmagic.cl/market/plan_subscription/j80p5OdDW6"
                  plan="Membresía Universo"
                  className="mt-3 bg-primary text-primary-foreground px-5 py-3 rounded-lg hover:bg-primary/90 w-full font-medium"
                >
                  Suscribirme
                </CheckoutRedirectButton>
              </div>
              <div className="rounded-2xl border bg-card p-5">
                <h3 className="font-semibold text-primary">Órbita — 2/sem</h3>
                <p className="text-4xl font-bold text-primary mt-1">$79.000</p>
                <p className="text-sm text-muted-foreground mt-2">2 sesiones por semana en cualquier disciplina.</p>
                <p className="text-xs text-muted-foreground mt-1">50% OFF 1er mes con código <strong>1MES</strong>.</p>
                <CheckoutRedirectButton
                  url="https://boxmagic.cl/market/plan_subscription/ev4VPzOD9A"
                  plan="Membresía Órbita"
                  className="mt-3 bg-primary text-primary-foreground px-5 py-3 rounded-lg hover:bg-primary/90 w-full font-medium"
                >
                  Suscribirme
                </CheckoutRedirectButton>
              </div>
              <div className="rounded-2xl border bg-card p-5">
                <h3 className="font-semibold text-primary">Eclipse — 1/sem</h3>
                <p className="text-4xl font-bold text-primary mt-1">$49.000</p>
                <p className="text-sm text-muted-foreground mt-2">1 sesión semanal, elige la disciplina.</p>
                <CheckoutRedirectButton
                  url="https://boxmagic.cl/market/plan_subscription/VrD8wRx0Qz"
                  plan="Membresía Eclipse"
                  className="mt-3 bg-primary text-primary-foreground px-5 py-3 rounded-lg hover:bg-primary/90 w-full font-medium"
                >
                  Suscribirme
                </CheckoutRedirectButton>
              </div>
            </div>
          </div>
        </section>

        {/* Facilitators Section */}
        <section id="facilitadores">
          <CoachesSection filterIds={["alan", "sol", "maral", "rolo"]} />
        </section>

        {/* How to Book Section */}
        <section className="py-8 px-4 md:px-6">
          <div className="max-w-5xl mx-auto bg-card rounded-2xl p-5 shadow-sm border">
            <h3 className="text-xl font-bold text-primary">Paga, recibe créditos y agenda en la app</h3>
            <ul className="list-disc pl-5 text-foreground mt-2 space-y-1">
              <li>Al comprar una sesión, pack o membresía, se cargan <strong>créditos</strong> a tu cuenta.</li>
              <li>Descarga la <strong>app BoxMagic</strong> y agenda desde ahí tus clases.</li>
              <li>Soporte por WhatsApp: <a className="underline text-primary hover:text-primary/80" href="https://wa.me/56946120426" target="_blank" rel="noopener">+56 9 4612 0426</a>.</li>
            </ul>
          </div>
        </section>

        {/* Location Section */}
        <section className="py-8 px-4 md:px-6">
          <div className="max-w-5xl mx-auto bg-card rounded-2xl p-5 shadow-sm border">
            <h3 className="text-xl font-bold text-primary">Estamos en Las Condes, Santiago</h3>
            <p className="text-muted-foreground mt-1">Antares 259, Las Condes</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <a href="https://maps.app.goo.gl/oW6G58gLd5oYWmGn8" target="_blank" rel="noopener" className="inline-block border-2 border-primary text-primary rounded-lg px-4 py-2 hover:bg-primary hover:text-primary-foreground transition">Ver mapa</a>
              <a href="/horarios#hoy" className="inline-block bg-primary text-primary-foreground rounded-lg px-4 py-2 hover:bg-primary/90 transition">Ver horarios</a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-10 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">Preguntas frecuentes</h2>
            <div className="mt-6 space-y-4">
              <details className="rounded-xl border p-4 bg-card">
                <summary className="font-semibold text-primary cursor-pointer">¿Qué es el Método Wim Hof y la Criomedicina?</summary>
                <p className="text-foreground mt-2">Es la combinación de respiración Wim Hof y exposición al frío (ice bath) en un protocolo seguro y guiado.</p>
              </details>
              <details className="rounded-xl border p-4 bg-card">
                <summary className="font-semibold text-primary cursor-pointer">¿Cuánto cuesta una sesión en Chile?</summary>
                <p className="text-foreground mt-2">1 sesión grupal $30.000, pack 3 sesiones $59.000, personalizado (1–2) $40.000. También disponible en membresías.</p>
              </details>
              <details className="rounded-xl border p-4 bg-card">
                <summary className="font-semibold text-primary cursor-pointer">¿Dónde está Nave Studio?</summary>
                <p className="text-foreground mt-2">Antares 259, Las Condes, Santiago de Chile.</p>
              </details>
              <details className="rounded-xl border p-4 bg-card">
                <summary className="font-semibold text-primary cursor-pointer">¿Es seguro?</summary>
                <p className="text-foreground mt-2">Seguimos protocolos guiados, personalizamos tiempos y contraindicaciones. Consulta a tu médico si tienes condiciones preexistentes.</p>
              </details>
              <details className="rounded-xl border p-4 bg-card">
                <summary className="font-semibold text-primary cursor-pointer">¿Qué debo llevar a mi primera clase?</summary>
                <p className="text-foreground mt-2">Para Ice Bath: traje de baño, toalla y ropa cómoda para después. Para Yoga: ropa deportiva cómoda y botella de agua. Nosotros proporcionamos esterillas y todo el equipamiento necesario.</p>
              </details>
            </div>
          </div>
        </section>
      </main>

      <GiftCardSection />
      <Footer />
    </div>
  );
};

export default CriomedicinMetodoWimHof;