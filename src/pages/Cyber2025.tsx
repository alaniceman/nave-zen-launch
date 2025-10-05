import { Footer } from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Flame } from "lucide-react";
import heroImage from "@/assets/cyber-2025-hero.jpg";
import { useEffect, useState } from "react";

const Cyber2025 = () => {
  const [showStickyBar, setShowStickyBar] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const planesSection = document.getElementById('planes');
      if (planesSection) {
        const rect = planesSection.getBoundingClientRect();
        // Hide sticky bar when planes section is visible
        setShowStickyBar(rect.top > window.innerHeight || rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Helmet>
        <title>Cyber La Nave 2025 — 80% OFF en Nave Studio Santiago</title>
        <meta name="description" content="Vive el poder del Método Wim Hof, Yoga y Biohacking con 80% de descuento por 2 meses. Solo del 6 al 8 de octubre en Nave Studio, Las Condes." />
        <link rel="canonical" href="https://studiolanave.com/cyber-2025" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Cyber La Nave 2025 — 80% OFF en Nave Studio Santiago" />
        <meta property="og:description" content="Vive el poder del Método Wim Hof, Yoga y Biohacking con 80% de descuento por 2 meses. Solo del 6 al 8 de octubre en Nave Studio, Las Condes." />
        <meta property="og:url" content="https://studiolanave.com/cyber-2025" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://studiolanave.com/og-image.png" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cyber La Nave 2025 — 80% OFF en Nave Studio Santiago" />
        <meta name="twitter:description" content="Vive el poder del Método Wim Hof, Yoga y Biohacking con 80% de descuento por 2 meses. Solo del 6 al 8 de octubre en Nave Studio, Las Condes." />
      </Helmet>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-[#00C2CB]/10 via-primary/5 to-secondary/10">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={heroImage}
              alt="Cyber La Nave 2025 - Promoción especial Nave Studio"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90" />
          </div>
          
          <div className="relative container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading text-primary mb-6 leading-tight">
                El hábito que cambiará tu vida empieza hoy.
              </h1>
              
              <p className="text-xl md:text-2xl text-secondary mb-4 font-medium">
                💨 Durante el Cyber La Nave, entrena tu bienestar con 80% OFF los primeros 2 meses.
              </p>
              
              <p className="text-lg md:text-xl text-primary mb-8">
                📅 Solo del 6 al 8 de octubre de 2025.
              </p>
              
              <p className="text-lg md:text-xl text-neutral-mid max-w-3xl mx-auto mb-12 leading-relaxed">
                Crea el hábito. Regula tu sistema nervioso. Descubre el poder del frío, el movimiento y la respiración.
              </p>
              
              <a
                href="#planes"
                className="inline-flex items-center justify-center px-10 py-4 text-lg bg-[#00C2CB] hover:bg-primary text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Suscríbete hoy y comienza tu cambio →
              </a>
            </div>
          </div>
        </section>

        {/* Storytelling Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-heading text-primary mb-8">
                Entrena tu bienestar.
              </h2>
              
              <div className="space-y-6 text-lg md:text-xl text-neutral-mid leading-relaxed">
                <p>
                  En La Nave no se trata solo de clases.<br />
                  Se trata de entrenar tu bienestar y construir un hábito que te devuelva energía, enfoque y propósito.
                </p>
                
                <p className="font-medium text-primary">
                  Queremos que firmes tu compromiso contigo mismo.
                </p>
                
                <p>
                  Durante dos meses, te acompañamos a despertar tu poder interior a través del Método Wim Hof, el Yoga, el movimiento y el hielo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="planes" className="py-20 bg-gradient-to-br from-[#00C2CB]/5 to-primary/5">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-heading text-primary mb-4">
                  🔥 Planes en promoción (solo por Cyber Week)
                </h2>
                <p className="text-xl text-neutral-mid">
                  Dos planes, mismo propósito: crear el hábito que transforma.
                </p>
              </div>

              {/* Pricing Table */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#00C2CB] to-primary text-white">
                      <tr>
                        <th className="px-6 py-4 text-left text-lg font-heading">Plan</th>
                        <th className="px-6 py-4 text-left text-lg font-heading">Normal</th>
                        <th className="px-6 py-4 text-left text-lg font-heading">Cyber x 2 meses</th>
                        <th className="px-6 py-4 text-left text-lg font-heading">Ahorro</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr className="hover:bg-secondary/5 transition-colors">
                        <td className="px-6 py-6 font-medium text-primary">
                          Membresía Órbita<br />
                          <span className="text-sm text-neutral-mid">(2 sesiones/semana)</span>
                        </td>
                        <td className="px-6 py-6 text-neutral-mid">$79.000</td>
                        <td className="px-6 py-6 font-bold text-[#00C2CB] text-lg">$15.800/mes x 2</td>
                        <td className="px-6 py-6 font-bold text-secondary text-lg">–80%</td>
                      </tr>
                      <tr className="hover:bg-secondary/5 transition-colors">
                        <td className="px-6 py-6 font-medium text-primary">
                          Membresía Universo<br />
                          <span className="text-sm text-neutral-mid">(acceso ilimitado)</span>
                        </td>
                        <td className="px-6 py-6 text-neutral-mid">$95.000</td>
                        <td className="px-6 py-6 font-bold text-[#00C2CB] text-lg">$19.000/mes x 2</td>
                        <td className="px-6 py-6 font-bold text-secondary text-lg">–80%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-6 mb-12">
                <div className="space-y-2 text-neutral-mid">
                  <p>💳 Compromiso mínimo: 2 meses al valor promocional.</p>
                  <p>📅 Pasado el periodo Cyber, el plan continúa al valor regular.</p>
                  <p>🧊 Promoción válida solo para nuevos miembros o quienes no tengan plan activo.</p>
                </div>
              </div>

              {/* Urgency Box */}
              <div className="relative bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 border-2 border-red-500 rounded-xl p-6 mb-8 overflow-hidden">
                <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                <div className="relative flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
                  <Flame className="w-8 h-8 md:w-10 md:h-10 text-red-500 animate-pulse flex-shrink-0" />
                  <p className="text-base md:text-xl font-bold text-red-600 text-center leading-tight">
                    Solo quedan <span className="text-xl md:text-2xl">4 de las 15</span> suscripciones disponibles en promoción Cyber
                  </p>
                  <Flame className="w-8 h-8 md:w-10 md:h-10 text-red-500 animate-pulse flex-shrink-0" />
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="grid md:grid-cols-2 gap-6">
                <a
                  href="https://boxmagic.cl/market/plan/Vx0JnJw0vB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-r from-[#00C2CB] to-primary hover:from-primary hover:to-[#00C2CB] text-white rounded-xl p-8 text-center transition-all transform hover:scale-105 shadow-lg"
                >
                  <div className="text-4xl mb-3">🪐</div>
                  <h3 className="text-2xl font-heading mb-3">Membresía Órbita</h3>
                  <p className="text-lg mb-2">$15.800/mes x 2 meses</p>
                  <p className="text-sm opacity-90">(80% OFF)</p>
                </a>

                <a
                  href="https://boxmagic.cl/market/plan/Kp0MnaPD8x"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white rounded-xl p-8 text-center transition-all transform hover:scale-105 shadow-lg"
                >
                  <div className="text-4xl mb-3">🌌</div>
                  <h3 className="text-2xl font-heading mb-3">Membresía Universo</h3>
                  <p className="text-lg mb-2">$19.000/mes x 2 meses</p>
                  <p className="text-sm opacity-90">(80% OFF)</p>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-heading text-primary mb-12 text-center">
                ✨ Lo que recibirás durante tus 2 meses Cyber
              </h2>

              <div className="space-y-8">
                <div className="bg-gradient-to-br from-[#00C2CB]/5 to-primary/5 rounded-2xl p-8 border border-[#00C2CB]/20">
                  <div className="flex items-start gap-4 mb-6">
                    <Check className="w-6 h-6 text-[#00C2CB] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-heading text-primary mb-3">
                        Acceso a todas las experiencias de Nave Studio:
                      </h3>
                      <ul className="space-y-2 text-neutral-mid">
                        <li>• Método Wim Hof (Breathwork + Ice Bath)</li>
                        <li>• Yoga Yin · Yang · Integral · Vinyasa</li>
                        <li>• Biohacking (Breathwork + HIIT + Ice Bath)</li>
                        <li>• Breathwork & Meditación</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                    <Check className="w-8 h-8 text-[#00C2CB] mx-auto mb-4" />
                    <p className="text-neutral-mid">Clases guiadas por instructores certificados</p>
                  </div>
                  
                  <div className="bg-white border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                    <Check className="w-8 h-8 text-[#00C2CB] mx-auto mb-4" />
                    <p className="text-neutral-mid">Ambientes reducidos, acompañamiento experto y energía real</p>
                  </div>
                  
                  <div className="bg-white border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                    <Check className="w-8 h-8 text-[#00C2CB] mx-auto mb-4" />
                    <p className="text-neutral-mid">Ubicación: Antares 259, Las Condes — Santiago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-heading text-primary mb-8">
                💡 Detalles del Cyber La Nave 2025
              </h2>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg space-y-4 text-lg text-neutral-mid">
                <p>📅 Vigencia: del 6 al 8 de octubre de 2025</p>
                <p>💳 Promoción válida solo durante Cyber La Nave.</p>
                <p>🧊 Compromiso mínimo: 2 meses al valor promocional.</p>
                <p>📍 Nave Studio — Antares 259, Las Condes, Santiago.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-heading text-primary mb-12 text-center">
                Preguntas frecuentes
              </h2>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border border-border rounded-xl px-6">
                  <AccordionTrigger className="text-lg font-medium text-primary hover:text-secondary">
                    ¿Qué pasa después de los 2 meses de promoción?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-mid">
                    Tu membresía continúa automáticamente al valor regular del plan.
                    Puedes cancelarla cuando quieras después del periodo mínimo de 2 meses.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border border-border rounded-xl px-6">
                  <AccordionTrigger className="text-lg font-medium text-primary hover:text-secondary">
                    ¿A quién está dirigida esta promoción?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-mid">
                    A todas las personas nuevas o que actualmente no tengan un plan activo en Nave Studio.
                    Es ideal si estás buscando crear un hábito sostenible de bienestar.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border border-border rounded-xl px-6">
                  <AccordionTrigger className="text-lg font-medium text-primary hover:text-secondary">
                    ¿Puedo usar el descuento para otra persona?
                  </AccordionTrigger>
                  <AccordionContent className="text-neutral-mid">
                    Sí, puedes regalar la promoción a alguien más, siempre que no tenga una membresía activa.
                    El beneficio es personal y se activa al momento de la suscripción.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-br from-[#00C2CB]/10 via-primary/5 to-secondary/10">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-heading text-primary mb-6">
                El bienestar no se compra, se entrena.
              </h2>
              
              <p className="text-xl md:text-2xl text-secondary mb-10">
                💙 Este es tu llamado a crear el hábito que cambiará tu vida.
              </p>
              
              <a
                href="#planes"
                className="inline-flex items-center justify-center px-10 py-4 text-lg bg-gradient-to-r from-[#00C2CB] to-primary hover:from-primary hover:to-secondary text-white font-medium rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Aprovecha el 80% OFF antes del 8 de octubre →
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </main>

      {/* Sticky Urgency Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md text-white py-3 md:py-4 px-4 md:px-6 z-50 shadow-2xl border-t border-red-500/50">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm md:text-base font-medium text-center sm:text-left">
              ⏰ Solo quedan <span className="text-red-400 font-bold">4 cupos</span> | Termina el 8 de octubre
            </p>
            <a 
              href="#planes" 
              className="bg-[#00C2CB] hover:bg-primary px-4 md:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all transform hover:scale-105 shadow-lg"
            >
              Ver planes
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Cyber2025;
