import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SessionPackage {
  id: string;
  name: string;
  price_clp: number;
  sessions_quantity: number;
  validity_days: number;
  description: string | null;
}

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPackage: (pkg: SessionPackage) => void;
  onContinueSingle: () => void;
  serviceId: string;
  singleSessionPrice: number;
  customerData: {
    name: string;
    email: string;
    phone: string;
  };
}

export function UpsellModal({
  isOpen,
  onClose,
  onSelectPackage,
  onContinueSingle,
  serviceId,
  singleSessionPrice,
  customerData,
}: UpsellModalProps) {
  const [packages, setPackages] = useState<SessionPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<SessionPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPackages();
    }
  }, [isOpen, serviceId]);

  const loadPackages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("session_packages")
        .select("*")
        .eq("is_active", true)
        .eq("show_in_upsell_modal", true)
        .contains("applicable_service_ids", [serviceId])
        .order("sessions_quantity", { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error("Error loading packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDiscount = (pkg: SessionPackage) => {
    const regularPrice = singleSessionPrice * pkg.sessions_quantity;
    const savings = regularPrice - pkg.price_clp;
    const percentage = Math.round((savings / regularPrice) * 100);
    return { regularPrice, savings, percentage };
  };

  const handleSelectPackage = async (pkg: SessionPackage) => {
    setSelectedPackage(pkg);
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("purchase-session-package", {
        body: {
          packageId: pkg.id,
          buyerName: customerData.name,
          buyerEmail: customerData.email,
          buyerPhone: customerData.phone,
          isGiftCard: false,
        },
      });

      if (error) throw error;

      if (data.initPoint) {
        window.location.href = data.initPoint;
      } else {
        throw new Error("No se pudo generar el link de pago");
      }
    } catch (error: any) {
      console.error("Error purchasing package:", error);
      setIsProcessing(false);
      setSelectedPackage(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isProcessing && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            Ahorra con nuestros paquetes
          </DialogTitle>
          <DialogDescription className="text-base">
            Agenda esta sesión y aprovecha un precio especial para tus próximas visitas.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {/* Package Cards */}
            <div className="grid gap-3">
              {packages.map((pkg) => {
                const { regularPrice, savings, percentage } = calculateDiscount(pkg);
                const pricePerSession = Math.round(pkg.price_clp / pkg.sessions_quantity);
                const isSelected = selectedPackage?.id === pkg.id;

                return (
                  <button
                    key={pkg.id}
                    onClick={() => handleSelectPackage(pkg)}
                    disabled={isProcessing}
                    className={`relative w-full text-left p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-muted hover:border-primary/50 hover:bg-muted/50"
                    } ${isProcessing && !isSelected ? "opacity-50" : ""}`}
                  >
                    {/* Discount Badge */}
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                      {percentage}% OFF
                    </div>

                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{pkg.sessions_quantity} Sesiones</h3>
                        <p className="text-sm text-muted-foreground">
                          ${pricePerSession.toLocaleString("es-CL")} por sesión
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground line-through">
                          ${regularPrice.toLocaleString("es-CL")}
                        </p>
                        <p className="text-xl font-bold text-primary">
                          ${pkg.price_clp.toLocaleString("es-CL")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Check className="h-4 w-4" />
                      <span>Ahorras ${savings.toLocaleString("es-CL")}</span>
                    </div>

                    {isSelected && isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-xl">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Info Text */}
            <p className="text-sm text-muted-foreground text-center px-4">
              Recibirás códigos a tu correo para agendar las sesiones cuando quieras.
              <br />
              Válidos por 1 año.
            </p>

            {/* Continue with single session */}
            <div className="pt-2 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={onContinueSingle}
                disabled={isProcessing}
              >
                Continuar con 1 sesión (${singleSessionPrice.toLocaleString("es-CL")})
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
