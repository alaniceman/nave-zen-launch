import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { activeIcefestTier, type IcefestEvent, type IcefestTier } from '@/lib/icefest';

export function useIcefestEvent() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);
  const query = useQuery({
    queryKey: ['icefest', 'icefest-santiago'],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase.from('icefest_events')
        .select('*, icefest_ticket_types(*)').eq('slug', 'icefest-santiago')
        .eq('is_active', true).abortSignal(signal).maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('El evento no está disponible en este momento.');
      const { icefest_ticket_types, ...event } = data;
      return { event: event as IcefestEvent, tiers: icefest_ticket_types as IcefestTier[] };
    },
    staleTime: 30000,
    refetchInterval: 60000,
    refetchIntervalInBackground: false,
    retry: 1,
  });
  const event = query.data?.event ?? null;
  const tiers = query.data?.tiers ?? [];
  const tier = activeIcefestTier(tiers, now);
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  return { ...query, event, tiers, tier, now, canBuy: Boolean(event?.sales_open && tier && event.date >= today && !query.isError) };
}