import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Minus, Plus, Save } from "lucide-react";
import { toast } from "sonner";

type Cupo = {
  id: string;
  event_id: string;
  cupos_total: number;
  cupos_vendidos: number;
};

export default function EventCuposManager() {
  const [rows, setRows] = useState<Cupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("event_cupos")
      .select("id, event_id, cupos_total, cupos_vendidos")
      .order("event_id");
    if (error) toast.error("No se pudieron cargar los cupos");
    setRows((data || []) as Cupo[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = (id: string, patch: Partial<Cupo>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const save = async (row: Cupo) => {
    const total = Math.max(0, Math.floor(row.cupos_total || 0));
    const vendidos = Math.max(0, Math.floor(row.cupos_vendidos || 0));
    setSaving(row.id);
    const { error } = await supabase
      .from("event_cupos")
      .update({ cupos_total: total, cupos_vendidos: vendidos })
      .eq("id", row.id);
    setSaving(null);
    if (error) {
      toast.error("Error al guardar: " + error.message);
      return;
    }
    toast.success("Cupos actualizados");
    load();
  };

  const toggleSoldOut = async (row: Cupo) => {
    const sold = row.cupos_vendidos >= row.cupos_total;
    const next = sold
      ? { ...row, cupos_vendidos: Math.max(0, row.cupos_total - 1) }
      : { ...row, cupos_vendidos: row.cupos_total };
    update(row.id, next);
    await save(next);
  };

  return (
    <Card className="p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Cupos por taller</h2>
        <p className="text-sm text-muted-foreground">
          Ajusta cupos totales/ocupados o marca un taller como agotado para deshabilitar la compra.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => {
            const sold = r.cupos_vendidos >= r.cupos_total;
            const disponibles = Math.max(0, r.cupos_total - r.cupos_vendidos);
            return (
              <div
                key={r.id}
                className="flex flex-wrap items-end gap-3 rounded-lg border p-3"
              >
                <div className="min-w-[220px] flex-1">
                  <div className="font-medium text-sm">{r.event_id}</div>
                  <div className="mt-1 flex items-center gap-2">
                    {sold ? (
                      <Badge variant="destructive">Agotado</Badge>
                    ) : (
                      <Badge variant="default">{disponibles} disponibles</Badge>
                    )}
                  </div>
                </div>

                <div className="w-24">
                  <Label className="text-xs">Total</Label>
                  <Input
                    type="number"
                    min={0}
                    value={r.cupos_total}
                    onChange={(e) =>
                      update(r.id, { cupos_total: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="w-36">
                  <Label className="text-xs">Ocupados</Label>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        update(r.id, {
                          cupos_vendidos: Math.max(0, r.cupos_vendidos - 1),
                        })
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min={0}
                      value={r.cupos_vendidos}
                      onChange={(e) =>
                        update(r.id, { cupos_vendidos: Number(e.target.value) })
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        update(r.id, { cupos_vendidos: r.cupos_vendidos + 1 })
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => toggleSoldOut(r)}
                    disabled={saving === r.id}
                  >
                    {sold ? "Reabrir" : "Marcar agotado"}
                  </Button>
                  <Button onClick={() => save(r)} disabled={saving === r.id}>
                    {saving === r.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span className="ml-2">Guardar</span>
                  </Button>
                </div>
              </div>
            );
          })}
          {rows.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin talleres registrados.</p>
          )}
        </div>
      )}
    </Card>
  );
}
