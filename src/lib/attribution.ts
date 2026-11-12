import { ATTRIBUTION_KEYS, cleanAttribution, type Attribution, type Touch } from '../../supabase/functions/_shared/attribution';
export { attributionOrigin } from '../../supabase/functions/_shared/attribution';
export type { Attribution, Touch } from '../../supabase/functions/_shared/attribution';
export const ATTRIBUTION_KEY = 'nave_attribution';
export const ATTRIBUTION_TTL = 90 * 24 * 60 * 60 * 1000;
let volatile: { expires_at: number; first_touch?: Touch; last_touch?: Touch } | undefined;
let lastUrl = '';
function read(): typeof volatile {
  if (typeof window === 'undefined') return undefined;
  const candidates: string[] = [];
  try { const v = localStorage.getItem(ATTRIBUTION_KEY); if (v) candidates.push(v); } catch { /* blocked */ }
  try { const v = document.cookie.split('; ').find(c => c.startsWith(`${ATTRIBUTION_KEY}=`)); if (v) candidates.push(decodeURIComponent(v.slice(ATTRIBUTION_KEY.length + 1))); } catch { /* blocked */ }
  for (const raw of candidates) try { const v = JSON.parse(raw); if (v.expires_at > Date.now()) return { ...cleanAttribution(v), expires_at: v.expires_at }; } catch { /* corrupt */ }
  return volatile && volatile.expires_at > Date.now() ? volatile : undefined;
}
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  try {
    const previous = read();
    const url = new URL(window.location.href);
    const params: Partial<Touch> = {};
    for (const key of ATTRIBUTION_KEYS) { const v = url.searchParams.get(key); if (v) params[key] = v.slice(0,300); }
    const campaign = Object.keys(params).length > 0;
    let first_touch = previous?.first_touch, last_touch = previous?.last_touch;
    if (!first_touch || (campaign && lastUrl !== url.href)) {
      const now = new Date();
      let source = params.utm_source;
      if (!campaign) { try { const ref = document.referrer ? new URL(document.referrer) : null; source = ref && ref.origin !== url.origin ? ref.hostname : 'directo'; } catch { source = 'directo'; } }
      // Only campaign identifiers belong in storage: do not retain checkout tokens or personal query fields.
      const safeSearch = new URLSearchParams();
      for (const key of ATTRIBUTION_KEYS) if (params[key]) safeSearch.set(key, params[key]);
      const touch: Touch = { ...params, ...(source ? { utm_source: source } : {}), captured_at: now.toISOString(), captured_at_chile: now.toLocaleString('sv-SE', { timeZone: 'America/Santiago' }), timezone: 'America/Santiago', landing_page: url.pathname + (safeSearch.size ? `?${safeSearch}` : '') };
      first_touch ||= touch;
      last_touch = touch;
    }
    lastUrl = url.href;
    const expires_at = campaign && previous?.last_touch !== last_touch ? Date.now() + ATTRIBUTION_TTL : previous?.expires_at || Date.now() + ATTRIBUTION_TTL;
    volatile = { first_touch, last_touch, expires_at };
    const raw = JSON.stringify(volatile);
    try { localStorage.setItem(ATTRIBUTION_KEY, raw); } catch { /* blocked */ }
    try { document.cookie = `${ATTRIBUTION_KEY}=${encodeURIComponent(raw)}; Path=/; Max-Age=${Math.max(0, Math.floor((expires_at-Date.now())/1000))}; SameSite=Lax${url.protocol === 'https:' ? '; Secure' : ''}`; } catch { /* blocked */ }
    return { first_touch, last_touch };
  } catch { return {}; }
}