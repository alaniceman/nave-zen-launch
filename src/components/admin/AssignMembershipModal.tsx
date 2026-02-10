import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Props {
  customerId: string;
  onClose: () => void;
  onSaved: () => void;
}

export function AssignMembershipModal({ customerId, onClose, onSaved }: Props) {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      membership_plan_id: "",
      start_date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const { data: plans = [] } = useQuery({
    queryKey: ["active-membership-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("membership_plans")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const onSubmit = async (data: any) => {
    try {
      // Insert membership
      const { error: memError } = await supabase
        .from("customer_memberships")
        .insert({
          customer_id: customerId,
          membership_plan_id: data.membership_plan_id,
          start_date: data.start_date,
          notes: data.notes || null,
          status: "active",
        });
      if (memError) throw memError;

      // Find plan name
      const plan = plans.find((p: any) => p.id === data.membership_plan_id);

      // Log event
      await supabase.from("customer_events").insert({
        customer_id: customerId,
        event_type: "membership_assigned",
        title: "Membresía asignada",
        description: plan?.name || "Plan",
        metadata: { membership_plan_id: data.membership_plan_id },
      });

      // Update customer status
      await supabase
        .from("customers")
        .update({ status: "member" })
        .eq("id", customerId);

      toast.success("Membresía asignada");
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Error al asignar");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Asignar Membresía</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Plan</Label>
            <Select value={watch("membership_plan_id")} onValueChange={(v) => setValue("membership_plan_id", v)}>
              <SelectTrigger><SelectValue placeholder="Seleccionar plan..." /></SelectTrigger>
              <SelectContent>
                {plans.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — ${p.price_clp.toLocaleString("es-CL")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Fecha inicio</Label>
            <Input type="date" {...register("start_date")} />
          </div>
          <div>
            <Label>Notas (opcional)</Label>
            <Textarea {...register("notes")} rows={2} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting || !watch("membership_plan_id")}>
              {isSubmitting ? "Guardando..." : "Asignar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
