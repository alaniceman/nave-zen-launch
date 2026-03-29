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
 * Get Chile's UTC offset in hours for a specific date and time.
 * Chile uses CLST (UTC-3) in summer and CLT (UTC-4) in winter.
 * Returns negative hours (e.g. -3 or -4).
 */
function getChileOffsetMinutes(year: number, month: number, day: number, hour: number): number {
  // Use Intl.DateTimeFormat to determine the actual offset
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Santiago",
    timeZoneName: "shortOffset",
  });
  
  // Create a UTC date and format it in Chile timezone to detect the offset
  const testDate = new Date(Date.UTC(year, month - 1, day, hour + 4, 0, 0));
  const parts = formatter.formatToParts(testDate);
  const tzPart = parts.find(p => p.type === "timeZoneName");
  
  if (tzPart) {
    // Format is like "GMT-3" or "GMT-4"
    const match = tzPart.value.match(/GMT([+-]?\d+)/);
    if (match) {
      return parseInt(match[1], 10);
    }
  }
  
  // Default to -3 (Chile summer time) if detection fails
  return -3;
}


/**
 * Generates slots from availability rules for a specific date
 * @param date - Date string in YYYY-MM-DD format (in Chile timezone)
 * @param rules - Active availability rules
 * @param services - Services with capacity info
 * @param professionalId - Optional filter by professional
 * @param serviceId - Optional filter by service
 * @returns Array of generated slots with times in UTC
 */
export function generateSlotsFromRules(
  date: string,
  rules: AvailabilityRule[],
  services: Service[],
  professionalId?: string,
  serviceId?: string
): GeneratedSlot[] {
  const slots: GeneratedSlot[] = [];
  
  // Parse the date in Chile timezone (GMT-3)
  // We create a date with the Chile timezone offset explicitly
  const chileDateStr = date + "T12:00:00-03:00"; // Use noon to avoid DST issues
  const chileDate = new Date(chileDateStr);
  
  // Get day of week for the Chile date (0 = Sunday, 6 = Saturday)
  const dayOfWeek = chileDate.getUTCDay();
  
  // Get current time in UTC for min_hours_before_booking check
  const nowUTC = new Date();

  // Format date as YYYY-MM-DD for specific_date comparison
  const dateStr = date;

  console.log(`Generating slots for date: ${date}, dayOfWeek: ${dayOfWeek}`);

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

    console.log(`Rule matches for professional ${rule.professional_id}, day ${dayOfWeek}, start: ${rule.start_time}`);

    // Check if within max_days_in_future
    const daysDiff = Math.floor(
      (chileDate.getTime() - nowUTC.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysDiff > rule.max_days_in_future) {
      console.log(`Rule skipped: too far in future (${daysDiff} days)`);
      continue;
    }

    // Parse start and end times (these are in Chile local time)
    const [startHour, startMinute] = rule.start_time.split(":").map(Number);
    const [endHour, endMinute] = rule.end_time.split(":").map(Number);

    // Create start and end times in Chile timezone, then convert to UTC
    // Dynamically determine Chile's UTC offset for this specific date
    const [year, month, day] = date.split("-").map(Number);
    
    // Build a Date in Chile local time to detect DST
    // Chile uses CLST (UTC-3) in summer and CLT (UTC-4) in winter
    // We create a temp date and check its actual offset
    const tempChileDate = new Date(`${date}T${rule.start_time}:00`);
    // Use Intl to get the actual offset for this date in Chile
    const chileOffsetMinutes = getChileOffsetMinutes(year, month, day, startHour);
    const offsetHours = chileOffsetMinutes / 60;
    
    // Create UTC time by subtracting the offset (offset is negative, e.g. -180 for UTC-3)
    let currentSlotStartUTC = new Date(Date.UTC(year, month - 1, day, startHour - offsetHours, startMinute, 0, 0));
    const ruleEndTimeUTC = new Date(Date.UTC(year, month - 1, day, endHour - offsetHours, endMinute, 0, 0));

    console.log(`Creating slots from ${currentSlotStartUTC.toISOString()} to ${ruleEndTimeUTC.toISOString()}`);

    while (currentSlotStartUTC < ruleEndTimeUTC) {
      const slotEndUTC = new Date(currentSlotStartUTC.getTime() + rule.duration_minutes * 60 * 1000);

      // Check min_hours_before_booking (compare UTC times)
      const hoursUntilSlot = (currentSlotStartUTC.getTime() - nowUTC.getTime()) / (1000 * 60 * 60);
      
      if (hoursUntilSlot >= rule.min_hours_before_booking) {
        // Get max_capacity from service
        const service = services.find(s => s.id === rule.service_id);
        const maxCapacity = service?.max_capacity || 1;

        console.log(`Adding slot at ${currentSlotStartUTC.toISOString()} (${hoursUntilSlot.toFixed(1)} hours from now)`);

        slots.push({
          professional_id: rule.professional_id,
          service_id: rule.service_id,
          date_time_start: currentSlotStartUTC.toISOString(),
          date_time_end: slotEndUTC.toISOString(),
          max_capacity: maxCapacity,
        });
      } else {
        console.log(`Slot skipped at ${currentSlotStartUTC.toISOString()}: only ${hoursUntilSlot.toFixed(1)} hours away (need ${rule.min_hours_before_booking})`);
      }

      currentSlotStartUTC = slotEndUTC;
    }
  }

  console.log(`Generated ${slots.length} total slots`);
  return slots;
}
