import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Mail, Send, RefreshCw } from "lucide-react";

interface PreviewResult {
  subject: string;
  week: number;
  weekKey: string;
  phrase: { quote: string; support: string };
  classesCount: number;
  html: string;
}

interface LogRow {
  id: string;
  email: string;
  buyer_name: string | null;
  week_key: string;
  remaining: number | null;
  status: string;
  subject: string | null;
  error_message: string | null;
  sent_at: string;
}

export default function AdminWeeklyReminder() {
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [forceWeek, setForceWeek] = useState<string>("");
  const [remaining, setRemaining] = useState<string>("3");
  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [runningNow, setRunningNow] = useState(false);
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [optoutCount, setOptoutCount] = useState<number>(0);

  const loadLogs = async () => {
    const [{ data: logRows }, { count }] = await Promise.all([
      supabase
        .from("weekly_reminder_logs")
        .select("*")
        .order("sent_at", { ascending: false })
        .limit(100),
      supabase
        .from("email_optouts")
        .select("*", { count: "exact", head: true })
        .not("opted_out_at", "is", null),
    ]);
    setLogs((logRows || []) as LogRow[]);
    setOptoutCount(count || 0);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const generatePreview = async () => {
    setLoadingPreview(true);
    setPreview(null);
    try {
      const body: Record<string, unknown> = {
        dryRun: true,
        previewRemaining: Number(remaining) || 3,
      };
      if (forceWeek.trim()) body.forceWeek = Number(forceWeek);
      const { data, error } = await supabase.functions.invoke(
        "send-weekly-package-reminder",
        { body },
      );
      if (error) throw error;
      if (!data?.html) throw new Error(data?.error || "No se pudo generar el preview");
      setPreview(data as PreviewResult);
    } catch (e: any) {
      toast.error(e?.message || "Error al generar preview");
    } finally {
      setLoadingPreview(false);
    }
  };

  const sendTest = async () => {
    if (!testEmail.includes("@")) {
      toast.error("Ingresa un email válido");
      return;
    }
    setSendingTest(true);
    try {
      const body: Record<string, unknown> = { previewEmail: testEmail.trim() };
      if (forceWeek.trim()) body.forceWeek = Number(forceWeek);
      const { data, error } = await supabase.functions.invoke(
        "send-weekly-package-reminder",
        { body },
      );
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Falló el envío");
      toast.success(`Email de prueba enviado a ${testEmail}`);
    } catch (e: any) {
      toast.error(e?.message || "Error al enviar prueba");
    } finally {
      setSendingTest(false);
    }
  };

  const runNow = async () => {
    if (
      !confirm(
        "¿Enviar ahora el recordatorio semanal a todas las personas con sesiones sin usar? (no se reenvía a quienes ya lo recibieron esta semana)",
      )
    )
      return;
    setRunningNow(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "send-weekly-package-reminder",
        { body: {} },
      );
      if (error) throw error;
      toast.success(`Enviados: ${data?.sent ?? 0} de ${data?.total ?? 0}`);
      loadLogs();
    } catch (e: any) {
      toast.error(e?.message || "Error al ejecutar el envío");
    } finally {
      setRunningNow(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Recordatorio semanal · Paquetes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Se envía automáticamente todos los domingos a las 18:00 (Chile) a quienes tienen
          sesiones pagadas sin usar. Cada semana rota la frase de poder y el asunto, e incluye
          los horarios de Criomedicina y Yoga.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Preview y pruebas</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div>
            <Label>Semana (opcional)</Label>
            <Input
              type="number"
              placeholder="Semana actual"
              value={forceWeek}
              onChange={(e) => setForceWeek(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Cambia la frase/asunto para ver otras variantes.
            </p>
          </div>
          <div>
            <Label>Sesiones restantes</Label>
            <Input
              type="number"
              value={remaining}
              onChange={(e) => setRemaining(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Enviar prueba a</Label>
            <div className="flex gap-2">
              <Input
                placeholder="tu@email.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
              <Button variant="outline" onClick={sendTest} disabled={sendingTest}>
                {sendingTest ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-wrap items-center gap-3">
            <Button onClick={generatePreview} disabled={loadingPreview}>
              {loadingPreview && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <Mail className="h-4 w-4 mr-2" />
              Generar preview
            </Button>
            <Button variant="secondary" onClick={runNow} disabled={runningNow}>
              {runningNow && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Enviar ahora a todos
            </Button>
            <Button variant="ghost" onClick={loadLogs}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refrescar
            </Button>
            <Badge variant="outline">Bajas: {optoutCount}</Badge>
          </div>
        </CardContent>
      </Card>

      {preview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {preview.subject}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Semana {preview.week} ({preview.weekKey}) · {preview.classesCount} clases en el
              horario · “{preview.phrase.quote}”
            </p>
          </CardHeader>
          <CardContent>
            <iframe
              title="Preview recordatorio semanal"
              srcDoc={preview.html}
              className="w-full rounded border bg-white"
              style={{ height: 900 }}
              sandbox=""
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimos envíos</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no hay envíos registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 pr-4">Fecha</th>
                    <th className="py-2 pr-4">Semana</th>
                    <th className="py-2 pr-4">Persona</th>
                    <th className="py-2 pr-4">Sesiones</th>
                    <th className="py-2 pr-4">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l) => (
                    <tr key={l.id} className="border-b last:border-0">
                      <td className="py-2 pr-4 whitespace-nowrap">
                        {new Date(l.sent_at).toLocaleString("es-CL")}
                      </td>
                      <td className="py-2 pr-4">{l.week_key}</td>
                      <td className="py-2 pr-4">
                        {l.buyer_name || "—"}
                        <span className="block text-xs text-muted-foreground">{l.email}</span>
                      </td>
                      <td className="py-2 pr-4">{l.remaining ?? "—"}</td>
                      <td className="py-2 pr-4">
                        <Badge variant={l.status === "sent" ? "default" : "destructive"}>
                          {l.status}
                        </Badge>
                        {l.error_message && (
                          <span className="block text-xs text-destructive">
                            {l.error_message}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
