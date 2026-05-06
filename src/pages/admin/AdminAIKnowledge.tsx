import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Brain } from "lucide-react";
import { toast } from "sonner";

type Entry = {
  id: string;
  category: string;
  title: string;
  content: string;
  priority: number;
  is_active: boolean;
  updated_at: string;
};

const EMPTY: Partial<Entry> = {
  category: "general",
  title: "",
  content: "",
  priority: 0,
  is_active: true,
};

export default function AdminAIKnowledge() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Entry> | null>(null);
  const [deleting, setDeleting] = useState<Entry | null>(null);

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["ai-knowledge"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_knowledge")
        .select("*")
        .order("priority", { ascending: false })
        .order("category");
      if (error) throw error;
      return data as Entry[];
    },
  });

  const save = useMutation({
    mutationFn: async (e: Partial<Entry>) => {
      const payload = {
        category: e.category || "general",
        title: e.title!,
        content: e.content!,
        priority: e.priority ?? 0,
        is_active: e.is_active ?? true,
      };
      if (e.id) {
        const { error } = await supabase.from("ai_knowledge").update(payload).eq("id", e.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("ai_knowledge").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ai-knowledge"] });
      toast.success("Guardado. El chatbot lo usará en la próxima respuesta.");
      setEditing(null);
    },
    onError: (e: any) => toast.error(e.message || "Error al guardar"),
  });

  const toggle = useMutation({
    mutationFn: async (e: Entry) => {
      const { error } = await supabase
        .from("ai_knowledge")
        .update({ is_active: !e.is_active })
        .eq("id", e.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ai-knowledge"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("ai_knowledge").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ai-knowledge"] });
      toast.success("Eliminado");
      setDeleting(null);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6" /> Conocimiento de Nave AI
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Edita lo que sabe el chatbot. Los cambios se aplican al instante en la próxima conversación.
            Datos como precios de membresías, paquetes y planes activos se inyectan automáticamente desde la base de datos.
          </p>
        </div>
        <Button onClick={() => setEditing({ ...EMPTY })}>
          <Plus className="h-4 w-4 mr-1" /> Nueva entrada
        </Button>
      </div>

      <div className="bg-white rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Categoría</TableHead>
              <TableHead>Título</TableHead>
              <TableHead className="w-24">Prioridad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">Cargando...</TableCell></TableRow>
            ) : entries.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">Sin entradas</TableCell></TableRow>
            ) : entries.map((e) => (
              <TableRow key={e.id}>
                <TableCell><Badge variant="outline">{e.category}</Badge></TableCell>
                <TableCell className="font-medium max-w-md truncate">{e.title}</TableCell>
                <TableCell>{e.priority}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={e.is_active ? "bg-green-100 text-green-700 cursor-pointer" : "bg-gray-100 text-gray-500 cursor-pointer"}
                    onClick={() => toggle.mutate(e)}
                  >
                    {e.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => setEditing(e)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleting(e)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing.id ? "Editar entrada" : "Nueva entrada"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Categoría</Label>
                  <Input
                    value={editing.category || ""}
                    onChange={(ev) => setEditing({ ...editing, category: ev.target.value })}
                    placeholder="ej: faq, horarios, promos"
                  />
                </div>
                <div>
                  <Label>Prioridad (mayor = aparece antes)</Label>
                  <Input
                    type="number"
                    value={editing.priority ?? 0}
                    onChange={(ev) => setEditing({ ...editing, priority: parseInt(ev.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <Label>Título (interno, no se muestra)</Label>
                <Input
                  value={editing.title || ""}
                  onChange={(ev) => setEditing({ ...editing, title: ev.target.value })}
                />
              </div>
              <div>
                <Label>Contenido (markdown — esto lo lee el chatbot)</Label>
                <Textarea
                  rows={14}
                  value={editing.content || ""}
                  onChange={(ev) => setEditing({ ...editing, content: ev.target.value })}
                  placeholder="### Mi sección&#10;Texto que el chatbot incorporará a su conocimiento..."
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={editing.is_active ?? true}
                  onChange={(ev) => setEditing({ ...editing, is_active: ev.target.checked })}
                />
                <Label htmlFor="active">Activo</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button
                onClick={() => save.mutate(editing)}
                disabled={save.isPending || !editing.title || !editing.content}
              >
                {save.isPending ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {deleting && (
        <AlertDialog open onOpenChange={() => setDeleting(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar "{deleting.title}"?</AlertDialogTitle>
              <AlertDialogDescription>
                El chatbot dejará de tener acceso a esta información.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => remove.mutate(deleting.id)}
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
