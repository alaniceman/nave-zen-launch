import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Loader2, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { ServiceForm } from '@/components/admin/ServiceForm';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminServices() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: services, isLoading } = useQuery({
    queryKey: ['services-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*, branches(id, name)')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase.from('services').update({ is_active: isActive }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services-admin'] }); toast.success('Estado actualizado'); },
    onError: () => { toast.error('Error al actualizar estado'); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['services-admin'] }); toast.success('Servicio eliminado'); setDeletingId(null); },
    onError: () => { toast.error('Error al eliminar servicio'); },
  });

  const handleEdit = (service: any) => { setEditingService(service); setIsFormOpen(true); };
  const handleCloseForm = () => { setIsFormOpen(false); setEditingService(null); };

  const BoolIcon = ({ value }: { value: boolean }) =>
    value ? <Check className="h-4 w-4 text-emerald-600" /> : <X className="h-4 w-4 text-muted-foreground" />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Gestión de Servicios</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Servicio
        </Button>
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
                  <TableHead className="w-14">#</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Sucursal</TableHead>
                  <TableHead className="w-20">Duración</TableHead>
                  <TableHead className="w-24">Precio</TableHead>
                  <TableHead className="w-16 text-center">Prueba</TableHead>
                  <TableHead className="w-16 text-center">Agenda</TableHead>
                  <TableHead className="w-16 text-center">Activo</TableHead>
                  <TableHead className="text-right w-24">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No hay servicios registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  services?.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="text-foreground font-medium">{service.sort_order ?? 0}</TableCell>
                      <TableCell>
                        <div className="font-medium text-foreground">{service.name}</div>
                        {service.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">{service.description}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{(service as any).branches?.name || '-'}</TableCell>
                      <TableCell className="text-foreground">{service.duration_minutes} min</TableCell>
                      <TableCell className="text-foreground font-medium">
                        ${service.price_clp.toLocaleString('es-CL')}
                      </TableCell>
                      <TableCell className="text-center">
                        <BoolIcon value={(service as any).is_trial_enabled} />
                      </TableCell>
                      <TableCell className="text-center">
                        <BoolIcon value={(service as any).show_in_agenda} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={service.is_active}
                          onCheckedChange={(checked) => toggleActiveMutation.mutate({ id: service.id, isActive: checked })}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(service)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeletingId(service.id)}>
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

      <ServiceForm open={isFormOpen} onClose={handleCloseForm} service={editingService} />

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar servicio?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el servicio.
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
