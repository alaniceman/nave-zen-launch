import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const DAY_OPTIONS = [
  { value: '0', label: 'Lunes' },
  { value: '1', label: 'Martes' },
  { value: '2', label: 'Miércoles' },
  { value: '3', label: 'Jueves' },
  { value: '4', label: 'Viernes' },
  { value: '5', label: 'Sábado' },
  { value: '6', label: 'Domingo' },
];

const schema = z.object({
  serviceId: z.string().min(1, 'Selecciona un servicio'),
  professionalId: z.string().optional(),
  dayOfWeek: z.string().min(1, 'Selecciona un día'),
  startTime: z.string().min(1, 'Ingresa la hora'),
  displayName: z.string().optional(),
  badges: z.string().optional(),
  isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  entry?: any;
}

export function ScheduleEntryForm({ open, onClose, entry }: Props) {
  const queryClient = useQueryClient();
  const isEditing = !!entry;

  const { data: services } = useQuery({
    queryKey: ['services-admin-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('id, name').eq('is_active', true).order('sort_order');
      if (error) throw error;
      return data;
    },
  });

  const { data: professionals } = useQuery({
    queryKey: ['professionals-admin-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('professionals').select('id, name').eq('is_active', true).order('name');
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { serviceId: '', professionalId: '__none__', dayOfWeek: '', startTime: '', displayName: '', badges: '', isActive: true },
  });

  useEffect(() => {
    if (entry) {
      form.reset({
        serviceId: entry.service_id,
        professionalId: entry.professional_id || '__none__',
        dayOfWeek: String(entry.day_of_week),
        startTime: entry.start_time?.slice(0, 5) || '',
        displayName: entry.display_name || '',
        badges: (entry.badges || []).join(', '),
        isActive: entry.is_active,
      });
    } else {
      form.reset({ serviceId: '', professionalId: '__none__', dayOfWeek: '', startTime: '', displayName: '', badges: '', isActive: true });
    }
  }, [entry, form]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const badgesArr = data.badges ? data.badges.split(',').map(b => b.trim()).filter(Boolean) : [];
      const payload = {
        service_id: data.serviceId,
        professional_id: data.professionalId === '__none__' ? null : data.professionalId || null,
        day_of_week: parseInt(data.dayOfWeek),
        start_time: data.startTime,
        display_name: data.displayName || null,
        badges: badgesArr,
        is_active: data.isActive,
      };

      if (isEditing) {
        const { error } = await supabase.from('schedule_entries' as any).update(payload).eq('id', entry.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('schedule_entries' as any).insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule-entries-admin'] });
      queryClient.invalidateQueries({ queryKey: ['schedule-entries'] });
      toast.success(isEditing ? 'Horario actualizado' : 'Horario creado');
      onClose();
    },
    onError: (err: any) => toast.error(err.message || 'Error al guardar'),
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Horario' : 'Nuevo Horario'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <FormField control={form.control} name="serviceId" render={({ field }) => (
              <FormItem>
                <FormLabel>Servicio</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecciona servicio" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {services?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="professionalId" render={({ field }) => (
              <FormItem>
                <FormLabel>Profesional (opcional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Sin profesional" /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="__none__">Sin profesional</SelectItem>
                    {professionals?.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="dayOfWeek" render={({ field }) => (
                <FormItem>
                  <FormLabel>Día</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Día" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {DAY_OPTIONS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="startTime" render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora inicio</FormLabel>
                  <FormControl><Input {...field} type="time" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="displayName" render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre display (opcional)</FormLabel>
                <FormControl><Input {...field} placeholder="Override del nombre del servicio" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="badges" render={({ field }) => (
              <FormItem>
                <FormLabel>Badges (separados por coma)</FormLabel>
                <FormControl><Input {...field} placeholder="Ice Bath opcional, Sin inmersión" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="isActive" render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <FormLabel className="!mt-0">Activo</FormLabel>
              </FormItem>
            )} />

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
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
