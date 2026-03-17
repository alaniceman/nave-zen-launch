import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Clock, User } from "lucide-react";

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

export function TimeSlotsList({ slots, selectedDate, onSelectSlot }: TimeSlotsListProps) {
  if (slots.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No hay horarios disponibles para esta fecha</p>
        <p className="text-sm mt-2">Intenta con otra fecha o profesional</p>
      </div>
    );
  }

  // Group slots by service
  const groupedByService = slots
    .sort((a, b) => a.dateTimeStart.localeCompare(b.dateTimeStart))
    .reduce((acc, slot) => {
      const key = slot.serviceName;
      if (!acc[key]) acc[key] = { slots: [], sortOrder: slot.serviceSortOrder ?? 0 };
      acc[key].slots.push(slot);
      return acc;
    }, {} as Record<string, { slots: TimeSlot[]; sortOrder: number }>);

  // Sort service groups by sort_order
  const sortedServiceGroups = Object.entries(groupedByService).sort(
    ([, a], [, b]) => a.sortOrder - b.sortOrder
  );

  return (
    <div className="space-y-6">
      <div className="max-h-[480px] overflow-y-auto space-y-6 pr-1">
        {sortedServiceGroups.map(([serviceName, { slots: serviceSlots }]) => (
          <div key={serviceName} className="space-y-3">
            <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-widest">
              {serviceName}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {serviceSlots.map((slot, index) => (
                <button
                  key={index}
                  className="group flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-4 py-5 text-center shadow-sm transition-all hover:border-primary/40 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                  onClick={() => onSelectSlot(slot)}
                >
                  <span className="font-bold text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {formatInTimeZone(parseISO(slot.dateTimeStart), "America/Santiago", "HH:mm")}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                    <User className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate max-w-[120px]">{slot.professionalName}</span>
                  </div>
                  {slot.availableCapacity != null && slot.availableCapacity > 0 && (
                    <span className="text-[11px] text-muted-foreground/70 mt-1.5">
                      {slot.availableCapacity} {slot.availableCapacity === 1 ? "cupo" : "cupos"}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}