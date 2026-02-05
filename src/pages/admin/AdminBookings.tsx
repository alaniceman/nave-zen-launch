import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatInTimeZone } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const statusColors = {
  PENDING_PAYMENT: 'bg-yellow-500',
  CONFIRMED: 'bg-green-500',
  CANCELLED: 'bg-red-500',
  COMPLETED: 'bg-blue-500',
};

const statusLabels = {
  PENDING_PAYMENT: 'Pendiente Pago',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada',
  COMPLETED: 'Completada',
};

export default function AdminBookings() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('all');
  const [professionalFilter, setProfessionalFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Debounce search
  useState(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings', page, status, professionalFilter, debouncedSearch, sortBy, sortOrder],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sortBy,
        sortOrder,
      });

      if (status !== 'all') {
        params.append('status', status);
      }

      if (professionalFilter !== 'all') {
        params.append('professionalId', professionalFilter);
      }

      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }

      // Construct the full URL with query params
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const functionUrl = `${supabaseUrl}/functions/v1/admin-bookings?${params.toString()}`;

      const response = await fetch(functionUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error fetching bookings');
      }

      const data = await response.json();
      console.log('Admin bookings response:', data);
      return data;
    },
    enabled: !!session,
  });

  const { data: professionals } = useQuery({
    queryKey: ['professionals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .eq('is_active', true);
      if (error) throw error;
      return data;
    },
  });

  const confirmBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      console.log('Confirming booking:', bookingId);
      console.log('Session token available:', !!session?.access_token);
      
      const { data, error } = await supabase.functions.invoke('admin-bookings', {
        body: { id: bookingId, status: 'CONFIRMED' },
      });
      
      console.log('Response data:', data);
      console.log('Response error:', error);
      
      if (error) {
        console.error('Function invoke error:', error);
        throw new Error(error.message || 'Error al confirmar reserva');
      }
      return data;
    },
    onSuccess: (data) => {
      console.log('Confirmation successful:', data);
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Reserva confirmada y email enviado al cliente');
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast.error(`Error al confirmar: ${error.message}`);
    }
  });

  const cancelAndReleaseMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      console.log('Cancel and release for booking:', bookingId);
      
      const { data, error } = await supabase.functions.invoke('admin-bookings', {
        body: { id: bookingId, action: 'cancel_and_release' },
      });
      
      if (error) {
        console.error('Function invoke error:', error);
        throw new Error(error.message || 'Error al cancelar reserva');
      }
      return data;
    },
    onSuccess: (data) => {
      console.log('Cancel and release successful:', data);
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      if (data.code_released) {
        toast.success(`Reserva cancelada y código ${data.code_released} liberado`);
      } else {
        toast.success('Reserva cancelada exitosamente');
      }
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast.error(`Error al cancelar: ${error.message}`);
    }
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const SortButton = ({ column, label }: { column: string; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(column)}
      className="h-8 px-2 lg:px-3"
    >
      {label}
      {sortBy === column ? (
        sortOrder === 'asc' ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowDown className="ml-2 h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Gestión de Reservas</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={professionalFilter} onValueChange={setProfessionalFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Instructor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los instructores</SelectItem>
                {professionals?.map((prof) => (
                  <SelectItem key={prof.id} value={prof.id}>
                    {prof.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="PENDING_PAYMENT">Pendiente Pago</SelectItem>
                <SelectItem value="CONFIRMED">Confirmada</SelectItem>
                <SelectItem value="CANCELLED">Cancelada</SelectItem>
                <SelectItem value="COMPLETED">Completada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <SortButton column="created_at" label="Fecha de Pago" />
                    </TableHead>
                    <TableHead>
                      <SortButton column="customer_name" label="Cliente" />
                    </TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>
                      <SortButton column="date_time_start" label="Fecha y Hora Sesión" />
                    </TableHead>
                    <TableHead>
                      <SortButton column="status" label="Estado" />
                    </TableHead>
                    <TableHead>
                      <SortButton column="final_price" label="Precio" />
                    </TableHead>
                    <TableHead>Cupón/Código</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.bookings?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No se encontraron reservas
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.bookings?.map((booking: any) => (
                      <TableRow key={booking.id}>
                        <TableCell className="text-foreground">
                          {formatInTimeZone(booking.created_at, 'America/Santiago', "d 'de' MMM, yyyy HH:mm", { locale: es })}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium text-foreground">{booking.customer_name}</div>
                            <div className="text-sm text-muted-foreground">{booking.customer_email}</div>
                            <div className="text-sm text-muted-foreground">{booking.customer_phone}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground">{booking.professionals.name}</TableCell>
                        <TableCell className="text-foreground">{booking.services.name}</TableCell>
                        <TableCell className="text-foreground">
                          {formatInTimeZone(booking.date_time_start, 'America/Santiago', "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[booking.status as keyof typeof statusColors]}>
                            {statusLabels[booking.status as keyof typeof statusLabels]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground font-medium">
                          {booking.discount_amount && booking.discount_amount > 0 ? (
                            <div className="flex flex-col">
                              <span className="line-through text-muted-foreground text-sm">
                                ${booking.original_price?.toLocaleString('es-CL')}
                              </span>
                              <span className="text-green-600 font-semibold">
                                ${booking.final_price?.toLocaleString('es-CL')}
                              </span>
                            </div>
                          ) : (
                            <span>${booking.services.price_clp.toLocaleString('es-CL')}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {booking.session_codes ? (
                            <div className="flex flex-col gap-1">
                              <Badge variant="outline" className="font-mono text-xs border-primary text-primary">
                                🎟️ {booking.session_codes.code}
                              </Badge>
                              {booking.session_codes.session_packages?.name && (
                                <span className="text-xs text-muted-foreground">
                                  {booking.session_codes.session_packages.name}
                                </span>
                              )}
                            </div>
                          ) : booking.discount_coupons ? (
                            <Badge variant="secondary" className="font-mono text-xs">
                              🏷️ {booking.discount_coupons.code}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            {booking.status === 'PENDING_PAYMENT' && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => confirmBookingMutation.mutate(booking.id)}
                                disabled={confirmBookingMutation.isPending}
                              >
                                {confirmBookingMutation.isPending ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Confirmando...
                                  </>
                                ) : (
                                  'Confirmar Manualmente'
                                )}
                              </Button>
                            )}
                            
                            {(booking.status === 'CONFIRMED' || booking.status === 'PENDING_PAYMENT') && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    disabled={cancelAndReleaseMutation.isPending}
                                  >
                                    {cancelAndReleaseMutation.isPending ? (
                                      <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Cancelando...
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="h-4 w-4 mr-1" />
                                        {booking.session_codes ? 'Cancelar y Liberar Código' : 'Cancelar Reserva'}
                                      </>
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Cancelar esta reserva?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {booking.session_codes ? (
                                        <>
                                          Esta acción cancelará la reserva de <strong>{booking.customer_name}</strong> y 
                                          liberará el código <strong className="font-mono">{booking.session_codes.code}</strong> para 
                                          que pueda ser utilizado nuevamente.
                                        </>
                                      ) : (
                                        <>
                                          Esta acción cancelará la reserva de <strong>{booking.customer_name}</strong>.
                                          Esta acción no se puede deshacer.
                                        </>
                                      )}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>No, mantener reserva</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => cancelAndReleaseMutation.mutate(booking.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Sí, cancelar{booking.session_codes ? ' y liberar código' : ''}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Página {page} de {data.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= data.totalPages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
