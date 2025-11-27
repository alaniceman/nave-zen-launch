import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/blog-protocolo-seguro-hero.jpg";

export default function BlogProtocoloSeguro() {
  return (
    <>
      <Helmet>
        <title>Protocolo Seguro: Agua Fría y Respiración para Principiantes | Nave Studio</title>
        <meta
          name="description"
          content="Lo que nadie te cuenta del agua fría y la respiración. Aprende el protocolo seguro para iniciar con el método Wim Hof sin traumas ni forzar nada."
        />
        <meta property="og:title" content="Protocolo Seguro: Agua Fría y Respiración para Principiantes | Nave Studio" />
        <meta
          property="og:description"
          content="Lo que nadie te cuenta del agua fría y la respiración. Aprende el protocolo seguro para iniciar con el método Wim Hof sin traumas ni forzar nada."
        />
        <meta property="og:type" content="article" />
      </Helmet>

      <article className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative h-[60vh] overflow-hidden">
          <img
            src={heroImage}
            alt="Protocolo seguro de agua fría y respiración"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
                Lo que nadie te cuenta del agua fría y la respiración
              </h1>
              <p className="text-xl text-muted-foreground">
                El protocolo seguro para iniciar sin traumas
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container max-w-4xl mx-auto px-4 py-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-foreground leading-relaxed mb-8">
              🧊🌀 Lo que nadie te cuenta del agua fría y la respiración…
            </p>

            <p className="text-lg text-foreground leading-relaxed mb-6">
              Muchos ven videos de Wim Hof, se inspiran y…
              <br />
              al día siguiente están con los pies en una tina helada, hiperventilando sin guía.
            </p>

            <p className="text-lg text-foreground leading-relaxed mb-6">
              Pero lo que no te dicen es que hay un protocolo real para iniciar.
            </p>

            <p className="text-lg text-foreground leading-relaxed mb-8">
              Especialmente si:
            </p>

            <ul className="list-disc pl-6 mb-8 space-y-2 text-lg text-foreground">
              <li>Nunca has hecho respiraciones activas</li>
              <li>Estás en un momento emocionalmente sensible</li>
              <li>Tienes ansiedad o miedos físicos</li>
            </ul>

            <p className="text-xl font-semibold text-foreground mb-8">
              👇 Aquí va un marco básico seguro (pero no completo):
            </p>

            <div className="border-l-4 border-primary pl-6 my-12 space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  🔹 Fase 1: Prepara tu cuerpo
                </h3>
                <p className="text-lg text-foreground leading-relaxed">
                  Respira suave, nasal, y entra en presencia primero. No vayas directo a forzar.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  🔹 Fase 2: Respiración guiada (3 rondas Wim Hof)
                </h3>
                <p className="text-lg text-foreground leading-relaxed">
                  Inhala profundo (sin tensión), exhala sin vaciar. Repite 30 veces, luego retén sin aire.
                  <br />
                  Escucha tu cuerpo. Si mareas o fuerzas: detente.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  🔹 Fase 3: Inmersión gradual
                </h3>
                <p className="text-lg text-foreground leading-relaxed">
                  Agua fría ≠ tortura. Empieza con manos y pies.
                  <br />
                  Luego cara. Luego ducha. Recién ahí, un minuto en cuerpo completo.
                </p>
              </div>
            </div>

            <div className="my-12 p-8 bg-muted/50 rounded-xl border">
              <p className="text-lg text-foreground leading-relaxed mb-4">
                Pero este es solo el marco externo.
                <br />
                Lo más profundo no es el agua ni el aire…
                <br />
                es lo que desbloqueas dentro cuando sigues un protocolo diseñado para tu energía.
              </p>
            </div>

            <div className="my-12 p-8 bg-primary/10 rounded-xl border-2 border-primary">
              <p className="text-xl font-bold text-foreground mb-6">
                🛸 En NAVE Studio te comparto el protocolo que uso para iniciar a decenas de personas con agua fría + respiración, sin traumas ni forzar nada.
              </p>
              <Link to="/agenda-nave-studio">
                <Button size="lg" className="w-full md:w-auto text-lg px-8 py-6">
                  Agenda tu primera sesión del método Wim Hof
                </Button>
              </Link>
            </div>

            {/* Back to Blog */}
            <div className="mt-16 pt-8 border-t">
              <Link to="/blog">
                <Button variant="outline" size="lg">
                  ← Volver al Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
