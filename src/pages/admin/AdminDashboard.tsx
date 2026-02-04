import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, subMonths, parseISO } from "date-fns";
import { es } from "date-fns/locale";
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
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Ticket,
  Calendar,
  Package,
  Users,
  Key,
  ShoppingCart,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardData {
  // Booking stats
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  bookingsRevenue: number;
  
  // Package orders stats
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  failedOrders: number;
  ordersRevenue: number;
  
  // Coupons stats
  totalCoupons: number;
  activeCoupons: number;
  totalCouponUses: number;
  
  // Session codes stats
  totalCodes: number;
  usedCodes: number;
  expiredCodes: number;
  availableCodes: number;
  
  // Charts data
  revenueByMonth: { month: string; bookings: number; orders: number; total: number }[];
  bookingsByService: { name: string; count: number }[];
  ordersByPackage: { name: string; count: number; revenue: number }[];
  couponUsageByMonth: { month: string; uses: number }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("6"); // months

  useEffect(() => {
    loadDashboardData();
  }, [period]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    const monthsAgo = parseInt(period);
    const startDate = startOfMonth(subMonths(new Date(), monthsAgo - 1));
    const endDate = endOfMonth(new Date());
    
    try {
      // Fetch all data in parallel
      const [
        bookingsResult,
        ordersResult,
        couponsResult,
        codesResult,
        servicesResult,
        packagesResult,
      ] = await Promise.all([
        supabase
          .from("bookings")
          .select("id, status, final_price, created_at, service_id, coupon_id")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString()),
        supabase
          .from("package_orders")
          .select("id, status, final_price, created_at, package_id, coupon_id")
          .gte("created_at", startDate.toISOString())
          .lte("created_at", endDate.toISOString()),
        supabase
          .from("discount_coupons")
          .select("id, code, is_active, current_uses"),
        supabase
          .from("session_codes")
          .select("id, is_used, expires_at, purchased_at")
          .gte("purchased_at", startDate.toISOString()),
        supabase.from("services").select("id, name"),
        supabase.from("session_packages").select("id, name"),
      ]);

      const bookings = bookingsResult.data || [];
      const orders = ordersResult.data || [];
      const coupons = couponsResult.data || [];
      const codes = codesResult.data || [];
      const services = servicesResult.data || [];
      const packages = packagesResult.data || [];

      // Create lookup maps
      const servicesMap = new Map(services.map(s => [s.id, s.name]));
      const packagesMap = new Map(packages.map(p => [p.id, p.name]));

      // Calculate booking stats
      const confirmedBookings = bookings.filter(b => b.status === "CONFIRMED");
      const pendingBookings = bookings.filter(b => b.status === "PENDING_PAYMENT");
      const cancelledBookings = bookings.filter(b => b.status === "CANCELLED");
      const bookingsRevenue = confirmedBookings.reduce((sum, b) => sum + (b.final_price || 0), 0);

      // Calculate order stats
      const completedOrders = orders.filter(o => o.status === "completed");
      const pendingOrders = orders.filter(o => ["created", "pending_payment"].includes(o.status));
      const failedOrders = orders.filter(o => o.status === "failed");
      const ordersRevenue = completedOrders.reduce((sum, o) => sum + (o.final_price || 0), 0);

      // Calculate coupon stats
      const activeCoupons = coupons.filter(c => c.is_active);
      const totalCouponUses = coupons.reduce((sum, c) => sum + (c.current_uses || 0), 0);

      // Calculate session codes stats
      const now = new Date();
      const usedCodes = codes.filter(c => c.is_used);
      const expiredCodes = codes.filter(c => !c.is_used && new Date(c.expires_at) < now);
      const availableCodes = codes.filter(c => !c.is_used && new Date(c.expires_at) >= now);

      // Revenue by month
      const revenueByMonth = getRevenueByMonth(bookings, orders, monthsAgo);

      // Bookings by service
      const bookingsByService = getBookingsByService(confirmedBookings, servicesMap);

      // Orders by package
      const ordersByPackage = getOrdersByPackage(completedOrders, packagesMap);

      // Coupon usage by month (from bookings and orders with coupon)
      const couponUsageByMonth = getCouponUsageByMonth(bookings, orders, monthsAgo);

      setData({
        totalBookings: bookings.length,
        confirmedBookings: confirmedBookings.length,
        pendingBookings: pendingBookings.length,
        cancelledBookings: cancelledBookings.length,
        bookingsRevenue,
        totalOrders: orders.length,
        completedOrders: completedOrders.length,
        pendingOrders: pendingOrders.length,
        failedOrders: failedOrders.length,
        ordersRevenue,
        totalCoupons: coupons.length,
        activeCoupons: activeCoupons.length,
        totalCouponUses,
        totalCodes: codes.length,
        usedCodes: usedCodes.length,
        expiredCodes: expiredCodes.length,
        availableCodes: availableCodes.length,
        revenueByMonth,
        bookingsByService,
        ordersByPackage,
        couponUsageByMonth,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Error al cargar el dashboard
      </div>
    );
  }

  const totalRevenue = data.bookingsRevenue + data.ordersRevenue;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Último mes</SelectItem>
            <SelectItem value="3">Últimos 3 meses</SelectItem>
            <SelectItem value="6">Últimos 6 meses</SelectItem>
            <SelectItem value="12">Último año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Ingresos Totales"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          description={`Reservas: ${formatCurrency(data.bookingsRevenue)} | Bonos: ${formatCurrency(data.ordersRevenue)}`}
        />
        <KPICard
          title="Reservas Confirmadas"
          value={data.confirmedBookings.toString()}
          icon={Calendar}
          description={`${data.pendingBookings} pendientes, ${data.cancelledBookings} canceladas`}
        />
        <KPICard
          title="Órdenes Completadas"
          value={data.completedOrders.toString()}
          icon={ShoppingCart}
          description={`${data.pendingOrders} pendientes, ${data.failedOrders} fallidas`}
        />
        <KPICard
          title="Uso de Cupones"
          value={data.totalCouponUses.toString()}
          icon={Ticket}
          description={`${data.activeCoupons} cupones activos de ${data.totalCoupons}`}
        />
      </div>

      {/* Session Codes Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Códigos Generados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCodes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Códigos Usados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.usedCodes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Códigos Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.availableCodes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Códigos Expirados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{data.expiredCodes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by Month */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ingresos por Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Mes: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="bookings" name="Reservas" fill="#0088FE" stackId="a" />
                  <Bar dataKey="orders" name="Bonos" fill="#00C49F" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Coupon Usage by Month */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Uso de Cupones por Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.couponUsageByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="uses" 
                    name="Cupones usados"
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: "#8884d8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bookings by Service */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Reservas por Servicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {data.bookingsByService.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.bookingsByService}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {data.bookingsByService.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Sin datos de reservas
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Orders by Package */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Ventas por Bono/Paquete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {data.ordersByPackage.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.ordersByPackage} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: number, name: string) => 
                        name === "revenue" ? formatCurrency(value) : value
                      }
                    />
                    <Bar dataKey="count" name="Cantidad" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Sin datos de órdenes
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Packages Table */}
      {data.ordersByPackage.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Bonos/Paquetes por Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paquete</TableHead>
                  <TableHead className="text-right">Ventas</TableHead>
                  <TableHead className="text-right">Ingresos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.ordersByPackage
                  .sort((a, b) => b.revenue - a.revenue)
                  .slice(0, 5)
                  .map((pkg) => (
                    <TableRow key={pkg.name}>
                      <TableCell className="font-medium">{pkg.name}</TableCell>
                      <TableCell className="text-right">{pkg.count}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(pkg.revenue)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper Components

function KPICard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-10 w-44" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Helper Functions

function getRevenueByMonth(
  bookings: any[],
  orders: any[],
  monthsAgo: number
): { month: string; bookings: number; orders: number; total: number }[] {
  const result: Map<string, { bookings: number; orders: number }> = new Map();

  // Initialize months
  for (let i = monthsAgo - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const key = format(date, "MMM yy", { locale: es });
    result.set(key, { bookings: 0, orders: 0 });
  }

  // Add confirmed bookings revenue
  bookings
    .filter(b => b.status === "CONFIRMED")
    .forEach(b => {
      const key = format(parseISO(b.created_at), "MMM yy", { locale: es });
      const current = result.get(key);
      if (current) {
        current.bookings += b.final_price || 0;
      }
    });

  // Add completed orders revenue
  orders
    .filter(o => o.status === "completed")
    .forEach(o => {
      const key = format(parseISO(o.created_at), "MMM yy", { locale: es });
      const current = result.get(key);
      if (current) {
        current.orders += o.final_price || 0;
      }
    });

  return Array.from(result.entries()).map(([month, data]) => ({
    month,
    bookings: data.bookings,
    orders: data.orders,
    total: data.bookings + data.orders,
  }));
}

function getBookingsByService(
  bookings: any[],
  servicesMap: Map<string, string>
): { name: string; count: number }[] {
  const counts = new Map<string, number>();

  bookings.forEach(b => {
    const name = servicesMap.get(b.service_id) || "Desconocido";
    counts.set(name, (counts.get(name) || 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

function getOrdersByPackage(
  orders: any[],
  packagesMap: Map<string, string>
): { name: string; count: number; revenue: number }[] {
  const data = new Map<string, { count: number; revenue: number }>();

  orders.forEach(o => {
    const name = packagesMap.get(o.package_id) || "Desconocido";
    const current = data.get(name) || { count: 0, revenue: 0 };
    current.count += 1;
    current.revenue += o.final_price || 0;
    data.set(name, current);
  });

  return Array.from(data.entries())
    .map(([name, { count, revenue }]) => ({ name, count, revenue }))
    .sort((a, b) => b.count - a.count);
}

function getCouponUsageByMonth(
  bookings: any[],
  orders: any[],
  monthsAgo: number
): { month: string; uses: number }[] {
  const result = new Map<string, number>();

  // Initialize months
  for (let i = monthsAgo - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const key = format(date, "MMM yy", { locale: es });
    result.set(key, 0);
  }

  // Count bookings with coupons
  bookings
    .filter(b => b.coupon_id)
    .forEach(b => {
      const key = format(parseISO(b.created_at), "MMM yy", { locale: es });
      const current = result.get(key);
      if (current !== undefined) {
        result.set(key, current + 1);
      }
    });

  // Count orders with coupons
  orders
    .filter(o => o.coupon_id)
    .forEach(o => {
      const key = format(parseISO(o.created_at), "MMM yy", { locale: es });
      const current = result.get(key);
      if (current !== undefined) {
        result.set(key, current + 1);
      }
    });

  return Array.from(result.entries()).map(([month, uses]) => ({ month, uses }));
}
