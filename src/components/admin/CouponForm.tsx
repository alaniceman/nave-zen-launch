import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const couponSchema = z.object({
  code: z.string()
    .min(3, 'El código debe tener al menos 3 caracteres')
    .max(20, 'El código no puede exceder 20 caracteres')
    .regex(/^[A-Z0-9]+$/, 'El código solo puede contener letras mayúsculas y números')
    .transform(val => val.toUpperCase()),
  discount_type: z.enum(['percentage', 'fixed_amount'], {
    required_error: 'Selecciona un tipo de descuento',
  }),
  discount_value: z.number()
    .min(1, 'El valor debe ser mayor a 0')
    .positive('El valor debe ser positivo'),
  min_purchase_amount: z.number()
    .min(0, 'El monto mínimo no puede ser negativo')
    .default(0),
  max_uses: z.number()
    .nullable()
    .refine(val => val === null || val > 0, 'Los usos máximos deben ser mayor a 0')
    .optional(),
  valid_from: z.string().optional(),
  valid_until: z.string().nullable().optional(),
  applicable_package_ids: z.array(z.string()).optional(),
}).refine((data) => {
  if (data.discount_type === 'percentage') {
    return data.discount_value <= 100;
  }
  return true;
}, {
  message: 'El porcentaje no puede ser mayor a 100',
  path: ['discount_value'],
});

type CouponFormData = z.infer<typeof couponSchema>;

interface CouponFormProps {
  open: boolean;
  onClose: () => void;
  coupon?: any;
}

export function CouponForm({ open, onClose, coupon }: CouponFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!coupon;
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);

  // Load session packages
  const { data: packages = [] } = useQuery({
    queryKey: ['session-packages-for-coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('session_packages')
        .select('*')
        .eq('is_active', true)
        .order('sessions_quantity', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const form = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: '',
      discount_type: 'percentage',
      discount_value: 10,
      min_purchase_amount: 0,
      max_uses: null,
      valid_from: new Date().toISOString().split('T')[0],
      valid_until: null,
      applicable_package_ids: [],
    },
  });

  useEffect(() => {
    if (coupon) {
      form.reset({
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        min_purchase_amount: coupon.min_purchase_amount || 0,
        max_uses: coupon.max_uses,
        valid_from: coupon.valid_from ? new Date(coupon.valid_from).toISOString().split('T')[0] : undefined,
        valid_until: coupon.valid_until ? new Date(coupon.valid_until).toISOString().split('T')[0] : null,
        applicable_package_ids: coupon.applicable_package_ids || [],
      });
      setSelectedPackages(coupon.applicable_package_ids || []);
    } else {
      form.reset({
        code: '',
        discount_type: 'percentage',
        discount_value: 10,
        min_purchase_amount: 0,
        max_uses: null,
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: null,
        applicable_package_ids: [],
      });
      setSelectedPackages([]);
    }
  }, [coupon, form, open]);

  const saveMutation = useMutation({
    mutationFn: async (data: CouponFormData) => {
      const payload: any = {
        code: data.code,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        min_purchase_amount: data.min_purchase_amount,
        max_uses: data.max_uses || null,
        valid_from: data.valid_from || new Date().toISOString(),
        valid_until: data.valid_until || null,
        applicable_package_ids: selectedPackages.length > 0 ? selectedPackages : null,
      };

      if (isEditing) {
        const { error } = await supabase
          .from('discount_coupons')
          .update(payload)
          .eq('id', coupon.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('discount_coupons')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons-admin'] });
      toast.success(isEditing ? 'Cupón actualizado' : 'Cupón creado');
      onClose();
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al guardar cupón');
    },
  });

  const onSubmit = (data: CouponFormData) => {
    saveMutation.mutate(data);
  };

  const discountType = form.watch('discount_type');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Cupón' : 'Crear Nuevo Cupón'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código del cupón *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="DESCUENTO20"
                      className="font-mono uppercase"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormDescription>
                    Solo letras mayúsculas y números (ej: VERANO2025)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discount_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de descuento *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Porcentaje (%)</SelectItem>
                        <SelectItem value="fixed_amount">Monto fijo ($)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor del descuento *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        placeholder={discountType === 'percentage' ? '20' : '5000'}
                      />
                    </FormControl>
                    <FormDescription>
                      {discountType === 'percentage' ? 'Porcentaje (1-100)' : 'Monto en CLP'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="min_purchase_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Compra mínima (CLP)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </FormControl>
                    <FormDescription>
                      Monto mínimo para usar el cupón (0 = sin mínimo)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_uses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usos máximos</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                        placeholder="Ilimitado"
                      />
                    </FormControl>
                    <FormDescription>
                      Dejar vacío para ilimitado
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valid_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Válido desde</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valid_until"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Válido hasta</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormDescription>
                      Dejar vacío para sin fecha límite
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
              )}
            />
          </div>

          <div className="space-y-3">
            <FormLabel>Aplicable a Bonos (opcional)</FormLabel>
            <FormDescription>
              Si no seleccionas ningún bono, el cupón solo aplicará a reservas directas (sin bonos)
            </FormDescription>
            <div className="grid grid-cols-1 gap-3 p-4 border rounded-lg bg-muted/50">
              {packages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay bonos disponibles</p>
              ) : (
                packages.map((pkg: any) => (
                  <div key={pkg.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`package-${pkg.id}`}
                      checked={selectedPackages.includes(pkg.id)}
                      onCheckedChange={(checked) => {
                        setSelectedPackages(prev =>
                          checked
                            ? [...prev, pkg.id]
                            : prev.filter(id => id !== pkg.id)
                        );
                      }}
                    />
                    <label
                      htmlFor={`package-${pkg.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {pkg.name} - ${pkg.price_clp.toLocaleString('es-CL')} ({pkg.sessions_quantity} sesiones)
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={saveMutation.isPending}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                className="flex-1"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  isEditing ? 'Actualizar' : 'Crear Cupón'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
