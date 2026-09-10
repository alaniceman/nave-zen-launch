import { useLocation } from "react-router-dom";

// Promo 18 de Septiembre — Bautizo de Hielo + Yoga
// Vigente hasta el 30 de septiembre 2026, 23:59 (Chile, UTC-3)
export const PROMO_18_PACKAGE_ID = "e6a2a1b0-ba4c-49a9-bcfd-43a840419084";
export const PROMO_18_PATH = "/promo-18-septiembre";
export const PROMO_18_NAME = "Pack 18 · Bautizo de Hielo + Yoga";
export const PROMO_18_PRICE = 60000;
export const PROMO_18_REGULAR_PRICE = 120000;
export const PROMO_18_END_DATE = new Date("2026-10-01T02:59:59Z");

export function isPromo18Active(now: Date = new Date()): boolean {
  return now < PROMO_18_END_DATE;
}

/** Muestra la barra superior sólo si la promo está vigente y no estamos en su landing ni en el admin. */
export function usePromo18Banner(): boolean {
  const { pathname } = useLocation();
  if (!isPromo18Active()) return false;
  if (pathname.startsWith("/admin")) return false;
  if (pathname === PROMO_18_PATH || pathname === "/promo-18") return false;
  return true;
}

export const PROMO_18_BANNER_HEIGHT = 36;
