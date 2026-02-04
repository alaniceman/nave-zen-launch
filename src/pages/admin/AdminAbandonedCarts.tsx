import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Search, Loader2, Mail, ShoppingCart, CheckCircle2 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

interface AbandonedOrder {
  id: string;
  created_at: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string | null;
  package_id: string;
  order_type: string;
  is_giftcard: boolean;
  original_price: number;
  final_price: number;
  abandonment_email_sent_at: string | null;
  session_packages: {
    name: string;
  } | null;
}

export default function AdminAbandonedCarts() {
  const [orders, setOrders] = useState<AbandonedOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<AbandonedOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);

  useEffect(() => {
    loadAbandonedOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm]);

  const loadAbandonedOrders = async () => {
    setIsLoading(true);
    
    // Get orders with status "created" that are older than 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from("package_orders")
      .select("id, created_at, buyer_name, buyer_email, buyer_phone, package_id, order_type, is_giftcard, original_price, final_price, abandonment_email_sent_at, session_packages(name)")
      .eq("status", "created")
      .lt("created_at", thirtyMinutesAgo)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading abandoned orders:", error);
      toast.error("Error al cargar carros abandonados");
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
          order.buyer_email.toLowerCase().includes(term)
      );
    }

    setFilteredOrders(filtered);
  };

  const sendRecoveryEmail = async (order: AbandonedOrder) => {
    setSendingEmail(order.id);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-abandonment-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            orderId: order.id,
            buyerEmail: order.buyer_email,
            buyerName: order.buyer_name,
            packageName: order.session_packages?.name || "Paquete de sesiones",
            finalPrice: order.final_price,
            isGiftCard: order.is_giftcard,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al enviar email");
      }

      toast.success(`Email de recuperación enviado a ${order.buyer_email}`);
      
      // Update local state
      setOrders(orders.map(o => 
        o.id === order.id 
          ? { ...o, abandonment_email_sent_at: new Date().toISOString() }
          : o
      ));
    } catch (error) {
      console.error("Error sending recovery email:", error);
      toast.error("Error al enviar email de recuperación");
    } finally {
      setSendingEmail(null);
    }
  };

  const sendAllEmails = async () => {
    const ordersToSend = filteredOrders.filter(o => !o.abandonment_email_sent_at);
    
    if (ordersToSend.length === 0) {
      toast.info("No hay emails pendientes de enviar");
      return;
    }

    for (const order of ordersToSend) {
      await sendRecoveryEmail(order);
      // Small delay between emails
      await new Promise(resolve => setTimeout(resolve, 500));
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
      "Hace cuánto",
      "Nombre",
      "Email",
      "Teléfono",
      "Paquete",
      "Tipo",
      "Precio",
      "Email Enviado",
    ];

    const rows = filteredOrders.map((order) => [
      order.id,
      format(new Date(order.created_at), "dd/MM/yyyy HH:mm"),
      formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: es }),
      order.buyer_name,
      order.buyer_email,
      order.buyer_phone || "",
      order.session_packages?.name || "",
      order.is_giftcard ? "Gift Card" : "Paquete",
      order.final_price,
      order.abandonment_email_sent_at ? "Sí" : "No",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `carros_abandonados_${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalLostRevenue = filteredOrders.reduce((sum, o) => sum + o.final_price, 0);
  const pendingEmails = filteredOrders.filter(o => !o.abandonment_email_sent_at).length;
  const sentEmails = filteredOrders.filter(o => o.abandonment_email_sent_at).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Carros Abandonados
        </h1>
        <div className="flex gap-2">
          <Button onClick={sendAllEmails} variant="default" className="gap-2" disabled={pendingEmails === 0}>
            <Mail className="h-4 w-4" />
            Enviar todos ({pendingEmails})
          </Button>
          <Button onClick={exportToCSV} variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Carros Abandonados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos Perdidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatPrice(totalLostRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Emails Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingEmails}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Emails Enviados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{sentEmails}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            🎉 No hay carros abandonados
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hace cuánto</TableHead>
                <TableHead>Comprador</TableHead>
                <TableHead>Paquete</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead>Email Enviado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">
                      {formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: es })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(order.created_at), "dd MMM HH:mm", { locale: es })}
                    </div>
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
                  <TableCell className="text-right font-medium">
                    {formatPrice(order.final_price)}
                  </TableCell>
                  <TableCell>
                    {order.abandonment_email_sent_at ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs">
                          {format(new Date(order.abandonment_email_sent_at), "dd/MM HH:mm")}
                        </span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        Pendiente
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={order.abandonment_email_sent_at ? "outline" : "default"}
                      onClick={() => sendRecoveryEmail(order)}
                      disabled={sendingEmail === order.id}
                      className="gap-1"
                    >
                      {sendingEmail === order.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Mail className="h-3 w-3" />
                      )}
                      {order.abandonment_email_sent_at ? "Reenviar" : "Enviar"}
                    </Button>
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
