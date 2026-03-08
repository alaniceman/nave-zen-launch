import { useState, useEffect } from "react";
import { Clock, XCircle } from "lucide-react";
import { dayNames, getTodayInSantiago } from "@/data/schedule";
import { EXPERIENCE_CATALOG } from "@/lib/experiences";
import { useScheduleEntries, type ScheduleClassItem } from "@/hooks/useScheduleEntries";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const DAY_ORDER = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] as const;

const getCardBgColor = (color_tag: string) => {
  switch (color_tag) {
    case 'wim-hof': return "bg-[#35C7D2]";
    case 'yoga': return "bg-[#2E4D3A]";
    case 'hiit': return "bg-[#C49A6C]";
    case 'breathwork': return "bg-[#7AA6A0]";
    case 'personalizado': return "bg-[#8C7A6B]";
    default: return "bg-[#35C7D2]";
  }
};

interface TrialScheduleCardsProps {
  onSelectClass: (classItem: ScheduleClassItem, dayKey: string) => void;
}

export default function TrialScheduleCards({ onSelectClass }: TrialScheduleCardsProps) {
  const navigate = useNavigate();
  const { data, isLoading } = useScheduleEntries();
  const scheduleData = data?.scheduleData || {};

  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const initialView = params.get("view") === "exp" ? "exp" : "day";

  const [viewMode, setViewMode] = useState<"day" | "exp">(initialView);
  const [expSlug, setExpSlug] = useState<string>(params.get("exp") || "yoga");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [todayKey, setTodayKey] = useState<string>("");

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    const today = getTodayInSantiago();
    setTodayKey(today);
    setSelectedDay(today);
  }, []);

  const dayTabs = [
    { key: "lunes", label: "Lun" }, { key: "martes", label: "Mar" },
    { key: "miercoles", label: "Mié" }, { key: "jueves", label: "Jue" },
    { key: "viernes", label: "Vie" }, { key: "sabado", label: "Sáb" },
    { key: "domingo", label: "Dom" }
  ];

  const getActiveDay = () => selectedDay || todayKey;
  const currentDayClasses = scheduleData[getActiveDay()] || [];
  const currentDayName = dayNames[getActiveDay()] || "";

  const experienceWeekData = viewMode === "exp" ? (() => {
    const exp = EXPERIENCE_CATALOG.find(e => e.slug === expSlug);
    if (!exp) return [];
    return DAY_ORDER.map((day) => {
      const daySchedule = scheduleData[day] || [];
      const items = daySchedule.filter(item => exp.match(item as any)).sort((a, b) => a.time.localeCompare(b.time));
      return { day, dayName: dayNames[day as keyof typeof dayNames], items };
    }).filter(block => block.items.length > 0);
  })() : [];

  const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
  const onTouchMove = (e: React.TouchEvent) => { setTouchEnd(e.targetTouches[0].clientX); };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > minSwipeDistance) {
      const currentIndex = dayTabs.findIndex(tab => tab.key === selectedDay);
      let newIndex = currentIndex;
      if (distance > 0 && currentIndex < dayTabs.length - 1) newIndex = currentIndex + 1;
      else if (distance < 0 && currentIndex > 0) newIndex = currentIndex - 1;
      if (newIndex !== currentIndex) setSelectedDay(dayTabs[newIndex].key);
    }
  };

  const handleClassAction = (classItem: ScheduleClassItem, dayKey: string) => {
    if (classItem.is_trial_enabled) {
      onSelectClass(classItem, dayKey);
    } else {
      navigate("/agenda-nave-studio");
    }
  };

  if (isLoading) {
    return (
      <section className="py-4 md:py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
        </div>
      </section>
    );
  }

  const renderCard = (classItem: ScheduleClassItem, dayKey: string, index: number, showDayAbbr = false) => (
    <div
      key={`${dayKey}-${index}`}
      className={`${getCardBgColor(classItem.color_tag)} text-white rounded-2xl px-5 py-5 shadow-sm relative`}
    >
      {showDayAbbr && (
        <div className="lg:hidden absolute top-3 right-3 text-xs font-medium text-white/80 bg-black/20 px-2 py-1 rounded backdrop-blur">
          {dayNames[dayKey]?.slice(0, 3).toUpperCase()}
        </div>
      )}

      {/* Time + Instructor */}
      <div className="flex items-center gap-2 text-white/90 text-lg md:text-xl font-semibold mb-1.5 pr-12 lg:pr-0">
        <Clock className="w-4.5 h-4.5 md:w-5 md:h-5 shrink-0" />
        {classItem.time} hrs
      </div>

      {/* Title */}
      <h3 className="text-white font-bold text-xl md:text-2xl leading-tight line-clamp-2 mb-1">
        {classItem.title}
      </h3>

      {/* Instructor */}
      {classItem.instructor && (
        <p className="text-white/70 text-sm mb-2">con {classItem.instructor}</p>
      )}

      {/* Description */}
      {classItem.description && (
        <p className="text-white/75 text-sm mb-3 line-clamp-2">{classItem.description}</p>
      )}

      {/* Badges */}
      {classItem.badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {classItem.badges.map((badge, i) => (
            <span key={i} className="bg-white/15 text-white rounded-full px-3 py-0.5 text-xs backdrop-blur inline-flex">
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="flex flex-col items-center gap-2 mt-4">
        {classItem.is_trial_enabled ? (
          <button
            onClick={() => handleClassAction(classItem, dayKey)}
            className="w-full sm:w-auto bg-white text-[#2E4D3A] font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-white/90 transition-colors shadow-sm"
          >
            Agendar clase de prueba
          </button>
        ) : (
          <>
            <span className="inline-flex items-center gap-1 bg-white/20 text-white/80 rounded-full px-3 py-1 text-xs backdrop-blur">
              <XCircle className="w-3.5 h-3.5" /> No permite clase de prueba
            </span>
            <button
              onClick={() => handleClassAction(classItem, dayKey)}
              className="w-full sm:w-auto bg-white/20 text-white font-medium text-sm px-5 py-2 rounded-full hover:bg-white/30 transition-colors backdrop-blur"
            >
              Agendar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <section className="py-4 md:py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* View toggle */}
        <div className="flex items-center justify-center gap-2 mb-6 md:mb-8">
          <button
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${viewMode === "day" ? "bg-[#2E4D3A] text-white shadow-sm" : "bg-white text-[#2E4D3A] border border-[#E2E8F0] hover:border-[#2E4D3A]/40 hover:bg-[#F8F9FA]"}`}
            onClick={() => setViewMode("day")}
          >
            📅 Por Día
          </button>
          <button
            className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${viewMode === "exp" ? "bg-[#2E4D3A] text-white shadow-sm" : "bg-white text-[#2E4D3A] border border-[#E2E8F0] hover:border-[#2E4D3A]/40 hover:bg-[#F8F9FA]"}`}
            onClick={() => setViewMode("exp")}
          >
            🎯 Por Experiencia
          </button>
        </div>

        {viewMode === "exp" && (
          <div className="mb-6 md:mb-8">
            <div className="text-sm font-medium text-[#575757] mb-3 text-center">Selecciona una experiencia:</div>
            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 justify-center flex-wrap">
              {EXPERIENCE_CATALOG.map(exp => (
                <button
                  key={exp.slug}
                  onClick={() => setExpSlug(exp.slug)}
                  className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 border transition-all text-sm font-medium ${expSlug === exp.slug ? "bg-[#2E4D3A] text-white border-[#2E4D3A] shadow-sm" : "bg-white text-[#2E4D3A] border-[#E2E8F0] hover:border-[#2E4D3A]/40 hover:bg-[#F8F9FA]"}`}
                >
                  {exp.labelShort ?? exp.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {viewMode === "day" ? (
          <>
            {/* Day tabs — centered on mobile */}
            <div className="flex gap-1.5 overflow-x-auto px-0 pb-2 mb-5 justify-center" role="tablist">
              {dayTabs.map(tab => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={selectedDay === tab.key}
                  onClick={() => setSelectedDay(tab.key)}
                  className={`rounded-full px-3.5 py-2 font-medium text-sm whitespace-nowrap transition-all ${selectedDay === tab.key ? "bg-[#2E4D3A] text-white shadow-sm" : "bg-white text-[#2E4D3A] border border-[#E2E8F0] hover:bg-[#F8F9FA]"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Day title */}
            <h2 className="text-xl md:text-2xl font-bold text-[#2E4D3A] mb-4 text-center md:text-left flex items-center justify-center md:justify-start gap-2">
              {currentDayName}
              {selectedDay === todayKey && <span className="bg-[#2E4D3A] text-white rounded-full text-xs px-2.5 py-0.5">Hoy</span>}
            </h2>

            <div
              className="space-y-4 animate-fade-in"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {currentDayClasses.length === 0 && (
                <div className="text-center py-12 text-[#575757]">
                  <p>No hay clases programadas este día.</p>
                </div>
              )}
              {currentDayClasses.map((c, i) => renderCard(c, getActiveDay(), i, true))}

              {/* Next day */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    const idx = DAY_ORDER.indexOf(selectedDay as any);
                    setSelectedDay(DAY_ORDER[(idx + 1) % DAY_ORDER.length]);
                  }}
                  className="text-[#2E4D3A] font-medium text-sm underline underline-offset-4 hover:no-underline transition-all"
                >
                  Ver día siguiente →
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {experienceWeekData.map(({ day, dayName, items }) => (
              <div key={day} className="bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0]">
                <h3 className="text-lg font-bold text-[#2E4D3A] mb-3">{dayName}</h3>
                <ul className="space-y-3">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex flex-col gap-2 p-3 bg-[#F8F9FA] rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-[#2E4D3A]">
                          <Clock className="w-4 h-4" />
                          <time className="font-semibold min-w-[52px]">{item.time}</time>
                        </div>
                        <span className="text-[#2F2F2F] font-medium text-sm">{item.title}</span>
                      </div>
                      {item.description && <p className="text-xs text-[#575757] ml-8">{item.description}</p>}
                      <div className="flex items-center justify-center gap-2 mt-1">
                        {item.is_trial_enabled ? (
                          <button
                            onClick={() => onSelectClass(item, day)}
                            className="text-sm font-semibold text-white bg-[#2E4D3A] px-4 py-1.5 rounded-full hover:bg-[#2E4D3A]/90 transition-colors"
                          >
                            Agendar prueba
                          </button>
                        ) : (
                          <>
                            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 rounded-full px-2.5 py-0.5 text-xs">
                              <XCircle className="w-3 h-3" /> No permite prueba
                            </span>
                            <button
                              onClick={() => navigate("/agenda-nave-studio")}
                              className="text-sm font-medium text-[#575757] underline hover:no-underline"
                            >
                              Agendar
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {experienceWeekData.length === 0 && (
              <div className="text-center py-12 text-[#575757]">
                <p>No hay clases programadas para esta experiencia.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
