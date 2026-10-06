import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CyberStockRow, useCyberStock } from "@/hooks/useCyberStock";

const Row = ({ row }: { row: CyberStockRow }) => {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [total, setTotal] = useState(row.total);
  const [saving, setSaving] = useState(false);
  useEffect(() => setTotal(row.total), [row.total]);
  const left = Math.max(0, row.total - row.sold);

  const save = async (patch: Partial<Pick<CyberStockRow, "total" | "sold">>) => {
    setSaving(true);
    const { error } = await supabase.from("cyber_stock").update(patch).eq("pool", row.pool);
    setSaving(false);
    if (error) return toast({ title: "No se pudo guardar", description: error.message, variant: "destructive" });
    qc.invalidateQueries({ queryKey: ["cyber-stock"] });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-foreground">{row.label}</h3>
          <p className="text-sm text-muted-foreground">Vendidos: {row.sold}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-primary leading-none">{left}</p>
          <p className="text-xs text-muted-foreground">quedan de {row.total}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled={saving || left === 0} onClick={() => save({ sold: row.sold + 1 })}>
          <Minus className="h-4 w-4 mr-1" /> Descontar 1 (venta interna)
        </Button>
        <Button variant="ghost" disabled={saving || row.sold === 0} onClick={() => save({ sold: row.sold - 1 })}>
          <Plus className="h-4 w-4 mr-1" /> Devolver 1
        </Button>
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground">Cupos totales</label>
          <Input type="number" min={0} value={total} onChange={(e) => setTotal(Math.max(0, Number(e.target.value) || 0))} />
        </div>
        <Button disabled={saving || total === row.total} onClick={() => save({ total })}>Guardar</Button>
      </div>
    </div>
  );
};

const AdminCyberStock = () => {
  const { data, isLoading } = useCyberStock();
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Cyber · Cupos</h1>
        <p className="text-sm text-muted-foreground">
          Las compras pagadas en la web se descuentan solas. Usa "Descontar 1" cuando vendas por fuera (WhatsApp, en el estudio).
          Al llegar a 0 la web muestra "Agotado" y no deja comprar. Las membresías de 3 meses no tienen límite.
        </p>
      </div>
      {isLoading ? <p>Cargando…</p> : (
        <div className="grid gap-4">{(data ?? []).map((r) => <Row key={r.pool} row={r} />)}</div>
      )}
    </div>
  );
};

export default AdminCyberStock;
