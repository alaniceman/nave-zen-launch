import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Loader2, Search } from "lucide-react";

type Inscripcion = {
  id: string;
  event_id: string;
  nivel: string;
  taller_nombre: string;
  nombre: string;
  apellido: string;
  email: string;
  phone: string;
  fecha_evento: string;
  horario: string;
  amount: number;
  original_amount: number | null;
  discount_amount: number;
  coupon_code: string | null;
  status: string;
  mercado_pago_payment_id: string | null;
  mercado_pago_status: string | null;
  paid_at: string | null;
  cupo_reserved: boolean;
  notification_error: string | null;
  created_at: string;
};

const fmtDate = (d: string | null) =>
  d
    ? new Date(d).toLocaleString("es-CL", {
        timeZone: "America/Santiago",
        dateStyle: "short",
        timeStyle: "short",
      })
    : "—";

const statusVariant = (s: string) =>
  s === "paid" ? "default" : s === "pending" ? "secondary" : "destructive";

const confirmacionInfo = (i: Inscripcion) => {
  if (i.status !== "paid") return { label: "No aplica", variant: "outline" as const };
  if (i.notification_error) return { label: "Error", variant: "destructive" as const };
  return { label: "Enviada", variant: "default" as const };
};

export default function AdminTallerInscripciones() {
  const [rows, setRows] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tallerFilter, setTallerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmFilter, setConfirmFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("taller_inscripciones")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);
      setRows((data || []) as Inscripcion[]);
      setLoading(false);
    };
    load();
  }, []);

  const talleres = useMemo(() => {
    const map = new Map<string, string>();
    rows.forEach((r) =>
      map.set(r.event_id, `${r.taller_nombre} · ${r.fecha_evento}`)
    );
    return Array.from(map.entries());
  }, [rows]);

  const isAbandoned = (r: Inscripcion) =>
    r.status !== "paid" &&
    Date.now() - new Date(r.created_at).getTime() > 30 * 60 * 1000;

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (tallerFilter !== "all" && r.event_id !== tallerFilter) return false;
      if (statusFilter === "abandoned") {
        if (!isAbandoned(r)) return false;
      } else if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (confirmFilter !== "all") {
        const label = confirmacionInfo(r).label;
        if (confirmFilter === "sent" && label !== "Enviada") return false;
        if (confirmFilter === "error" && label !== "Error") return false;
        if (confirmFilter === "na" && label !== "No aplica") return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const hay = `${r.nombre} ${r.apellido} ${r.email} ${r.phone} ${r.coupon_code || ""} ${r.mercado_pago_payment_id || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, search, tallerFilter, statusFilter, confirmFilter]);

  const totalPagado = filtered
    .filter((r) => r.status === "paid")
    .reduce((sum, r) => sum + r.amount, 0);

  const exportCSV = () => {
    const headers = [
      "Fecha inscripción",
      "Taller",
      "Nivel",
      "Fecha evento",
      "Horario",
      "Nombre",
      "Email",
      "Teléfono",
      "Cupón",
      "Precio original",
      "Descuento",
      "Monto pagado",
      "Estado",
      "Estado MP",
      "MP Payment ID",
      "Pagado el",
      "Cupo reservado",
      "Confirmación",
      "Error notificación",
    ];
    const rowsCsv = filtered.map((r) => [
      fmtDate(r.created_at),
      r.taller_nombre,
      r.nivel,
      r.fecha_evento,
      r.horario,
      `${r.nombre} ${r.apellido}`,
      r.email,
      r.phone,
      r.coupon_code || "",
      r.original_amount ?? r.amount,
      r.discount_amount,
      r.amount,
      r.status,
      r.mercado_pago_status || "",
      r.mercado_pago_payment_id || "",
      fmtDate(r.paid_at),
      r.cupo_reserved ? "Sí" : "No",
      confirmacionInfo(r).label,
      r.notification_error || "",
    ]);
    const csv = [headers, ...rowsCsv]
      .map((row) =>
        row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `inscripciones-talleres-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Talleres · Inscripciones</h1>
          <p className="text-sm text-muted-foreground">
            Reservas por taller, estado de pago y envío de confirmación.
          </p>
        </div>
        <Button variant="outline" onClick={exportCSV} disabled={filtered.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      <Card className="p-4 grid gap-4 md:grid-cols-4">
        <div>
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              className="pl-10"
              placeholder="Nombre, email, teléfono..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label>Taller</Label>
          <Select value={tallerFilter} onValueChange={setTallerFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {talleres.map(([id, label]) => (
                <SelectItem key={id} value={id}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Estado de pago</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="paid">Pagados</SelectItem>
              <SelectItem value="abandoned">Carros abandonados (+30 min sin pagar)</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="rejected">Rechazados</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Confirmación</Label>
          <Select value={confirmFilter} onValueChange={setConfirmFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="sent">Enviada</SelectItem>
              <SelectItem value="error">Con error</SelectItem>
              <SelectItem value="na">No aplica</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Inscripciones</p>
          <p className="text-2xl font-bold">{filtered.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Pagadas</p>
          <p className="text-2xl font-bold">
            {filtered.filter((r) => r.status === "paid").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Recaudado</p>
          <p className="text-2xl font-bold">${totalPagado.toLocaleString("es-CL")}</p>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3">Fecha</th>
                <th className="p-3">Taller</th>
                <th className="p-3">Participante</th>
                <th className="p-3">Contacto</th>
                <th className="p-3 text-right">Monto</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Confirmación</th>
                <th className="p-3">Cupo</th>
                <th className="p-3">MP Payment</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const conf = confirmacionInfo(r);
                return (
                  <tr key={r.id} className="border-t align-top">
                    <td className="p-3 whitespace-nowrap">{fmtDate(r.created_at)}</td>
                    <td className="p-3">
                      <div className="font-medium">{r.taller_nombre}</div>
                      <div className="text-xs text-muted-foreground">
                        {r.fecha_evento} · {r.horario}
                      </div>
                    </td>
                    <td className="p-3 font-medium">
                      {r.nombre} {r.apellido}
                    </td>
                    <td className="p-3">
                      <div>{r.email}</div>
                      <div className="text-xs text-muted-foreground">{r.phone}</div>
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="font-semibold">
                        ${r.amount.toLocaleString("es-CL")}
                      </div>
                      {r.discount_amount > 0 && (
                        <div className="text-xs text-muted-foreground">
                          {r.coupon_code} −${r.discount_amount.toLocaleString("es-CL")}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge variant={statusVariant(r.status) as any}>{r.status}</Badge>
                      {r.paid_at && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {fmtDate(r.paid_at)}
                        </div>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge variant={conf.variant}>{conf.label}</Badge>
                      {r.notification_error && (
                        <div className="text-xs text-destructive mt-1 max-w-[200px] truncate">
                          {r.notification_error}
                        </div>
                      )}
                    </td>
                    <td className="p-3">{r.cupo_reserved ? "Sí" : "No"}</td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {r.mercado_pago_payment_id || "—"}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-muted-foreground">
                    Sin inscripciones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
