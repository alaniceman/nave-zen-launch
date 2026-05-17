import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Loader2, Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

type Landing = {
  hero: { eyebrow: string; title: string; subtitle: string };
  pills: string[];
  benefits: { icon: string; title: string; body: string }[];
  recommendation: {
    type: string;
    title: string;
    reason: string;
    ctaLabel: string;
    ctaHref: string;
  };
  social: { quote: string; author: string };
  closing: { title: string; ctaLabel: string; ctaHref: string };
};

const EXAMPLES = [
  "Soy corredor, busco recuperarme mejor",
  "Tengo ansiedad y duermo mal",
  "Quiero regalarle algo único a mi pareja",
  "Nunca he hecho ice bath, me da miedo el frío",
  "Hago yoga hace años, quiero algo nuevo",
];

const Generative = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [landing, setLanding] = useState<Landing | null>(null);
  const [lastInput, setLastInput] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (landing && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [landing]);

  const generate = async (text: string) => {
    const value = text.trim();
    if (value.length < 2) return;
    setLoading(true);
    setLanding(null);
    setLastInput(value);
    try {
      const { data, error } = await supabase.functions.invoke("generate-landing", {
        body: { userInput: value },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.landing) throw new Error("Respuesta vacía");
      setLanding(data.landing as Landing);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "No pudimos generar tu landing. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generate(input);
  };

  return (
    <>
      <Helmet>
        <title>Nave Studio Generativa | Tu landing personalizada por IA</title>
        <meta
          name="description"
          content="Cuéntanos qué buscas y la IA de Nave Studio te genera una landing personalizada con Ice Bath, Método Wim Hof y Yoga."
        />
        <meta name="robots" content="noindex,follow" />
        <link rel="canonical" href="https://studiolanave.com/generative" />
      </Helmet>

      <main className="min-h-screen bg-background text-foreground">
        {/* HERO INPUT */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
          {/* ambient gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
          </div>

          <div className="w-full max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/50 backdrop-blur-sm text-xs uppercase tracking-wider text-muted-foreground mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Nave Studio Generativa · IA
            </div>

            <h1 className="text-4xl md:text-6xl font-light leading-tight tracking-tight mb-4">
              Una landing,{" "}
              <span className="italic font-serif text-primary">solo para ti.</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Cuéntanos quién eres o qué buscas. La IA arma esta página
              específicamente para ti, con el Método Wim Hof, Ice Bath y Yoga de
              Nave Studio.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ej: soy corredor con ansiedad, busco dormir mejor y recuperarme..."
                  className="min-h-[120px] text-base md:text-lg p-5 rounded-2xl border-2 border-border bg-card/80 backdrop-blur focus-visible:ring-primary resize-none"
                  disabled={loading}
                  maxLength={500}
                />
                <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                  {input.length}/500
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading || input.trim().length < 2}
                className="w-full md:w-auto px-10 rounded-full text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generando tu landing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Personalizar para mí
                  </>
                )}
              </Button>
            </form>

            {!loading && !landing && (
              <div className="mt-10">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  O prueba con
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => {
                        setInput(ex);
                        generate(ex);
                      }}
                      className="px-3 py-1.5 rounded-full text-xs md:text-sm border border-border bg-card/50 hover:bg-card hover:border-primary/40 transition text-foreground/80"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* LOADING SKELETON */}
        {loading && (
          <section className="px-4 pb-20">
            <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
              <div className="h-12 bg-muted/40 rounded-lg w-3/4 mx-auto" />
              <div className="h-6 bg-muted/30 rounded-lg w-1/2 mx-auto" />
              <div className="grid md:grid-cols-3 gap-4 pt-8">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-40 bg-muted/30 rounded-2xl" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* GENERATED LANDING */}
        {landing && !loading && (
          <div ref={resultRef} className="animate-fade-in">
            {/* Hero personalizado */}
            <section className="px-4 py-20 md:py-28 border-t border-border">
              <div className="max-w-4xl mx-auto text-center">
                <div className="text-xs uppercase tracking-[0.2em] text-primary mb-4">
                  {landing.hero.eyebrow}
                </div>
                <h2 className="text-4xl md:text-6xl font-light leading-tight tracking-tight mb-6">
                  {landing.hero.title}
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                  {landing.hero.subtitle}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {landing.pills.map((p, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full text-xs border border-border bg-card text-foreground/80"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Benefits */}
            <section className="px-4 py-16 bg-card/30">
              <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
                {landing.benefits.map((b, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-background border border-border hover:border-primary/40 transition"
                  >
                    <div className="text-4xl mb-4">{b.icon}</div>
                    <h3 className="text-xl font-medium mb-2">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {b.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommendation */}
            <section className="px-4 py-20">
              <div className="max-w-3xl mx-auto p-8 md:p-12 rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
                <div className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
                  Recomendado para ti
                </div>
                <h3 className="text-3xl md:text-4xl font-light mb-4">
                  {landing.recommendation.title}
                </h3>
                <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                  {landing.recommendation.reason}
                </p>
                <Button asChild size="lg" className="rounded-full">
                  <Link to={landing.recommendation.ctaHref}>
                    {landing.recommendation.ctaLabel}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </section>

            {/* Social proof */}
            <section className="px-4 py-16 border-t border-border">
              <div className="max-w-2xl mx-auto text-center">
                <p className="text-xl md:text-2xl font-light italic text-foreground/90 leading-relaxed mb-4">
                  "{landing.social.quote}"
                </p>
                <p className="text-sm text-muted-foreground">
                  — {landing.social.author}
                </p>
              </div>
            </section>

            {/* Closing */}
            <section className="px-4 py-20 bg-card/30">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-3xl md:text-4xl font-light mb-8">
                  {landing.closing.title}
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <Button asChild size="lg" className="rounded-full w-full sm:w-auto">
                    <Link to={landing.closing.ctaHref}>
                      {landing.closing.ctaLabel}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full w-full sm:w-auto"
                    onClick={() => {
                      setLanding(null);
                      setInput("");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generar otra versión
                  </Button>
                </div>
                {lastInput && (
                  <p className="mt-8 text-xs text-muted-foreground">
                    Generado a partir de: <span className="italic">"{lastInput}"</span>
                  </p>
                )}
              </div>
            </section>
          </div>
        )}

        <Footer />
      </main>
    </>
  );
};

export default Generative;
