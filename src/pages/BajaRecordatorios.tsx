import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Helmet } from "react-helmet-async";

type State = "loading" | "done" | "invalid" | "error";

const BajaRecordatorios = () => {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState<State>("loading");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setState("invalid");
        return;
      }
      const { data, error } = await supabase.functions.invoke("weekly-reminder-optout", {
        body: { token },
      });
      if (error) {
        setState("error");
        return;
      }
      if (data?.success) {
        setEmail(data.email ?? null);
        setState("done");
      } else {
        setState("invalid");
      }
    };
    run();
  }, [token]);

  return (
    <>
      <SEOHead
        title="Preferencias de correo | Nave Studio"
        description="Administra tus recordatorios semanales de Nave Studio."
        noindex
      />
      <main className="min-h-screen flex items-center justify-center bg-background px-6 py-24">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          {state === "loading" && (
            <>
              <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Procesando tu solicitud…</p>
            </>
          )}

          {state === "done" && (
            <>
              <CheckCircle2 className="mx-auto mb-4 h-10 w-10 text-primary" />
              <h1 className="mb-3 text-2xl font-bold text-foreground">Listo, te dimos de baja</h1>
              <p className="text-muted-foreground">
                {email ? `${email} ya no recibirá` : "Ya no recibirás"} los recordatorios semanales de
                sesiones. Tus sesiones y códigos siguen activos y puedes agendar cuando quieras.
              </p>
              <Button asChild className="mt-6 w-full">
                <Link to="/agenda-nave-studio">Ir a la agenda</Link>
              </Button>
            </>
          )}

          {(state === "invalid" || state === "error") && (
            <>
              <XCircle className="mx-auto mb-4 h-10 w-10 text-destructive" />
              <h1 className="mb-3 text-2xl font-bold text-foreground">No pudimos procesar el enlace</h1>
              <p className="text-muted-foreground">
                El enlace no es válido o expiró. Escríbenos por WhatsApp y lo gestionamos manualmente.
              </p>
              <Button asChild variant="outline" className="mt-6 w-full">
                <a href="https://wa.me/56946120426" target="_blank" rel="noopener noreferrer">
                  Escribir por WhatsApp
                </a>
              </Button>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default BajaRecordatorios;
