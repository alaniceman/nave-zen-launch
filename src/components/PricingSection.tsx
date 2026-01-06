import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckoutRedirectButton } from "@/components/CheckoutRedirectButton";

const PricingSection = () => {
  return (
    <>
      {/* Intention Menu Section */}
      <section id="intent-menu-home" className="py-12 bg-background">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center font-space">Elige cómo quieres empezar</h2>
          <p className="text-muted-foreground text-center mt-2 font-inter">Te guiamos al plan ideal según tu objetivo.</p>

          <div className="grid gap-4 mt-6 md:grid-cols-4">
            {/* 1. Hábito semanal */}
            <a href="/planes-precios#habito-semanal"
               className="group rounded-2xl p-5 bg-muted hover:bg-card hover:shadow-lg transition"
               aria-label="Ver membresías para mantener mi hábito semanal">
              <h3 className="font-semibold text-primary font-space">Mantener mi hábito semanal</h3>
              <p className="text-sm text-muted-foreground mt-1 font-inter">Quiero venir todas las semanas y construir consistencia.</p>
              <span className="inline-block mt-3 text-secondary group-hover:underline font-inter">Ver membresías →</span>
            </a>

            {/* 2. Personalizado */}
            <a href="/planes-precios#personalizado"
               className="group rounded-2xl p-5 bg-muted hover:bg-card hover:shadow-lg transition"
               aria-label="Ver sesión personalizada 1:1 o 1:2">
              <h3 className="font-semibold text-primary font-space">Sesión personalizada 1:1 / 1:2</h3>
              <p className="text-sm text-muted-foreground mt-1 font-inter">Quiero una guía privada para avanzar más rápido.</p>
              <span className="inline-block mt-3 text-secondary group-hover:underline font-inter">Ver personalizado →</span>
            </a>

            {/* 3. Ice Bath una vez */}
            <a href="/planes-precios#sesion-unica"
               className="group rounded-2xl p-5 bg-muted hover:bg-card hover:shadow-lg transition"
               aria-label="Ver sesión única para probar Ice Bath">
              <h3 className="font-semibold text-primary font-space">Probar el Ice Bath una sola vez</h3>
              <p className="text-sm text-muted-foreground mt-1 font-inter">Vive la experiencia de hielo + respiración.</p>
              <span className="inline-block mt-3 text-secondary group-hover:underline font-inter">Ver sesión única →</span>
            </a>

            {/* 4. Solo Yoga */}
            <a href="/planes-precios#solo-yoga"
               className="group rounded-2xl p-5 bg-muted hover:bg-card hover:shadow-lg transition"
               aria-label="Ver planes para practicar solo Yoga">
              <h3 className="font-semibold text-primary font-space">Solo Yoga</h3>
              <p className="text-sm text-muted-foreground mt-1 font-inter">Practica Yin, Yang o Integral sin compromiso.</p>
              <span className="inline-block mt-3 text-secondary group-hover:underline font-inter">Ver Yoga →</span>
            </a>
          </div>
        </div>
      </section>

      {/* Compact Teaser Section */}
      <section id="planes-teaser-home" className="py-12 bg-background">
        <div className="max-w-5xl mx-auto text-center px-4 md:px-6">
          <h3 className="text-2xl md:text-3xl font-bold text-primary font-space">Planes para cada ritmo</h3>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto font-inter">
            Desde sesiones sueltas hasta membresías ilimitadas. Elige cómo empezar y mejora tu energía, foco y bienestar.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-muted rounded-lg py-3 px-4 font-inter">Membresías desde <strong>$49.000</strong></div>
            <div className="bg-muted rounded-lg py-3 px-4 font-inter">Misión 90 · <strong>27 sesiones/90 días</strong></div>
            <div className="bg-muted rounded-lg py-3 px-4 font-inter">Drop-In Discovery · <strong>3 sesiones/60 días</strong></div>
          </div>

          <a href="/planes-precios"
             className="mt-8 inline-block bg-secondary text-secondary-foreground font-medium py-3 px-8 rounded-lg hover:bg-primary hover:text-primary-foreground transition font-inter"
             aria-label="Ver todos los planes y precios">
            Ver todos los planes →
          </a>

          <p className="text-xs text-muted-foreground mt-3 font-inter">
            30% OFF el primer mes con código <strong>1MES</strong> (aplica a Universo y Órbita).
          </p>
        </div>
      </section>
    </>
  )
};

export { PricingSection };