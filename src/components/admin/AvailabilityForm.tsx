import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const availabilitySchema = z.object({
  professionalId: z.string().min(1, 'Selecciona un profesional'),
  serviceId: z.string().optional(),
  recurrenceType: z.enum(['weekly', 'specific_date']),
  dayOfWeek: z.number().min(0).max(6).optional(),
  specificDate: z.string().optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM'),
  durationMinutes: z.number().min(15).max(480),
  maxDaysInFuture: z.number().min(1).max(365),
  minHoursBeforeBooking: z.number().min(0).max(168),
  isActive: z.boolean().default(true),
}).refine((data) => {
  if (data.recurrenceType === 'weekly' && data.dayOfWeek === undefined) {
    return false;
  }
  if (data.recurrenceType === 'specific_date' && !data.specificDate) {
    return false;
  }
  return true;
}, {
  message: 'Debes especificar el día de la semana o la fecha específica',
});

type AvailabilityFormData = z.infer<typeof availabilitySchema>;

interface AvailabilityFormProps {
  open: boolean;
  onClose: () => void;
  rule?: any;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

export function AvailabilityForm({ open, onClose, rule }: AvailabilityFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!rule;

  const { data: professionals } = useQuery({
    queryKey: ['professionals-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });

  const { data: services } = useQuery({
    queryKey: ['services-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });

  const form = useForm<AvailabilityFormData>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      professionalId: '',
      serviceId: '',
      recurrenceType: 'weekly',
      startTime: '09:00',
      endTime: '18:00',
      durationMinutes: 60,
      maxDaysInFuture: 30,
      minHoursBeforeBooking: 3,
      isActive: true,
    },
  });

  useEffect(() => {
    if (rule) {
      form.reset({
        professionalId: rule.professional_id,
        serviceId: rule.service_id || '',
        recurrenceType: rule.recurrence_type,
        dayOfWeek: rule.day_of_week,
        specificDate: rule.specific_date,
        startTime: rule.start_time,
        endTime: rule.end_time,
        durationMinutes: rule.duration_minutes,
        maxDaysInFuture: rule.max_days_in_future,
        minHoursBeforeBooking: rule.min_hours_before_booking,
        isActive: rule.is_active,
      });
    }
  }, [rule, form]);

  const mutation = useMutation({
    mutationFn: async (data: AvailabilityFormData) => {
      const payload = {
        professional_id: data.professionalId,
        service_id: data.serviceId || null,
        recurrence_type: data.recurrenceType,
        day_of_week: data.recurrenceType === 'weekly' ? data.dayOfWeek : null,
        specific_date: data.recurrenceType === 'specific_date' ? data.specificDate : null,
        start_time: data.startTime,
        end_time: data.endTime,
        duration_minutes: data.durationMinutes,
        max_days_in_future: data.maxDaysInFuture,
        min_hours_before_booking: data.minHoursBeforeBooking,
        is_active: data.isActive,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('availability_rules')
          .update(payload)
          .eq('id', rule.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('availability_rules')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability-rules-admin'] });
      toast.success(isEditing ? 'Regla actualizada' : 'Regla creada');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al guardar regla');
    },
  });

  const onSubmit = (data: AvailabilityFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Regla de Disponibilidad' : 'Nueva Regla de Disponibilidad'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="professionalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profesional</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un profesional" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {professionals?.map((prof) => (
                        <SelectItem key={prof.id} value={prof.id}>
                          {prof.name}
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
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servicio (opcional)</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos los servicios" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Todos los servicios</SelectItem>
                      {services?.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
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
              name="recurrenceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Recurrencia</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly">Semanal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="specific_date" id="specific_date" />
                        <Label htmlFor="specific_date">Fecha Específica</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('recurrenceType') === 'weekly' && (
              <FormField
                control={form.control}
                name="dayOfWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Día de la Semana</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))} 
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un día" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((day) => (
                          <SelectItem key={day.value} value={day.value.toString()}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {form.watch('recurrenceType') === 'specific_date' && (
              <FormField
                control={form.control}
                name="specificDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha Específica</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora Inicio</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora Fin</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="durationMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duración del Slot (minutos)</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">60 minutos</SelectItem>
                      <SelectItem value="90">90 minutos</SelectItem>
                      <SelectItem value="120">120 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxDaysInFuture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Días Máximos en el Futuro</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minHoursBeforeBooking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horas Mínimas de Anticipación</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Activo</FormLabel>
                </FormItem>
              )}
            />

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
