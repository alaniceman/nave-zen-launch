import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format, parseISO, addDays } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, RefreshCw, Edit, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminFutureSlots() {
  const queryClient = useQueryClient();
  const [selectedProfessional, setSelectedProfessional] = useState<string>("all");
  const [selectedService, setSelectedService] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [dateTo, setDateTo] = useState<string>(format(addDays(new Date(), 30), "yyyy-MM-dd"));
  const [editingSlot, setEditingSlot] = useState<any>(null);
  const [editMaxCapacity, setEditMaxCapacity] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch professionals
  const { data: professionals } = useQuery({
    queryKey: ["professionals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch services
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  // Fetch generated slots with filters
  const { data: slots, isLoading } = useQuery({
    queryKey: ["generated-slots", selectedProfessional, selectedService, dateFrom, dateTo],
    queryFn: async () => {
      let query = supabase
        .from("generated_slots")
        .select(`
          *,
          professionals:professional_id(name),
          services:service_id(name)
        `)
        .gte("date_time_start", `${dateFrom}T00:00:00`)
        .lte("date_time_start", `${dateTo}T23:59:59`)
        .order("date_time_start", { ascending: true });

      if (selectedProfessional !== "all") {
        query = query.eq("professional_id", selectedProfessional);
      }

      if (selectedService !== "all") {
        query = query.eq("service_id", selectedService);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Update slot mutation
  const updateSlotMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from("generated_slots")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generated-slots"] });
      toast.success("Slot actualizado exitosamente");
      setEditingSlot(null);
    },
    onError: (error: any) => {
      toast.error(`Error al actualizar slot: ${error.message}`);
    },
  });

  // Generate slots mutation
  const generateSlotsMutation = useMutation({
    mutationFn: async (params: { dateFrom: string; dateTo: string }) => {
      const { data, error } = await supabase.functions.invoke("generate-future-slots", {
        body: {
          dateFrom: params.dateFrom,
          dateTo: params.dateTo,
          professionalId: selectedProfessional !== "all" ? selectedProfessional : undefined,
          serviceId: selectedService !== "all" ? selectedService : undefined,
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["generated-slots"] });
      toast.success(`${data.slotsCreated} slots generados exitosamente`);
    },
    onError: (error: any) => {
      toast.error(`Error al generar slots: ${error.message}`);
    },
  });

  const handleGenerateSlots = async () => {
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    
    if (toDate < fromDate) {
      toast.error("La fecha 'hasta' debe ser posterior a la fecha 'desde'");
      return;
    }

    const confirmed = window.confirm(
      `Se generarán slots para el período:\n${format(fromDate, "d MMM yyyy", { locale: es })} - ${format(toDate, "d MMM yyyy", { locale: es })}\n\n¿Confirmar?`
    );

    if (!confirmed) return;

    setIsGenerating(true);
    try {
      await generateSlotsMutation.mutateAsync({ dateFrom, dateTo });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditSlot = (slot: any) => {
    setEditingSlot(slot);
    setEditMaxCapacity(slot.max_capacity);
  };

  const handleSaveEdit = () => {
    if (!editingSlot) return;
    updateSlotMutation.mutate({
      id: editingSlot.id,
      updates: { max_capacity: editMaxCapacity },
    });
  };

  const handleToggleActive = (slot: any) => {
    updateSlotMutation.mutate({
      id: slot.id,
      updates: { is_active: !slot.is_active },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agendas Futuras</h1>
          <p className="text-muted-foreground">
            Gestiona los cupos de todas las agendas a futuro
          </p>
        </div>
        <Button
          onClick={handleGenerateSlots}
          disabled={isGenerating}
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generar Slots para Rango Actual
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtra las agendas por profesional, servicio y fecha</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Profesional</Label>
              <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {professionals?.map((prof) => (
                    <SelectItem key={prof.id} value={prof.id}>
                      {prof.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Servicio</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {services?.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Fecha Desde</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div>
              <Label>Fecha Hasta</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Slots Generados ({slots?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !slots || slots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron slots con estos filtros</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Profesional</TableHead>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Cupos Máx</TableHead>
                    <TableHead>Reservados</TableHead>
                    <TableHead>Disponibles</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {slots.map((slot) => {
                    const available = slot.max_capacity - slot.confirmed_bookings;
                    return (
                      <TableRow key={slot.id} className={!slot.is_active ? "opacity-50" : ""}>
                        <TableCell>
                          {format(parseISO(slot.date_time_start), "EEEE d MMM yyyy", {
                            locale: es,
                          })}
                        </TableCell>
                        <TableCell>
                          {format(parseISO(slot.date_time_start), "HH:mm")}
                        </TableCell>
                        <TableCell>{slot.professionals?.name}</TableCell>
                        <TableCell>{slot.services?.name}</TableCell>
                        <TableCell>{slot.max_capacity}</TableCell>
                        <TableCell>{slot.confirmed_bookings}</TableCell>
                        <TableCell>
                          <span className={available <= 0 ? "text-destructive font-bold" : ""}>
                            {available}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              slot.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {slot.is_active ? "Activo" : "Inactivo"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSlot(slot)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={slot.is_active ? "destructive" : "default"}
                              size="sm"
                              onClick={() => handleToggleActive(slot)}
                            >
                              {slot.is_active ? "Desactivar" : "Activar"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingSlot} onOpenChange={() => setEditingSlot(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cupos</DialogTitle>
          </DialogHeader>
          {editingSlot && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {format(parseISO(editingSlot.date_time_start), "EEEE d MMMM yyyy 'a las' HH:mm", {
                    locale: es,
                  })}
                </p>
                <p className="text-sm">
                  <strong>Profesional:</strong> {editingSlot.professionals?.name}
                </p>
                <p className="text-sm">
                  <strong>Servicio:</strong> {editingSlot.services?.name}
                </p>
                <p className="text-sm">
                  <strong>Reservas Confirmadas:</strong> {editingSlot.confirmed_bookings}
                </p>
              </div>
              <div>
                <Label htmlFor="max_capacity">Cupos Máximos</Label>
                <Input
                  id="max_capacity"
                  type="number"
                  min={editingSlot.confirmed_bookings}
                  value={editMaxCapacity}
                  onChange={(e) => setEditMaxCapacity(parseInt(e.target.value))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Mínimo: {editingSlot.confirmed_bookings} (reservas confirmadas)
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSlot(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
