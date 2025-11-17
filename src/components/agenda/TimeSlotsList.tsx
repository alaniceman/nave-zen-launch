import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Clock, User } from "lucide-react";

interface TimeSlot {
  dateTimeStart: string;
  dateTimeEnd: string;
  professionalId: string;
  professionalName: string;
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

  return (
    <div className="space-y-2">
      <h3 className="font-semibold mb-4">
        {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
      </h3>
      <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2">
        {slots.map((slot, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start text-left h-auto py-3"
            onClick={() => onSelectSlot(slot)}
          >
            <div className="flex items-center gap-3 w-full">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">
                {format(parseISO(slot.dateTimeStart), "HH:mm")}
              </span>
              <div className="flex items-center gap-2 ml-auto text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                {slot.professionalName}
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}