import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Search, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";

type TrialBooking = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  class_title: string;
  class_day: string;
  class_time: string;
  scheduled_date: string;
  status: string;
  source: string;
  created_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

const statusColors: Record<string, string> = {
  booked: "bg-blue-100 text-blue-800",
  attended: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  no_show: "bg-yellow-100 text-yellow-800",
};

const statusLabels: Record<string, string> = {
  booked: "Agendada",
  attended: "Asistió",
  cancelled: "Cancelada",
  no_show: "No asistió",
};

export default function AdminTrialBookings() {
  const [bookings, setBookings] = useState<TrialBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchBookings = async () => {
    setLoading(true);
    let query = supabase
      .from("trial_bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    if (search) {
      query = query.or(
        `customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,customer_phone.ilike.%${search}%`
      );
    }

    const { data, error } = await query.limit(100);
    if (error) {
      toast.error("Error cargando clases de prueba");
      console.error(error);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("trial_bookings")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Error actualizando estado");
      console.error(error);
    } else {
      toast.success(`Estado actualizado a "${statusLabels[newStatus]}"`);
      fetchBookings();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookings();
  };

  const totalBooked = bookings.filter((b) => b.status === "booked").length;
  const totalAttended = bookings.filter((b) => b.status === "attended").length;
  const totalCancelled = bookings.filter((b) => b.status === "cancelled").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clases de Prueba</h1>
        <Button variant="outline" size="sm" onClick={fetchBookings}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" /> Agendadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{totalBooked}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> Asistieron
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{totalAttended}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <XCircle className="h-4 w-4" /> Canceladas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{totalCancelled}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <Input
            placeholder="Buscar por nombre, email o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="booked">Agendadas</SelectItem>
            <SelectItem value="attended">Asistieron</SelectItem>
            <SelectItem value="cancelled">Canceladas</SelectItem>
            <SelectItem value="no_show">No asistieron</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Clase</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fuente</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No hay clases de prueba registradas
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.customer_name}</TableCell>
                    <TableCell className="text-sm">{b.customer_email}</TableCell>
                    <TableCell className="text-sm">{b.customer_phone}</TableCell>
                    <TableCell className="text-sm">{b.class_title}</TableCell>
                    <TableCell className="text-sm">
                      {b.scheduled_date
                        ? format(parseISO(b.scheduled_date), "dd MMM yyyy", { locale: es })
                        : b.class_day}
                    </TableCell>
                    <TableCell className="text-sm">{b.class_time}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[b.status] || "bg-gray-100 text-gray-800"}>
                        {statusLabels[b.status] || b.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {b.utm_source ? `${b.utm_source}` : b.source}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(parseISO(b.created_at), "dd/MM HH:mm")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {b.status !== "attended" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-700 border-green-300 hover:bg-green-50 h-7 text-xs"
                            onClick={() => updateStatus(b.id, "attended")}
                          >
                            Asistió
                          </Button>
                        )}
                        {b.status !== "cancelled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-700 border-red-300 hover:bg-red-50 h-7 text-xs"
                            onClick={() => updateStatus(b.id, "cancelled")}
                          >
                            Cancelar
                          </Button>
                        )}
                        {b.status !== "no_show" && b.status !== "attended" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-yellow-700 border-yellow-300 hover:bg-yellow-50 h-7 text-xs"
                            onClick={() => updateStatus(b.id, "no_show")}
                          >
                            No asistió
                          </Button>
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
    </div>
  );
}
