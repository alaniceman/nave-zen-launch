import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ScheduleEntry {
  id: string;
  service_id: string;
  professional_id: string | null;
  day_of_week: number;
  start_time: string;
  display_name: string | null;
  badges: string[];
  is_active: boolean;
  sort_order: number;
  // Joined fields
  service_name: string;
  service_description: string | null;
  is_trial_enabled: boolean;
  color_tag: string;
  professional_name: string | null;
}

export interface ScheduleClassItem {
  time: string;
  title: string;
  tags: string[];
  badges: string[];
  duration: number;
  instructor?: string;
  is_trial_enabled: boolean;
  description?: string;
  color_tag: string;
  service_id: string;
}

const DAY_KEYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] as const;

const colorTagToTags: Record<string, string[]> = {
  'yoga': ['Yoga'],
  'wim-hof': ['Método Wim Hof'],
  'hiit': ['HIIT'],
  'breathwork': ['Breathwork & Meditación'],
  'personalizado': ['Personalizado', 'Método Wim Hof'],
  'default': [],
};

export function useScheduleEntries() {
  return useQuery({
    queryKey: ['schedule-entries'],
    queryFn: async () => {
      // We need to do a manual join since the types don't know about schedule_entries yet
      const { data, error } = await supabase
        .from('schedule_entries' as any)
        .select('*, services!inner(name, description, is_trial_enabled, color_tag, duration_minutes), professionals(name)')
        .eq('is_active', true)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;

      const entries: ScheduleEntry[] = (data || []).map((row: any) => ({
        id: row.id,
        service_id: row.service_id,
        professional_id: row.professional_id,
        day_of_week: row.day_of_week,
        start_time: row.start_time,
        display_name: row.display_name,
        badges: row.badges || [],
        is_active: row.is_active,
        sort_order: row.sort_order,
        service_name: row.services?.name || '',
        service_description: row.services?.description || null,
        is_trial_enabled: row.services?.is_trial_enabled || false,
        color_tag: row.services?.color_tag || 'default',
        professional_name: row.professionals?.name || null,
      }));

      // Transform to schedule data format
      const scheduleData: Record<string, ScheduleClassItem[]> = {};
      for (const dayKey of DAY_KEYS) {
        scheduleData[dayKey] = [];
      }

      for (const entry of entries) {
        const dayKey = DAY_KEYS[entry.day_of_week];
        if (!dayKey) continue;

        const tags = colorTagToTags[entry.color_tag] || [];
        const title = entry.display_name || entry.service_name;

        scheduleData[dayKey].push({
          time: entry.start_time.slice(0, 5), // "HH:MM"
          title,
          tags,
          badges: entry.badges,
          duration: 60,
          instructor: entry.professional_name || undefined,
          is_trial_enabled: entry.is_trial_enabled,
          description: entry.service_description || undefined,
          color_tag: entry.color_tag,
          service_id: entry.service_id,
        });
      }

      return { entries, scheduleData };
    },
    staleTime: 5 * 60 * 1000,
  });
}
