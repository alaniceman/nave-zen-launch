export function icefestConversion(sales: number, visits: number): number | null {
  return visits > 0 ? sales / visits * 100 : null;
}
export function icefestVisitSession(previous: { id: string; lastSeen: number } | null, now: number, id: string) {
  return { id: previous && now - previous.lastSeen < 1800000 ? previous.id : id, lastSeen: now };
}
