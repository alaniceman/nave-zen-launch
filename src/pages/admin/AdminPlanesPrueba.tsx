import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format, parseISO, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { RefreshCw, ExternalLink, MessageCircle, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export type Lead = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  plan_type: string | null;
  requested_start_date: string | null;
  actual_start_date: string | null;
  actual_end_date: string | null;
  status: string;
  created_at: string;
  paid_at: string | null;
  utm_source: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  interesado_plan_prueba: "Interesado",
  redirigido_a_boxmagic: "Redirigido a BoxMagic",
  pagado_plan_prueba: "Pagado",
  plan_prueba_activo: "Activo",
  plan_prueba_finalizado: "Finalizado",
  convertido_a_membresia: "Convertido",
};

const STATUS_COLORS: Record<string, string> = {
  interesado_plan_prueba: "bg-blue-100 text-blue-800",
  redirigido_a_boxmagic: "bg-amber-100 text-amber-800",
  pagado_plan_prueba: "bg-green-100 text-green-800",
  plan_prueba_activo: "bg-emerald-100 text-emerald-800",
  plan_prueba_finalizado: "bg-gray-100 text-gray-800",
  convertido_a_membresia: "bg-purple-100 text-purple-800",
};

const PLAN_LABELS: Record<string, string> = {
  trial_7d: "7 días",
  trial_15d: "15 días",
};

export default function AdminPlanesPrueba() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paidModalLead, setPaidModalLead] = useState<Lead | null>(null);
  const navigate = useNavigate();

  const fetch = async () => {
    setLoading(true);
    let q = supabase
      .from("trial_bookings")
      .select("*")
      .in("plan_type", ["trial_7d", "trial_15d"])
      .order("created_at", { ascending: false });
    if (statusFilter !== "all") q = q.eq("status", statusFilter);
    const { data, error } = await q.limit(200);
    if (error) toast.error("Error cargando leads");
    else setLeads((data as any) || []);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
    // also include leads where status starts with 'interesado_plan_prueba' but no plan yet
    (async () => {
      const { data } = await supabase
        .from("trial_bookings")
        .select("*")
        .eq("status", "interesado_plan_prueba")
        .is("plan_type", null)
        .order("created_at", { ascending: false })
        .limit(100);
      if (data && data.length) {
        setLeads((prev) => {
          const ids = new Set(prev.map((l) => l.id));
          const fresh = (data as any[]).filter((d) => !ids.has(d.id));
          return [...fresh, ...prev];
        });
      }
    })();
  }, [statusFilter]);

  const filtered = leads.filter((l) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      l.customer_name?.toLowerCase().includes(s) ||
      l.customer_email?.toLowerCase().includes(s) ||
      l.customer_phone?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Planes de Prueba</h1>
        <Button variant="outline" size="sm" onClick={fetch}>
          <RefreshCw className="h-4 w-4 mr-2" />Actualizar
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Buscar por nombre, email o teléfono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Fecha solicitada</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Cargando...</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Sin leads</TableCell></TableRow>
              ) : filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.customer_name}</TableCell>
                  <TableCell className="text-sm">{l.customer_email}</TableCell>
                  <TableCell className="text-sm">
                    {l.customer_phone && (
                      <a
                        className="text-[#2E4D3A] hover:underline inline-flex items-center gap-1"
                        href={`https://wa.me/${l.customer_phone.replace(/[^0-9]/g, "")}`}
                        target="_blank" rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-3 w-3" />{l.customer_phone}
                      </a>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{l.plan_type ? PLAN_LABELS[l.plan_type] || l.plan_type : "-"}</TableCell>
                  <TableCell className="text-sm">
                    {l.requested_start_date
                      ? format(parseISO(l.requested_start_date), "dd MMM yyyy", { locale: es })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[l.status] || "bg-gray-100 text-gray-800"}>
                      {STATUS_LABELS[l.status] || l.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(parseISO(l.created_at), "dd/MM HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={async () => {
                          const { data, error } = await supabase
                            .from("customers")
                            .select("id")
                            .eq("email", l.customer_email.toLowerCase().trim())
                            .maybeSingle();
                          if (error || !data) {
                            toast.error("Cliente no encontrado en CRM");
                            return;
                          }
                          navigate(`/admin/clientes/${data.id}`);
                        }}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />Ver
                      </Button>
                      {l.status !== "plan_prueba_activo" && l.status !== "plan_prueba_finalizado" && (
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-[#2E4D3A] hover:bg-[#2E4D3A]/90 text-white"
                          onClick={() => setPaidModalLead(l)}
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />Marcar pagado
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <MarkPaidModal
        lead={paidModalLead}
        onClose={() => setPaidModalLead(null)}
        onSuccess={() => { setPaidModalLead(null); fetch(); }}
      />
    </div>
  );
}

export function MarkPaidModal({ lead, onClose, onSuccess }: { lead: Lead | null; onClose: () => void; onSuccess: () => void }) {
  const [plan, setPlan] = useState<"trial_7d" | "trial_15d">("trial_7d");
  const [start, setStart] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (lead) {
      setPlan((lead.plan_type as any) || "trial_7d");
      setStart(lead.requested_start_date || format(new Date(), "yyyy-MM-dd"));
      setNotes("");
    }
  }, [lead]);

  const days = plan === "trial_7d" ? 7 : 15;
  const endDate = start ? format(addDays(parseISO(start), days), "yyyy-MM-dd") : "";

  const submit = async () => {
    if (!lead || !start) return;
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("trial_bookings")
        .update({
          plan_type: plan,
          actual_start_date: start,
          actual_end_date: endDate,
          paid_at: new Date().toISOString(),
          paid_marked_by: user?.id || null,
          admin_notes: notes || null,
          status: "plan_prueba_activo",
        })
        .eq("id", lead.id);
      if (error) throw error;

      // CRM event
      const { data: customer } = await supabase
        .from("customers").select("id").eq("email", lead.customer_email.toLowerCase()).single();
      if (customer) {
        await supabase.from("customer_events").insert({
          customer_id: customer.id,
          event_type: "plan_prueba_paid",
          title: "Plan de prueba activado",
          description: `${plan === "trial_7d" ? "7" : "15"} días · ${start} → ${endDate}`,
          metadata: { lead_id: lead.id, plan_type: plan, start, end: endDate, notes },
        });
      }

      // Send activation email (non-blocking on UI feedback)
      supabase.functions.invoke("send-plan-prueba-activo", { body: { leadId: lead.id } })
        .catch(() => toast.warning("Lead actualizado pero el email no se pudo enviar"));

      toast.success("Plan marcado como pagado y email enviado");
      onSuccess();
    } catch (e: any) {
      toast.error(e.message || "Error al marcar como pagado");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={!!lead} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Marcar plan de prueba como pagado</DialogTitle>
          <DialogDescription>
            {lead?.customer_name} — {lead?.customer_email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <label className="text-sm font-medium block mb-1">Plan</label>
            <Select value={plan} onValueChange={(v) => setPlan(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="trial_7d">7 días</SelectItem>
                <SelectItem value="trial_15d">15 días</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Fecha de inicio real</label>
            <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Fecha de término (auto)</label>
            <Input value={endDate} readOnly className="bg-muted" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Notas internas (opcional)</label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <Button
            onClick={submit}
            disabled={submitting || !start}
            className="w-full bg-[#2E4D3A] hover:bg-[#2E4D3A]/90 text-white"
          >
            {submitting ? "Guardando..." : "Marcar como pagado y enviar email"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
