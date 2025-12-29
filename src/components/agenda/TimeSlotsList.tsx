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
      <h3 className="font-semibold text-lg mb-4">
        {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
      </h3>
      <div className="max-h-[500px] overflow-y-auto space-y-6 pr-2">
        {sortedServiceGroups.map(([serviceName, { slots: serviceSlots }]) => (
          <div key={serviceName} className="space-y-3">
            <h4 className="font-semibold text-base text-primary border-b pb-2">
              {serviceName}
            </h4>
            <div className="space-y-2">
              {serviceSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => onSelectSlot(slot)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">
                      {formatInTimeZone(parseISO(slot.dateTimeStart), "America/Santiago", "HH:mm")}
                    </span>
                    {slot.availableCapacity && slot.availableCapacity > 0 && (
                      <span className="text-xs text-muted-foreground">
                        ({slot.availableCapacity} cupos)
                      </span>
                    )}
                    <div className="flex items-center gap-2 ml-auto text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      {slot.professionalName}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}