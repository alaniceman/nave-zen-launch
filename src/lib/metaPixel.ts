/**
 * Meta Pixel — utilidades compartidas y tipadas.
 *
 * Reglas:
 * - Un solo PageView por navegación SPA (lo dispara FacebookPixelRouterTracker).
 * - Eventos estándar usan `track`, el resto `trackCustom`.
 * - `eventID` determinista cuando el mismo evento también se envía por CAPI.
 * - Nunca se loguea PII.
 */

type Fbq = (...args: unknown[]) => void;

const getFbq = (): Fbq | undefined => {
  if (typeof window === "undefined") return undefined;
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  return typeof fbq === "function" ? fbq : undefined;
};

export const META_STANDARD_EVENTS = [
  "PageView",
  "ViewContent",
  "Search",
  "AddToCart",
  "AddToWishlist",
  "InitiateCheckout",
  "AddPaymentInfo",
  "Purchase",
  "Lead",
  "CompleteRegistration",
  "Contact",
  "CustomizeProduct",
  "Donate",
  "FindLocation",
  "Schedule",
  "StartTrial",
  "SubmitApplication",
  "Subscribe",
] as const;

export type MetaStandardEvent = (typeof META_STANDARD_EVENTS)[number];
export type MetaEventName = MetaStandardEvent | (string & {});
export type MetaEventParams = Record<string, string | number | boolean | string[] | undefined>;

const STANDARD = new Set<string>(META_STANDARD_EVENTS);

/** Guard en memoria para evitar dobles disparos por re-render o doble clic. */
const fired = new Set<string>();

export function hasFired(key: string): boolean {
  return fired.has(key);
}

export function markFired(key: string): void {
  fired.add(key);
}

/** event_id determinista: `${prefix}-${id}` (idéntico en Pixel y CAPI). */
export function deterministicEventId(prefix: string, id: string | number): string {
  return `${prefix}-${id}`;
}

/** event_id aleatorio para eventos sin entidad estable. */
export function randomEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** _fbp desde cookie. */
export function getFbp(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(/_fbp=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : undefined;
}

/**
 * Persistencia first-touch (sessionStorage, sin PII).
 * Guardamos sólo identificadores de click/campaña: fbc y UTMs.
 */
const FBC_KEY = "nave_meta_fbc";
const UTM_KEY = "nave_meta_utm";

function readStore(key: string): string | null {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return null;
    return window.sessionStorage.getItem(key);
  } catch {
    return null; // Safari privado / storage bloqueado
  }
}

function writeStore(key: string, value: string): void {
  try {
    if (typeof window === "undefined" || !window.sessionStorage) return;
    window.sessionStorage.setItem(key, value);
  } catch {
    // no-op: el tracking nunca debe romper la app
  }
}

/**
 * _fbc: cookie > valor persistido > derivado una única vez de un fbclid nuevo.
 * Nunca regenera el timestamp en llamadas sucesivas.
 */
export function getFbc(): string | undefined {
  if (typeof document === "undefined") return undefined;

  const cookie = document.cookie.match(/_fbc=([^;]+)/);
  if (cookie) {
    const value = decodeURIComponent(cookie[1]);
    writeStore(FBC_KEY, value);
    return value;
  }

  const stored = readStore(FBC_KEY) || undefined;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");

  // Si el fbclid de la URL ya es el que tenemos guardado, reutilizamos el valor.
  if (fbclid) {
    if (stored && stored.endsWith(`.${fbclid}`)) return stored;
    const derived = `fb.1.${Date.now()}.${fbclid}`;
    writeStore(FBC_KEY, derived);
    return derived;
  }

  return stored;
}

export type UtmParams = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

const UTM_KEYS: (keyof UtmParams)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

/**
 * UTMs de la URL actual si existen (y se persisten); si no, las guardadas
 * en la sesión, para que rutas posteriores conserven la atribución.
 */
export function getUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};

  const search = new URLSearchParams(window.location.search);
  const fromUrl: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = search.get(key);
    if (value) fromUrl[key] = value;
  }

  if (Object.keys(fromUrl).length > 0) {
    writeStore(UTM_KEY, JSON.stringify(fromUrl));
    return fromUrl;
  }

  const raw = readStore(UTM_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as UtmParams;
    const out: UtmParams = {};
    for (const key of UTM_KEYS) {
      const value = parsed?.[key];
      if (typeof value === "string" && value) out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

export type MetaBrowserContext = {
  fbp?: string;
  fbc?: string;
  eventSourceUrl?: string;
  referrer?: string;
} & UtmParams;

/** Contexto de navegador para enriquecer eventos server-side (sin PII). */
export function getMetaBrowserContext(): MetaBrowserContext {
  if (typeof window === "undefined") return {};
  return {
    fbp: getFbp(),
    fbc: getFbc(),
    eventSourceUrl: window.location.href,
    referrer: document.referrer || undefined,
    ...getUtmParams(),
  };
}

function cleanParams(params?: MetaEventParams): Record<string, unknown> | undefined {
  if (!params) return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

/** Envía un evento al Pixel. Devuelve el event_id usado (o undefined si no hay pixel). */
export function trackMetaEvent(
  eventName: MetaEventName,
  params?: MetaEventParams,
  eventId?: string
): string | undefined {
  const fbq = getFbq();
  if (!fbq) return eventId;
  const method = STANDARD.has(eventName) ? "track" : "trackCustom";
  const payload = cleanParams(params);
  if (eventId) {
    fbq(method, eventName, payload, { eventID: eventId });
  } else {
    fbq(method, eventName, payload);
  }
  return eventId;
}

/**
 * Igual que trackMetaEvent pero con guard de idempotencia por `dedupeKey`
 * (por defecto el event_id, si existe).
 */
export function trackMetaEventOnce(
  dedupeKey: string,
  eventName: MetaEventName,
  params?: MetaEventParams,
  eventId?: string
): boolean {
  if (fired.has(dedupeKey)) return false;
  fired.add(dedupeKey);
  trackMetaEvent(eventName, params, eventId);
  return true;
}

/**
 * PageView único por navegación.
 * `navKey` debe ser único por navegación (p.ej. `location.key` de react-router),
 * de modo que volver a una misma ruta sí cuente como un nuevo PageView.
 */
export function trackMetaPageView(navKey: string): void {
  trackMetaEventOnce(`pageview:${navKey}`, "PageView");
}
