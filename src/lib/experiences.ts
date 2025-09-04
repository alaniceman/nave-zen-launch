// Experience catalog and utilities for schedule filtering
import type { ClassItem } from "../data/schedule";

export type ScheduleItem = ClassItem;

export const EXPERIENCE_CATALOG = [
  {
    slug: "wim-hof-group",
    label: "Método Wim Hof (Breathwork + Ice Bath)",
    match: (item: ScheduleItem) =>
      /m(é|e)todo\s*wim\s*hof/i.test(item.title) &&
      /ice\s*bath|inmersi(ó|o)n/i.test(item.title) &&
      !/personalizad/i.test(item.title),
    metaNote: null,
  },
  {
    slug: "wim-hof-personalizado",
    label: "Personalizado Método Wim Hof",
    match: (item: ScheduleItem) =>
      /personalizad/i.test(item.title) && /wim\s*hof/i.test(item.title),
    metaNote: "Máx 1–2 personas",
  },
  {
    slug: "biohacking",
    label: "Biohacking (Breathwork + HIIT + Ice Bath)",
    match: (item: ScheduleItem) => /biohacking/i.test(item.title),
    metaNote: null,
  },
  {
    slug: "breathwork",
    label: "Breathwork & Meditación",
    match: (item: ScheduleItem) =>
      /breathwork|meditaci(ó|o)n/i.test(item.title) &&
      !/wim\s*hof.*ice\s*bath/i.test(item.title),
    metaNote: null,
  },
  {
    slug: "yoga",
    label: "Yoga (Yin · Yang · Vinyasa · Integral · Power)",
    match: (item: ScheduleItem) =>
      /\byoga\b/i.test(item.title) ||
      /\b(yin|yang|vinyasa|integral|power)\b\s*yoga/i.test(item.title),
    metaNote: null,
  },
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