import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Download, Ban } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SessionCode {
  id: string;
  code: string;
  buyer_email: string;
  buyer_name: string;
  buyer_phone: string;
  purchased_at: string;
  expires_at: string;
  is_used: boolean;
  used_at: string | null;
  used_in_booking_id: string | null;
  mercado_pago_payment_id: string | null;
  session_packages: {
    name: string;
  };
}

export default function AdminSessionCodes() {
  const [codes, setCodes] = useState<SessionCode[]>([]);
  const [filteredCodes, setFilteredCodes] = useState<SessionCode[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCodes();
  }, []);

  useEffect(() => {
    filterCodes();
  }, [codes, searchTerm, statusFilter]);

  const loadCodes = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("session_codes")
      .select("*, session_packages(name)")
      .order("purchased_at", { ascending: false });

    if (error) {
      toast.error("Error al cargar códigos");
      setIsLoading(false);
      return;
    }
    setCodes(data || []);
    setIsLoading(false);
  };

  const filterCodes = () => {
    let filtered = codes;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (code) =>
          code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          code.buyer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          code.buyer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter === "used") {
      filtered = filtered.filter((code) => code.is_used);
    } else if (statusFilter === "unused") {
      filtered = filtered.filter((code) => !code.is_used);
    } else if (statusFilter === "expired") {
      const now = new Date();
      filtered = filtered.filter(
        (code) => !code.is_used && new Date(code.expires_at) < now
      );
    }

    setFilteredCodes(filtered);
  };

  const exportToCSV = () => {
    const headers = [
      "Código",
      "Comprador",
      "Email",
      "Teléfono",
      "Paquete",
      "Comprado",
      "Expira",
      "Estado",
      "Usado en",
    ];
    
    const rows = filteredCodes.map((code) => [
      code.code,
      code.buyer_name,
      code.buyer_email,
      code.buyer_phone,
      code.session_packages?.name || "N/A",
      format(new Date(code.purchased_at), "dd/MM/yyyy HH:mm", { locale: es }),
      format(new Date(code.expires_at), "dd/MM/yyyy", { locale: es }),
      code.is_used ? "Usado" : "Disponible",
      code.used_at ? format(new Date(code.used_at), "dd/MM/yyyy HH:mm", { locale: es }) : "N/A",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `codigos-sesiones-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const markAsUsed = async (code: SessionCode) => {
    if (!confirm(`¿Marcar el código ${code.code} como usado? Esto es equivalente a que la persona asistió.`)) return;
    
    const { error } = await supabase
      .from("session_codes")
      .update({ is_used: true, used_at: new Date().toISOString() })
      .eq("id", code.id);

    if (error) {
      toast.error("Error al desactivar el código");
      return;
    }
    toast.success(`Código ${code.code} marcado como usado`);
    loadCodes();
  };

  const getStatusBadge = (code: SessionCode) => {
    if (code.is_used) {
      return <Badge variant="secondary">Usado</Badge>;
    }
    
    const now = new Date();
    const expiresAt = new Date(code.expires_at);
    
    if (now > expiresAt) {
      return <Badge variant="destructive">Expirado</Badge>;
    }
    
    return <Badge variant="default">Disponible</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Códigos de Sesión</h1>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </Button>
      </div>

      <Card className="p-6">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="search">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Código, email, nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="status">Estado</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="unused">Disponibles</SelectItem>
                <SelectItem value="used">Usados</SelectItem>
                <SelectItem value="expired">Expirados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{filteredCodes.length}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Cargando...</p>
          ) : filteredCodes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No se encontraron códigos</p>
          ) : (
            filteredCodes.map((code) => (
              <Card key={code.id} className="p-4">
                <div className="grid md:grid-cols-5 gap-4 items-start">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Código</p>
                    <p className="font-mono font-bold text-lg">{code.code}</p>
                    {getStatusBadge(code)}
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Comprador</p>
                    <p className="font-semibold">{code.buyer_name}</p>
                    <p className="text-sm text-muted-foreground">{code.buyer_email}</p>
                    <p className="text-sm text-muted-foreground">{code.buyer_phone}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Paquete</p>
                    <p className="text-sm font-medium">{code.session_packages?.name || "N/A"}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Fechas</p>
                    <p className="text-sm">
                      <strong>Comprado:</strong>{" "}
                      {format(new Date(code.purchased_at), "dd/MM/yyyy", { locale: es })}
                    </p>
                    <p className="text-sm">
                      <strong>Expira:</strong>{" "}
                      {format(new Date(code.expires_at), "dd/MM/yyyy", { locale: es })}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Uso</p>
                    {code.is_used ? (
                      <p className="text-sm">
                        {format(new Date(code.used_at!), "dd/MM/yyyy HH:mm", { locale: es })}
                      </p>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsUsed(code)}
                        className="mt-1"
                      >
                        <Ban className="h-3 w-3 mr-1" />
                        Marcar usado
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}