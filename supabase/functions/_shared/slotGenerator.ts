import { toZonedTime } from "https://esm.sh/date-fns-tz@3.1.3";

export interface AvailabilityRule {
  id: string;
  professional_id: string;
  service_id: string;
  recurrence_type: string;
  day_of_week: number | null;
  specific_date: string | null;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  max_days_in_future: number;
  min_hours_before_booking: number;
  is_active: boolean;
}

export interface Service {
  id: string;
  max_capacity: number;
}

export interface GeneratedSlot {
  professional_id: string;
  service_id: string;
  date_time_start: string;
  date_time_end: string;
  max_capacity: number;
}

/**
 * Generates slots from availability rules for a specific date
 * @param date - Date string in YYYY-MM-DD format
 * @param rules - Active availability rules
 * @param services - Services with capacity info
 * @param professionalId - Optional filter by professional
 * @param serviceId - Optional filter by service
 * @returns Array of generated slots
 */
export function generateSlotsFromRules(
  date: string,
  rules: AvailabilityRule[],
  services: Service[],
  professionalId?: string,
  serviceId?: string
): GeneratedSlot[] {
  const timezone = "America/Santiago";
  const slots: GeneratedSlot[] = [];
  
  const currentDate = toZonedTime(new Date(date + "T00:00:00-03:00"), timezone);
  const dayOfWeek = currentDate.getDay();
  const now = toZonedTime(new Date(), timezone);

  // Format date as YYYY-MM-DD for specific_date comparison
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;

  for (const rule of rules) {
    // Apply filters if provided
    if (professionalId && rule.professional_id !== professionalId) continue;
    if (serviceId && rule.service_id !== serviceId) continue;

    let shouldGenerateSlot = false;

    // Check if rule applies to this date
    if (rule.recurrence_type === "WEEKLY" && rule.day_of_week === dayOfWeek) {
      shouldGenerateSlot = true;
    } else if (rule.recurrence_type === "ONCE" && rule.specific_date === dateStr) {
      shouldGenerateSlot = true;
    }

    if (!shouldGenerateSlot) continue;

    // Check if within max_days_in_future
    const daysDiff = Math.floor(
      (currentDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff > rule.max_days_in_future) continue;

    // Parse start and end times
    const [startHour, startMinute] = rule.start_time.split(":").map(Number);
    const [endHour, endMinute] = rule.end_time.split(":").map(Number);

    // Generate slots based on duration - create times in Chile timezone
    const slotYear = currentDate.getFullYear();
    const slotMonth = currentDate.getMonth();
    const slotDate = currentDate.getDate();
    
    let currentSlotStart = new Date(Date.UTC(slotYear, slotMonth, slotDate, startHour + 3, startMinute, 0, 0));
    const ruleEndTime = new Date(Date.UTC(slotYear, slotMonth, slotDate, endHour + 3, endMinute, 0, 0));

    while (currentSlotStart < ruleEndTime) {
      const slotEnd = new Date(currentSlotStart.getTime() + rule.duration_minutes * 60 * 1000);

      // Check min_hours_before_booking
      const hoursUntilSlot = (currentSlotStart.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (hoursUntilSlot >= rule.min_hours_before_booking) {
        // Get max_capacity from service
        const service = services.find(s => s.id === rule.service_id);
        const maxCapacity = service?.max_capacity || 1;

        slots.push({
          professional_id: rule.professional_id,
          service_id: rule.service_id,
          date_time_start: currentSlotStart.toISOString(),
          date_time_end: slotEnd.toISOString(),
          max_capacity: maxCapacity,
        });
      }

      currentSlotStart = slotEnd;
    }
  }

  return slots;
}
