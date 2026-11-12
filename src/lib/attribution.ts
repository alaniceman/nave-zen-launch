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
  try {
    const cookies = document.cookie.split('; ');
    const count = Number(cookies.find(c=>c.startsWith(`${ATTRIBUTION_KEY}_count=`))?.split('=')[1]);
    if (count > 0 && count <= 30) {
      let raw='';
      for (let i=0;i<count;i++) raw += cookies.find(c=>c.startsWith(`${ATTRIBUTION_KEY}_${i}=`))?.split('=').slice(1).join('=') || '';
      candidates.push(decodeURIComponent(raw));
    }
  } catch { /* blocked/corrupt */ }
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
    let campaign = Object.keys(params).length > 0;
    // Preserve the existing session attribution when upgrading an active visit.
    if (!previous?.first_touch && !campaign) try {
      const old = JSON.parse(sessionStorage.getItem('nave_meta_utm') || '{}');
      for (const key of ATTRIBUTION_KEYS) if (typeof old[key] === 'string' && old[key]) params[key] = old[key].slice(0,300);
      campaign = Object.keys(params).length > 0;
    } catch { /* blocked/corrupt */ }
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
    // Chunk encoded data below the browser's per-cookie size limit.
    try {
      const encoded = encodeURIComponent(raw);
      const suffix = `; Path=/; Max-Age=${Math.max(0, Math.floor((expires_at-Date.now())/1000))}; SameSite=Lax${url.protocol === 'https:' ? '; Secure' : ''}`;
      document.cookie = `${ATTRIBUTION_KEY}=; Path=/; Max-Age=0`;
      const count = Math.ceil(encoded.length / 3000);
      document.cookie = `${ATTRIBUTION_KEY}_count=${count}${suffix}`;
      for (let i=0;i<count;i++) document.cookie = `${ATTRIBUTION_KEY}_${i}=${encoded.slice(i*3000,(i+1)*3000)}${suffix}`;
    } catch { /* blocked */ }
    return { first_touch, last_touch };
  } catch { return {}; }
}