export const ATTRIBUTION_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid'] as const;
export type Touch = Partial<Record<typeof ATTRIBUTION_KEYS[number], string>> & { captured_at: string; captured_at_chile: string; timezone: 'America/Santiago'; landing_page: string };
export type Attribution = { first_touch?: Touch; last_touch?: Touch };
export function cleanTouch(value: unknown): Touch | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const v = value as Record<string, unknown>;
  if (typeof v.captured_at !== 'string' || !Number.isFinite(Date.parse(v.captured_at)) || typeof v.landing_page !== 'string' || !v.landing_page.startsWith('/') || v.landing_page.startsWith('//')) return undefined;
  const out: Touch = { captured_at: v.captured_at, captured_at_chile: typeof v.captured_at_chile === 'string' ? v.captured_at_chile.slice(0,100) : '', timezone: 'America/Santiago', landing_page: v.landing_page.slice(0,2000) };
  for (const k of ATTRIBUTION_KEYS) if (typeof v[k] === 'string' && v[k]) out[k] = v[k].slice(0,300);
  return out;
}
export function cleanAttribution(value: unknown): Attribution {
  const v = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  return { first_touch: cleanTouch(v.first_touch), last_touch: cleanTouch(v.last_touch) };
}
export function attributionOrigin(context: unknown, first = false): string {
  const c = context && typeof context === 'object' ? context as Record<string, any> : {};
  const touch = cleanTouch(first ? c.first_touch : c.last_touch);
  const old = c.utm || {};
  const source = touch?.utm_source || old.source;
  if (source === 'directo') return 'Directo';
  if (!source && !touch && !Object.values(old).some(Boolean)) return 'Sin atribución';
  return [source || (touch?.fbclid ? 'facebook' : touch?.gclid ? 'google' : '—'), touch?.utm_medium || old.medium || '—', touch?.utm_campaign || old.campaign || '—', touch?.utm_content || old.content || '—'].join(' / ');
}