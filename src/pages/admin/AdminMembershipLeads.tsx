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
import { format, parseISO } from "date-fns";
import { RefreshCw, MessageCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Lead = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  plan_code: string | null;
  plan_label: string | null;
  plan_group: string | null;
  boxmagic_url: string | null;
  requested_start_date: string | null;
  status: string;
  paid_at: string | null;
  admin_notes: string | null;
  created_at: string;
  utm_source: string | null;
};

const STATUS_LABELS: Record<string, string> = {
  interesado_membresia: "Interesado",
  redirigido_a_boxmagic: "Redirigido",
  pagado: "Pagado",
  activo: "Activo",
  cancelado: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  interesado_membresia: "bg-blue-100 text-blue-800",
  redirigido_a_boxmagic: "bg-amber-100 text-amber-800",
  pagado: "bg-green-100 text-green-800",
  activo: "bg-emerald-100 text-emerald-800",
  cancelado: "bg-gray-100 text-gray-800",
};

export default function AdminMembershipLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paidModalLead, setPaidModalLead] = useState<Lead | null>(null);
  const navigate = useNavigate();

  const fetchLeads = async () => {
    setLoading(true);
    let q = (supabase as any)
      .from("membership_leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (statusFilter !== "all") q = q.eq("status", statusFilter);
    const { data, error } = await q.limit(300);
    if (error) toast.error("Error cargando leads de membresías");
    else setLeads((data as Lead[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, [statusFilter]);

  const filtered = leads.filter((l) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      l.customer_name?.toLowerCase().includes(s) ||
      l.customer_email?.toLowerCase().includes(s) ||
      l.customer_phone?.toLowerCase().includes(s) ||
      l.plan_label?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads de Membresías</h1>
        <Button variant="outline" size="sm" onClick={fetchLeads}>
          <RefreshCw className="h-4 w-4 mr-2" />Actualizar
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Buscar por nombre, email, teléfono o plan..."
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
                <TableHead>Fecha inicio</TableHead>
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
                  <TableCell className="text-sm">{l.plan_label || "-"}</TableCell>
                  <TableCell className="text-sm">
                    {l.requested_start_date
                      ? format(parseISO(l.requested_start_date), "dd/MM/yyyy")
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
                          const { data } = await supabase
                            .from("customers")
                            .select("id")
                            .eq("email", l.customer_email.toLowerCase().trim())
                            .maybeSingle();
                          if (!data) { toast.error("Cliente no encontrado en CRM"); return; }
                          navigate(`/admin/clientes/${data.id}`);
                        }}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />Ver
                      </Button>
                      {l.status !== "pagado" && l.status !== "activo" && (
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
        onSuccess={() => { setPaidModalLead(null); fetchLeads(); }}
      />
    </div>
  );
}

function MarkPaidModal({ lead, onClose, onSuccess }: { lead: Lead | null; onClose: () => void; onSuccess: () => void }) {
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (lead) setNotes(lead.admin_notes || ""); }, [lead]);

  const submit = async () => {
    if (!lead) return;
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await (supabase as any)
        .from("membership_leads")
        .update({
          status: "pagado",
          paid_at: new Date().toISOString(),
          paid_marked_by: user?.id || null,
          admin_notes: notes || null,
        })
        .eq("id", lead.id);
      if (error) throw error;

      // CRM event
      const { data: customer } = await supabase
        .from("customers").select("id").eq("email", lead.customer_email.toLowerCase()).maybeSingle();
      if (customer) {
        await supabase.from("customer_events").insert({
          customer_id: customer.id,
          event_type: "membership_paid",
          title: "Membresía pagada",
          description: `${lead.plan_label} · inicio ${lead.requested_start_date}`,
          metadata: { lead_id: lead.id, plan_code: lead.plan_code, notes },
        });
        await supabase.from("customers").update({ status: "member" }).eq("id", customer.id);
      }

      toast.success("Membresía marcada como pagada");
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
          <DialogTitle>Marcar membresía como pagada</DialogTitle>
          <DialogDescription>
            {lead?.customer_name} — {lead?.plan_label}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-sm font-medium block mb-1">Notas internas (opcional)</label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <Button
            onClick={submit}
            disabled={submitting}
            className="w-full bg-[#2E4D3A] hover:bg-[#2E4D3A]/90 text-white"
          >
            {submitting ? "Guardando..." : "Marcar como pagada"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
