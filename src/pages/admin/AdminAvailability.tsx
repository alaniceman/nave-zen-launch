import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AvailabilityForm } from '@/components/admin/AvailabilityForm';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const DAYS_OF_WEEK = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function AdminAvailability() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: rules, isLoading } = useQuery({
    queryKey: ['availability-rules-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('availability_rules')
        .select(`
          *,
          professionals(name),
          services(name)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const weeklyRules = rules?.filter(r => r.recurrence_type === 'WEEKLY') || [];
  const specificRules = rules?.filter(r => r.recurrence_type === 'ONCE') || [];

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('availability_rules')
        .update({ is_active: isActive })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability-rules-admin'] });
      toast.success('Estado actualizado');
    },
    onError: () => {
      toast.error('Error al actualizar estado');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('availability_rules')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability-rules-admin'] });
      toast.success('Regla eliminada');
      setDeletingId(null);
    },
    onError: () => {
      toast.error('Error al eliminar regla');
    },
  });

  const handleEdit = (rule: any) => {
    setEditingRule(rule);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRule(null);
  };

  const RulesTable = ({ data }: { data: any[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Profesional</TableHead>
          <TableHead>Servicio</TableHead>
          <TableHead>Día/Fecha</TableHead>
          <TableHead>Horario</TableHead>
          <TableHead>Duración Slot</TableHead>
          <TableHead>Activo</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
              No hay reglas de disponibilidad
            </TableCell>
          </TableRow>
        ) : (
          data.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium text-foreground">{rule.professionals.name}</TableCell>
              <TableCell className="text-foreground">{rule.services?.name || 'Todos'}</TableCell>
              <TableCell className="text-foreground">
                {rule.recurrence_type === 'WEEKLY' 
                  ? DAYS_OF_WEEK[rule.day_of_week!]
                  : rule.specific_date}
              </TableCell>
              <TableCell className="text-foreground">
                {rule.start_time} - {rule.end_time}
              </TableCell>
              <TableCell className="text-foreground">{rule.duration_minutes} min</TableCell>
              <TableCell>
                <Switch
                  checked={rule.is_active}
                  onCheckedChange={(checked) =>
                    toggleActiveMutation.mutate({ id: rule.id, isActive: checked })
                  }
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(rule)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingId(rule.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Gestión de Disponibilidad</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Regla
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="weekly">
          <TabsList>
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
            <TabsTrigger value="specific">Fechas Específicas</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <Card>
              <CardContent className="p-0">
                <RulesTable data={weeklyRules} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specific">
            <Card>
              <CardContent className="p-0">
                <RulesTable data={specificRules} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <AvailabilityForm
        open={isFormOpen}
        onClose={handleCloseForm}
        rule={editingRule}
      />

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar regla de disponibilidad?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente la regla.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
