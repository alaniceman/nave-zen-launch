

## Plan: Database-driven yoga schedule on `/yoga-las-condes`

### Current state
The YogaLasCondes page calls `weeklyByExperience("yoga")` which reads from the **hardcoded** `scheduleData` in `src/data/schedule.ts`. Changes made in the admin panel (`/admin/horarios`) have no effect on this landing page.

### What changes

1. **`src/pages/YogaLasCondes.tsx`** — Replace the static `yogaSchedule` with the `useScheduleEntries` hook:
   - Import and call `useScheduleEntries()`
   - Filter entries where `color_tag` is `"yoga"` or title contains "Isométrica" (to include isométrica as yoga)
   - Group by `day_of_week` and render the same card layout
   - Move `yogaSchedule` from module-level constant to inside the component (since it now depends on async data)
   - Add a simple loading state

2. **No database changes needed** — `schedule_entries` already has all the data and the `color_tag` field on `services` handles categorization. Isométrica entries will be matched by checking for `color_tag === 'yoga'` OR the service name/display_name containing "isométrica". If isométrica currently has a different `color_tag`, we can also match by name pattern.

### Implementation detail

```typescript
// Inside YogaLasCondes component
const { data } = useScheduleEntries();
const DAY_KEYS = ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'];
const DAY_NAMES_MAP = { lunes:'Lunes', martes:'Martes', ... };

const yogaSchedule = useMemo(() => {
  if (!data) return [];
  return DAY_KEYS.map((dayKey, idx) => {
    const items = (data.scheduleData[dayKey] || [])
      .filter(item => 
        item.color_tag === 'yoga' || 
        /isom[eé]trica/i.test(item.title)
      );
    if (items.length === 0) return null;
    return { day: dayKey, dayName: DAY_NAMES_MAP[dayKey], items };
  }).filter(Boolean);
}, [data]);
```

### Files to modify
- `src/pages/YogaLasCondes.tsx` — swap hardcoded schedule for DB-driven hook

