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
    <div className="space-y-4">
      <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
        {sortedServiceGroups.map(([serviceName, { slots: serviceSlots }]) => (
          <div key={serviceName} className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              {serviceName}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {serviceSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="flex flex-col items-center justify-center h-20 text-center p-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => onSelectSlot(slot)}
                >
                  <span className="font-bold text-lg">
                    {formatInTimeZone(parseISO(slot.dateTimeStart), "America/Santiago", "HH:mm")}
                  </span>
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <User className="h-3 w-3" />
                    <span className="truncate">{slot.professionalName}</span>
                  </div>
                  {slot.availableCapacity && slot.availableCapacity > 0 && (
                    <span className="text-xs opacity-70 mt-1">
                      {slot.availableCapacity} cupos
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}