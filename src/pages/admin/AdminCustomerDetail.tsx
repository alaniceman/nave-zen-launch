import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageCircle, GraduationCap, CheckCircle, Calendar, Package, Gift, Crown, StickyNote, Pencil, Save, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { AssignMembershipModal } from "@/components/admin/AssignMembershipModal";
import { AddCustomerNoteModal } from "@/components/admin/AddCustomerNoteModal";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = {
  new: "Nuevo", trial_booked: "Prueba agendada", trial_attended: "Prueba asistida",
  purchased: "Comprador", member: "Miembro",
};
const STATUS_COLORS: Record<string, string> = {
  new: "bg-gray-100 text-gray-700", trial_booked: "bg-blue-100 text-blue-700",
  trial_attended: "bg-yellow-100 text-yellow-700", purchased: "bg-green-100 text-green-700",
  member: "bg-purple-100 text-purple-700",
};

const EVENT_ICONS: Record<string, any> = {
  trial_booked: GraduationCap, trial_attended: CheckCircle, trial_cancelled: GraduationCap,
  booking_confirmed: Calendar, package_purchased: Package, giftcard_purchased: Gift,
  membership_assigned: Crown, membership_updated: Crown, note: StickyNote,
};
const EVENT_COLORS: Record<string, string> = {
  trial_booked: "text-blue-500", trial_attended: "text-green-500", trial_cancelled: "text-red-400",
  booking_confirmed: "text-indigo-500", package_purchased: "text-emerald-500",
  giftcard_purchased: "text-pink-500", membership_assigned: "text-purple-500",
  membership_updated: "text-purple-400", note: "text-yellow-500",
};

export default function AdminCustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: customer, isLoading } = useQuery({
    queryKey: ["admin-customer", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: events = [] } = useQuery({
    queryKey: ["admin-customer-events", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_events")
        .select("*")
        .eq("customer_id", id!)
        .order("event_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: membership } = useQuery({
    queryKey: ["admin-customer-membership", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_memberships")
        .select("*, membership_plans(*)")
        .eq("customer_id", id!)
        .eq("status", "active")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const whatsappLink = (phone: string | null) => {
    if (!phone) return null;
    return `https://wa.me/${phone.replace(/[^0-9]/g, "")}`;
  };

  const refreshAll = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-customer", id] });
    queryClient.invalidateQueries({ queryKey: ["admin-customer-events", id] });
    queryClient.invalidateQueries({ queryKey: ["admin-customer-membership", id] });
  };

  const startEditing = () => {
    setEditName(customer?.name || "");
    setEditPhone(customer?.phone || "");
    setEditNotes(customer?.notes || "");
    setEditing(true);
  };

  const cancelEditing = () => setEditing(false);

  const saveEditing = async () => {
    if (!customer) return;
    setSaving(true);
    const { error } = await supabase
      .from("customers")
      .update({ name: editName.trim(), phone: editPhone.trim() || null, notes: editNotes.trim() || null })
      .eq("id", customer.id);
    setSaving(false);
    if (error) { toast.error("Error al guardar"); return; }
    toast.success("Cliente actualizado");
    setEditing(false);
    refreshAll();
  };

  if (isLoading) return <div className="p-8 text-gray-500">Cargando...</div>;
  if (!customer) return <div className="p-8 text-gray-500">Cliente no encontrado</div>;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate("/admin/clientes")} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Volver a Clientes
      </Button>

      {/* Profile card */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-1 flex-1">
            {editing ? (
              <div className="space-y-3 max-w-md">
                <div>
                  <label className="text-xs font-medium text-gray-500">Nombre</label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Teléfono</label>
                  <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="+56912345678" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Notas internas</label>
                  <Textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={3} placeholder="Notas sobre el cliente..." />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveEditing} disabled={saving || !editName.trim()}>
                    <Save className="h-4 w-4 mr-1" /> {saving ? "Guardando..." : "Guardar"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEditing}>
                    <X className="h-4 w-4 mr-1" /> Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={startEditing}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <p className="text-gray-600">{customer.email}</p>
                {customer.phone && (
                  <a
                    href={whatsappLink(customer.phone)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                    {customer.phone}
                  </a>
                )}
                {customer.notes && (
                  <p className="text-sm text-gray-500 mt-2 italic">📝 {customer.notes}</p>
                )}
              </>
            )}
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <Badge variant="outline" className={`text-sm ${STATUS_COLORS[customer.status] || ""}`}>
              {STATUS_LABELS[customer.status] || customer.status}
            </Badge>
            {membership && (
              <div className="text-sm text-purple-600 font-medium flex items-center gap-1">
                <Crown className="h-4 w-4" />
                {(membership as any).membership_plans?.name} · desde {format(new Date(membership.start_date), "dd MMM yyyy", { locale: es })}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button size="sm" onClick={() => setShowMembershipModal(true)}>
            <Crown className="h-4 w-4 mr-1" /> Asignar Membresía
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowNoteModal(true)}>
            <StickyNote className="h-4 w-4 mr-1" /> Agregar Nota
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial</h2>
        {events.length === 0 ? (
          <p className="text-gray-400 text-sm">Sin eventos registrados.</p>
        ) : (
          <div className="space-y-4">
            {events.map((e: any) => {
              const Icon = EVENT_ICONS[e.event_type] || StickyNote;
              const color = EVENT_COLORS[e.event_type] || "text-gray-400";
              return (
                <div key={e.id} className="flex gap-3">
                  <div className={`mt-0.5 ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{e.title}</p>
                    {e.description && <p className="text-gray-500 text-sm">{e.description}</p>}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">
                        {format(new Date(e.event_date), "dd MMM yyyy · HH:mm", { locale: es })}
                      </span>
                      {e.amount != null && e.amount > 0 && (
                        <span className="text-xs font-medium text-green-600">
                          ${e.amount.toLocaleString("es-CL")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showMembershipModal && (
        <AssignMembershipModal
          customerId={customer.id}
          onClose={() => setShowMembershipModal(false)}
          onSaved={refreshAll}
        />
      )}
      {showNoteModal && (
        <AddCustomerNoteModal
          customerId={customer.id}
          onClose={() => setShowNoteModal(false)}
          onSaved={refreshAll}
        />
      )}
    </div>
  );
}
