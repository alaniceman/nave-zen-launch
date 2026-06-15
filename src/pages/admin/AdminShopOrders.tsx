import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

type Order = {
  id: string;
  product_name: string;
  product_price: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  status: string;
  mercado_pago_payment_id: string | null;
  paid_at: string | null;
  created_at: string;
};

const statusVariant = (s: string) =>
  s === "paid" ? "default" : s === "pending" ? "secondary" : "destructive";

const AdminShopOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let q = supabase
        .from("shop_orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (filter !== "all") q = q.eq("status", filter);
      const { data } = await q;
      setOrders((data || []) as Order[]);
      setLoading(false);
    };
    load();
  }, [filter]);

  const fmt = (d: string) =>
    new Date(d).toLocaleString("es-CL", { timeZone: "America/Santiago", dateStyle: "short", timeStyle: "short" });

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Tienda · Compras</h1>
          <p className="text-sm text-muted-foreground">Listado de compras del QR en el local.</p>
        </div>
        <select
          className="border rounded-md px-3 py-2 text-sm bg-background"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="paid">Pagados</option>
          <option value="pending">Pendientes</option>
          <option value="failed">Fallidos</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3">Fecha</th>
                <th className="p-3">Producto</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Contacto</th>
                <th className="p-3 text-right">Precio</th>
                <th className="p-3">Estado</th>
                <th className="p-3">MP Payment</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-3 whitespace-nowrap">{fmt(o.created_at)}</td>
                  <td className="p-3 font-medium">{o.product_name}</td>
                  <td className="p-3">{o.customer_name}</td>
                  <td className="p-3">
                    <div>{o.customer_email}</div>
                    {o.customer_phone && <div className="text-xs text-muted-foreground">{o.customer_phone}</div>}
                  </td>
                  <td className="p-3 text-right font-semibold">${o.product_price.toLocaleString("es-CL")}</td>
                  <td className="p-3"><Badge variant={statusVariant(o.status) as any}>{o.status}</Badge></td>
                  <td className="p-3 text-xs text-muted-foreground">{o.mercado_pago_payment_id || "—"}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Sin compras aún.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminShopOrders;
