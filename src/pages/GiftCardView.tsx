import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Gift, Calendar, Download, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";

interface GiftCardData {
  codes: {
    code: string;
    is_used: boolean;
    expires_at: string;
    used_at?: string | null;
    used_by_name?: string | null;
    used_for_date?: string | null;
  }[];
  packageName: string;
  buyerName: string;
  sessionsQuantity: number;
  validityDays: number;
  expiresAt: string;
  applicableServices: string[];
}

export default function GiftCardView() {
  const { token } = useParams<{ token: string }>();
  const [giftCardData, setGiftCardData] = useState<GiftCardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!token) return;

    const loadGiftCardData = async () => {
      try {
        const { data, error: fetchError } = await supabase.functions.invoke("get-giftcard-data", {
          body: { token },
        });

        if (fetchError) throw fetchError;

        if (data.error) {
          setError(data.error);
          return;
        }

        setGiftCardData({
          codes: data.codes,
          packageName: data.packageName,
          buyerName: data.buyerName,
          sessionsQuantity: data.sessionsQuantity,
          validityDays: data.validityDays,
          expiresAt: data.expiresAt,
          applicableServices: data.applicableServices,
        });
      } catch (error) {
        console.error("Error loading gift card:", error);
        setError("Error al cargar la Gift Card");
      } finally {
        setIsLoading(false);
      }
    };

    loadGiftCardData();
  }, [token]);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success("Código copiado");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      toast.error("Error al copiar");
    }
  };

  const downloadPDF = async () => {
    if (!token || !giftCardData) return;

    setIsDownloading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-giftcard-pdf", {
        body: { token },
      });

      if (error) throw error;

      // Convert base64 to blob and download
      const byteCharacters = atob(data.pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `GiftCard-StudioLaNave-${giftCardData.packageName.replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("PDF descargado");
    } catch (error: any) {
      console.error("Error downloading PDF:", error);
      toast.error("Error al descargar el PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-CL", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </main>
    );
  }

  if (error || !giftCardData) {
    return (
      <>
        <main className="min-h-screen pt-24 pb-16 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <Gift className="h-8 w-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Gift Card no encontrada</h1>
            <p className="text-muted-foreground mb-6">
              {error || "El link de la Gift Card no es válido o ha expirado."}
            </p>
            <Link to="/giftcards">
              <Button>Ver Gift Cards disponibles</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const availableCodes = giftCardData.codes.filter(c => !c.is_used);
  const usedCodes = giftCardData.codes.filter(c => c.is_used);

  return (
    <>
      <Helmet>
        <title>Tu Gift Card - Studio La Nave</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-4">
              <Gift className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">🎁 Gift Card</h1>
            <p className="text-lg text-muted-foreground">{giftCardData.packageName}</p>
          </div>

          {/* Main Card */}
          <Card className="p-6 md:p-8 mb-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div>
                <p className="text-sm text-muted-foreground">De parte de</p>
                <p className="font-semibold">{giftCardData.buyerName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Válido hasta</p>
                <p className="font-semibold">{formatDate(giftCardData.expiresAt)}</p>
              </div>
            </div>

            {/* Session Codes */}
            <div className="mb-6">
              <div className="mb-4">
                <h2 className="font-semibold mb-3">Códigos de sesión</h2>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold">{giftCardData.codes.length}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10 text-center">
                    <p className="text-2xl font-bold text-primary">{availableCodes.length}</p>
                    <p className="text-xs text-muted-foreground">Disponibles</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 text-center">
                    <p className="text-2xl font-bold text-muted-foreground">{usedCodes.length}</p>
                    <p className="text-xs text-muted-foreground">Usados</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {availableCodes.map((codeData) => (
                  <div
                    key={codeData.code}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border-2 border-dashed border-primary/30"
                  >
                    <code className="text-lg md:text-xl font-mono font-bold tracking-wider">
                      {codeData.code}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCode(codeData.code)}
                    >
                      {copiedCode === codeData.code ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}

                {usedCodes.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Códigos canjeados ({usedCodes.length})
                    </p>
                    <div className="space-y-2">
                      {usedCodes.map((codeData) => (
                        <div
                          key={codeData.code}
                          className="p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <code className="text-sm font-mono line-through opacity-70">
                              {codeData.code}
                            </code>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              Usado
                            </span>
                          </div>
                          {(codeData.used_by_name || codeData.used_for_date || codeData.used_at) && (
                            <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                              {codeData.used_by_name && (
                                <p>Reservado por: <span className="font-medium text-foreground/80">{codeData.used_by_name}</span></p>
                              )}
                              {codeData.used_for_date && (
                                <p>Clase: {new Date(codeData.used_for_date).toLocaleString("es-CL", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                              )}
                              {codeData.used_at && !codeData.used_for_date && (
                                <p>Canjeado: {formatDate(codeData.used_at)}</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground/80 mt-3 italic">
                      Si compartiste algún código, también aparecerá aquí cuando sea canjeado.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Services */}
            {giftCardData.applicableServices.length > 0 && (
              <div className="mb-6 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm font-medium mb-2">Válido para:</p>
                <p className="text-sm text-muted-foreground">
                  {giftCardData.applicableServices.join(" • ")}
                </p>
              </div>
            )}

            {/* Download PDF */}
            <Button
              onClick={downloadPDF}
              disabled={isDownloading}
              className="w-full"
              size="lg"
              variant="outline"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Generando PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Gift Card en PDF
                </>
              )}
            </Button>
          </Card>

          {/* Instructions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">¿Cómo usar tus códigos?</h3>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
                <span>Ve a la página de reservas de Studio La Nave</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                <span>Selecciona el profesional, fecha y hora que prefieras</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
                <span>Ingresa uno de tus códigos en el campo correspondiente</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">4</span>
                <span>¡Tu sesión quedará confirmada sin costo adicional!</span>
              </li>
            </ol>

            <Link to="/agenda-nave-studio" className="block mt-6">
              <Button className="w-full" size="lg">
                <Calendar className="h-4 w-4 mr-2" />
                Ir a reservar
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>
      </main>

      <Footer />
    </>
  );
}
