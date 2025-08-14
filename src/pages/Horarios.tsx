import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Calendar, Clock, Users, Thermometer, Zap, MapPin } from "lucide-react";
import { Footer } from "../components/Footer";

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

const filters = [
  "Todos",
  "Método Wim Hof",
  "Yoga",
  "Breathwork & Meditación",
  "Biohacking",
  "Personalizado"
];

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

export default function Horarios() {
  const [activeFilters, setActiveFilters] = useState<string[]>(["Todos"]);
  const [todayKey, setTodayKey] = useState<string>("");

  useEffect(() => {
    setTodayKey(getTodayInSantiago());
  }, []);

  const toggleFilter = (filter: string) => {
    if (filter === "Todos") {
      setActiveFilters(["Todos"]);
    } else {
      const newFilters = activeFilters.includes(filter)
        ? activeFilters.filter(f => f !== filter)
        : [...activeFilters.filter(f => f !== "Todos"), filter];
      
      if (newFilters.length === 0) {
        setActiveFilters(["Todos"]);
      } else {
        setActiveFilters(newFilters);
      }
    }
  };

  const shouldShowClass = (classTags: string[]) => {
    if (activeFilters.includes("Todos")) return true;
    return classTags.some(tag => activeFilters.includes(tag));
  };

  const scrollToDay = (day: string) => {
    const element = document.getElementById(day);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToToday = () => {
    const element = document.getElementById('hoy');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <Helmet>
        <title>Horarios - Nave Studio</title>
        <meta name="description" content="Horarios de clases de Método Wim Hof, Yoga, Breathwork y Biohacking. Programa tu semana y vive nuestras experiencias en Nave Studio." />
        <meta property="og:title" content="Horarios - Nave Studio" />
        <meta property="og:description" content="Horarios de clases de Método Wim Hof, Yoga, Breathwork y Biohacking. Programa tu semana y vive nuestras experiencias en Nave Studio." />
        <link rel="canonical" href="https://studiolanave.com/horarios" />
        <style>{`
          :root {
            --header-h: 56px;
            --daybar-h: 48px;
          }
          html {
            scroll-padding-top: calc(var(--header-h) + var(--daybar-h) + 8px);
          }
        `}</style>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 text-center bg-gradient-to-br from-background to-muted/30">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Horarios de Nave Studio
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Programa tu semana y vive nuestras experiencias.
            </p>
            <button
              onClick={scrollToToday}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Ver el día de hoy
            </button>
          </div>
        </section>

        {/* Filters */}
        <section className="py-4 md:py-8 px-4 border-b md:sticky md:top-0 z-40 bg-background/95 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all h-9 ${
                    activeFilters.includes(filter)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Day Navigation - Always sticky */}
        <nav className="sticky top-0 md:top-[var(--header-h)] z-40 h-12 bg-background border-b border-border">
          <div className="max-w-6xl mx-auto h-full">
            <div className="flex gap-2 overflow-x-auto h-full items-center px-4">
              <button
                onClick={scrollToToday}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  todayKey ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
                aria-current={todayKey ? "date" : undefined}
              >
                Hoy
              </button>
              {Object.entries(dayNames).map(([key, name]) => (
                <button
                  key={key}
                  onClick={() => scrollToDay(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    key === todayKey
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Schedule */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto space-y-12">
            {Object.entries(scheduleData).map(([dayKey, classes]) => (
              <div
                key={dayKey}
                id={dayKey === todayKey ? 'hoy' : dayKey}
                className="animate-fade-in scroll-mt-[calc(var(--header-h)+var(--daybar-h)+8px)]"
              >
                <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-3">
                  {dayNames[dayKey as keyof typeof dayNames]}
                  {dayKey === todayKey && (
                    <span className="text-sm bg-primary text-primary-foreground px-3 py-1 rounded-full">
                      Hoy
                    </span>
                  )}
                </h2>
                
                <div className="space-y-4">
                  {classes
                    .filter(classItem => shouldShowClass(classItem.tags))
                    .map((classItem, index) => (
                      <div
                        key={index}
                        className="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                          {/* Class Info */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-primary font-bold text-xl">
                                <Clock className="w-5 h-5" />
                                {classItem.time}
                              </div>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-foreground">
                              {classItem.title}
                            </h3>
                            
                            <div className="flex flex-wrap gap-2">
                              {classItem.badges.map((badge, badgeIndex) => (
                                <span
                                  key={badgeIndex}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                                >
                                  {badge.includes("Ice Bath") && <Thermometer className="w-3 h-3" />}
                                  {badge.includes("personas") && <Users className="w-3 h-3" />}
                                  {badge.includes("HIIT") && <Zap className="w-3 h-3" />}
                                  {badge}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="space-y-3">
                            <button
                              data-checkout-url="https://members.boxmagic.app/acceso/ingreso"
                              data-plan={classItem.title}
                              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                            >
                              Reservar
                            </button>
                            
                            <a
                              href={generateCalendarLink(classItem.title, dayKey, classItem.time, classItem.duration)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full inline-flex items-center justify-center gap-2 border border-border px-6 py-3 rounded-lg hover:bg-muted transition-colors text-sm"
                            >
                              <Calendar className="w-4 h-4" />
                              Agregar a Google Calendar
                            </a>

                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Important Notices */}
        <section className="py-12 px-4 bg-orange-50 border-t">
          <div className="max-w-4xl mx-auto">
            <div className="bg-orange-100 border border-orange-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center gap-2">
                <Thermometer className="w-5 h-5" />
                Avisos importantes
              </h3>
              <div className="space-y-3 text-orange-800">
                <p>
                  <strong>Yoga:</strong> el Ice Bath al final es <strong>opcional</strong>.
                </p>
                <p>
                  Para entrar al hielo después de Yoga debes haber completado <strong>una sesión guiada del Método Wim Hof</strong> (breathwork + ice bath).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cross CTAs */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-8 text-foreground">
              ¿Listo para comenzar tu experiencia?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/planes-precios"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Ver planes y precios
              </a>
              <a
                href="/coaches"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-8 py-4 rounded-lg hover:bg-primary/10 transition-colors font-medium"
              >
                Conocer a los coaches
              </a>
              <button
                data-open-trial="true"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Agendar clase de prueba (Yoga)
              </button>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
}