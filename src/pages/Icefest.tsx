import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Snowflake, Zap, Gift, Clock, Check, Loader2, Brain, Heart, ShieldCheck, Users, Calendar, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";

const PACKAGE_ID = "003cce17-e599-44e4-a1e6-e7873d45deaf";
const PROMO_END = new Date("2026-04-01T23:59:59-04:00"); // 10 días desde el 22 de marzo

function getTimeLeft() {
  const now = new Date();
  const diff = PROMO_END.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function Icefest() {
  const { trackViewContent, trackInitiateCheckout } = useFacebookPixel();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    trackViewContent({
      content_name: "Promo Icefest",
      content_type: "product",
      content_ids: [PACKAGE_ID],
      currency: "CLP",
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) {
    return <Navigate to="/bonos" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);

    trackInitiateCheckout({
      content_name: "Icefest — 6 Sesiones",
      content_type: "product",
      value: 60000,
      currency: "CLP",
    });

    try {
      const { data, error } = await supabase.functions.invoke("purchase-session-package", {
        body: {
          packageId: PACKAGE_ID,
          buyerName: formData.name,
          buyerEmail: formData.email,
          buyerPhone: formData.phone,
          isGiftCard: true,
          promoType: "icefest",
        },
      });

      if (error) throw new Error(error.message);

      if (data?.freeOrder) {
        window.location.href = `/giftcards/success?order=${data.orderId}`;
        return;
      }

      if (data?.initPoint) {
        window.location.href = data.initPoint;
      } else {
        throw new Error("No se pudo crear el link de pago");
      }
    } catch (error: any) {
      console.error("Error purchasing:", error);
      toast.error(error.message || "Error al procesar la compra");
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: Brain, text: "Reduce el estrés", desc: "El agua fría activa tu sistema nervioso parasimpático" },
    { icon: Zap, text: "Recarga tu energía", desc: "Libera dopamina y norepinefrina naturalmente" },
    { icon: ShieldCheck, text: "Fortalece tu inmunidad", desc: "Aumenta la producción de glóbulos blancos" },
    { icon: Heart, text: "Mejora tu sueño", desc: "Regula el cortisol y mejora la calidad de descanso" },
  ];

  return (
    <>
      <Helmet>
        <title>Icefest ❄️ — 6 Sesiones de Criomedicina por $60.000 | Nave Studio</title>
        <meta
          name="description"
          content="Promo Icefest: 6 sesiones de Criomedicina por solo $60.000 ($10.000 c/u). Compartibles y con 6 meses de validez. ¡Solo por tiempo limitado!"
        />
        <meta property="og:title" content="Icefest ❄️ — 6 Sesiones de Criomedicina por $60.000" />
        <meta property="og:description" content="6 sesiones de Criomedicina por $60.000. Compartibles, 6 meses de validez. Solo por 10 días." />
        <link rel="canonical" href="https://nave-zen-launch.lovable.app/icefest" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-sky-950 to-slate-900">
        {/* Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 text-cyan-400/30 animate-pulse"><Snowflake className="w-8 h-8" /></div>
            <div className="absolute top-24 right-16 text-sky-400/20 animate-pulse" style={{ animationDelay: "0.5s" }}><Snowflake className="w-14 h-14" /></div>
            <div className="absolute bottom-32 left-1/4 text-cyan-400/20 animate-pulse" style={{ animationDelay: "1s" }}><Snowflake className="w-6 h-6" /></div>
            <div className="absolute bottom-16 right-10 text-sky-400/30 animate-pulse" style={{ animationDelay: "1.5s" }}><Snowflake className="w-10 h-10" /></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              {/* Urgency badge */}
              <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-md text-red-300 px-5 py-2.5 rounded-full text-sm font-semibold border border-red-500/30 mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-400" />
                </span>
                Oferta por tiempo limitado
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400">
                  Icefest
                </span>{" "}
                ❄️
              </h1>

              <p className="text-xl md:text-2xl text-cyan-100/90 mb-2 font-medium">
                6 sesiones de Criomedicina
              </p>

              <div className="flex items-baseline justify-center gap-3 mb-6">
                <span className="text-white/50 line-through text-xl">$180.000</span>
                <span className="text-5xl md:text-6xl font-black text-white">$60.000</span>
              </div>

              <p className="text-cyan-200/80 text-lg mb-8">
                Solo <strong className="text-white">$10.000 por sesión</strong> — 67% de descuento
              </p>

              {/* Key benefits pills */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-10">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2.5 rounded-full text-sm border border-white/10">
                  <Users className="w-4 h-4 text-cyan-300" />
                  <span><strong>Compartibles</strong> con quien quieras</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2.5 rounded-full text-sm border border-white/10">
                  <Calendar className="w-4 h-4 text-cyan-300" />
                  <span><strong>6 meses</strong> para usarlas</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2.5 rounded-full text-sm border border-white/10">
                  <Snowflake className="w-4 h-4 text-cyan-300" />
                  <span>1 sesión <strong>al mes</strong></span>
                </div>
              </div>

              {/* Countdown */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 max-w-md mx-auto">
                <p className="text-cyan-200/70 text-sm font-medium mb-3 flex items-center justify-center gap-2">
                  <Timer className="w-4 h-4" /> La oferta termina en
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { value: timeLeft.days, label: "Días" },
                    { value: timeLeft.hours, label: "Hrs" },
                    { value: timeLeft.minutes, label: "Min" },
                    { value: timeLeft.seconds, label: "Seg" },
                  ].map((unit) => (
                    <div key={unit.label} className="bg-white/10 rounded-xl p-3">
                      <div className="text-2xl md:text-3xl font-black text-white tabular-nums">
                        {String(unit.value).padStart(2, "0")}
                      </div>
                      <div className="text-xs text-cyan-300/70 font-medium">{unit.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Purchase Form */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-slate-900 to-sky-950">
          <div className="container mx-auto px-4">
            <Card className="border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 bg-slate-800/80 backdrop-blur-sm max-w-lg mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-white">
                  <Gift className="w-5 h-5 text-cyan-400" />
                  Comprar Icefest ❄️
                </CardTitle>
                <p className="text-cyan-200/60 text-sm">
                  Recibirás 6 códigos de sesión y Gift Card descargable al email indicado
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-cyan-100">Nombre completo</Label>
                    <Input
                      id="name" name="name" type="text" placeholder="Tu nombre"
                      value={formData.name} onChange={handleInputChange} required disabled={isLoading}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-cyan-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-cyan-100">Email</Label>
                    <Input
                      id="email" name="email" type="email" placeholder="tu@email.com"
                      value={formData.email} onChange={handleInputChange} required disabled={isLoading}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-cyan-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-cyan-100">Celular</Label>
                    <Input
                      id="phone" name="phone" type="tel" placeholder="+56 9 1234 5678"
                      value={formData.phone} onChange={handleInputChange} required disabled={isLoading}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-cyan-400"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-6 text-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all hover:scale-[1.02]"
                  >
                    {isLoading ? (
                      <><Loader2 className="w-5 h-5 animate-spin mr-2" />Procesando...</>
                    ) : (
                      <>
                        <Snowflake className="w-5 h-5 mr-2" />
                        Comprar 6 Sesiones — $60.000
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-2 text-cyan-200/60 bg-white/5 p-3 rounded-lg border border-white/10">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">6 meses de validez · Sesiones compartibles</span>
                  </div>

                  <p className="text-xs text-cyan-200/40 text-center">
                    Pago seguro con Mercado Pago · Funciona como Gift Card
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-gradient-to-b from-sky-950 to-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-4">
              ¿Por qué Criomedicina?
            </h2>
            <p className="text-center text-cyan-200/60 mb-12 max-w-xl mx-auto">
              La ciencia detrás de la inmersión en agua fría y la respiración Wim Hof
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10 hover:border-cyan-400/30 transition-colors">
                  <div className="inline-flex p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full text-white mb-4">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <p className="text-white font-semibold mb-1">{benefit.text}</p>
                  <p className="text-sm text-cyan-200/50">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 bg-slate-900">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-12">
              ¿Cómo funciona?
            </h2>

            <div className="space-y-6">
              {[
                { step: "1", title: "Compra tu Icefest", desc: "Recibirás 6 códigos de sesión y una Gift Card descargable en PDF al email indicado." },
                { step: "2", title: "Agenda cuando quieras", desc: "Entra a studiolanave.com/agenda-nave-studio e ingresa tu código al reservar." },
                { step: "3", title: "Comparte si quieres", desc: "Cada código es independiente. Puedes regalarlo a un amigo o usarlo tú." },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-cyan-200/60 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-cyan-600 to-blue-700">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              No dejes pasar esta oferta ❄️
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              6 sesiones por $60.000 — solo $10.000 cada una. Compartibles y con 6 meses de validez.
            </p>
            <Button
              onClick={() => document.getElementById("name")?.focus()}
              size="lg"
              className="bg-white text-cyan-700 hover:bg-white/90 font-bold text-lg py-6 px-8 rounded-xl shadow-xl hover:scale-105 transition-all"
            >
              <Snowflake className="w-5 h-5 mr-2" />
              Comprar Icefest — $60.000
            </Button>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
