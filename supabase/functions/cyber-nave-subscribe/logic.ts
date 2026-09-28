export const MAX_NEW_KEYS = 4; // intentos con key nueva (el reintento incierto no cuenta)
export const RESEND_COOLDOWN_MS = 30 * 60_000; // reenvío deliberado tras "sent"
export const FAILED_COOLDOWN_MS = 60_000; // tras rechazo definitivo
export const UNCERTAIN_COOLDOWN_MS = 5_000; // reintento misma key
export const STALE_SENDING_MS = 2 * 60_000;

export type Sub = { delivery_status: string; delivery_attempts: number; last_attempt_at: string | null };

/** Decide si se puede reclamar un envío y con qué número de intento (= key). */
export type Claim =
  | { claim: true; fromStatus: string; attempt: number; newKey: boolean }
  | { claim: false; reply: "sent" | "processing" | "delivery_failed" | "delivery_exhausted" };

export function decideClaim(s: Sub, now: number): Claim {
  const last = s.last_attempt_at ? new Date(s.last_attempt_at).getTime() : 0;
  const age = now - last;
  const n = s.delivery_attempts;
  switch (s.delivery_status) {
    case "pending":
      return { claim: true, fromStatus: "pending", attempt: n + 1, newKey: true };
    case "uncertain":
      if (age < UNCERTAIN_COOLDOWN_MS) return { claim: false, reply: "processing" };
      return { claim: true, fromStatus: "uncertain", attempt: n, newKey: false };
    case "sending":
      if (age < STALE_SENDING_MS) return { claim: false, reply: "processing" };
      return { claim: true, fromStatus: "sending", attempt: n, newKey: false };
    case "failed":
      if (n >= MAX_NEW_KEYS) return { claim: false, reply: "delivery_exhausted" };
      if (age < FAILED_COOLDOWN_MS) return { claim: false, reply: "delivery_failed" };
      return { claim: true, fromStatus: "failed", attempt: n + 1, newKey: true };
    case "sent":
      if (n >= MAX_NEW_KEYS || age < RESEND_COOLDOWN_MS) return { claim: false, reply: "sent" };
      return { claim: true, fromStatus: "sent", attempt: n + 1, newKey: true };
    default:
      return { claim: false, reply: "processing" };
  }
}

/** Clasifica la respuesta de Resend. */
export function classifyResend(httpStatus: number | null, hasId: boolean): "sent" | "failed" | "uncertain" {
  if (httpStatus !== null && httpStatus >= 200 && httpStatus < 300 && hasId) return "sent";
  if (httpStatus === null) return "uncertain"; // red/timeout/secret ausente
  if (httpStatus === 409 || httpStatus === 429 || httpStatus >= 500) return "uncertain";
  if (httpStatus >= 200 && httpStatus < 300) return "uncertain"; // 2xx sin id: ambiguo
  return "failed";
}

export const idemKey = (id: string, attempt: number) => `cyber-nave-${id}-${attempt}`;
