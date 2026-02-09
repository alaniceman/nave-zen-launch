import { useMemo } from "react";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { dayNames, scheduleData, CL_TZ, type ClassItem } from "@/data/schedule";

interface TrialClassDetailProps {
  classItem: ClassItem;
  dayKey: string;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const DAY_INDEX: Record<string, number> = {
  domingo: 0, lunes: 1, martes: 2, miercoles: 3, jueves: 4, viernes: 5, sabado: 6
};

/** Generate upcoming dates for a given day-of-week, max 14 days out from today (Santiago TZ) */
const getUpcomingDates = (dayKey: string): Date[] => {
  const targetDow = DAY_INDEX[dayKey];
  if (targetDow === undefined) return [];

  // Today in Santiago
  const nowStr = new Date().toLocaleDateString("en-CA", { timeZone: CL_TZ }); // "YYYY-MM-DD"
  const today = new Date(nowStr + "T12:00:00"); // noon to avoid DST edge
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 14);

  const dates: Date[] = [];
  const cursor = new Date(today);
  // Advance to next occurrence of targetDow
  const diff = (targetDow - cursor.getDay() + 7) % 7;
  cursor.setDate(cursor.getDate() + (diff === 0 ? 0 : diff));
  // If today is the same dow but has already past class time, skip to next week? No — we keep it.

  while (cursor <= maxDate) {
    dates.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 7);
  }
  return dates;
};

const formatDate = (d: Date): string => {
  return d.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: CL_TZ
  });
};

const toISODate = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export default function TrialClassDetail({
  classItem,
  dayKey,
  selectedDate,
  onSelectDate,
  onBack,
  onContinue
}: TrialClassDetailProps) {
  const dates = useMemo(() => getUpcomingDates(dayKey), [dayKey]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-[#2E4D3A] font-medium mb-6 hover:underline">
        <ArrowLeft className="w-5 h-5" />
        Volver
      </button>

      {/* Class info block */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0] mb-6">
        <h2 className="text-2xl font-bold text-[#2E4D3A] mb-3">{classItem.title}</h2>
        {classItem.description && (
          <p className="text-[#575757] mb-4">{classItem.description}</p>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-[#575757]">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#2E4D3A]" />
            {dayNames[dayKey]}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#2E4D3A]" />
            {classItem.time} hrs
          </span>
          {classItem.instructor && (
            <span className="text-[#575757]">con {classItem.instructor}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-sm text-[#575757]">
          <MapPin className="w-4 h-4 text-[#2E4D3A]" />
          <a
            href="https://maps.app.goo.gl/YGMv9VjfZM6HPxEy8"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#2E4D3A]"
          >
            Antares 259, Las Condes
          </a>
        </div>
      </div>

      {/* Date selection */}
      <h3 className="text-lg font-semibold text-[#2E4D3A] mb-4">Selecciona una fecha</h3>
      <div className="space-y-3 mb-8">
        {dates.length === 0 && (
          <p className="text-[#575757] text-sm">No hay fechas disponibles en los próximos 14 días.</p>
        )}
        {dates.map(d => {
          const iso = toISODate(d);
          const isSelected = selectedDate === iso;
          return (
            <button
              key={iso}
              onClick={() => onSelectDate(iso)}
              className={`w-full text-left rounded-xl px-5 py-4 font-medium transition-all border ${
                isSelected
                  ? "bg-[#2E4D3A] text-white border-[#2E4D3A] shadow-sm"
                  : "bg-white text-[#2E4D3A] border-[#E2E8F0] hover:border-[#2E4D3A]/40 hover:bg-[#F8F9FA]"
              }`}
            >
              <span className="capitalize">{formatDate(d)}</span>
              <span className="block text-sm mt-0.5 opacity-70">{classItem.time} hrs</span>
            </button>
          );
        })}
      </div>

      {/* CTA */}
      <button
        onClick={onContinue}
        disabled={!selectedDate}
        className="w-full bg-[#2E4D3A] text-white font-semibold py-4 rounded-xl text-lg hover:bg-[#2E4D3A]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continuar
      </button>
    </div>
  );
}
