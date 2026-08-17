import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type OAuthResult = { redirect_url?: string; redirect_to?: string; client?: { name?: string } | null } & Record<
  string,
  unknown
>;

type OAuthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<{ data: OAuthResult | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: OAuthResult | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: OAuthResult | null; error: { message: string } | null }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthNamespace }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<OAuthResult | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [scopes, setScopes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Falta el parámetro authorization_id.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      setEmail(sess.session.user.email ?? null);

      const { data, error: detailsError } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (detailsError) {
        setError(detailsError.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      const rawScope = (data as { scope?: string; scopes?: string[] } | null)?.scope;
      const rawScopes = (data as { scopes?: string[] } | null)?.scopes;
      setScopes(rawScopes ?? (rawScope ? rawScope.split(" ").filter(Boolean) : []));
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error: decideError } = approve
      ? await oauth().approveAuthorization(authorizationId)
      : await oauth().denyAuthorization(authorizationId);
    if (decideError) {
      setBusy(false);
      setError(decideError.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("El servidor de autorización no devolvió una URL de redirección.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "la aplicación";

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-24">
      <Card className="w-full max-w-md">
        {error ? (
          <>
            <CardHeader>
              <CardTitle>No pudimos cargar esta autorización</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </CardContent>
          </>
        ) : !details ? (
          <CardContent className="flex items-center gap-3 py-10">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-muted-foreground">Cargando…</span>
          </CardContent>
        ) : (
          <>
            <CardHeader>
              <CardTitle>Conectar {clientName} a Nave Studio</CardTitle>
              <CardDescription>
                {clientName} podrá usar las herramientas habilitadas de Nave Studio actuando como tu cuenta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {email && (
                <p className="text-sm text-muted-foreground">
                  Cuenta conectada: <span className="text-foreground font-medium">{email}</span>
                </p>
              )}
              {scopes.length > 0 && (
                <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                  {scopes.map((scope) => (
                    <li key={scope}>
                      {scope === "openid" || scope === "profile"
                        ? "Compartir tu perfil básico"
                        : scope === "email"
                          ? "Compartir tu dirección de email"
                          : `Permiso adicional solicitado: ${scope}`}
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-muted-foreground">
                Esto no omite los permisos ni las políticas de seguridad de Nave Studio.
              </p>
              <div className="flex gap-3 pt-2">
                <Button disabled={busy} onClick={() => decide(true)} className="flex-1">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aprobar"}
                </Button>
                <Button disabled={busy} variant="secondary" onClick={() => decide(false)} className="flex-1">
                  Cancelar conexión
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </main>
  );
}
