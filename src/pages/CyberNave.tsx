import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Loader2, Music2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/ui/floating-input";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { getMetaBrowserContext, trackMetaEventOnce } from "@/lib/metaPixel";
import heroImg from "@/assets/studio-ice-sereno.webp.asset.json";

type Status = "idle" | "loading" | "success" | "error" | "delivery_failed" | "rate_limited";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const CyberNave = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [emailError, setEmailError] = useState<string>();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    const clean = email.trim().toLowerCase();
    if (!EMAIL_RE.test(clean) || clean.length > 254) {
      setEmailError("Ingresa un correo válido");
      return;
    }
    setEmailError(undefined);
    if (!consent) return;
    setStatus("loading");
    const ctx = getMetaBrowserContext();
    const params = new URLSearchParams(window.location.search);
    const { data, error } = await supabase.functions.invoke("cyber-nave-subscribe", {
      body: {
        name: name.trim().slice(0, 80),
        email: clean,
        consent: true,
        website,
        utm_source: params.get("utm_source") ?? undefined,
        utm_medium: params.get("utm_medium") ?? undefined,
        utm_campaign: params.get("utm_campaign") ?? undefined,
        fbp: ctx.fbp,
        fbc: ctx.fbc,
        eventSourceUrl: window.location.href,
      },
    });
    let payload = data as { ok?: boolean; status?: string; error?: string; leadEventId?: string } | null;
    if (error && "context" in error) {
      try { payload = await (error as { context: Response }).context.json(); } catch { /* noop */ }
    }
    if (payload?.leadEventId) {
      trackMetaEventOnce(payload.leadEventId, "Lead", { content_name: "Cyber Nave · Regalo musical", content_category: "cyber" }, payload.leadEventId);
    }
    if (payload?.ok && payload.status === "sent") setStatus("success");
    else if (payload?.status === "delivery_failed") setStatus("delivery_failed");
    else if (payload?.error === "rate_limited") setStatus("rate_limited");
    else setStatus("error");
  };

  return (
    <>
      <Helmet>
        <html lang="es-CL" />
        <title>Adelántate al Cyber · Regalo musical | Nave Studio</title>
        <meta name="description" content="Súmate a las novedades del Cyber de Nave Studio y recibe por correo una grabación musical de 7 minutos creada por Alan Earle." />
        <link rel="canonical" href="https://studiolanave.com/cyber-nave" />
        <meta property="og:title" content="Adelántate al Cyber. Tu regalo empieza ahora." />
        <meta property="og:description" content="Recibe por correo una grabación musical de 7 minutos creada por Alan Earle." />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="min-h-screen bg-primary text-primary-foreground">
        <section className="container mx-auto px-5 py-10 md:py-20 grid gap-10 md:grid-cols-2 md:items-center max-w-6xl">
          <div className="order-2 md:order-1">
            <p className="text-xs uppercase tracking-[0.25em] opacity-80 mb-4">Nave Studio · Cyber</p>
            <h1 className="font-heading text-4xl md:text-5xl leading-tight mb-5">
              Adelántate al Cyber. Tu regalo empieza ahora.
            </h1>
            <p className="text-lg opacity-90 mb-8 leading-relaxed">
              Súmate a las novedades del Cyber de Nave Studio y recibe por correo una grabación musical de 7 minutos
              creada por Alan Earle para acompañar la preparación, la inmersión en agua fría y la recuperación.
            </p>

            <div className="rounded-2xl bg-background text-foreground p-5 md:p-7 shadow-xl">
              {status === "success" ? (
                <div className="text-center py-6" role="status" aria-live="polite">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-primary mb-3" />
                  <h2 className="font-heading text-2xl text-primary mb-2">¡Listo! Revisa tu correo</h2>
                  <p className="text-muted-foreground">
                    Te enviamos tu grabación. Si no la ves en unos minutos, revisa promociones o spam.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="space-y-4">
                  <FloatingInput label="Nombre (opcional)" value={name} maxLength={80}
                    autoComplete="given-name" onChange={(e) => setName(e.target.value)} />
                  <FloatingInput label="Email" type="email" inputMode="email" autoComplete="email" required
                    value={email} maxLength={254} error={emailError} onChange={(e) => setEmail(e.target.value)} />
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                    value={website} onChange={(e) => setWebsite(e.target.value)}
                    className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                  <label className="flex items-start gap-3 text-sm leading-snug cursor-pointer">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 accent-primary" />
                    <span>
                      Acepto recibir el regalo y las novedades de Nave Studio por correo. Puedo darme de baja cuando quiera.
                      Ver <Link to="/privacidad" className="underline text-primary">política de privacidad</Link>.
                    </span>
                  </label>
                  {status === "delivery_failed" && (
                    <p className="text-sm text-destructive" role="alert">
                      Guardamos tu inscripción, pero no pudimos enviar el correo. Intenta de nuevo en unos minutos.
                    </p>
                  )}
                  {status === "rate_limited" && (
                    <p className="text-sm text-destructive" role="alert">Demasiados intentos. Prueba más tarde.</p>
                  )}
                  {status === "error" && (
                    <p className="text-sm text-destructive" role="alert">Algo falló. Revisa tus datos e intenta de nuevo.</p>
                  )}
                  <Button type="submit" size="lg" className="w-full h-14 text-base"
                    disabled={!consent || !email || status === "loading"}>
                    {status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> :
                      status === "delivery_failed" ? "Reintentar envío" : "Quiero mi regalo"}
                  </Button>
                </form>
              )}
              <p className="mt-5 text-xs text-muted-foreground leading-relaxed flex gap-2">
                <Music2 className="w-4 h-4 shrink-0 mt-0.5" />
                Los 7 minutos corresponden a la experiencia completa, no al tiempo dentro del agua. Adapta la inmersión
                a tu experiencia y a la indicación de tu instructor.
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <img src={heroImg.url} alt="Persona en calma durante una inmersión en agua fría en Nave Studio"
              className="w-full aspect-[4/5] md:aspect-[4/5] max-h-[60vh] md:max-h-none object-cover rounded-2xl" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CyberNave;
