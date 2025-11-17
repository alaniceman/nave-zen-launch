import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const professionalSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres').max(100),
  isActive: z.boolean().default(true),
});

type ProfessionalFormData = z.infer<typeof professionalSchema>;

interface ProfessionalFormProps {
  open: boolean;
  onClose: () => void;
  professional?: any;
}

export function ProfessionalForm({ open, onClose, professional }: ProfessionalFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!professional;

  const form = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalSchema),
    defaultValues: {
      name: '',
      email: '',
      slug: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (professional) {
      form.reset({
        name: professional.name,
        email: professional.email,
        slug: professional.slug,
        isActive: professional.is_active,
      });
    } else {
      form.reset({
        name: '',
        email: '',
        slug: '',
        isActive: true,
      });
    }
  }, [professional, form]);

  const mutation = useMutation({
    mutationFn: async (data: ProfessionalFormData) => {
      const payload = {
        name: data.name,
        email: data.email,
        slug: data.slug,
        is_active: data.isActive,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('professionals')
          .update(payload)
          .eq('id', professional.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('professionals')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionals-admin'] });
      toast.success(isEditing ? 'Profesional actualizado' : 'Profesional creado');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al guardar profesional');
    },
  });

  const onSubmit = (data: ProfessionalFormData) => {
    mutation.mutate(data);
  };

  // Generate slug from name
  const handleNameChange = (value: string) => {
    if (!isEditing) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      form.setValue('slug', slug);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Profesional' : 'Nuevo Profesional'}
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
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleNameChange(e.target.value);
                      }}
                      placeholder="Sol García"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="sol@navestudio.cl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (URL)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="sol-garcia" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
