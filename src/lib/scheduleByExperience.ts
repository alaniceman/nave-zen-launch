import { scheduleData, dayNames } from "../data/schedule";
import { EXPERIENCE_CATALOG, ensureYangHasIceOptional, type ScheduleItem } from "./experiences";

const DAY_ORDER = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] as const;
type DayKey = typeof DAY_ORDER[number];

export function weeklyByExperience(expSlug: string) {
  const exp = EXPERIENCE_CATALOG.find(e => e.slug === expSlug);
  if (!exp) return [];

  return DAY_ORDER.map((day) => {
    const daySchedule = scheduleData[day] || [];
    const items = daySchedule
      .filter(exp.match)
      .map(ensureYangHasIceOptional)
      .sort((a, b) => a.time.localeCompare(b.time))
      .map((item) => ({
        time: item.time,
        title: item.title,
        instructor: item.instructor || null,
        badges: item.badges || [],
        pronto: item.slug === "pronto",
        metaNote: exp.metaNote,
      }));
    
    return { 
      day, 
      dayName: dayNames[day as keyof typeof dayNames],
      items 
    };
  }).filter(block => block.items.length > 0);
}