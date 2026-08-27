import { parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { Clock } from "lucide-react";

interface TimeSlot {
  dateTimeStart: string;
  dateTimeEnd: string;
  professionalId: string;
  professionalName: string;
  serviceId: string;
  serviceName: string;
  serviceSortOrder?: number;
  availableCapacity?: number;
  maxCapacity?: number;
}

interface TimeSlotsListProps {
  slots: TimeSlot[];
  selectedDate: Date;
  onSelectSlot: (slot: TimeSlot) => void;
}

/**
 * Display-only label normalization. Never mutates the stored service name.
 * Cold-session variants (Sesión Criomedicina / Método Wim Hof, Método Wim Hof:
 * Breathwork + Ice Bath, etc.) are shown simply as "Criomedicina".
 */
export function getDisplayServiceName(serviceName: string): string {
  const name = (serviceName || "").trim();
  const normalized = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Never touch yoga variants or workshops/retreats/other products
  if (/\byoga\b|\byin\b|\byang\b|vinyasa|integral|power|somatic/.test(normalized)) return name;
  if (/taller|retiro|workshop|curso|evento|masaje|sound/.test(normalized)) return name;

  const isCriomedicina = /criomedicina/.test(normalized);
  const isWimHof = /wim\s*hof/.test(normalized);
  const isColdSession = /(ice\s*bath|inmersion|agua\s*fria|breathwork|respiracion)/.test(normalized);

  if (isCriomedicina || (isWimHof && (isColdSession || /sesion|metodo/.test(normalized)))) {
    return "Criomedicina";
  }

  return name;
}

export function TimeSlotsList({ slots, onSelectSlot }: TimeSlotsListProps) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <Clock className="h-10 w-10 mx-auto mb-3 opacity-50" />
        <p>No hay horarios disponibles para esta fecha</p>
        <p className="text-sm mt-2">Intenta con otra fecha o profesional</p>
      </div>
    );
  }

  // Strict chronological order; stable tie-breakers by service then instructor.
  const orderedSlots = [...slots].sort((a, b) => {
    const byTime = a.dateTimeStart.localeCompare(b.dateTimeStart);
    if (byTime !== 0) return byTime;
    const byService = a.serviceName.localeCompare(b.serviceName, "es");
    if (byService !== 0) return byService;
    return a.professionalName.localeCompare(b.professionalName, "es");
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3">
      {orderedSlots.map((slot) => {
        const title = getDisplayServiceName(slot.serviceName);
        const capacity = slot.availableCapacity;

        return (
          <button
            type="button"
            key={`${slot.dateTimeStart}-${slot.serviceId}-${slot.professionalId}`}
            onClick={() => onSelectSlot(slot)}
            className="group flex w-full items-stretch gap-3 rounded-xl border border-border bg-card p-3 text-left shadow-sm transition-all min-h-[64px] hover:border-primary/40 hover:shadow-md active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="flex w-[64px] shrink-0 flex-col items-center justify-center rounded-lg bg-muted/60 px-2 py-2">
              <span className="font-bold text-lg leading-none tracking-tight text-foreground group-hover:text-primary transition-colors">
                {formatInTimeZone(parseISO(slot.dateTimeStart), "America/Santiago", "HH:mm")}
              </span>
            </div>

            <div className="min-w-0 flex-1 flex flex-col justify-center">
              <span className="text-sm font-semibold leading-snug text-foreground line-clamp-2">
                {title}
              </span>
              <span className="mt-1 text-xs text-muted-foreground truncate">
                {slot.professionalName}
                {capacity != null && capacity > 0 && (
                  <> · {capacity} {capacity === 1 ? "cupo" : "cupos"}</>
                )}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
