import { useState, useEffect, useRef } from "react";
import { Calendar, Clock, Users, Thermometer, Zap, X } from "lucide-react";

interface ClassItem {
  time: string;
  title: string;
  tags: string[];
  badges: string[];
  duration: number;
  isPersonalized?: boolean;
}

interface WeekCalendarProps {
  scheduleData: Record<string, ClassItem[]>;
  activeFilters: string[];
  shouldShowClass: (classTags: string[]) => boolean;
}

const dayNames = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo"
};

const dayNamesShort = {
  lunes: "Lun",
  martes: "Mar",
  miercoles: "Mié",
  jueves: "Jue",
  viernes: "Vie",
  sabado: "Sáb",
  domingo: "Dom"
};

const getColorByTag = (tags: string[]) => {
  if (tags.includes("Método Wim Hof")) return "bg-[#3BC7D6] text-white";
  if (tags.includes("Yoga")) return "bg-[#2E4D3A] text-white";
  if (tags.includes("Breathwork & Meditación")) return "bg-[#7AA6A0] text-white";
  if (tags.includes("Biohacking")) return "bg-[#C49A6C] text-white";
  if (tags.includes("Personalizado")) return "bg-[#8C7A6B] text-white";
  return "bg-gray-500 text-white";
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

export const WeekCalendar = ({ scheduleData, activeFilters, shouldShowClass }: WeekCalendarProps) => {
  const [selectedEvent, setSelectedEvent] = useState<{
    event: ClassItem;
    day: string;
    dayKey: string;
  } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [todayKey, setTodayKey] = useState<string>("");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTodayKey(getTodayInSantiago());
    setSelectedDay(getTodayInSantiago());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setSelectedEvent(null);
      }
    };

    if (selectedEvent) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [selectedEvent]);

  const timeSlots = [];
  for (let hour = 7; hour <= 21; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 21) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }

  const getCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    if (hours < 7 || hours > 21) return null;
    
    const totalMinutes = (hours - 7) * 60 + minutes;
    const totalSlots = 14 * 2; // 14 hours * 2 slots per hour
    const position = (totalMinutes / (14 * 60)) * 100;
    
    return Math.min(Math.max(position, 0), 100);
  };

  const getEventPosition = (time: string, duration: number) => {
    const [hours, minutes] = time.split(':').map(Number);
    const startMinutes = (hours - 7) * 60 + minutes;
    const top = (startMinutes / (14 * 60)) * 100;
    const height = (duration / (14 * 60)) * 100;
    
    return { top: `${top}%`, height: `${height}%` };
  };

  const filteredEvents = Object.entries(scheduleData).reduce((acc, [dayKey, events]) => {
    acc[dayKey] = events.filter(event => shouldShowClass(event.tags));
    return acc;
  }, {} as Record<string, ClassItem[]>);

  const currentTimePosition = getCurrentTimePosition();

  return (
    <section id="calendario-semanal" className="py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Calendario semanal</h2>
            <p className="text-muted-foreground">Visualiza tu semana de un vistazo. (Zona horaria: America/Santiago)</p>
          </div>
          <div className="flex gap-2">
            <a 
              href="#top-horarios" 
              className="border-2 border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-primary-foreground transition"
            >
              Ver en lista
            </a>
            <a 
              href="/planes-precios" 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition"
            >
              Ver planes & precios
            </a>
          </div>
        </div>

        {/* Mobile Day Selector */}
        <div className="sm:hidden mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedDay(todayKey)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedDay === todayKey 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Hoy
            </button>
            {Object.entries(dayNamesShort).map(([key, name]) => (
              <button
                key={key}
                onClick={() => setSelectedDay(key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedDay === key 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-card border border-border rounded-xl overflow-hidden" style={{ minHeight: '600px', maxHeight: '80vh' }}>
          {/* Desktop/Tablet View */}
          <div className="hidden sm:block h-full">
            <div 
              className="grid overflow-y-auto" 
              style={{ 
                gridTemplateColumns: '80px repeat(7, 1fr)',
                height: 'min(80vh, 600px)'
              }}
              role="grid"
            >
              {/* Header Row */}
              <div className="sticky top-0 bg-muted/50 border-b border-border p-3 text-center text-sm font-medium">
                Hora
              </div>
              {Object.entries(dayNames).map(([key, name]) => (
                <div 
                  key={key}
                  className={`sticky top-0 bg-muted/50 border-b border-border p-3 text-center text-sm font-medium ${
                    key === todayKey ? 'bg-primary/10 text-primary' : ''
                  }`}
                  role="columnheader"
                  aria-current={key === todayKey ? "date" : undefined}
                >
                  {name}
                </div>
              ))}

              {/* Time Grid */}
              {timeSlots.map((timeSlot, index) => (
                <div key={`time-${index}`} className="relative">
                  {/* Time Label */}
                  <div className="text-xs text-muted-foreground p-2 border-r border-border h-8 flex items-center">
                    {timeSlot}
                  </div>
                  
                  {/* Day Columns */}
                  {Object.entries(dayNames).map(([dayKey, dayName]) => (
                    <div 
                      key={`${dayKey}-${index}`}
                      className="relative border-r border-b border-border h-8"
                      style={{ minHeight: '32px' }}
                      role="gridcell"
                    >
                      {/* Events */}
                      {index === 0 && filteredEvents[dayKey]?.map((event, eventIndex) => {
                        const position = getEventPosition(event.time, event.duration);
                        return (
                          <button
                            key={eventIndex}
                            className={`absolute left-1 right-1 rounded-lg text-xs p-1 shadow-sm hover:shadow-md transition-all z-10 text-left ${getColorByTag(event.tags)}`}
                            style={position}
                            onClick={() => setSelectedEvent({ event, day: dayName, dayKey })}
                            role="button"
                            aria-label={`Reservar ${event.title}, ${dayName} ${event.time}`}
                          >
                            <div className="font-medium">{event.time}</div>
                            <div className="truncate">{event.title}</div>
                          </button>
                        );
                      })}

                      {/* Current Time Line */}
                      {dayKey === todayKey && currentTimePosition !== null && index === 0 && (
                        <div 
                          className="absolute left-0 right-0 h-0.5 bg-red-500 z-20"
                          style={{ top: `${currentTimePosition}%` }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile View */}
          <div className="sm:hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {dayNames[selectedDay as keyof typeof dayNames]}
                {selectedDay === todayKey && (
                  <span className="text-sm bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    Hoy
                  </span>
                )}
              </h3>

              <div className="space-y-2">
                {filteredEvents[selectedDay]?.map((event, index) => (
                  <button
                    key={index}
                    className={`w-full p-3 rounded-lg text-left transition-all hover:shadow-md ${getColorByTag(event.tags)}`}
                    onClick={() => setSelectedEvent({ event, day: dayNames[selectedDay as keyof typeof dayNames], dayKey: selectedDay })}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{event.time}</span>
                    </div>
                    <div className="font-semibold">{event.title}</div>
                    {event.badges.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {event.badges.map((badge, badgeIndex) => (
                          <span
                            key={badgeIndex}
                            className="text-xs bg-white/20 px-2 py-1 rounded-full"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}

                {filteredEvents[selectedDay]?.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay clases programadas para este día
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Event Popover/Bottom Sheet */}
        {selectedEvent && (
          <>
            {/* Desktop Popover */}
            <div className="hidden sm:block fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20">
              <div 
                ref={popoverRef}
                className="bg-card text-card-foreground border border-border rounded-xl p-6 shadow-lg max-w-md w-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{selectedEvent.event.title}</h3>
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedEvent.day} - {selectedEvent.event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{selectedEvent.event.duration} minutos</span>
                  </div>
                  {selectedEvent.event.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.event.badges.map((badge, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
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

                <div className="space-y-3">
                  <a
                    href="https://boxmagic.link/PLACEHOLDER"
                    data-checkout-url="https://boxmagic.link/PLACEHOLDER"
                    data-plan={selectedEvent.event.title}
                    className="w-full inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Reservar
                  </a>
                  
                  <a
                    href={generateCalendarLink(
                      selectedEvent.event.title, 
                      selectedEvent.dayKey, 
                      selectedEvent.event.time, 
                      selectedEvent.event.duration
                    )}
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

            {/* Mobile Bottom Sheet */}
            <div className="sm:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/20">
              <div 
                ref={popoverRef}
                className="bg-card text-card-foreground border-t border-border rounded-t-xl p-6 w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">{selectedEvent.event.title}</h3>
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedEvent.day} - {selectedEvent.event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{selectedEvent.event.duration} minutos</span>
                  </div>
                  {selectedEvent.event.badges.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.event.badges.map((badge, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
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

                <div className="space-y-3">
                  <a
                    href="https://boxmagic.link/PLACEHOLDER"
                    data-checkout-url="https://boxmagic.link/PLACEHOLDER"
                    data-plan={selectedEvent.event.title}
                    className="w-full inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Reservar
                  </a>
                  
                  <a
                    href={generateCalendarLink(
                      selectedEvent.event.title, 
                      selectedEvent.dayKey, 
                      selectedEvent.event.time, 
                      selectedEvent.event.duration
                    )}
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
          </>
        )}

        {/* Rules/Notes */}
        <div className="mt-8 bg-[#C49A6C]/10 text-foreground rounded-lg p-4">
          <p className="mb-2">
            <strong>Clase de prueba:</strong> Yoga (Yin · Yang · Integral) o Respiración Wim Hof.
          </p>
          <p>
            Las clases de prueba no incluyen sesiones del <strong>Método Wim Hof</strong>. Para ingresar al Ice Bath después de Yoga debes haber realizado una sesión guiada del <strong>Método Wim Hof</strong> (breathwork + ice bath).
          </p>
        </div>
      </div>
    </section>
  );
};