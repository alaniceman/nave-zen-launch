import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Props {
  customerId: string;
  onClose: () => void;
  onSaved: () => void;
}

export function AddCustomerNoteModal({ customerId, onClose, onSaved }: Props) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { note: "" },
  });

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabase.from("customer_events").insert({
        customer_id: customerId,
        event_type: "note",
        title: "Nota manual",
        description: data.note,
      });
      if (error) throw error;
      toast.success("Nota agregada");
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Error al guardar");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Nota</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Nota</Label>
            <Textarea {...register("note", { required: true })} rows={3} placeholder="Escribe una nota..." />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
