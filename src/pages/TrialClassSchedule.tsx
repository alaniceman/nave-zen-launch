import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { type ScheduleClassItem } from "@/hooks/useScheduleEntries";
import TrialScheduleCards from "@/components/trial/TrialScheduleCards";
import TrialClassDetail from "@/components/trial/TrialClassDetail";
import TrialBookingForm from "@/components/trial/TrialBookingForm";
import TrialAlreadyAttended from "@/components/trial/TrialAlreadyAttended";
import { CheckCircle, Calendar, Clock, MapPin, Instagram } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";
import { useFacebookConversionsAPI } from "@/hooks/useFacebookConversionsAPI";

type Step = "calendar" | "detail" | "form" | "blocked" | "success";

export default function TrialClassSchedule() {
  const navigate = useNavigate();
  const { trackEvent } = useFacebookPixel();
  const { trackServerEvent } = useFacebookConversionsAPI();
  const [step, setStep] = useState<Step>("calendar");
  const [selectedClass, setSelectedClass] = useState<ScheduleClassItem | null>(null);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    trackEvent('ViewContent', { content_name: 'Clase de prueba', content_category: 'Trial' }, eventId);
    trackServerEvent({
      eventName: 'ViewContent',
      eventId,
      contentName: 'Clase de prueba',
    }).catch(() => {});
  }, []);

  const goToForm = () => {
    if (selectedClass) {
      const eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      trackEvent('InitiateCheckout', { content_name: selectedClass.title, currency: 'CLP', value: 0 }, eventId);
      trackServerEvent({
        eventName: 'InitiateCheckout',
        eventId,
        contentName: selectedClass.title,
        value: 0,
        currency: 'CLP',
      }).catch(() => {});
    }
    setStep("form");
  };

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
    const formattedDate = selectedDate
      ? new Date(selectedDate + "T12:00:00").toLocaleDateString("es-CL", {
          weekday: "long",
          day: "numeric",
          month: "long",
          timeZone: "America/Santiago",
        })
      : "";

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

          {/* Class details card */}
          {selectedClass && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] text-left my-6">
              <h3 className="font-bold text-[#2E4D3A] text-lg mb-3">{selectedClass.title}</h3>
              <div className="space-y-2 text-sm text-[#575757]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2E4D3A] shrink-0" />
                  <span className="capitalize">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2E4D3A] shrink-0" />
                  <span>{selectedClass.time} hrs</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2E4D3A] shrink-0" />
                  <a
                    href="https://maps.app.goo.gl/RZmsnSLuxH8XkW2K6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-[#2E4D3A]"
                  >
                    Antares 259, Las Condes
                  </a>
                </div>
                {selectedClass.instructor && (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 shrink-0 text-center text-[#2E4D3A] font-bold text-xs">👤</span>
                    <span>con {selectedClass.instructor}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="text-[#575757] mb-6">
            ¿Alguna duda?{" "}
            <a href="https://wa.me/56946120426" target="_blank" rel="noopener noreferrer" className="text-[#2E4D3A] font-semibold underline">
              Escríbenos por WhatsApp
            </a>
          </p>

          <div className="space-y-3">
            <a
              href="https://instagram.com/nave.icestudio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white font-semibold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity"
            >
              <Instagram className="w-5 h-5" />
              Síguenos en Instagram
            </a>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-[#2E4D3A] text-white font-semibold py-3 px-8 rounded-xl hover:bg-[#2E4D3A]/90 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Agendar clase de prueba | Nave Studio</title>
        <meta name="description" content="Agenda tu clase de prueba gratis en Nave Studio. Yoga, Breathwork y más en Las Condes." />
      </Helmet>

      <div className="min-h-screen bg-[#FAFAFA]">
        {/* Header */}
        <div className="bg-[#2E4D3A] text-white py-8 px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Agenda tu clase de prueba</h1>
          <p className="text-white/80 text-sm md:text-base">Elige una clase, selecciona fecha y reserva tu lugar</p>
        </div>

        {/* Ice bath policy notice */}
        <div className="max-w-xl mx-auto px-4 pt-6">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#2E4D3A] mb-2">🧊 Sobre el agua fría en clases de prueba</h3>
            <p className="text-[14px] text-[#555] leading-relaxed mb-2">
              Las clases de prueba <strong>no incluyen inmersión en hielo</strong> al final, independiente de si ya has hecho baños de hielo antes o no.
            </p>
            <p className="text-[13px] text-[#888] leading-relaxed italic">
              Esto es parte del proceso para que primero conozcas el espacio, la práctica y cómo trabajamos. Si te interesa el hielo, te invitamos a agendar una sesión del <strong>Método Wim Hof</strong>.
            </p>
          </div>
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
            onContinue={goToForm}
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
