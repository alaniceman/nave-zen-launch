import { useMemo } from "react";
import { useScheduleEntries } from "@/hooks/useScheduleEntries";
import { NextClassWidget } from "@/components/NextClassWidget";

// day_of_week convention (unified): 0=Domingo .. 6=Sábado
const DAY_KEYS = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'] as const;
const DAY_NAMES: Record<string, string> = {
  domingo: 'Domingo', lunes: 'Lunes', martes: 'Martes', miercoles: 'Miércoles',
  jueves: 'Jueves', viernes: 'Viernes', sabado: 'Sábado',
};

interface Props {
  /** Filter by service color_tag(s), e.g. ['wim-hof'] or ['yoga'] */
  tags: string[];
  /** Label prefix — default "Próxima clase" */
  labelPrefix?: string;
  /** Anchor / href when tapping the card */
  href?: string;
  /** Per-landing session-storage suffix so dismissals don't bleed across pages */
  storageKey?: string;
}

export const NextClassAutoWidget = ({ tags, labelPrefix, href, storageKey }: Props) => {
  const { data: scheduleData } = useScheduleEntries();

  const next = useMemo(() => {
    if (!scheduleData) return null;
    const nowCL = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" }));
    const jsDay = nowCL.getDay();
    const todayIdx = jsDay === 0 ? 6 : jsDay - 1;
    const nowMin = nowCL.getHours() * 60 + nowCL.getMinutes();
    for (let offset = 0; offset < 7; offset++) {
      const idx = (todayIdx + offset) % 7;
      const dayKey = DAY_KEYS[idx];
      const items = (scheduleData.scheduleData[dayKey] || [])
        .filter((i: { color_tag: string }) => tags.includes(i.color_tag))
        .sort((a: { time: string }, b: { time: string }) => a.time.localeCompare(b.time));
      for (const item of items) {
        const [h, m] = item.time.split(":").map(Number);
        const itemMin = h * 60 + m;
        if (offset > 0 || itemMin > nowMin) {
          return {
            item,
            when: offset === 0 ? "hoy" : offset === 1 ? "mañana" : DAY_NAMES[dayKey].toLowerCase(),
          };
        }
      }
    }
    return null;
  }, [scheduleData, tags]);

  if (!next) return null;
  return (
    <NextClassWidget
      when={next.when}
      time={next.item.time}
      title={next.item.title}
      instructor={next.item.instructor}
      href={href}
      labelPrefix={labelPrefix}
      storageKey={storageKey}
    />
  );
};
