import { useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AvailabilitySlot = {
  dateTimeStart: string;
  dateTimeEnd: string;
  professionalId: string;
  professionalName: string;
  serviceId: string;
  serviceName: string;
  availableCapacity?: number;
  maxCapacity?: number;
};

type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

function makeKey(dateStr: string, professionalId: string | null) {
  return `${dateStr}::${professionalId ?? "any"}`;
}

export function useAvailabilityCache(options?: { ttlMs?: number }) {
  const ttlMs = options?.ttlMs ?? 5 * 60 * 1000;

  const cacheRef = useRef<Map<string, CacheEntry<AvailabilitySlot[]>>>(new Map());
  const inFlightRef = useRef<Map<string, Promise<AvailabilitySlot[]>>>(new Map());
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(() => new Set());

  const getCachedSlots = useCallback((dateStr: string, professionalId: string | null) => {
    const key = makeKey(dateStr, professionalId);
    const entry = cacheRef.current.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      cacheRef.current.delete(key);
      return null;
    }
    return entry.value;
  }, []);

  const fetchSlots = useCallback(
    async (dateStr: string, professionalId: string | null) => {
      const key = makeKey(dateStr, professionalId);

      const cached = getCachedSlots(dateStr, professionalId);
      if (cached) return cached;

      const inFlight = inFlightRef.current.get(key);
      if (inFlight) return inFlight;

      setLoadingKeys((prev) => {
        if (prev.has(key)) return prev;
        const next = new Set(prev);
        next.add(key);
        return next;
      });

      const promise = (async () => {
        const { data, error } = await supabase.functions.invoke("get-availability", {
          body: { date: dateStr, professionalId },
        });
        if (error) throw error;

        const slots = (data?.slots ?? []) as AvailabilitySlot[];
        cacheRef.current.set(key, { value: slots, expiresAt: Date.now() + ttlMs });
        return slots;
      })();

      inFlightRef.current.set(key, promise);

      try {
        return await promise;
      } finally {
        inFlightRef.current.delete(key);
        setLoadingKeys((prev) => {
          if (!prev.has(key)) return prev;
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    },
    [getCachedSlots, ttlMs]
  );

  const prefetchDateStrs = useCallback(
    (dateStrs: string[], professionalId: string | null) => {
      dateStrs.forEach((dateStr) => {
        const key = makeKey(dateStr, professionalId);
        const cached = getCachedSlots(dateStr, professionalId);
        if (cached) return;
        if (inFlightRef.current.has(key)) return;

        void fetchSlots(dateStr, professionalId).catch(() => {
          // silent prefetch
        });
      });
    },
    [fetchSlots, getCachedSlots]
  );

  const isLoading = useCallback(
    (dateStr: string, professionalId: string | null) => loadingKeys.has(makeKey(dateStr, professionalId)),
    [loadingKeys]
  );

  return { getCachedSlots, fetchSlots, prefetchDateStrs, isLoading };
}
