import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Props {
  plan?: any;
  onClose: () => void;
  onSaved: () => void;
}

export function MembershipPlanForm({ plan, onClose, onSaved }: Props) {
  const { register, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: plan?.name || "",
      frequency: plan?.frequency || "monthly",
      classes_included: plan?.classes_included || 4,
      price_clp: plan?.price_clp || 0,
      description: plan?.description || "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (plan) {
        const { error } = await supabase
          .from("membership_plans")
          .update(data)
          .eq("id", plan.id);
        if (error) throw error;
        toast.success("Plan actualizado");
      } else {
        const { error } = await supabase
          .from("membership_plans")
          .insert(data);
        if (error) throw error;
        toast.success("Plan creado");
      }
      onSaved();
    } catch (err: any) {
      toast.error(err.message || "Error al guardar");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{plan ? "Editar Plan" : "Nuevo Plan de Membresía"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input {...register("name", { required: true })} placeholder="Ej: Universo" />
          </div>
          <div>
            <Label>Frecuencia</Label>
            <Select value={watch("frequency")} onValueChange={(v) => setValue("frequency", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Clases incluidas</Label>
              <Input type="number" {...register("classes_included", { valueAsNumber: true })} />
            </div>
            <div>
              <Label>Precio (CLP)</Label>
              <Input type="number" {...register("price_clp", { valueAsNumber: true })} />
            </div>
          </div>
          <div>
            <Label>Descripción (opcional)</Label>
            <Textarea {...register("description")} rows={2} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : plan ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
