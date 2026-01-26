import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Snowflake,
  Gift,
  ExternalLink,
  CreditCard,
} from "lucide-react";

const PlanesAnualesPromo = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-warm/10 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <Badge className="bg-warm text-white text-lg px-4 py-1 mb-4">
            🔥 Oferta solo por ENERO
          </Badge>
          <h2 className="font-space text-3xl md:text-4xl font-bold text-primary mb-3">
            Planes Anuales 2026
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Compromiso anual, beneficios exclusivos y hasta 2 meses gratis.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* PLAN 1X SEMANA */}
          <Card className="bg-card border-border relative hover:shadow-lg transition-all">
            <CardHeader className="text-center pb-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Plan 1 vez por semana
              </p>
              <p className="text-lg line-through text-muted-foreground">
                $588.000 anual
              </p>
              <p className="font-space text-3xl font-bold text-foreground">
                $490.000
              </p>
              <p className="text-sm text-muted-foreground">anual</p>
              <Badge
                variant="secondary"
                className="mt-3 bg-primary/10 text-primary text-xs"
              >
                2 meses gratis · $98.000 de ahorro
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative border border-dashed border-primary/40 rounded-lg p-3 bg-primary/5">
                <Badge className="absolute -top-2.5 left-3 bg-primary text-primary-foreground text-xs px-2">
                  🎁 BONUS
                </Badge>
                <div className="space-y-2 text-sm pt-1">
                  <div className="flex items-start gap-2">
                    <Snowflake className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-xs">1 entrada Icefest 2026 ($70.000)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Gift className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-xs">5% dcto Retiro Guatemala</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full" size="sm">
                  <a
                    href="https://boxmagic.cl/market/plan/oV4d9wz0r2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Suscribirme
                    <ExternalLink className="ml-2 w-3 h-3" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <a
                    href="https://mpago.li/2iWEW6R"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CreditCard className="mr-2 w-3 h-3" />
                    12 cuotas sin interés
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground text-center">vía Mercado Pago</p>
              </div>
            </CardContent>
          </Card>

          {/* PLAN 2X SEMANA - RECOMENDADO */}
          <Card className="bg-card border-primary border-2 relative shadow-lg scale-[1.02] hover:shadow-xl transition-all">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1">
                RECOMENDADO
              </Badge>
            </div>
            <CardHeader className="text-center pb-4 pt-8">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Plan 2 veces por semana
              </p>
              <p className="text-lg line-through text-muted-foreground">
                $948.000 anual
              </p>
              <p className="font-space text-3xl font-bold text-primary">
                $790.000
              </p>
              <p className="text-sm text-muted-foreground">anual</p>
              <Badge
                variant="secondary"
                className="mt-3 bg-primary/10 text-primary text-xs"
              >
                2 meses gratis · $158.000 de ahorro
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative border border-dashed border-primary/40 rounded-lg p-3 bg-primary/5">
                <Badge className="absolute -top-2.5 left-3 bg-primary text-primary-foreground text-xs px-2">
                  🎁 BONUS
                </Badge>
                <div className="space-y-2 text-sm pt-1">
                  <div className="flex items-start gap-2">
                    <Snowflake className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-xs">2 entradas Icefest 2026 ($140.000)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Gift className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-xs">7% dcto Retiro Guatemala</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full" size="sm">
                  <a
                    href="https://boxmagic.cl/market/plan/AvLXgdpDEK"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Suscribirme
                    <ExternalLink className="ml-2 w-3 h-3" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <a
                    href="https://mpago.li/1vhEQuN"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CreditCard className="mr-2 w-3 h-3" />
                    12 cuotas sin interés
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground text-center">vía Mercado Pago</p>
              </div>
            </CardContent>
          </Card>

          {/* PLAN ILIMITADO */}
          <Card className="bg-card border-border relative hover:shadow-lg transition-all">
            <CardHeader className="text-center pb-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Plan Ilimitado
              </p>
              <p className="text-lg line-through text-muted-foreground">
                $1.140.000 anual
              </p>
              <p className="font-space text-3xl font-bold text-foreground">
                $950.000
              </p>
              <p className="text-sm text-muted-foreground">anual</p>
              <Badge
                variant="secondary"
                className="mt-3 bg-primary/10 text-primary text-xs"
              >
                2 meses gratis · $190.000 de ahorro
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative border border-dashed border-primary/40 rounded-lg p-3 bg-primary/5">
                <Badge className="absolute -top-2.5 left-3 bg-primary text-primary-foreground text-xs px-2">
                  🎁 BONUS
                </Badge>
                <div className="space-y-2 text-sm pt-1">
                  <div className="flex items-start gap-2">
                    <Snowflake className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-xs">3 entradas Icefest 2026 ($210.000)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Gift className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-xs">10% dcto Retiro Guatemala</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full" size="sm">
                  <a
                    href="https://boxmagic.cl/market/plan/Vx0J5xA4vB"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Suscribirme
                    <ExternalLink className="ml-2 w-3 h-3" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  <a
                    href="https://mpago.li/1pN6aNn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CreditCard className="mr-2 w-3 h-3" />
                    12 cuotas sin interés
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground text-center">vía Mercado Pago</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <a
            href="/anual"
            className="text-accent hover:text-primary underline font-medium transition-colors"
          >
            Ver todos los beneficios del Plan Anual 2026 →
          </a>
        </div>
      </div>
    </section>
  );
};

export { PlanesAnualesPromo };
