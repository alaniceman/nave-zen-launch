import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function TrialAlreadyAttended() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <div className="bg-amber-50 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-amber-600" />
      </div>
      <h2 className="text-2xl font-bold text-[#2E4D3A] mb-3">
        Veo que ya hiciste tu clase de prueba
      </h2>
      <p className="text-[#575757] mb-8">
        La clase de prueba es solo una vez. ¡Pero puedes seguir entrenando con nosotros!
      </p>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate("/planes-precios")}
          className="w-full bg-[#2E4D3A] text-white font-semibold py-4 rounded-xl text-lg hover:bg-[#2E4D3A]/90 transition-colors"
        >
          Ver planes
        </button>
        <button
          onClick={() => navigate("/agenda-nave-studio")}
          className="w-full bg-white text-[#2E4D3A] font-semibold py-4 rounded-xl text-lg border border-[#2E4D3A] hover:bg-[#F8F9FA] transition-colors"
        >
          Agendar sesión normal
        </button>
      </div>
    </div>
  );
}
