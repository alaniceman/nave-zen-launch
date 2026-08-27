import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format, addMonths, parseISO, startOfToday } from "date-fns";
import { Loader2, ChevronLeft, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WeeklyCalendar } from "@/components/agenda/WeeklyCalendar";
import { TimeSlotsList } from "@/components/agenda/TimeSlotsList";
import { BookingForm } from "@/components/agenda/BookingForm";
import { toast } from "sonner";
import { GiftCardSection } from "@/components/GiftCardSection";
import { SessionPackagePromo } from "@/components/SessionPackagePromo";
import { trackViewContentOnce } from "@/lib/metaTracking";
import { useAvailabilityCache } from "@/hooks/useAvailabilityCache";

interface Branch {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  is_default: boolean;
}

interface Professional {
  id: string;
  name: string;
  slug: string;
  email?: string;
}

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price_clp: number;
  description: string;
  branch_id: string | null;
}

interface TimeSlot {
  dateTimeStart: string;
  dateTimeEnd: string;
  professionalId: string;
  professionalName: string;
  serviceId: string;
  serviceName: string;
  availableCapacity?: number;
  maxCapacity?: number;
}

export default function AgendaNaveStudio() {
  const { professionalSlug, dateParam } = useParams();

  const bookingFormRef = useRef<HTMLDivElement>(null);
  const latestAvailabilityRequestKeyRef = useRef<string | null>(null);

  const { getCachedSlots, fetchSlots, prefetchDateStrs } = useAvailabilityCache({ ttlMs: 5 * 60 * 1000 });
  const [visibleDateStrs, setVisibleDateStrs] = useState<string[]>([]);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<string>("any");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // ViewContent: una sola vez por vista (Pixel + CAPI con el mismo event_id)
  useEffect(() => {
    trackViewContentOnce("Agenda Nave Studio", { contentCategory: "booking" });
  }, []);

  // Load branches, professionals and services
  useEffect(() => {
    const loadData = async () => {
      try {
        const [branchesResult, profsResult, servicesResult] = await Promise.all([
          supabase.from("branches").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
          supabase.rpc("get_active_professionals"),
          supabase
            .from("services")
            .select("*")
            .eq("is_active", true)
            .eq("show_in_agenda", true)
            .order("sort_order", { ascending: true }),
        ]);

        if (branchesResult.error) throw branchesResult.error;
        if (profsResult.error) throw profsResult.error;
        if (servicesResult.error) throw servicesResult.error;

        const branchesData = branchesResult.data || [];
        setBranches(branchesData);

        // Set default branch
        const defaultBranch = branchesData.find((b) => b.is_default) || branchesData[0];
        if (defaultBranch) {
          setSelectedBranch(defaultBranch.id);
        }

        const sortedProfs = (profsResult.data || []).sort((a, b) => a.name.localeCompare(b.name));
        setProfessionals(sortedProfs);
        setServices(servicesResult.data || []);

        if (professionalSlug && profsResult.data) {
          const prof = profsResult.data.find((p) => p.slug === professionalSlug);
          if (prof) {
            setSelectedProfessional(prof.id);
          }
        }

        if (dateParam) {
          try {
            const date = parseISO(dateParam);
            setSelectedDate(date);
          } catch (e) {
            console.error("Invalid date param", e);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [professionalSlug, dateParam]);

  // Filter services by selected branch
  const filteredServices = services.filter((s) => s.branch_id === selectedBranch);

  // Filter slots by selected branch's services
  const filteredSlots = availableSlots.filter((slot) => filteredServices.some((s) => s.id === slot.serviceId));

  // Load available slots when date changes (with cache)
  useEffect(() => {
    if (!selectedDate) return;

    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const professionalId = selectedProfessional === "any" ? null : selectedProfessional;
    const requestKey = `${dateStr}::${professionalId ?? "any"}`;
    latestAvailabilityRequestKeyRef.current = requestKey;

    const cached = getCachedSlots(dateStr, professionalId);
    if (cached) {
      setAvailableSlots(cached);
      setLoadingSlots(false);
    } else {
      setLoadingSlots(true);
    }

    fetchSlots(dateStr, professionalId)
      .then((slots) => {
        if (latestAvailabilityRequestKeyRef.current !== requestKey) return;
        setAvailableSlots(slots);
      })
      .catch((error) => {
        if (latestAvailabilityRequestKeyRef.current !== requestKey) return;
        console.error("Error loading slots:", error);
        toast.error("Error al cargar horarios disponibles");
        setAvailableSlots([]);
      })
      .finally(() => {
        if (latestAvailabilityRequestKeyRef.current !== requestKey) return;
        if (!cached) setLoadingSlots(false);
      });
  }, [fetchSlots, getCachedSlots, selectedDate, selectedProfessional]);

  // Prefetch week dates in background
  useEffect(() => {
    const professionalId = selectedProfessional === "any" ? null : selectedProfessional;
    if (visibleDateStrs.length === 0) return;
    prefetchDateStrs(visibleDateStrs, professionalId);
  }, [prefetchDateStrs, selectedProfessional, visibleDateStrs]);

  const handleProfessionalChange = (value: string) => {
    setSelectedProfessional(value);
    const prof = professionals.find((p) => p.id === value);
    if (prof) {
      window.history.replaceState(null, "", `/agenda-nave-studio/${prof.slug}`);
    } else {
      window.history.replaceState(null, "", "/agenda-nave-studio");
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd");
      const prof = professionals.find((p) => p.id === selectedProfessional);
      if (prof) {
        window.history.replaceState(null, "", `/agenda-nave-studio/${prof.slug}/${dateStr}`);
      } else {
        window.history.replaceState(null, "", `/agenda-nave-studio/any/${dateStr}`);
      }
    }
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);

    // InitiateCheckout NO se emite aquí: seleccionar horario no es checkout.
    // Única fuente: BookingForm, tras create-booking (bookingId + initPoint).
    const prof = professionals.find((p) => p.id === slot.professionalId);
    const dateStr = format(selectedDate!, "yyyy-MM-dd");
    const timeStr = format(parseISO(slot.dateTimeStart), "HH:mm");
    if (prof) {
      window.history.replaceState(null, "", `/agenda-nave-studio/${prof.slug}/${dateStr}/${timeStr}`);
    }

    setTimeout(() => {
      bookingFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleBackToSlots = () => {
    setSelectedTimeSlot(null);
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const prof = professionals.find((p) => p.id === selectedProfessional);
      if (prof) {
        window.history.replaceState(null, "", `/agenda-nave-studio/${prof.slug}/${dateStr}`);
      } else {
        window.history.replaceState(null, "", `/agenda-nave-studio/any/${dateStr}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Agenda tu Sesión</h1>
            <p className="text-muted-foreground">Elige profesional, fecha y hora para tu experiencia en Nave Studio</p>
          </div>

          <SessionPackagePromo />

          {!selectedTimeSlot ? (
            <div className="space-y-6">
              {/* Top row: Branch and Professional selectors */}
              <div className="flex flex-col sm:flex-row gap-4">
                {branches.length > 1 && (
                  <Card className="flex-1 p-4">
                    <label className="text-sm font-medium mb-2 block">Sucursal</label>
                    <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Card>
                )}

                <Card className="flex-1 p-4">
                  <label className="text-sm font-medium mb-2 block">Instructor</label>
                  <Select value={selectedProfessional} onValueChange={handleProfessionalChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Cualquiera</SelectItem>
                      {professionals.map((prof) => (
                        <SelectItem key={prof.id} value={prof.id}>
                          {prof.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Card>
              </div>

              {/* Weekly calendar */}
              <Card className="p-3 sm:p-6">
                <WeeklyCalendar
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                  onVisibleDatesChange={(dates) => setVisibleDateStrs(dates.map((d) => format(d, "yyyy-MM-dd")))}
                  disabled={(date) => {
                    const today = startOfToday();
                    return date < today || date > addMonths(today, 1);
                  }}
                />
              </Card>

              {/* Available time slots */}
              <Card className="p-3 sm:p-6">
                {!selectedDate ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <User className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>Selecciona una fecha para ver horarios disponibles</p>
                  </div>
                ) : loadingSlots ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h3 className="text-base sm:text-lg font-semibold">¿A qué hora?</h3>
                    <TimeSlotsList slots={filteredSlots} selectedDate={selectedDate} onSelectSlot={handleTimeSlotSelect} />
                  </div>
                )}
              </Card>

            </div>
          ) : (
            <div ref={bookingFormRef} className="max-w-2xl mx-auto">
              <Button variant="ghost" onClick={handleBackToSlots} className="mb-4">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Volver a horarios
              </Button>

              <BookingForm
                timeSlot={selectedTimeSlot}
                professional={professionals.find((p) => p.id === selectedTimeSlot.professionalId)!}
                service={services.find((s) => s.id === selectedTimeSlot.serviceId)!}
                onBack={handleBackToSlots}
              />
            </div>
          )}
        </div>
      </div>
      <GiftCardSection />
    </>
  );
}
