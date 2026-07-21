import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Lead {
  id: string;
  customer_name: string;
  customer_email: string;
  plan_type: string | null;
  actual_start_date: string | null;
  actual_end_date: string | null;
  status: string | null;
}

interface PreviewResult {
  subject: string;
  dayNumber: number;
  totalDays: number;
  tomorrowISO: string;
  dateLabel: string;
  remainingDays: number;
  classes: Array<{ title: string; time: string; instructor: string | null }>;
  showCredentials: boolean;
  html: string;
}

// Add N days to a YYYY-MM-DD string.
function addDaysISO(iso: string, days: number): string {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function AdminEmailPreview() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [overrideDuration, setOverrideDuration] = useState<"auto" | "7" | "15">(
    "auto",
  );
  const [dayNumber, setDayNumber] = useState<number>(1);
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [sendTo, setSendTo] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("trial_bookings")
        .select(
          "id, customer_name, customer_email, plan_type, actual_start_date, actual_end_date, status",
        )
        .not("actual_start_date", "is", null)
        .order("actual_start_date", { ascending: false })
        .limit(200);
      if (error) {
        toast.error("No se pudieron cargar los leads");
      } else {
        setLeads(data || []);
      }
      setLoadingLeads(false);
    })();
  }, []);

  const selectedLead = useMemo(
    () => leads.find((l) => l.id === selectedLeadId) || null,
    [leads, selectedLeadId],
  );

  const totalDays = useMemo(() => {
    if (overrideDuration === "7") return 7;
    if (overrideDuration === "15") return 15;
    return selectedLead?.plan_type === "trial_15d" ? 15 : 7;
  }, [overrideDuration, selectedLead]);

  useEffect(() => {
    if (dayNumber > totalDays) setDayNumber(totalDays);
    if (dayNumber < 1) setDayNumber(1);
  }, [totalDays, dayNumber]);

  const generatePreview = async () => {
    if (!selectedLead) {
      toast.error("Selecciona un lead");
      return;
    }
    if (!selectedLead.actual_start_date) {
      toast.error("El lead no tiene fecha de inicio activa");
      return;
    }
    setLoadingPreview(true);
    setPreview(null);
    try {
      // targetClassDate = start + (dayNumber - 1)
      const targetClassDate = addDaysISO(
        selectedLead.actual_start_date,
        dayNumber - 1,
      );

      const { data, error } = await supabase.functions.invoke(
        "send-trial-daily-reminder",
        {
          body: {
            leadId: selectedLead.id,
            targetClassDate,
            dryRun: true,
          },
        },
      );
      if (error) throw error;
      if (!data?.html) {
        throw new Error(
          data?.reason || data?.error || "No se pudo generar el preview",
        );
      }
      setPreview(data as PreviewResult);
    } catch (e: any) {
      toast.error(e?.message || "Error al generar preview");
    } finally {
      setLoadingPreview(false);
    }
  };

  const sendTestEmail = async () => {
    if (!preview) return;
    const to = sendTo.trim();
    if (!to || !/.+@.+\..+/.test(to)) {
      toast.error("Ingresa un email válido");
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "send-test-email",
        {
          body: {
            to,
            subject: `[PREVIEW] ${preview.subject}`,
            html: preview.html,
          },
        },
      );
      if (error) throw error;
      toast.success(`Correo de prueba enviado a ${to}`);
    } catch (e: any) {
      // Fallback: fetch alternative simple send is not guaranteed to exist,
      // so surface the underlying error.
      toast.error(
        e?.message ||
          "No se pudo enviar. Puedes copiar el HTML y probar manualmente.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Preview · Emails Plan de Prueba</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Previsualiza los correos diarios según duración (7 o 15 días) y día
          del plan, usando datos reales de un lead activo.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Configuración</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <Label>Lead</Label>
            <Select
              value={selectedLeadId}
              onValueChange={(v) => setSelectedLeadId(v)}
              disabled={loadingLeads}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingLeads ? "Cargando..." : "Selecciona un lead"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {leads.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.customer_name} · {l.customer_email} ·{" "}
                    {l.plan_type === "trial_15d" ? "15d" : "7d"} ·{" "}
                    {l.actual_start_date || "sin inicio"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Duración</Label>
            <Select
              value={overrideDuration}
              onValueChange={(v: any) => setOverrideDuration(v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">
                  Auto ({selectedLead?.plan_type === "trial_15d" ? "15" : "7"}{" "}
                  días)
                </SelectItem>
                <SelectItem value="7">Forzar 7 días</SelectItem>
                <SelectItem value="15">Forzar 15 días</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Forzar solo cambia el copy mostrado; usa las fechas del lead.
            </p>
          </div>

          <div>
            <Label>Día del plan (dayNumber)</Label>
            <Select
              value={String(dayNumber)}
              onValueChange={(v) => setDayNumber(Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                  <SelectItem key={d} value={String(d)}>
                    Día {d} de {totalDays}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-4 flex flex-wrap gap-3 items-end">
            <Button onClick={generatePreview} disabled={loadingPreview || !selectedLeadId}>
              {loadingPreview && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Generar preview
            </Button>
            {selectedLead && (
              <p className="text-xs text-muted-foreground">
                Plan real: {selectedLead.actual_start_date} →{" "}
                {selectedLead.actual_end_date} · estado: {selectedLead.status}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {preview && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumen</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm md:grid-cols-2">
              <div>
                <span className="text-muted-foreground">Asunto:</span>{" "}
                <strong>{preview.subject}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Día:</span>{" "}
                {preview.dayNumber} de {preview.totalDays}
              </div>
              <div>
                <span className="text-muted-foreground">Fecha clases:</span>{" "}
                {preview.tomorrowISO} · {preview.dateLabel}
              </div>
              <div>
                <span className="text-muted-foreground">Días restantes:</span>{" "}
                {preview.remainingDays}
              </div>
              <div>
                <span className="text-muted-foreground">Credenciales:</span>{" "}
                {preview.showCredentials ? "Sí" : "No"}
              </div>
              <div>
                <span className="text-muted-foreground">Clases:</span>{" "}
                {preview.classes.length}
              </div>
              {preview.classes.length > 0 && (
                <ul className="md:col-span-2 mt-1 list-disc pl-5 text-xs text-muted-foreground">
                  {preview.classes.map((c, i) => (
                    <li key={i}>
                      {c.title} · {c.time}
                      {c.instructor ? ` · ${c.instructor}` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
              <CardTitle className="text-base">Vista previa</CardTitle>
              <div className="flex items-end gap-2">
                <div>
                  <Label className="text-xs">Enviar prueba a</Label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={sendTo}
                    onChange={(e) => setSendTo(e.target.value)}
                    className="w-64"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={sendTestEmail}
                  disabled={sending}
                >
                  {sending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Enviar prueba
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <iframe
                title="Email preview"
                srcDoc={preview.html}
                className="w-full rounded border bg-white"
                style={{ height: 900 }}
                sandbox=""
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
