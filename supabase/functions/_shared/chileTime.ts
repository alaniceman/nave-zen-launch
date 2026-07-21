// Chile timezone helpers. Never hardcode day names or UTC offsets.

export const TIMEZONE = "America/Santiago";

export function chileDateString(d: Date): string {
  // YYYY-MM-DD in Chile local time
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(d);
}

export function chileHour(d: Date): number {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: TIMEZONE,
      hour: "2-digit",
      hour12: false,
    }).format(d),
  );
}

export function formatChileLongDate(isoDate: string): string {
  // isoDate is YYYY-MM-DD; interpret at noon to avoid DST edge cases.
  const d = new Date(isoDate + "T12:00:00Z");
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatChileTime(iso: string): string {
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

// Add N calendar days to a YYYY-MM-DD, respecting Chile calendar days.
export function addDaysISO(isoDate: string, days: number): string {
  const d = new Date(isoDate + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(startISO: string, endISO: string): number {
  const a = new Date(startISO + "T12:00:00Z").getTime();
  const b = new Date(endISO + "T12:00:00Z").getTime();
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}
