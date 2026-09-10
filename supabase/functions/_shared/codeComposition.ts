// Reparte los códigos de un paquete por tipo de sesión (ej: 2 Wim Hof + 4 Yoga).
// Si el paquete no tiene code_composition, todos los códigos sirven para
// applicable_service_ids completo (comportamiento histórico).

export interface CodeCompositionEntry {
  label: string;
  count: number;
  service_ids: string[];
}

export interface CodePlanSlot {
  label: string | null;
  serviceIds: string[];
}

export function buildCodePlan(pkg: {
  sessions_quantity: number;
  applicable_service_ids: string[];
  code_composition?: unknown;
}): CodePlanSlot[] {
  const total = pkg.sessions_quantity;
  const raw = pkg.code_composition;
  const composition: CodeCompositionEntry[] = Array.isArray(raw)
    ? (raw as CodeCompositionEntry[]).filter(
        (e) => e && Array.isArray(e.service_ids) && Number(e.count) > 0
      )
    : [];

  if (composition.length === 0) {
    return Array.from({ length: total }, () => ({
      label: null,
      serviceIds: pkg.applicable_service_ids,
    }));
  }

  const slots: CodePlanSlot[] = [];
  for (const entry of composition) {
    for (let i = 0; i < Number(entry.count); i++) {
      slots.push({ label: entry.label || null, serviceIds: entry.service_ids });
    }
  }

  // Ajuste defensivo por si la suma no coincide con sessions_quantity
  while (slots.length < total) {
    slots.push({ label: null, serviceIds: pkg.applicable_service_ids });
  }
  return slots.slice(0, total);
}

export function buildCodeGroups(
  slots: CodePlanSlot[],
  codes: string[]
): { label: string; codes: string[] }[] | null {
  if (!slots.some((s) => s.label)) return null;
  const map = new Map<string, string[]>();
  slots.forEach((slot, i) => {
    if (!codes[i]) return;
    const key = slot.label || "Sesiones";
    const list = map.get(key) || [];
    list.push(codes[i]);
    map.set(key, list);
  });
  return Array.from(map.entries()).map(([label, codes]) => ({ label, codes }));
}
