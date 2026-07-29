// Promo Invierno — vigente hasta el 31 de julio 2026, 23:59 (Chile, UTC-4)
export const PROMO_INVIERNO_PACKAGE_ID = "577d13fc-590e-4e9f-a99e-18cc1e62e414";
export const PROMO_INVIERNO_END_DATE = new Date("2026-08-01T03:59:59Z");

export function isPromoInviernoActive(now: Date = new Date()): boolean {
  return now < PROMO_INVIERNO_END_DATE;
}
