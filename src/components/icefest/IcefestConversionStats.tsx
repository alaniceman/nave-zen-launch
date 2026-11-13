import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { icefestConversion } from '@/lib/icefestConversion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
type Stats = { started_at: string | null; period_start: string | null; visits: number; sales: number };
export function IcefestConversionStats({ eventId }: { eventId: string }) {
  const [days, setDays] = useState('7');
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const load = useCallback(async () => {
    setLoading(true); setError(false);
    try {
      const result = await supabase.rpc('icefest_conversion_stats', { _event_id: eventId, _days: Number(days) });
      if (result.error) throw result.error;
      setStats(result.data as unknown as Stats);
    } catch { setError(true); } finally { setLoading(false); }
  }, [eventId, days]);
  useEffect(() => { void load(); }, [load]);
  const rate = stats ? icefestConversion(stats.sales, stats.visits) : null;
  return <section aria-label="Conversión Icefest" className="space-y-4 border-b pb-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">Conversión de ventas online</h2><div className="flex items-center gap-2"><Select value={days} onValueChange={setDays}><SelectTrigger className="w-48" aria-label="Período de conversión"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="7">Últimos 7 días</SelectItem><SelectItem value="30">Últimos 30 días</SelectItem><SelectItem value="0">Desde el inicio</SelectItem></SelectContent></Select><Button variant="outline" size="icon" aria-label="Actualizar conversión" disabled={loading} onClick={() => void load()}><RefreshCw className="h-4 w-4" /></Button></div></div>
    {error ? <p className="text-destructive">No se pudo cargar la conversión. <Button variant="link" onClick={() => void load()}>Reintentar</Button></p> : <><div className="flex flex-wrap gap-x-10 gap-y-4">{[['Compras pagadas', stats?.sales ?? '—'], ['Visitas a Icefest', stats?.visits ?? '—'], ['Tasa de conversión', rate === null ? '—' : `${rate.toLocaleString('es-CL', { maximumFractionDigits: 2 })}%`]].map(([label, value]) => <div key={label}><p className="text-sm text-muted-foreground">{label}</p><strong className="text-2xl">{loading ? '…' : value}</strong></div>)}</div><p className="text-sm text-muted-foreground">{stats?.started_at ? `Medición desde ${new Date(stats.started_at).toLocaleString('es-CL', { timeZone: 'America/Santiago' })}.` : 'Aún no hay visitas registradas en el sitio publicado.'} Compras online pagadas ÷ visitas × 100; no incluye inscripciones manuales ni compras anteriores al inicio de la medición.</p></>}
  </section>;
}
