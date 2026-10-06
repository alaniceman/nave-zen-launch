import { cn } from "@/lib/utils";

export const StockBadge = ({ stock, className }: { stock: { total: number; left: number } | null; className?: string }) => {
  if (!stock) return null;
  const out = stock.left === 0;
  return (
    <div className={cn("rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2", className)}>
      <p className="font-inter text-sm font-semibold text-destructive">
        {out ? "Cupos Cyber agotados" : `Quedan ${stock.left} de ${stock.total} cupos Cyber`}
      </p>
      <div className="mt-1.5 h-1.5 w-full rounded-full bg-destructive/15 overflow-hidden">
        <div className="h-full bg-destructive" style={{ width: `${(stock.left / Math.max(1, stock.total)) * 100}%` }} />
      </div>
    </div>
  );
};
