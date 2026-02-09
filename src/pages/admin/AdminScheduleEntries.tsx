import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { ScheduleEntryForm } from '@/components/admin/ScheduleEntryForm';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function AdminScheduleEntries() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dayFilter, setDayFilter] = useState<string>('all');

  const { data: entries, isLoading } = useQuery({
    queryKey: ['schedule-entries-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schedule_entries' as any)
        .select('*, services(name), professionals(name)')
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });
      if (error) throw error;
      return data as any[];
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase.from('schedule_entries' as any).update({ is_active: isActive }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-entries-admin'] });
      queryClient.invalidateQueries({ queryKey: ['schedule-entries'] });
      toast.success('Estado actualizado');
    },
    onError: () => toast.error('Error al actualizar'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('schedule_entries' as any).delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-entries-admin'] });
      queryClient.invalidateQueries({ queryKey: ['schedule-entries'] });
      toast.success('Horario eliminado');
      setDeletingId(null);
    },
    onError: () => toast.error('Error al eliminar'),
  });

  const filteredEntries = entries?.filter(e =>
    dayFilter === 'all' ? true : e.day_of_week === parseInt(dayFilter)
  ) || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-foreground">Horarios Semanales</h1>
        <div className="flex items-center gap-3">
          <Select value={dayFilter} onValueChange={setDayFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filtrar día" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los días</SelectItem>
              {DAY_NAMES.map((d, i) => (
                <SelectItem key={i} value={String(i)}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => { setEditingEntry(null); setIsFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Horario
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Día</TableHead>
                  <TableHead className="w-20">Hora</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Profesional</TableHead>
                  <TableHead>Badges</TableHead>
                  <TableHead className="w-16 text-center">Activo</TableHead>
                  <TableHead className="text-right w-24">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No hay horarios registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium text-foreground">
                        {DAY_NAMES[entry.day_of_week] || '-'}
                      </TableCell>
                      <TableCell className="text-foreground font-mono">
                        {entry.start_time?.slice(0, 5)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {entry.display_name || entry.services?.name || '-'}
                        </div>
                        {entry.display_name && (
                          <div className="text-xs text-muted-foreground">{entry.services?.name}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {entry.professionals?.name || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(entry.badges || []).map((badge: string, i: number) => (
                            <span key={i} className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">
                              {badge}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={entry.is_active}
                          onCheckedChange={(checked) =>
                            toggleActiveMutation.mutate({ id: entry.id, isActive: checked })
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => { setEditingEntry(entry); setIsFormOpen(true); }}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeletingId(entry.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <ScheduleEntryForm
        open={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingEntry(null); }}
        entry={editingEntry}
      />

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar horario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente este horario del calendario.
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
