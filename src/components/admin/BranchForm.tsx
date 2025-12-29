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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const branchSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slug: z.string().min(2, 'El slug debe tener al menos 2 caracteres').regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  address: z.string().optional(),
  description: z.string().optional(),
  sortOrder: z.number().min(0, 'Mínimo 0').default(0),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type BranchFormData = z.infer<typeof branchSchema>;

interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  description: string | null;
  is_default: boolean;
  sort_order: number;
  is_active: boolean;
}

interface BranchFormProps {
  open: boolean;
  onClose: () => void;
  branch?: Branch | null;
}

export function BranchForm({ open, onClose, branch }: BranchFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!branch;

  const form = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: '',
      slug: '',
      address: '',
      description: '',
      sortOrder: 0,
      isDefault: false,
      isActive: true,
    },
  });

  useEffect(() => {
    if (branch) {
      form.reset({
        name: branch.name,
        slug: branch.slug,
        address: branch.address || '',
        description: branch.description || '',
        sortOrder: branch.sort_order,
        isDefault: branch.is_default,
        isActive: branch.is_active,
      });
    } else {
      form.reset({
        name: '',
        slug: '',
        address: '',
        description: '',
        sortOrder: 0,
        isDefault: false,
        isActive: true,
      });
    }
  }, [branch, form]);

  const mutation = useMutation({
    mutationFn: async (data: BranchFormData) => {
      const payload = {
        name: data.name,
        slug: data.slug,
        address: data.address || null,
        description: data.description || null,
        sort_order: data.sortOrder,
        is_default: data.isDefault,
        is_active: data.isActive,
      };

      // If setting as default, unset other defaults first
      if (data.isDefault) {
        await supabase
          .from('branches')
          .update({ is_default: false })
          .neq('id', branch?.id || '');
      }

      if (isEditing) {
        const { error } = await supabase
          .from('branches')
          .update(payload)
          .eq('id', branch.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('branches')
          .insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches-admin'] });
      toast.success(isEditing ? 'Sucursal actualizada' : 'Sucursal creada');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al guardar sucursal');
    },
  });

  const onSubmit = (data: BranchFormData) => {
    mutation.mutate(data);
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    form.setValue('name', name);
    if (!isEditing || !branch?.slug) {
      const slug = name.toLowerCase()
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
            {isEditing ? 'Editar Sucursal' : 'Nueva Sucursal'}
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
                      placeholder="Santiago Centro"
                      onChange={handleNameChange}
                    />
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
                    <Input {...field} placeholder="santiago-centro" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Av. Providencia 123, Santiago" />
                  </FormControl>
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
                    <Textarea {...field} placeholder="Descripción de la sucursal..." rows={3} />
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
                  <FormLabel>Orden de visualización</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      placeholder="1 = primero"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-6">
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Sucursal por defecto</FormLabel>
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
                    <FormLabel className="!mt-0">Activa</FormLabel>
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
