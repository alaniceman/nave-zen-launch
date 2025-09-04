import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { scheduleData, dayNames, getTodayInSantiago, CL_TZ, type ClassItem } from "../data/schedule";
import { EXPERIENCE_CATALOG } from "../lib/experiences";
import { weeklyByExperience } from "../lib/scheduleByExperience";

const DAY_ORDER = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"] as const;

// Get background color based on class tags
const getCardBgColor = (tags: string[]) => {
  if (tags.includes("Método Wim Hof")) return "bg-[#35C7D2]";
  if (tags.includes("Yoga")) return "bg-[#2E4D3A]";
  if (tags.includes("Biohacking")) return "bg-[#C49A6C]";
  if (tags.includes("Breathwork & Meditación")) return "bg-[#7AA6A0]";
  if (tags.includes("Personalizado")) return "bg-[#8C7A6B]";
  return "bg-[#35C7D2]"; // default
};

export default function ScheduleDayCards() {
  // Helper to check if class is coming soon
  const isComingSoon = (item: ClassItem) => {
    if (!item.goLiveDate) return false;
    // Comparar en TZ America/Santiago
    const todayCL = new Date().toLocaleDateString('en-CA', { timeZone: CL_TZ }); // "YYYY-MM-DD"
    const goLive = item.goLiveDate;
    return todayCL < goLive; // antes de goLive → "Pronto"
  };

  // Helper to check if should show "Pronto" chip
  const showComingSoon = (item: ClassItem) => {
    return item.slug === "pronto" || isComingSoon(item);
  };

  // URL params for view mode
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const initialView = params.get("view") === "exp" ? "exp" : "day";
  const initialExp = params.get("exp") || "yoga";

  // State
  const [viewMode, setViewMode] = useState<"day" | "exp">(initialView);
  const [expSlug, setExpSlug] = useState<string>(initialExp);

  // Touch/swipe handling
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

  // Update URL when view mode or experience changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      p.set("view", viewMode);
      if (viewMode === "exp") {
        p.set("exp", expSlug);
      } else {
        p.delete("exp");
      }
      window.history.replaceState({}, "", `${window.location.pathname}?${p.toString()}`);
    }
  }, [viewMode, expSlug]);

  const dayTabs = [
    { key: "hoy", label: "Hoy", actual: todayKey },
    { key: "lunes", label: "Lun" },
    { key: "martes", label: "Mar" },
    { key: "miercoles", label: "Mié" },
    { key: "jueves", label: "Jue" },
    { key: "viernes", label: "Vie" },
    { key: "sabado", label: "Sáb" },
    { key: "domingo", label: "Dom" }
  ];

  const getActiveDay = () => {
    return selectedDay === "hoy" ? todayKey : selectedDay;
  };

  const currentDayClasses = scheduleData[getActiveDay()] || [];
  const currentDayName = dayNames[getActiveDay() as keyof typeof dayNames] || "";

  // Experience view data
  const experienceWeekData = viewMode === "exp" ? weeklyByExperience(expSlug) : [];

  // Swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = dayTabs.findIndex(tab => tab.key === selectedDay);
      let newIndex = currentIndex;

      if (isLeftSwipe && currentIndex < dayTabs.length - 1) {
        newIndex = currentIndex + 1;
      } else if (isRightSwipe && currentIndex > 0) {
        newIndex = currentIndex - 1;
      }

      if (newIndex !== currentIndex) {
        setSelectedDay(dayTabs[newIndex].key);
      }
    }
  };

  return (
    <section id="horarios" className="py-8 md:py-10">
      <style>{`
        html {
          scroll-padding-top: 70px;
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* View mode controls */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "day" 
                ? "bg-[#2E4D3A] text-white" 
                : "bg-[#F4F4F4] text-[#2E4D3A] hover:bg-[#E9E9E9]"
            }`}
            onClick={() => setViewMode("day")} 
            aria-pressed={viewMode === "day"}
          >
            Filtrar por Día
          </button>
          <button 
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "exp" 
                ? "bg-[#2E4D3A] text-white" 
                : "bg-[#F4F4F4] text-[#2E4D3A] hover:bg-[#E9E9E9]"
            }`}
            onClick={() => setViewMode("exp")} 
            aria-pressed={viewMode === "exp"}
          >
            Filtrar por Experiencia
          </button>

        </div>

        {/* Experience chips selector */}
        {viewMode === "exp" && (
          <div className="mb-6">
            <div className="text-sm text-[#575757] mb-2">Experiencia:</div>
            <div className="relative">
              <div
                role="radiogroup"
                aria-label="Seleccionar experiencia"
                className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-2 px-2 pr-8
                           [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']
                           after:absolute after:right-0 after:top-0 after:bottom-2 after:w-8 
                           after:bg-gradient-to-l after:from-white after:to-transparent after:pointer-events-none"
              >
                {EXPERIENCE_CATALOG.map(exp => {
                  const active = expSlug === exp.slug;
                  return (
                    <button
                      key={exp.slug}
                      role="radio"
                      aria-checked={active}
                      onClick={() => setExpSlug(exp.slug)}
                      className={`snap-start shrink-0 whitespace-nowrap rounded-full px-4 py-2 border transition-colors ${
                        active
                          ? "bg-[#2E4D3A] text-white border-[#2E4D3A]"
                          : "bg-white text-[#2E4D3A] border-[#E2E8F0] hover:border-[#2E4D3A]/40"
                      }`}
                    >
                      {exp.labelShort ?? exp.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {viewMode === "day" ? (
          <>
        {/* Mobile/Tablet: Horizontal tabs */}
        <div className="lg:hidden">
          {/* Day tabs */}
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 mb-6" role="tablist">
            {dayTabs.map((tab) => {
              const isActive = selectedDay === tab.key;
              return (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.key}`}
                  onClick={() => setSelectedDay(tab.key)}
                  className={`rounded-2xl px-4 py-2 font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#2E4D3A] text-white'
                      : 'bg-[#F4F4F4] text-[#2E4D3A]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Day title */}
          <h2 className="text-2xl md:text-3xl font-bold text-[#2E4D3A] px-4 mb-3 md:mb-4 flex items-center gap-2">
            {currentDayName}
            {selectedDay === "hoy" && (
              <span className="bg-[#2E4D3A] text-white rounded-full text-sm px-3 py-1">
                Hoy
              </span>
            )}
          </h2>

          {/* Cards */}
          <div 
            className="px-4 space-y-4 md:space-y-5 animate-fade-in" 
            role="tabpanel" 
            id={`panel-${selectedDay}`}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {currentDayClasses.map((classItem, index) => (
              <div
                key={index}
                className={`${getCardBgColor(classItem.tags)} text-white rounded-2xl px-4 py-4 md:px-5 md:py-5 shadow-sm relative`}
              >
                {/* Day abbreviation - mobile only */}
                <div className="lg:hidden absolute top-3 right-3 text-xs font-medium text-white/80 bg-black/20 px-2 py-1 rounded backdrop-blur">
                  {dayNames[getActiveDay()]?.slice(0, 3).toUpperCase()}
                </div>
                
                {/* Time */}
                <div className="flex items-center gap-2 text-white/90 text-xl md:text-2xl font-semibold mb-2 pr-12 lg:pr-0">
                  <Clock className="w-5 h-5 md:w-6 md:h-6" />
                  {classItem.time}
                  {showComingSoon(classItem) && (
                    <span className="ml-3 bg-white/20 text-white rounded-full text-xs px-2.5 py-1 backdrop-blur">
                      Pronto
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-white font-semibold text-lg md:text-xl leading-tight line-clamp-2 mb-3">
                  {classItem.title}
                </h3>

                {/* Badges */}
                {classItem.badges.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {classItem.badges.map((badge, badgeIndex) => (
                      <span
                        key={badgeIndex}
                        className="bg-white/20 text-white rounded-full px-3 py-1 text-sm backdrop-blur inline-flex"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Next day button - mobile only */}
            <div className="lg:hidden mt-6 text-center">
              <button
                onClick={() => {
                  const currentIndex = DAY_ORDER.indexOf(selectedDay as any);
                  const nextIndex = (currentIndex + 1) % DAY_ORDER.length;
                  setSelectedDay(DAY_ORDER[nextIndex]);
                }}
                className="bg-[#2E4D3A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2E4D3A]/90 transition-colors"
              >
                Ver día siguiente
              </button>
            </div>
          </div>
        </div>

        {/* Desktop: Two columns */}
        <div className="hidden lg:grid lg:grid-cols-[220px,1fr] gap-6">
          {/* Left column: Vertical day navigation */}
          <div className="sticky top-0 self-start">
            <div className="space-y-2" role="tablist">
              {dayTabs.map((tab) => {
                const isActive = selectedDay === tab.key;
                return (
                  <button
                    key={tab.key}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${tab.key}`}
                    onClick={() => setSelectedDay(tab.key)}
                    className={`w-full text-left rounded-2xl px-4 py-3 font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#2E4D3A] text-white'
                        : 'bg-[#F4F4F4] text-[#2E4D3A] hover:bg-[#E9E9E9]'
                    }`}
                  >
                    {tab.key === "hoy" ? "Hoy" : dayNames[tab.key as keyof typeof dayNames]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right column: Day content */}
          <div className="min-h-[70vh]" role="tabpanel" id={`panel-${selectedDay}`}>
            {/* Day title */}
            <h2 className="text-2xl md:text-3xl font-bold text-[#2E4D3A] mb-3 md:mb-4 flex items-center gap-2">
              {currentDayName}
              {selectedDay === "hoy" && (
                <span className="bg-[#2E4D3A] text-white rounded-full text-sm px-3 py-1">
                  Hoy
                </span>
              )}
            </h2>

            {/* Cards */}
            <div className="space-y-4 md:space-y-5 pb-8">
              {currentDayClasses.map((classItem, index) => (
                <div
                  key={index}
                  className={`${getCardBgColor(classItem.tags)} text-white rounded-2xl px-4 py-4 md:px-5 md:py-5 shadow-sm`}
                >
                  {/* Time */}
                  <div className="flex items-center gap-2 text-white/90 text-xl md:text-2xl font-semibold mb-2">
                    <Clock className="w-5 h-5 md:w-6 md:h-6" />
                    {classItem.time}
                    {showComingSoon(classItem) && (
                      <span className="ml-3 bg-white/20 text-white rounded-full text-xs px-2.5 py-1 backdrop-blur">
                        Pronto
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-semibold text-lg md:text-xl leading-tight line-clamp-2 mb-3">
                    {classItem.title}
                  </h3>

                  {/* Badges */}
                  {classItem.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {classItem.badges.map((badge, badgeIndex) => (
                        <span
                          key={badgeIndex}
                          className="bg-white/20 text-white rounded-full px-3 py-1 text-sm backdrop-blur inline-flex"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
          </>
        ) : (
          /* Experience view */
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
                        {item.pronto && (
                          <span className="bg-[#2E4D3A]/10 text-[#2E4D3A] border border-[#2E4D3A]/20 rounded-full text-xs px-2 py-0.5">
                            Pronto
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-[#575757] flex flex-wrap items-center gap-2">
                        {item.instructor && (
                          <span>con {item.instructor}</span>
                        )}
                        {item.metaNote && (
                          <span className="bg-[#2E4D3A]/10 text-[#2E4D3A] rounded-full px-2 py-1 text-xs">
                            {item.metaNote}
                          </span>
                        )}
                        {item.badges.map((badge, badgeIdx) => (
                          <span key={badgeIdx} className="bg-[#35C7D2]/10 text-[#35C7D2] rounded-full px-2 py-1 text-xs">
                            {badge}
                          </span>
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