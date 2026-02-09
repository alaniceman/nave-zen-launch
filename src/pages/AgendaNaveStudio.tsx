import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format, addMonths, startOfMonth, endOfMonth, addDays, isSameDay, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, ChevronLeft, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimeSlotsList } from "@/components/agenda/TimeSlotsList";
import { BookingForm } from "@/components/agenda/BookingForm";
import { toast } from "sonner";
import { GiftCardSection } from "@/components/GiftCardSection";
import { SessionPackagePromo } from "@/components/SessionPackagePromo";

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
  const { professionalSlug, dateParam, timeParam } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
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

  // Load branches, professionals and services
  useEffect(() => {
    const loadData = async () => {
      try {
        const [branchesResult, profsResult, servicesResult] = await Promise.all([
          supabase.from("branches").select("*").eq("is_active", true).order("sort_order", { ascending: true }),
          supabase.rpc("get_active_professionals"),
          supabase.from("services").select("*").eq("is_active", true).eq("show_in_agenda", true).order("sort_order", { ascending: true })
        ]);
        if (branchesResult.error) throw branchesResult.error;
        if (profsResult.error) throw profsResult.error;
        if (servicesResult.error) throw servicesResult.error;
        
        const branchesData = branchesResult.data || [];
        setBranches(branchesData);
        
        // Set default branch
        const defaultBranch = branchesData.find(b => b.is_default) || branchesData[0];
        if (defaultBranch) {
          setSelectedBranch(defaultBranch.id);
        }
        
        const sortedProfs = (profsResult.data || []).sort((a, b) => a.name.localeCompare(b.name));
        setProfessionals(sortedProfs);
        setServices(servicesResult.data || []);

        if (professionalSlug && profsResult.data) {
          const prof = profsResult.data.find(p => p.slug === professionalSlug);
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
  const filteredServices = services.filter(s => s.branch_id === selectedBranch);
  
  // Filter slots by selected branch's services
  const filteredSlots = availableSlots.filter(slot => 
    filteredServices.some(s => s.id === slot.serviceId)
  );

  // Load available slots when date changes
  useEffect(() => {
    if (!selectedDate) return;
    const loadSlots = async () => {
      setLoadingSlots(true);
      try {
        const dateStr = format(selectedDate, "yyyy-MM-dd");
        const professionalId = selectedProfessional === "any" ? null : selectedProfessional;
        const {
          data,
          error
        } = await supabase.functions.invoke("get-availability", {
          body: {
            date: dateStr,
            professionalId: professionalId
          }
        });
        if (error) throw error;
        setAvailableSlots(data.slots || []);
      } catch (error) {
        console.error("Error loading slots:", error);
        toast.error("Error al cargar horarios disponibles");
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    loadSlots();
  }, [selectedDate, selectedProfessional]);
  const handleProfessionalChange = (value: string) => {
    setSelectedProfessional(value);
    const prof = professionals.find(p => p.id === value);
    if (prof) {
      navigate(`/agenda-nave-studio/${prof.slug}`);
    } else {
      navigate("/agenda-nave-studio");
    }
  };
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd");
      const prof = professionals.find(p => p.id === selectedProfessional);
      if (prof) {
        navigate(`/agenda-nave-studio/${prof.slug}/${dateStr}`);
      } else {
        navigate(`/agenda-nave-studio/any/${dateStr}`);
      }
    }
  };
  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    const prof = professionals.find(p => p.id === slot.professionalId);
    const dateStr = format(selectedDate!, "yyyy-MM-dd");
    const timeStr = format(parseISO(slot.dateTimeStart), "HH:mm");
    if (prof) {
      navigate(`/agenda-nave-studio/${prof.slug}/${dateStr}/${timeStr}`);
    }
  };
  const handleBackToSlots = () => {
    setSelectedTimeSlot(null);
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const prof = professionals.find(p => p.id === selectedProfessional);
      if (prof) {
        navigate(`/agenda-nave-studio/${prof.slug}/${dateStr}`);
      } else {
        navigate(`/agenda-nave-studio/any/${dateStr}`);
      }
    }
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <>
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Agenda tu Sesión</h1>
          <p className="text-muted-foreground">Elige profesional, fecha y hora para tu experiencia en Nave Studio</p>
        </div>

        <SessionPackagePromo />

        {!selectedTimeSlot ? <div className="grid md:grid-cols-2 gap-6">
            {/* Left column: Branch, Professional selector and calendar */}
            <div className="space-y-4">
              {branches.length > 1 && (
                <Card className="p-4">
                  <label className="text-sm font-medium mb-2 block">Sucursal</label>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Card>
              )}

              <Card className="p-4">
                <label className="text-sm font-medium mb-2 block">Instructor</label>
                <Select value={selectedProfessional} onValueChange={handleProfessionalChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Cualquiera</SelectItem>
                    {professionals.map(prof => <SelectItem key={prof.id} value={prof.id}>
                        {prof.name}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </Card>

              <Card className="p-4">
                <Calendar mode="single" selected={selectedDate} onSelect={handleDateSelect} locale={es} className="rounded-md border-0" disabled={date => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today || date > addMonths(today, 1);
            }} />
              </Card>
            </div>

            {/* Right column: Available time slots */}
            <div>
              <Card className="p-6">
                {!selectedDate ? <div className="text-center py-12 text-muted-foreground">
                    <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Selecciona una fecha para ver horarios disponibles</p>
                  </div> : loadingSlots ? <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div> : <TimeSlotsList slots={filteredSlots} selectedDate={selectedDate} onSelectSlot={handleTimeSlotSelect} />}
              </Card>
            </div>
          </div> : <div className="max-w-2xl mx-auto">
            <Button variant="ghost" onClick={handleBackToSlots} className="mb-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver a horarios
            </Button>
            
            <BookingForm timeSlot={selectedTimeSlot} professional={professionals.find(p => p.id === selectedTimeSlot.professionalId)!} service={services.find(s => s.id === selectedTimeSlot.serviceId)!} onBack={handleBackToSlots} />
          </div>}
      </div>
    </div>
    <GiftCardSection />
  </>;
}