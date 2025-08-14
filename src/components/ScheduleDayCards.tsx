import { useState, useEffect } from "react";
import { Clock, Calendar, Users, Thermometer, Zap } from "lucide-react";

// Types
interface ClassItem {
  time: string;
  title: string;
  tags: string[];
  badges: string[];
  duration: number;
  isPersonalized?: boolean;
}

// Schedule data structure
const scheduleData: Record<string, ClassItem[]> = {
  lunes: [
    {
      time: "08:00",
      title: "Yin Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60
    },
    {
      time: "09:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    }
  ],
  martes: [
    {
      time: "10:00",
      title: "Personalizado Método Wim Hof",
      tags: ["Personalizado", "Método Wim Hof"],
      badges: ["Máx 1–2 personas"],
      duration: 60,
      isPersonalized: true
    },
    {
      time: "11:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    },
    {
      time: "13:00",
      title: "Biohacking: Breathwork + HIIT + Ice Bath",
      tags: ["Biohacking"],
      badges: ["Respiración + HIIT + Hielo"],
      duration: 60
    },
    {
      time: "19:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    },
    {
      time: "20:15",
      title: "Yoga Integral + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60
    }
  ],
  miercoles: [
    {
      time: "08:00",
      title: "Vinyasa Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60
    },
    {
      time: "09:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    },
    {
      time: "18:30",
      title: "Yin Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60
    },
    {
      time: "19:30",
      title: "Breathwork Wim Hof",
      tags: ["Breathwork & Meditación"],
      badges: ["Sin inmersión"],
      duration: 60
    }
  ],
  jueves: [
    {
      time: "10:00",
      title: "Personalizado Método Wim Hof",
      tags: ["Personalizado", "Método Wim Hof"],
      badges: ["Máx 1–2 personas"],
      duration: 60,
      isPersonalized: true
    },
    {
      time: "11:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    },
    {
      time: "13:00",
      title: "Biohacking: Breathwork + HIIT + Ice Bath",
      tags: ["Biohacking"],
      badges: ["Respiración + HIIT + Hielo"],
      duration: 60
    },
    {
      time: "18:00",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    },
    {
      time: "20:00",
      title: "Vinyasa Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60
    }
  ],
  viernes: [
    {
      time: "07:00",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    }
  ],
  sabado: [
    {
      time: "09:00",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    },
    {
      time: "10:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    },
    {
      time: "11:45",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    }
  ],
  domingo: [
    {
      time: "09:00",
      title: "Power Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60
    },
    {
      time: "10:15",
      title: "Power Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60
    }
  ]
};

const dayNames = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo"
};

// Utility functions
const getTodayInSantiago = () => {
  const now = new Date();
  const santiago = new Intl.DateTimeFormat('es-CL', {
    weekday: 'long',
    timeZone: 'America/Santiago'
  }).format(now).toLowerCase();
  
  const dayMap: { [key: string]: string } = {
    'lunes': 'lunes',
    'martes': 'martes',
    'miércoles': 'miercoles',
    'jueves': 'jueves',
    'viernes': 'viernes',
    'sábado': 'sabado',
    'domingo': 'domingo'
  };
  
  return dayMap[santiago] || 'lunes';
};

const generateCalendarLink = (title: string, day: string, time: string, duration: number) => {
  const now = new Date();
  const daysOfWeek = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const currentDay = now.getDay();
  const targetDay = Object.keys(dayNames).indexOf(day);
  
  let daysUntilTarget = targetDay - (currentDay === 0 ? 6 : currentDay - 1);
  if (daysUntilTarget < 0) daysUntilTarget += 7;
  
  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + daysUntilTarget);
  
  const [hours, minutes] = time.split(':').map(Number);
  targetDate.setHours(hours, minutes, 0, 0);
  
  const endDate = new Date(targetDate);
  endDate.setMinutes(endDate.getMinutes() + duration);
  
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatDate(targetDate)}/${formatDate(endDate)}`,
    details: 'Nave Studio - Antares 259',
    location: 'Antares 259, Las Condes',
    ctz: 'America/Santiago'
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const getClassColor = (tags: string[]) => {
  if (tags.includes("Método Wim Hof")) return "bg-[#35C7D2] text-white";
  if (tags.includes("Yoga")) return "bg-[#2E4D3A] text-white";
  if (tags.includes("Biohacking")) return "bg-[#C49A6C] text-white";
  if (tags.includes("Breathwork & Meditación")) return "bg-[#7AA6A0] text-white";
  if (tags.includes("Personalizado")) return "bg-[#8C7A6B] text-white";
  return "bg-muted text-muted-foreground";
};

interface ScheduleDayCardsProps {
  activeFilters?: string[];
}

export default function ScheduleDayCards({ activeFilters = ["Todos"] }: ScheduleDayCardsProps) {
  const [selectedDay, setSelectedDay] = useState<string>("");
  
  useEffect(() => {
    setSelectedDay(getTodayInSantiago());
  }, []);

  const shouldShowClass = (classTags: string[]) => {
    if (activeFilters.includes("Todos")) return true;
    return classTags.some(tag => activeFilters.includes(tag));
  };

  const filteredClasses = selectedDay ? 
    scheduleData[selectedDay]?.filter(classItem => shouldShowClass(classItem.tags)) || []
    : [];

  return (
    <section id="horarios-cards" className="py-10">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        
        {/* Desktop Layout (≥1024px) */}
        <div className="hidden lg:flex gap-8 min-h-[80vh] max-h-[900px]">
          {/* Left Column - Day Navigation */}
          <div className="w-56 flex-shrink-0">
            <div className="sticky top-0">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Días de la semana</h3>
              <nav role="tablist" className="space-y-2">
                {Object.entries(dayNames).map(([key, name]) => {
                  const isToday = key === getTodayInSantiago();
                  const isSelected = key === selectedDay;
                  
                  return (
                    <button
                      key={key}
                      role="tab"
                      aria-selected={isSelected}
                      aria-controls={`day-content-${key}`}
                      onClick={() => setSelectedDay(key)}
                      className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{name}</span>
                        {isToday && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                            Hoy
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Right Column - Class Cards */}
          <div className="flex-1 overflow-y-auto">
            <div role="tabpanel" id={`day-content-${selectedDay}`} className="space-y-4">
              {filteredClasses.length > 0 ? (
                filteredClasses.map((classItem, index) => (
                  <ClassCard
                    key={index}
                    classItem={classItem}
                    dayKey={selectedDay}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No hay clases programadas para este día con los filtros seleccionados.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tablet & Mobile Layout (<1024px) */}
        <div className="lg:hidden">
          {/* Day Navigation Tabs */}
          <div className="mb-6">
            <div className="overflow-x-auto">
              <nav role="tablist" className="flex gap-2 pb-2">
                {Object.entries(dayNames).map(([key, name]) => {
                  const isToday = key === getTodayInSantiago();
                  const isSelected = key === selectedDay;
                  
                  return (
                    <button
                      key={key}
                      role="tab"
                      aria-selected={isSelected}
                      aria-controls={`day-content-mobile-${key}`}
                      onClick={() => setSelectedDay(key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {isToday ? 'Hoy' : name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Class Cards */}
          <div role="tabpanel" id={`day-content-mobile-${selectedDay}`} className="space-y-4">
            {filteredClasses.length > 0 ? (
              filteredClasses.map((classItem, index) => (
                <ClassCard
                  key={index}
                  classItem={classItem}
                  dayKey={selectedDay}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No hay clases programadas para este día con los filtros seleccionados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ClassCardProps {
  classItem: ClassItem;
  dayKey: string;
}

function ClassCard({ classItem, dayKey }: ClassCardProps) {
  const colorClass = getClassColor(classItem.tags);
  
  return (
    <div 
      className={`${colorClass} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200`}
      aria-label={`${classItem.title}, ${dayNames[dayKey as keyof typeof dayNames]} ${classItem.time}, ${classItem.duration} minutos`}
    >
      {/* Header with time */}
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5" />
        <span className="text-xl font-bold">{classItem.time}</span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-4 line-clamp-2">
        {classItem.title}
      </h3>

      {/* Badges */}
      {classItem.badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {classItem.badges.map((badge, badgeIndex) => (
            <span
              key={badgeIndex}
              className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 text-white text-sm rounded-full backdrop-blur"
            >
              {badge.includes("Ice Bath") && <Thermometer className="w-3 h-3" />}
              {badge.includes("personas") && <Users className="w-3 h-3" />}
              {badge.includes("HIIT") && <Zap className="w-3 h-3" />}
              {badge}
            </span>
          ))}
        </div>
      )}

    </div>
  );
}