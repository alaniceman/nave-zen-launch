import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfMonth, endOfMonth, subMonths, parseISO, addMonths } from "date-fns";
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
  
  // Redeemed value stats
  totalRedeemedValue: number;
  
  // Charts data
  revenueByMonth: { month: string; bookings: number; orders: number; total: number }[];
  redeemedValueByMonth: { month: string; income: number; redeemed: number }[];
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

// Generate last 12 months for selector
function generateMonthOptions() {
  const options = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = subMonths(now, i);
    const value = format(date, "yyyy-MM");
    const label = format(date, "MMMM yyyy", { locale: es });
    options.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
  }
  return options;
}

const MONTH_OPTIONS = generateMonthOptions();

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<"period" | "month">("period");
  const [period, setPeriod] = useState("6"); // months
  const [selectedMonth, setSelectedMonth] = useState(MONTH_OPTIONS[0].value); // current month

  useEffect(() => {
    loadDashboardData();
  }, [period, filterType, selectedMonth]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    let startDate: Date;
    let endDate: Date;
    let monthsAgo: number;
    
    if (filterType === "month") {
      // Specific month selected
      const [year, month] = selectedMonth.split("-").map(Number);
      startDate = startOfMonth(new Date(year, month - 1));
      endDate = endOfMonth(new Date(year, month - 1));
      monthsAgo = 1;
    } else {
      // Period range
      monthsAgo = parseInt(period);
      startDate = startOfMonth(subMonths(new Date(), monthsAgo - 1));
      endDate = endOfMonth(new Date());
    }
    
    try {
      // Fetch all data in parallel
      const [
        bookingsResult,
        ordersResult,
        couponsResult,
        codesResult,
        usedCodesResult,
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
        // Fetch used codes with used_at date for redeemed value calculation
        supabase
          .from("session_codes")
          .select("id, is_used, used_at, package_id")
          .eq("is_used", true)
          .gte("used_at", startDate.toISOString())
          .lte("used_at", endDate.toISOString()),
        supabase.from("services").select("id, name"),
        supabase.from("session_packages").select("id, name, price_clp, sessions_quantity"),
      ]);

      const bookings = bookingsResult.data || [];
      const orders = ordersResult.data || [];
      const coupons = couponsResult.data || [];
      const codes = codesResult.data || [];
      const usedCodesWithDate = usedCodesResult.data || [];
      const services = servicesResult.data || [];
      const packages = packagesResult.data || [];

      // Create lookup maps
      const servicesMap = new Map(services.map(s => [s.id, s.name]));
      const packagesMap = new Map(packages.map(p => [p.id, p.name]));
      const packagesDataMap = new Map(packages.map(p => [p.id, { price: p.price_clp, sessions: p.sessions_quantity }]));

      // Calculate booking stats
      const confirmedBookings = bookings.filter(b => b.status === "CONFIRMED");
      const pendingBookings = bookings.filter(b => b.status === "PENDING_PAYMENT");
      const cancelledBookings = bookings.filter(b => b.status === "CANCELLED");
      const bookingsRevenue = confirmedBookings.reduce((sum, b) => sum + (b.final_price || 0), 0);

      // Calculate order stats
      const completedOrders = orders.filter(o => o.status === "paid");
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

      // Calculate redeemed value (value of used session codes)
      const totalRedeemedValue = calculateRedeemedValue(usedCodesWithDate, packagesDataMap);

      // Revenue by month
      const revenueByMonth = getRevenueByMonth(bookings, orders, startDate, endDate);

      // Redeemed value by month (income vs redeemed comparison)
      const redeemedValueByMonth = getRedeemedValueByMonth(orders, usedCodesWithDate, packagesDataMap, startDate, endDate);

      // Bookings by service
      const bookingsByService = getBookingsByService(confirmedBookings, servicesMap);

      // Orders by package
      const ordersByPackage = getOrdersByPackage(completedOrders, packagesMap);

      // Coupon usage by month (from bookings and orders with coupon)
      const couponUsageByMonth = getCouponUsageByMonth(bookings, orders, startDate, endDate);

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
        totalRedeemedValue,
        revenueByMonth,
        redeemedValueByMonth,
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter Type Toggle */}
          <Select value={filterType} onValueChange={(v) => setFilterType(v as "period" | "month")}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="period">Por período</SelectItem>
              <SelectItem value="month">Por mes</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Conditional selector based on filter type */}
          {filterType === "period" ? (
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Último mes</SelectItem>
                <SelectItem value="3">Últimos 3 meses</SelectItem>
                <SelectItem value="6">Últimos 6 meses</SelectItem>
                <SelectItem value="12">Último año</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar mes" />
              </SelectTrigger>
              <SelectContent>
                {MONTH_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Ingresos Reales"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          description={`Reservas: ${formatCurrency(data.bookingsRevenue)} | Bonos: ${formatCurrency(data.ordersRevenue)}`}
          highlight
        />
        <KPICard
          title="Valor Canjeado"
          value={formatCurrency(data.totalRedeemedValue)}
          icon={Key}
          description="Valor de códigos usados en el período"
          variant="secondary"
        />
        <KPICard
          title="Reservas Confirmadas"
          value={data.confirmedBookings.toString()}
          icon={Calendar}
          description={`${data.pendingBookings} pendientes, ${data.cancelledBookings} canceladas`}
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
            <div className="text-2xl font-bold" style={{ color: 'hsl(160, 84%, 39%)' }}>{data.usedCodes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Códigos Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'hsl(200, 98%, 39%)' }}>{data.availableCodes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Códigos Expirados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{data.expiredCodes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Income vs Redeemed Value by Month */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ingresos vs Valor Canjeado por Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.redeemedValueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Mes: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Ingresos (Bonos)" fill="#0088FE" />
                  <Bar dataKey="redeemed" name="Valor Canjeado" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Month (Bookings + Orders) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Ingresos Totales por Mes
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
                  <Bar dataKey="bookings" name="Sesiones Directas" fill="#0088FE" stackId="a" />
                  <Bar dataKey="orders" name="Bonos/GiftCards" fill="#00C49F" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 */}
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
              <ShoppingCart className="h-5 w-5" />
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
  highlight,
  variant,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  highlight?: boolean;
  variant?: "secondary";
}) {
  return (
    <Card className={highlight ? "border-primary/50 bg-primary/5" : variant === "secondary" ? "border-orange-200 bg-orange-50" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${highlight ? "text-primary" : variant === "secondary" ? "text-orange-600" : "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${highlight ? "text-primary" : variant === "secondary" ? "text-orange-700" : ""}`}>{value}</div>
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
  startDate: Date,
  endDate: Date
): { month: string; bookings: number; orders: number; total: number }[] {
  const result: Map<string, { bookings: number; orders: number }> = new Map();

  // Initialize months between startDate and endDate
  let current = startOfMonth(startDate);
  const end = startOfMonth(endDate);
  while (current <= end) {
    const key = format(current, "MMM yy", { locale: es });
    result.set(key, { bookings: 0, orders: 0 });
    current = addMonths(current, 1);
  }

  // Add confirmed bookings revenue
  bookings
    .filter(b => b.status === "CONFIRMED")
    .forEach(b => {
      const key = format(parseISO(b.created_at), "MMM yy", { locale: es });
      const currentData = result.get(key);
      if (currentData) {
        currentData.bookings += b.final_price || 0;
      }
    });

  // Add completed orders revenue
  orders
    .filter(o => o.status === "paid")
    .forEach(o => {
      const key = format(parseISO(o.created_at), "MMM yy", { locale: es });
      const currentData = result.get(key);
      if (currentData) {
        currentData.orders += o.final_price || 0;
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
  startDate: Date,
  endDate: Date
): { month: string; uses: number }[] {
  const result = new Map<string, number>();

  // Initialize months between startDate and endDate
  let current = startOfMonth(startDate);
  const end = startOfMonth(endDate);
  while (current <= end) {
    const key = format(current, "MMM yy", { locale: es });
    result.set(key, 0);
    current = addMonths(current, 1);
  }

  // Count bookings with coupons
  bookings
    .filter(b => b.coupon_id)
    .forEach(b => {
      const key = format(parseISO(b.created_at), "MMM yy", { locale: es });
      const currentVal = result.get(key);
      if (currentVal !== undefined) {
        result.set(key, currentVal + 1);
      }
    });

  // Count orders with coupons
  orders
    .filter(o => o.coupon_id)
    .forEach(o => {
      const key = format(parseISO(o.created_at), "MMM yy", { locale: es });
      const currentVal = result.get(key);
      if (currentVal !== undefined) {
        result.set(key, currentVal + 1);
      }
    });

  return Array.from(result.entries()).map(([month, uses]) => ({ month, uses }));
}

// Calculate total redeemed value from used session codes
function calculateRedeemedValue(
  usedCodes: { package_id: string | null }[],
  packagesDataMap: Map<string, { price: number; sessions: number }>
): number {
  return usedCodes.reduce((sum, code) => {
    if (!code.package_id) return sum;
    const pkg = packagesDataMap.get(code.package_id);
    if (!pkg || pkg.sessions === 0) return sum;
    return sum + (pkg.price / pkg.sessions);
  }, 0);
}

// Get redeemed value by month (income from package sales vs redeemed value)
function getRedeemedValueByMonth(
  orders: any[],
  usedCodes: { used_at: string | null; package_id: string | null }[],
  packagesDataMap: Map<string, { price: number; sessions: number }>,
  startDate: Date,
  endDate: Date
): { month: string; income: number; redeemed: number }[] {
  const result: Map<string, { income: number; redeemed: number }> = new Map();

  // Initialize months between startDate and endDate
  let current = startOfMonth(startDate);
  const end = startOfMonth(endDate);
  while (current <= end) {
    const key = format(current, "MMM yy", { locale: es });
    result.set(key, { income: 0, redeemed: 0 });
    current = addMonths(current, 1);
  }

  // Add completed orders revenue (income from package sales)
  orders
    .filter(o => o.status === "paid")
    .forEach(o => {
      const key = format(parseISO(o.created_at), "MMM yy", { locale: es });
      const currentData = result.get(key);
      if (currentData) {
        currentData.income += o.final_price || 0;
      }
    });

  // Add redeemed value from used session codes
  usedCodes.forEach(code => {
    if (!code.used_at || !code.package_id) return;
    const pkg = packagesDataMap.get(code.package_id);
    if (!pkg || pkg.sessions === 0) return;
    
    const codeValue = pkg.price / pkg.sessions;
    const key = format(parseISO(code.used_at), "MMM yy", { locale: es });
    const currentData = result.get(key);
    if (currentData) {
      currentData.redeemed += codeValue;
    }
  });

  return Array.from(result.entries()).map(([month, data]) => ({
    month,
    income: data.income,
    redeemed: Math.round(data.redeemed),
  }));
}
