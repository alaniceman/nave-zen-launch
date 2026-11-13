import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { icefestVisitSession } from '@/lib/icefestConversion';
export function useIcefestVisit(eventId: string | undefined) {
  useEffect(() => {
    if (!eventId || !['studiolanave.com', 'www.studiolanave.com', 'studiolanave.lovable.app'].includes(window.location.hostname) || navigator.webdriver) return;
    const record = async () => {
      try {
        const key = 'nave_icefest_visit';
        const raw = sessionStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : null;
        const previous = parsed && typeof parsed.id === 'string' && typeof parsed.lastSeen === 'number' ? parsed : null;
        const session = icefestVisitSession(previous, Date.now(), crypto.randomUUID());
        sessionStorage.setItem(key, JSON.stringify(session));
        const { error } = await supabase.rpc('icefest_record_visit', { _event_id: eventId, _session_id: session.id });
        if (error) console.warn('Icefest visit unavailable', error.code);
      } catch { /* Counting cannot block checkout. */ }
    };
    void record();
  }, [eventId]);
}
