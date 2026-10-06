import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type CyberPool = "paquetes" | "semestral" | "anual";

export type CyberStockRow = { pool: string; label: string; total: number; sold: number; sort_order: number };

/** Cupos reales de la campaña Cyber (se descuentan al confirmarse el pago o manualmente en el admin). */
export function useCyberStock() {
  return useQuery({
    queryKey: ["cyber-stock"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cyber_stock").select("*").order("sort_order");
      if (error) throw error;
      return (data ?? []) as CyberStockRow[];
    },
    refetchInterval: 60_000,
  });
}

export function stockFor(rows: CyberStockRow[] | undefined, pool: CyberPool | null) {
  if (!pool || !rows) return null;
  const r = rows.find((x) => x.pool === pool);
  if (!r) return null;
  return { total: r.total, left: Math.max(0, r.total - r.sold) };
}

export const poolForDuration = (d: number): CyberPool | null => (d === 7 ? "semestral" : d === 14 ? "anual" : null);
