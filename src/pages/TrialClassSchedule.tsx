import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { type ScheduleClassItem } from "@/hooks/useScheduleEntries";
import TrialScheduleCards from "@/components/trial/TrialScheduleCards";
import TrialClassDetail from "@/components/trial/TrialClassDetail";
import TrialBookingForm from "@/components/trial/TrialBookingForm";
import TrialAlreadyAttended from "@/components/trial/TrialAlreadyAttended";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Step = "calendar" | "detail" | "form" | "blocked" | "success";

export default function TrialClassSchedule() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("calendar");
  const [selectedClass, setSelectedClass] = useState<ScheduleClassItem | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleSelectClass = (classItem: ScheduleClassItem, dayKey: string) => {
    setSelectedClass(classItem);
    setSelectedDay(dayKey);
    setSelectedDate(null);
    setStep("detail");
  };

  if (step === "blocked") {
    return (
      <>
        <Helmet>
          <title>Clase de prueba | Nave Studio</title>
        </Helmet>
        <TrialAlreadyAttended />
      </>
    );
  }

  if (step === "success") {
    return (
      <>
        <Helmet>
          <title>¡Clase agendada! | Nave Studio</title>
        </Helmet>
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="bg-emerald-50 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#2E4D3A] mb-3">¡Clase de prueba agendada!</h2>
          <p className="text-[#575757] mb-2">Te enviamos un email con todos los detalles.</p>
          <p className="text-[#575757] mb-8">
            ¿Alguna duda?{" "}
            <a href="https://wa.me/56946120426" target="_blank" rel="noopener noreferrer" className="text-[#2E4D3A] font-semibold underline">
              Escríbenos por WhatsApp
            </a>
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#2E4D3A] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#2E4D3A]/90 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Agendar clase de prueba | Nave Studio</title>
        <meta name="description" content="Agenda tu clase de prueba gratis en Nave Studio. Yoga, HIIT, Breathwork y más en Las Condes." />
      </Helmet>

      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Header */}
        <div className="bg-[#2E4D3A] text-white py-8 px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Agenda tu clase de prueba</h1>
          <p className="text-white/80 text-sm md:text-base">Elige una clase, selecciona fecha y reserva tu lugar</p>
        </div>

        {step === "calendar" && (
          <TrialScheduleCards onSelectClass={handleSelectClass} />
        )}

        {step === "detail" && selectedClass && (
          <TrialClassDetail
            classItem={selectedClass}
            dayKey={selectedDay}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onBack={() => setStep("calendar")}
            onContinue={() => setStep("form")}
          />
        )}

        {step === "form" && selectedClass && selectedDate && (
          <TrialBookingForm
            classItem={selectedClass}
            dayKey={selectedDay}
            selectedDate={selectedDate}
            onBack={() => setStep("detail")}
            onAlreadyAttended={() => setStep("blocked")}
            onSuccess={() => setStep("success")}
          />
        )}
      </div>
    </>
  );
}
