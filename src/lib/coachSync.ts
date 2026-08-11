import { coaches } from "@/data/coaches";

/** Aliases for professional names stored in the DB that differ from the coach display name */
const NAME_ALIASES: Record<string, string> = {
  "mariela carrasco": "mar",
  "mar carrasco": "mar",
  "ambar vidal": "amber",
  "ámbar vidal": "amber",
};

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/** Resolve a professional name (from schedule_entries) to a coach id in src/data/coaches.ts */
export function resolveCoachId(professionalName?: string | null): string | null {
  if (!professionalName) return null;
  const target = normalize(professionalName);

  const alias = NAME_ALIASES[target];
  if (alias) return alias;

  const exact = coaches.find((c) => normalize(c.name) === target);
  if (exact) return exact.id;

  // Match by first name (e.g. "Maral Hekmat" -> "maral")
  const firstName = target.split(" ")[0];
  const byFirst = coaches.find((c) => normalize(c.name).split(" ")[0] === firstName);
  return byFirst ? byFirst.id : null;
}

/**
 * Derive the list of coach ids that actually teach the given schedule items,
 * keeping the order used in src/data/coaches.ts.
 */
export function coachIdsFromScheduleItems(
  items: Array<{ instructor?: string | null }>,
  fallback: string[] = []
): string[] {
  const ids = new Set<string>();
  for (const item of items) {
    const id = resolveCoachId(item.instructor);
    if (id) ids.add(id);
  }
  const found = coaches.filter((c) => ids.has(c.id)).map((c) => c.id);
  return found.length > 0 ? found : fallback;
}
