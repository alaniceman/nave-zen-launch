// Experience catalog and utilities for schedule filtering
import type { ClassItem } from "../data/schedule";

export type ScheduleItem = ClassItem;

export const EXPERIENCE_CATALOG = [
  {
    slug: "agua-fria",
    label: "Método Wim Hof (Breathwork + Ice Bath)",
    labelShort: "Agua Fría",
    match: (item: ScheduleItem) =>
      /m(é|e)todo\s*wim\s*hof/i.test(item.title) &&
      (/ice\s*bath|inmersi(ó|o)n|personalizad/i.test(item.title)),
    metaNote: null,
  },
  {
    slug: "yoga",
    label: "Yoga (Yin · Yang · Vinyasa · Vinyasa Somático · Integral · Power)",
    labelShort: "Yoga",
    match: (item: ScheduleItem) =>
      /\byoga\b/i.test(item.title) ||
      /\b(yin|yang|vinyasa|integral|power|som[aá]tic[oa]?)\b\s*yoga/i.test(item.title) ||
      /vinyasa\s+som[aá]tic[oa]?/i.test(item.title),
    metaNote: null,
  },
  // "wim-hof-personalizado" and "breathwork" hidden until they have scheduled classes
] as const;

export function ensureYangHasIceOptional(item: ScheduleItem): ScheduleItem {
  const isYang = /\byang\s*yoga/i.test(item.title);
  const hasIceBadge = (item.badges || []).some(b => /ice\s*bath.*opcional/i.test(b));
  
  if (isYang && !hasIceBadge) {
    return { 
      ...item, 
      badges: [...(item.badges || []), "Ice Bath (opcional)"] 
    };
  }
  
  return item;
}
