import { format, addDays, isSameDay, startOfToday } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface WeeklyCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  onVisibleDatesChange?: (dates: Date[]) => void;
  disabled?: (date: Date) => boolean;
}

export function WeeklyCalendar({ selectedDate, onDateSelect, onVisibleDatesChange, disabled }: WeeklyCalendarProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const today = startOfToday();

  // Generate 7 days starting from today + weekOffset
  const startDate = useMemo(() => addDays(today, weekOffset * 7), [today, weekOffset]);
  const dates = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(startDate, i)), [startDate]);

  useEffect(() => {
    onVisibleDatesChange?.(dates);
  }, [dates, onVisibleDatesChange]);

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
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-semibold">¿Qué día?</h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className="h-9 w-9 p-0"
            aria-label="Semana anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs sm:text-sm font-medium px-1 capitalize">{format(startDate, "MMMM yyyy", { locale: es })}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNext}
            disabled={!canGoNext}
            className="h-9 w-9 p-0"
            aria-label="Semana siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 -mx-1 px-1">
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
              className={`min-w-[52px] sm:min-w-[72px] flex-shrink-0 flex flex-col gap-0.5 py-2 h-auto min-h-[56px] ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isPast
                    ? "opacity-40 cursor-not-allowed"
                    : "bg-background hover:bg-muted"
              }`}
            >
              <span className="text-[10px] sm:text-xs font-medium uppercase">{format(date, "EEE", { locale: es })}</span>
              <span className="text-base sm:text-lg font-bold">{format(date, "dd")}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );

}
