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
import { Loader2, Plus, Pencil, Trash2, Percent, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { CouponForm } from '@/components/admin/CouponForm';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AdminCoupons() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: coupons, isLoading } = useQuery({
    queryKey: ['coupons-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discount_coupons')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('discount_coupons')
        .update({ is_active: isActive })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons-admin'] });
      toast.success('Estado actualizado');
    },
    onError: () => {
      toast.error('Error al actualizar estado');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('discount_coupons')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons-admin'] });
      toast.success('Cupón eliminado');
      setDeletingId(null);
    },
    onError: () => {
      toast.error('Error al eliminar cupón');
    },
  });

  const handleEdit = (coupon: any) => {
    setEditingCoupon(coupon);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCoupon(null);
  };

  const getStatusBadge = (coupon: any) => {
    const now = new Date();
    const validFrom = new Date(coupon.valid_from);
    const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

    if (!coupon.is_active) {
      return <Badge variant="secondary">Inactivo</Badge>;
    }
    if (now < validFrom) {
      return <Badge variant="outline">Programado</Badge>;
    }
    if (validUntil && now > validUntil) {
      return <Badge variant="destructive">Expirado</Badge>;
    }
    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
      return <Badge variant="destructive">Agotado</Badge>;
    }
    return <Badge className="bg-green-500 hover:bg-green-600">Activo</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Gestión de Cupones</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cupón
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
                  <TableHead>Código</TableHead>
                  <TableHead>Descuento</TableHead>
                  <TableHead>Usos</TableHead>
                  <TableHead>Validez</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No hay cupones registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  coupons?.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <span className="font-mono font-bold text-primary">{coupon.code}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {coupon.discount_type === 'percentage' ? (
                            <>
                              <Percent className="h-4 w-4 text-muted-foreground" />
                              <span>{coupon.discount_value}%</span>
                            </>
                          ) : (
                            <>
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span>${coupon.discount_value.toLocaleString('es-CL')}</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span>
                          {coupon.current_uses}
                          {coupon.max_uses ? ` / ${coupon.max_uses}` : ' / ∞'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Desde: {format(new Date(coupon.valid_from), 'dd/MM/yyyy', { locale: es })}</div>
                          {coupon.valid_until && (
                            <div>Hasta: {format(new Date(coupon.valid_until), 'dd/MM/yyyy', { locale: es })}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(coupon)}</TableCell>
                      <TableCell>
                        <Switch
                          checked={coupon.is_active}
                          onCheckedChange={(checked) =>
                            toggleActiveMutation.mutate({ id: coupon.id, isActive: checked })
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(coupon)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingId(coupon.id)}
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
          </CardContent>
        </Card>
      )}

      <CouponForm
        open={isFormOpen}
        onClose={handleCloseForm}
        coupon={editingCoupon}
      />

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cupón?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el cupón.
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
