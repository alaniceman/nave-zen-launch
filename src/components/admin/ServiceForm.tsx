import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const COLOR_TAG_OPTIONS = [
  { value: 'yoga', label: 'Yoga' },
  { value: 'wim-hof', label: 'Método Wim Hof' },
  { value: 'hiit', label: 'HIIT / Biohacking' },
  { value: 'breathwork', label: 'Breathwork' },
  { value: 'personalizado', label: 'Personalizado' },
  { value: 'default', label: 'Default' },
];

const serviceSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  branchId: z.string().min(1, 'Selecciona una sucursal'),
  durationMinutes: z.number().min(15, 'Mínimo 15 minutos').max(480, 'Máximo 480 minutos'),
  priceClp: z.number().min(0, 'El precio mínimo es $0'),
  maxCapacity: z.number().min(1, 'Mínimo 1 cupo').max(100, 'Máximo 100 cupos'),
  sortOrder: z.number().min(0, 'Mínimo 0').default(0),
  isActive: z.boolean().default(true),
  isTrialEnabled: z.boolean().default(false),
  showInAgenda: z.boolean().default(true),
  colorTag: z.string().default('default'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  open: boolean;
  onClose: () => void;
  service?: any;
}

export function ServiceForm({ open, onClose, service }: ServiceFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!service;

  const { data: branches } = useQuery({
    queryKey: ['branches-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      branchId: '',
      durationMinutes: 60,
      priceClp: 25000,
      maxCapacity: 6,
      sortOrder: 0,
      isActive: true,
      isTrialEnabled: false,
      showInAgenda: true,
      colorTag: 'default',
    },
  });

  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        description: service.description || '',
        branchId: service.branch_id || '',
        durationMinutes: service.duration_minutes,
        priceClp: service.price_clp,
        maxCapacity: service.max_capacity,
        sortOrder: service.sort_order ?? 0,
        isActive: service.is_active,
        isTrialEnabled: service.is_trial_enabled ?? false,
        showInAgenda: service.show_in_agenda ?? true,
        colorTag: service.color_tag || 'default',
      });
    } else {
      const defaultBranch = branches?.find(b => b.is_default);
      form.reset({
        name: '',
        description: '',
        branchId: defaultBranch?.id || '',
        durationMinutes: 60,
        priceClp: 25000,
        maxCapacity: 6,
        sortOrder: 0,
        isActive: true,
        isTrialEnabled: false,
        showInAgenda: true,
        colorTag: 'default',
      });
    }
  }, [service, form, branches]);

  const mutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      const payload = {
        name: data.name,
        description: data.description || null,
        branch_id: data.branchId,
        duration_minutes: data.durationMinutes,
        price_clp: data.priceClp,
        max_capacity: data.maxCapacity,
        sort_order: data.sortOrder,
        is_active: data.isActive,
        is_trial_enabled: data.isTrialEnabled,
        show_in_agenda: data.showInAgenda,
        color_tag: data.colorTag,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('services')
          .update(payload)
          .eq('id', service.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services-admin'] });
      toast.success(isEditing ? 'Servicio actualizado' : 'Servicio creado');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al guardar servicio');
    },
  });

  const onSubmit = (data: ServiceFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Servicio' : 'Nuevo Servicio'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Clase de Yoga" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sucursal</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una sucursal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches?.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Descripción del servicio..." rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración (min)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceClp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (CLP)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cupos</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orden</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="colorTag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría de color</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COLOR_TAG_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3 pt-2">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Activo</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isTrialEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Disponible como clase de prueba</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="showInAgenda"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="!mt-0">Mostrar en calendario de agenda</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
