import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Package, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";

const purchaseSchema = z.object({
  buyerName: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  buyerEmail: z.string().email("Email inválido").max(255),
  buyerPhone: z.string().min(8, "Teléfono inválido").max(20),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

interface SessionPackage {
  id: string;
  name: string;
  description: string;
  sessions_quantity: number;
  price_clp: number;
  validity_days: number;
  applicable_service_ids: string[];
  is_active: boolean;
}

interface Service {
  id: string;
  name: string;
  price_clp: number;
}

export default function Bonos() {
  const [packages, setPackages] = useState<SessionPackage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
  });

  useEffect(() => {
    loadPackages();
    loadServices();
  }, []);

  const loadPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("session_packages")
        .select("*")
        .eq("is_active", true)
        .order("sessions_quantity", { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error("Error loading packages:", error);
      toast.error("Error al cargar los paquetes");
    } finally {
      setIsLoading(false);
    }
  };

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("id, name, price_clp")
        .eq("is_active", true);

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  const calculateSavings = (pkg: SessionPackage) => {
    const applicableServices = services.filter(s => 
      pkg.applicable_service_ids.includes(s.id)
    );
    
    if (applicableServices.length === 0) return 0;
    
    const avgPrice = applicableServices.reduce((sum, s) => sum + s.price_clp, 0) / applicableServices.length;
    const normalPrice = avgPrice * pkg.sessions_quantity;
    return Math.floor(normalPrice - pkg.price_clp);
  };

  const getServiceNames = (serviceIds: string[]) => {
    return services
      .filter(s => serviceIds.includes(s.id))
      .map(s => s.name)
      .join(", ");
  };

  const onSubmit = async (data: PurchaseFormData) => {
    if (!selectedPackage) {
      toast.error("Selecciona un paquete");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: result, error } = await supabase.functions.invoke("purchase-session-package", {
        body: {
          packageId: selectedPackage,
          ...data,
        },
      });

      if (error) {
        throw new Error(error.message || "Error al procesar la compra");
      }

      // Redirect to Mercado Pago
      if (result.initPoint) {
        window.location.href = result.initPoint;
      } else {
        throw new Error("No se pudo generar el link de pago");
      }
    } catch (error: any) {
      console.error("Error purchasing package:", error);
      toast.error(error.message || "Error al procesar la compra");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Bonos de Sesiones - Studio La Nave</title>
        <meta name="description" content="Compra paquetes de sesiones con descuento en Studio La Nave. Ahorra y disfruta de múltiples sesiones de yoga, método Wim Hof y más." />
      </Helmet>

      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Bonos de Sesiones</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compra paquetes de sesiones con descuento y úsalos cuando quieras
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Packages List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Paquetes Disponibles</h2>
                {packages.map((pkg) => {
                  const savings = calculateSavings(pkg);
                  return (
                    <Card
                      key={pkg.id}
                      className={`p-6 cursor-pointer transition-all ${
                        selectedPackage === pkg.id
                          ? "border-primary shadow-lg"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Package className="h-5 w-5 text-primary" />
                            <h3 className="text-xl font-bold">{pkg.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {pkg.description}
                          </p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>{pkg.sessions_quantity} sesiones</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Válido por {pkg.validity_days} días</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Válido para: {getServiceNames(pkg.applicable_service_ids)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            ${pkg.price_clp.toLocaleString("es-CL")}
                          </p>
                          {savings > 0 && (
                            <p className="text-xs text-green-600 font-semibold mt-1">
                              Ahorras ${savings.toLocaleString("es-CL")}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Purchase Form */}
              <div>
                <Card className="p-6 sticky top-24">
                  <h2 className="text-2xl font-bold mb-6">Completa tus datos</h2>
                  
                  {!selectedPackage && (
                    <div className="text-center py-8 text-muted-foreground">
                      Selecciona un paquete para continuar
                    </div>
                  )}

                  {selectedPackage && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <Label htmlFor="buyerName">Nombre completo *</Label>
                        <Input
                          id="buyerName"
                          {...register("buyerName")}
                          placeholder="Juan Pérez"
                          disabled={isSubmitting}
                        />
                        {errors.buyerName && (
                          <p className="text-sm text-destructive mt-1">{errors.buyerName.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="buyerEmail">Email *</Label>
                        <Input
                          id="buyerEmail"
                          type="email"
                          {...register("buyerEmail")}
                          placeholder="juan@ejemplo.com"
                          disabled={isSubmitting}
                        />
                        {errors.buyerEmail && (
                          <p className="text-sm text-destructive mt-1">{errors.buyerEmail.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="buyerPhone">Celular *</Label>
                        <Input
                          id="buyerPhone"
                          {...register("buyerPhone")}
                          placeholder="+56912345678"
                          disabled={isSubmitting}
                        />
                        {errors.buyerPhone && (
                          <p className="text-sm text-destructive mt-1">{errors.buyerPhone.message}</p>
                        )}
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <p className="text-sm font-medium">📧 Recibirás tus códigos por email</p>
                        <p className="text-xs text-muted-foreground">
                          Cada código puede usarse una vez. Guarda el email para tener tus códigos siempre disponibles.
                        </p>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          "Comprar y pagar"
                        )}
                      </Button>
                    </form>
                  )}
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}