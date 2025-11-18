import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const overrideSchema = z.object({
  professionalId: z.string().min(1, 'Selecciona un profesional'),
  serviceId: z.string().min(1, 'Selecciona un servicio'),
  date: z.string().min(1, 'Selecciona una fecha'),
  startTime: z.string().min(1, 'Ingresa la hora de inicio'),
  maxCapacity: z.number().min(0, 'Mínimo 0 cupos').max(100, 'Máximo 100 cupos'),
});

type OverrideFormData = z.infer<typeof overrideSchema>;

export default function AdminCapacityOverrides() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOverride, setEditingOverride] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<OverrideFormData>({
    resolver: zodResolver(overrideSchema),
    defaultValues: {
      professionalId: '',
      serviceId: '',
      date: '',
      startTime: '',
      maxCapacity: 2,
    },
  });

  // Fetch capacity overrides
  const { data: overrides, isLoading } = useQuery({
    queryKey: ['capacity-overrides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('capacity_overrides')
        .select(`
          *,
          professionals(name),
          services(name, max_capacity)
        `)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Fetch professionals
  const { data: professionals } = useQuery({
    queryKey: ['professionals-for-overrides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('professionals')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Fetch services
  const { data: services } = useQuery({
    queryKey: ['services-for-overrides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, max_capacity')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Create/Update mutation
  const saveMutation = useMutation({
    mutationFn: async (data: OverrideFormData) => {
      if (editingOverride) {
        const { error } = await supabase
          .from('capacity_overrides')
          .update({
            professional_id: data.professionalId,
            service_id: data.serviceId,
            date: data.date,
            start_time: data.startTime,
            max_capacity: data.maxCapacity,
          })
          .eq('id', editingOverride.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('capacity_overrides')
          .insert({
            professional_id: data.professionalId,
            service_id: data.serviceId,
            date: data.date,
            start_time: data.startTime,
            max_capacity: data.maxCapacity,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capacity-overrides'] });
      toast.success(editingOverride ? 'Override actualizado' : 'Override creado');
      setIsDialogOpen(false);
      setEditingOverride(null);
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al guardar override');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('capacity_overrides')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capacity-overrides'] });
      toast.success('Override eliminado');
      setDeletingId(null);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar override');
    },
  });

  const handleEdit = (override: any) => {
    setEditingOverride(override);
    form.reset({
      professionalId: override.professional_id,
      serviceId: override.service_id,
      date: override.date,
      startTime: override.start_time,
      maxCapacity: override.max_capacity,
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingOverride(null);
    form.reset();
  };

  const onSubmit = (data: OverrideFormData) => {
    saveMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Cupos</h1>
          <p className="text-muted-foreground mt-1">
            Sobrescribe la capacidad de horarios específicos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingOverride(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Override
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingOverride ? 'Editar Override' : 'Nuevo Override'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>Profesional</Label>
                <Select
                  value={form.watch('professionalId')}
                  onValueChange={(value) => form.setValue('professionalId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona profesional" />
                  </SelectTrigger>
                  <SelectContent>
                    {professionals?.map((prof) => (
                      <SelectItem key={prof.id} value={prof.id}>
                        {prof.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.professionalId && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.professionalId.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Servicio</Label>
                <Select
                  value={form.watch('serviceId')}
                  onValueChange={(value) => form.setValue('serviceId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {services?.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} (Por defecto: {service.max_capacity} cupos)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.serviceId && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.serviceId.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  {...form.register('date')}
                />
                {form.formState.errors.date && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.date.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="startTime">Hora de Inicio</Label>
                <Input
                  id="startTime"
                  type="time"
                  {...form.register('startTime')}
                />
                {form.formState.errors.startTime && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.startTime.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="maxCapacity">Cupos en este Horario</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  {...form.register('maxCapacity', { valueAsNumber: true })}
                />
                {form.formState.errors.maxCapacity && (
                  <p className="text-sm text-destructive mt-1">
                    {form.formState.errors.maxCapacity.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingOverride ? 'Actualizar' : 'Crear'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profesional</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>Cupos</TableHead>
              <TableHead>Por Defecto</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {overrides?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No hay overrides configurados
                </TableCell>
              </TableRow>
            )}
            {overrides?.map((override) => (
              <TableRow key={override.id}>
                <TableCell>{override.professionals?.name}</TableCell>
                <TableCell>{override.services?.name}</TableCell>
                <TableCell>
                  {format(new Date(override.date + 'T12:00:00'), "EEEE d 'de' MMMM, yyyy", { locale: es })}
                </TableCell>
                <TableCell>{override.start_time}</TableCell>
                <TableCell className="font-bold">{override.max_capacity}</TableCell>
                <TableCell className="text-muted-foreground">
                  {override.services?.max_capacity} cupos
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(override)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingId(override.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar override?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El horario volverá a usar la capacidad
              por defecto del servicio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}