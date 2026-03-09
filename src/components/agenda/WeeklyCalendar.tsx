import { format, addDays, isSameDay, startOfToday } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface WeeklyCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
}

export function WeeklyCalendar({ selectedDate, onDateSelect, disabled }: WeeklyCalendarProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const today = startOfToday();
  
  // Generate 14 days starting from today + weekOffset
  const startDate = addDays(today, weekOffset * 7);
  const dates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  const canGoPrevious = weekOffset > 0;
  const canGoNext = weekOffset < 3; // Max 4 weeks ahead
  
  const handlePrevious = () => {
    if (canGoPrevious) {
      setWeekOffset(weekOffset - 1);
    }
  };
  
  const handleNext = () => {
    if (canGoNext) {
      setWeekOffset(weekOffset + 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">¿Qué día?</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium px-2">
            {format(startDate, "MMMM yyyy", { locale: es })}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            disabled={!canGoNext}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {dates.map((date) => {
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isDisabled = disabled?.(date) ?? false;
          const isPast = date < today;
          
          return (
            <Button
              key={date.toISOString()}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onDateSelect(date)}
              disabled={isDisabled || isPast}
              className={`min-w-[80px] flex-shrink-0 flex flex-col py-3 h-auto ${
                isSelected 
                  ? "bg-primary text-primary-foreground" 
                  : isPast 
                  ? "opacity-40 cursor-not-allowed" 
                  : "bg-background hover:bg-muted"
              }`}
            >
              <span className="text-xs font-medium uppercase">
                {format(date, "EEE", { locale: es })}
              </span>
              <span className="text-lg font-bold">
                {format(date, "dd")}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}