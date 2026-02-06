import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  RefreshCw,
  Store,
  Activity,
  Send,
  Settings,
  Loader2,
} from "lucide-react";

export default function AdminMailerLite() {
  const queryClient = useQueryClient();
  const [accountIdInput, setAccountIdInput] = useState("");

  // Fetch config
  const { data: config, isLoading: configLoading } = useQuery({
    queryKey: ["mailerlite-config"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("integrations_mailerlite")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Fetch sync logs
  const { data: syncLogs, isLoading: logsLoading } = useQuery({
    queryKey: ["mailerlite-sync-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders_sync_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (config?.mailerlite_account_id) {
      setAccountIdInput(config.mailerlite_account_id);
    }
  }, [config]);

  // Save config mutation
  const saveConfigMutation = useMutation({
    mutationFn: async (accountId: string) => {
      if (config?.id) {
        const { error } = await supabase
          .from("integrations_mailerlite")
          .update({ mailerlite_account_id: accountId })
          .eq("id", config.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("integrations_mailerlite")
          .insert({
            mailerlite_account_id: accountId,
            shop_name: "Nave Studio CLP 2026",
            currency: "CLP",
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mailerlite-config"] });
      toast.success("Account ID guardado correctamente");
    },
    onError: (e: any) => toast.error("Error: " + e.message),
  });

  // Health check mutation
  const healthCheckMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "mailerlite-init-shop",
        { body: { action: "health_check" } }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    },
    onError: (e: any) => toast.error("Error: " + e.message),
  });

  // Init shop mutation
  const initShopMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "mailerlite-init-shop",
        { body: { action: "init_shop" } }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["mailerlite-config"] });
      toast.success(`Shop creado: ${data.shop_id}`);
    },
    onError: (e: any) => toast.error("Error: " + e.message),
  });

  // Test order mutation
  const testOrderMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "mailerlite-sync-order",
        {
          body: {
            order_id: `test-${Date.now()}`,
            order_type: "manual_test",
            total: 1000,
            subtotal: 1000,
            customer_email: "test@studiolanave.com",
            customer_name: "Test Nave Studio",
            items: [
              {
                product_id: "test-product-001",
                name: "Orden de prueba MailerLite",
                quantity: 1,
                price: 1000,
              },
            ],
          },
        }
      );
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["mailerlite-sync-logs"] });
      if (data.status === "success") {
        toast.success("Orden de prueba enviada correctamente");
      } else if (data.status === "already_synced") {
        toast.info("Orden ya sincronizada previamente");
      } else {
        toast.error("Error al enviar orden: " + (data.error || "desconocido"));
      }
    },
    onError: (e: any) => toast.error("Error: " + e.message),
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">MailerLite E-commerce</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configuración de shop e-commerce y atribución de campañas
        </p>
      </div>

      {/* Configuration */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración
            </CardTitle>
            <CardDescription>Account ID y estado del shop</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="account-id">MailerLite Account ID</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="account-id"
                  value={accountIdInput}
                  onChange={(e) => setAccountIdInput(e.target.value)}
                  placeholder="Ej: 1234567"
                  className="flex-1"
                />
                <Button
                  onClick={() => saveConfigMutation.mutate(accountIdInput)}
                  disabled={saveConfigMutation.isPending || !accountIdInput}
                  size="sm"
                >
                  {saveConfigMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Guardar"
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Se usa para el Universal JS (tracking de atribución)
              </p>
            </div>

            <div className="pt-2 border-t space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Shop ID</span>
                {config?.mailerlite_shop_id ? (
                  <Badge variant="outline" className="font-mono text-xs">
                    {config.mailerlite_shop_id}
                  </Badge>
                ) : (
                  <Badge variant="secondary">No configurado</Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Nombre</span>
                <span className="text-sm text-gray-600">
                  {config?.shop_name || "—"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Moneda</span>
                <span className="text-sm text-gray-600">
                  {config?.currency || "CLP"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Universal JS</span>
                {config?.mailerlite_account_id ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Activo
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    Sin Account ID
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Acciones
            </CardTitle>
            <CardDescription>Health check, crear shop, orden de prueba</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => healthCheckMutation.mutate()}
              disabled={healthCheckMutation.isPending}
              variant="outline"
              className="w-full justify-start"
            >
              {healthCheckMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Health Check API
            </Button>

            <Button
              onClick={() => initShopMutation.mutate()}
              disabled={initShopMutation.isPending}
              variant="outline"
              className="w-full justify-start"
            >
              {initShopMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Store className="h-4 w-4 mr-2" />
              )}
              {config?.mailerlite_shop_id
                ? "Verificar Shop"
                : "Crear Shop Nuevo"}
            </Button>

            <Button
              onClick={() => testOrderMutation.mutate()}
              disabled={testOrderMutation.isPending || !config?.mailerlite_shop_id}
              variant="outline"
              className="w-full justify-start"
            >
              {testOrderMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Enviar Orden de Prueba
            </Button>

            {!config?.mailerlite_shop_id && (
              <p className="text-xs text-amber-600">
                ⚠️ Debes crear el shop antes de enviar órdenes de prueba
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sync Logs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Logs de Sincronización</CardTitle>
            <CardDescription>Últimas 20 sincronizaciones</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["mailerlite-sync-logs"],
              })
            }
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : !syncLogs?.length ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No hay logs de sincronización aún
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>HTTP</TableHead>
                    <TableHead>Error</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncLogs.map((log: any) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString("es-CL")}
                      </TableCell>
                      <TableCell className="font-mono text-xs max-w-[120px] truncate">
                        {log.order_id}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {log.order_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.status === "success" ? (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            ✓ OK
                          </Badge>
                        ) : log.status === "pending" ? (
                          <Badge variant="secondary" className="text-xs">
                            Pendiente
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            Error
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">{log.http_status || "—"}</TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate text-red-600">
                        {log.error_message || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
