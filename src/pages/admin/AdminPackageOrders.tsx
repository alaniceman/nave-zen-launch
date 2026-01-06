import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Search, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PackageOrder {
  id: string;
  created_at: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  package_id: string;
  order_type: string;
  is_giftcard: boolean;
  status: string;
  original_price: number;
  discount_amount: number;
  final_price: number;
  coupon_code: string | null;
  mercado_pago_payment_id: string | null;
  mercado_pago_status: string | null;
  session_packages: {
    name: string;
  } | null;
}

export default function AdminPackageOrders() {
  const [orders, setOrders] = useState<PackageOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<PackageOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, typeFilter]);

  const loadOrders = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("package_orders")
      .select("*, session_packages(name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading orders:", error);
    } else {
      setOrders(data || []);
    }
    setIsLoading(false);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.buyer_name.toLowerCase().includes(term) ||
          order.buyer_email.toLowerCase().includes(term) ||
          order.id.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (typeFilter !== "all") {
      if (typeFilter === "giftcard") {
        filtered = filtered.filter((order) => order.is_giftcard);
      } else {
        filtered = filtered.filter((order) => !order.is_giftcard);
      }
    }

    setFilteredOrders(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500 hover:bg-green-600">Pagada</Badge>;
      case "created":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendiente</Badge>;
      case "failed":
        return <Badge className="bg-red-500 hover:bg-red-600">Fallida</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(price);
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Fecha",
      "Nombre",
      "Email",
      "Teléfono",
      "Paquete",
      "Tipo",
      "Estado",
      "Precio Original",
      "Descuento",
      "Precio Final",
      "Cupón",
      "ID Pago MP",
      "Estado MP",
    ];

    const rows = filteredOrders.map((order) => [
      order.id,
      format(new Date(order.created_at), "dd/MM/yyyy HH:mm"),
      order.buyer_name,
      order.buyer_email,
      order.buyer_phone || "",
      order.session_packages?.name || "",
      order.is_giftcard ? "Gift Card" : "Paquete",
      order.status,
      order.original_price,
      order.discount_amount,
      order.final_price,
      order.coupon_code || "",
      order.mercado_pago_payment_id || "",
      order.mercado_pago_status || "",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ordenes_${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalRevenue = filteredOrders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.final_price, 0);

  const paidCount = filteredOrders.filter((o) => o.status === "paid").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Órdenes de Compra</h1>
        <Button onClick={exportToCSV} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Órdenes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Órdenes Pagadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{paidCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(totalRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="paid">Pagadas</SelectItem>
            <SelectItem value="created">Pendientes</SelectItem>
            <SelectItem value="failed">Fallidas</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="giftcard">Gift Cards</SelectItem>
            <SelectItem value="package">Paquetes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No se encontraron órdenes
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Comprador</TableHead>
                <TableHead>Paquete</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead>Cupón</TableHead>
                <TableHead>ID Pago</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(order.created_at), "dd MMM yyyy", {
                      locale: es,
                    })}
                    <br />
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(order.created_at), "HH:mm")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.buyer_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.buyer_email}
                    </div>
                    {order.buyer_phone && (
                      <div className="text-xs text-muted-foreground">
                        {order.buyer_phone}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.session_packages?.name || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.is_giftcard ? "default" : "secondary"}>
                      {order.is_giftcard ? "Gift Card" : "Paquete"}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">
                      {formatPrice(order.final_price)}
                    </div>
                    {order.discount_amount > 0 && (
                      <div className="text-xs text-muted-foreground line-through">
                        {formatPrice(order.original_price)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.coupon_code ? (
                      <Badge variant="outline">{order.coupon_code}</Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="max-w-[100px] truncate text-xs text-muted-foreground">
                    {order.mercado_pago_payment_id || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}