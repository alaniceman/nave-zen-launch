import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MembershipPlanForm } from "@/components/admin/MembershipPlanForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function AdminMembershipPlans() {
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingPlan, setDeletingPlan] = useState<any>(null);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["admin-membership-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_plans")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("membership_plans")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-membership-plans"] });
      toast.success("Plan actualizado");
    },
  });

  const deletePlan = useMutation({
    mutationFn: async (id: string) => {
      // Check if any customer has this plan assigned
      const { count, error: countError } = await supabase
        .from("customer_memberships")
        .select("*", { count: "exact", head: true })
        .eq("membership_plan_id", id);
      if (countError) throw countError;
      if (count && count > 0) {
        throw new Error(`No se puede eliminar: ${count} cliente(s) tienen esta membresía asignada.`);
      }
      const { error } = await supabase.from("membership_plans").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-membership-plans"] });
      toast.success("Plan eliminado");
      setDeletingPlan(null);
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al eliminar");
      setDeletingPlan(null);
    },
  });

  const FREQ_LABELS: Record<string, string> = { weekly: "Semanal", monthly: "Mensual" };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Planes de Membresía</h1>
        <Button onClick={() => { setEditingPlan(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Crear Plan
        </Button>
      </div>

      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Frecuencia</TableHead>
              <TableHead>Clases</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">Cargando...</TableCell>
              </TableRow>
            ) : plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">No hay planes creados</TableCell>
              </TableRow>
            ) : (
              plans.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{FREQ_LABELS[p.frequency] || p.frequency}</TableCell>
                  <TableCell>{p.classes_included}</TableCell>
                  <TableCell>${p.price_clp.toLocaleString("es-CL")}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={p.is_active ? "bg-green-100 text-green-700 cursor-pointer" : "bg-gray-100 text-gray-500 cursor-pointer"}
                      onClick={() => toggleActive.mutate({ id: p.id, is_active: !p.is_active })}
                    >
                      {p.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditingPlan(p); setShowForm(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeletingPlan(p)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {showForm && (
        <MembershipPlanForm
          plan={editingPlan}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            queryClient.invalidateQueries({ queryKey: ["admin-membership-plans"] });
          }}
        />
      )}
    </div>
  );
}
