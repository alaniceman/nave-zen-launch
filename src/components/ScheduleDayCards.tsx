import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { dayNames, getTodayInSantiago, CL_TZ } from "../data/schedule";
import { EXPERIENCE_CATALOG } from "../lib/experiences";
import { useScheduleEntries, type ScheduleClassItem } from "../hooks/useScheduleEntries";
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

export default function ScheduleDayCards() {
  const { data, isLoading } = useScheduleEntries();
  const scheduleData = data?.scheduleData || {};

  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const initialView = params.get("view") === "exp" ? "exp" : "day";
  const initialExp = params.get("exp") || "yoga";

  const [viewMode, setViewMode] = useState<"day" | "exp">(initialView);
  const [expSlug, setExpSlug] = useState<string>(initialExp);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [todayKey, setTodayKey] = useState<string>("");

  useEffect(() => {
    const today = getTodayInSantiago();
    setTodayKey(today);
    setSelectedDay(today);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      p.set("view", viewMode);
      if (viewMode === "exp") { p.set("exp", expSlug); } else { p.delete("exp"); }
      window.history.replaceState({}, "", `${window.location.pathname}?${p.toString()}`);
    }
  }, [viewMode, expSlug]);

  const dayTabs = [
    { key: "lunes", label: "Lun" }, { key: "martes", label: "Mar" },
    { key: "miercoles", label: "Mié" }, { key: "jueves", label: "Jue" },
    { key: "viernes", label: "Vie" }, { key: "sabado", label: "Sáb" },
    { key: "domingo", label: "Dom" }
  ];

  const getActiveDay = () => selectedDay || todayKey;
  const currentDayClasses = scheduleData[getActiveDay()] || [];
  const currentDayName = dayNames[getActiveDay() as keyof typeof dayNames] || "";

  // Experience view: filter from DB data
  const experienceWeekData = viewMode === "exp" ? (() => {
    const exp = EXPERIENCE_CATALOG.find(e => e.slug === expSlug);
    if (!exp) return [];
    return DAY_ORDER.map((day) => {
      const daySchedule = scheduleData[day] || [];
      const items = daySchedule
        .filter(item => {
          // Use the same match logic from experiences but on our DB data
          const fakeItem = { ...item, tags: item.tags, title: item.title, badges: item.badges, duration: item.duration };
          return exp.match(fakeItem as any);
        })
        .sort((a, b) => a.time.localeCompare(b.time));
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

  if (isLoading) {
    return (
      <section className="py-4 md:py-8">
        <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
        </div>
      </section>
    );
  }

  const renderCard = (classItem: ScheduleClassItem, index: number, showDayAbbr = false) => (
    <div
      key={index}
      className={`${getCardBgColor(classItem.color_tag)} text-white rounded-2xl px-4 py-4 md:px-5 md:py-5 shadow-sm relative`}
    >
      {showDayAbbr && (
        <div className="lg:hidden absolute top-3 right-3 text-xs font-medium text-white/80 bg-black/20 px-2 py-1 rounded backdrop-blur">
          {dayNames[getActiveDay()]?.slice(0, 3).toUpperCase()}
        </div>
      )}
      <div className="flex items-center gap-2 text-white/90 text-xl md:text-2xl font-semibold mb-2 pr-12 lg:pr-0">
        <Clock className="w-5 h-5 md:w-6 md:h-6" />
        {classItem.time}
      </div>
      <h3 className="text-white font-semibold text-lg md:text-xl leading-tight line-clamp-2 mb-3">
        {classItem.title}
      </h3>
      {classItem.badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {classItem.badges.map((badge, badgeIndex) => (
            <span key={badgeIndex} className="bg-white/20 text-white rounded-full px-3 py-1 text-sm backdrop-blur inline-flex">
              {badge}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section id="horarios" className="py-4 md:py-8">
      <style>{`html { scroll-padding-top: 70px; }`}</style>
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* View mode controls */}
        <div className="flex flex-wrap items-center gap-3 mb-6 md:mb-8">
          <button className={`px-5 py-3 rounded-full font-medium text-sm transition-all ${viewMode === "day" ? "bg-[#2E4D3A] text-white shadow-sm" : "bg-white text-[#2E4D3A] border border-[#E2E8F0] hover:border-[#2E4D3A]/40 hover:bg-[#F8F9FA]"}`} onClick={() => setViewMode("day")} aria-pressed={viewMode === "day"}>📅 Por Día</button>
          <button className={`px-5 py-3 rounded-full font-medium text-sm transition-all ${viewMode === "exp" ? "bg-[#2E4D3A] text-white shadow-sm" : "bg-white text-[#2E4D3A] border border-[#E2E8F0] hover:border-[#2E4D3A]/40 hover:bg-[#F8F9FA]"}`} onClick={() => setViewMode("exp")} aria-pressed={viewMode === "exp"}>🎯 Por Experiencia</button>
        </div>

        {/* Experience chips */}
        {viewMode === "exp" && (
          <div className="mb-6 md:mb-8">
            <div className="text-sm font-medium text-[#575757] mb-3">Selecciona una experiencia:</div>
            <div className="relative">
              <div role="radiogroup" aria-label="Seleccionar experiencia" className="flex gap-2 md:gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 pr-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] after:absolute after:right-0 after:top-0 after:bottom-2 after:w-8 after:bg-gradient-to-l after:from-white after:to-transparent after:pointer-events-none">
                {EXPERIENCE_CATALOG.map(exp => (
                  <button key={exp.slug} role="radio" aria-checked={expSlug === exp.slug} onClick={() => setExpSlug(exp.slug)} className={`snap-start shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 border transition-all text-sm font-medium ${expSlug === exp.slug ? "bg-[#2E4D3A] text-white border-[#2E4D3A] shadow-sm" : "bg-white text-[#2E4D3A] border-[#E2E8F0] hover:border-[#2E4D3A]/40 hover:bg-[#F8F9FA]"}`}>
                    {exp.labelShort ?? exp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === "day" ? (
          <>
            {/* Mobile */}
            <div className="lg:hidden">
              <div className="flex gap-2 overflow-x-auto px-4 pb-2 mb-4" role="tablist">
                {dayTabs.map(tab => (
                  <button key={tab.key} role="tab" aria-selected={selectedDay === tab.key} onClick={() => setSelectedDay(tab.key)} className={`rounded-xl px-4 py-2.5 font-medium text-sm whitespace-nowrap transition-all ${selectedDay === tab.key ? 'bg-[#2E4D3A] text-white shadow-sm' : 'bg-white text-[#2E4D3A] border border-[#E2E8F0] hover:bg-[#F8F9FA]'}`}>{tab.label}</button>
                ))}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-[#2E4D3A] px-4 mb-4 flex items-center gap-2">
                {currentDayName}
                {selectedDay === todayKey && <span className="bg-[#2E4D3A] text-white rounded-full text-sm px-3 py-1">Hoy</span>}
              </h2>
              <div className="px-4 space-y-4 md:space-y-5 animate-fade-in" role="tabpanel" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
                {currentDayClasses.map((c, i) => renderCard(c, i, true))}
                <div className="lg:hidden mt-6 text-center">
                  <button onClick={() => { const idx = DAY_ORDER.indexOf(selectedDay as any); setSelectedDay(DAY_ORDER[(idx + 1) % DAY_ORDER.length]); }} className="bg-[#2E4D3A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2E4D3A]/90 transition-colors">Ver día siguiente</button>
                </div>
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden lg:grid lg:grid-cols-[220px,1fr] gap-6">
              <div className="sticky top-0 self-start">
                <div className="space-y-2" role="tablist">
                  {dayTabs.map(tab => (
                    <button key={tab.key} role="tab" aria-selected={selectedDay === tab.key} onClick={() => setSelectedDay(tab.key)} className={`w-full text-left rounded-2xl px-4 py-3 font-semibold transition-colors ${selectedDay === tab.key ? 'bg-[#2E4D3A] text-white' : 'bg-[#F4F4F4] text-[#2E4D3A] hover:bg-[#E9E9E9]'}`}>{dayNames[tab.key as keyof typeof dayNames]}</button>
                  ))}
                </div>
              </div>
              <div className="min-h-[70vh]" role="tabpanel">
                <h2 className="text-2xl md:text-3xl font-bold text-[#2E4D3A] mb-3 md:mb-4 flex items-center gap-2">
                  {currentDayName}
                  {selectedDay === todayKey && <span className="bg-[#2E4D3A] text-white rounded-full text-sm px-3 py-1">Hoy</span>}
                </h2>
                <div className="space-y-4 md:space-y-5 pb-8">
                  {currentDayClasses.map((c, i) => renderCard(c, i))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-8">
            {experienceWeekData.map(({ day, dayName, items }) => (
              <div key={day} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-[#2E4D3A] mb-4">{dayName}</h3>
                <ul className="space-y-3">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-[#F8F9FA] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-[#2E4D3A]">
                          <Clock className="w-4 h-4" />
                          <time className="font-semibold min-w-[56px]">{item.time}</time>
                        </div>
                        <span className="text-[#2F2F2F] font-medium">{item.title}</span>
                      </div>
                      <div className="text-sm text-[#575757] flex flex-wrap items-center gap-2">
                        {item.instructor && <span>con {item.instructor}</span>}
                        {item.badges.map((badge, i) => (
                          <span key={i} className="bg-[#35C7D2]/10 text-[#35C7D2] rounded-full px-2 py-1 text-xs">{badge}</span>
                        ))}
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
