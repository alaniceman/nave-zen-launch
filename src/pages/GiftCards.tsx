import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Helmet } from "react-helmet-async";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Gift, Calendar, CheckCircle2 } from "lucide-react";
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
  available_as_giftcard: boolean;
}

interface Service {
  id: string;
  name: string;
  price_clp: number;
}

export default function GiftCards() {
  const [packages, setPackages] = useState<SessionPackage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

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
        .eq("available_as_giftcard", true)
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

  const validateCoupon = async () => {
    if (!couponCode.trim() || !selectedPackage) return;

    setIsValidatingCoupon(true);
    setCouponError("");
    setAppliedCoupon(null);

    try {
      const { data: couponData, error } = await supabase
        .from("discount_coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase())
        .eq("is_active", true)
        .maybeSingle();

      if (error || !couponData) {
        setCouponError("Cupón no encontrado");
        return;
      }

      if (couponData.applicable_package_ids && 
          !couponData.applicable_package_ids.includes(selectedPackage)) {
        setCouponError("Este cupón no aplica a esta Gift Card");
        return;
      }

      const now = new Date();
      if (couponData.valid_from && new Date(couponData.valid_from) > now) {
        setCouponError("Este cupón aún no es válido");
        return;
      }
      if (couponData.valid_until && new Date(couponData.valid_until) < now) {
        setCouponError("Este cupón ha expirado");
        return;
      }

      if (couponData.max_uses && couponData.current_uses >= couponData.max_uses) {
        setCouponError("Este cupón ha alcanzado su límite de usos");
        return;
      }

      const pkg = packages.find(p => p.id === selectedPackage);
      if (pkg && couponData.min_purchase_amount && pkg.price_clp < couponData.min_purchase_amount) {
        setCouponError(`Compra mínima requerida: $${couponData.min_purchase_amount.toLocaleString("es-CL")}`);
        return;
      }

      setAppliedCoupon(couponData);
      toast.success("¡Cupón aplicado!");
    } catch (error) {
      console.error("Error validating coupon:", error);
      setCouponError("Error al validar cupón");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const calculateFinalPrice = (packagePrice: number) => {
    if (!appliedCoupon) return packagePrice;

    let discount = 0;
    if (appliedCoupon.discount_type === "percentage") {
      discount = Math.floor(packagePrice * (appliedCoupon.discount_value / 100));
    } else {
      discount = appliedCoupon.discount_value;
    }

    return Math.max(0, packagePrice - discount);
  };

  const getDiscountAmount = (packagePrice: number) => {
    if (!appliedCoupon) return 0;
    return packagePrice - calculateFinalPrice(packagePrice);
  };

  const onSubmit = async (data: PurchaseFormData) => {
    if (!selectedPackage) {
      toast.error("Selecciona una Gift Card");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: result, error } = await supabase.functions.invoke("purchase-session-package", {
        body: {
          packageId: selectedPackage,
          couponCode: appliedCoupon?.code,
          isGiftCard: true,
          ...data,
        },
      });

      if (error) {
        throw new Error(error.message || "Error al procesar la compra");
      }

      if (result.initPoint) {
        window.location.href = result.initPoint;
      } else {
        throw new Error("No se pudo generar el link de pago");
      }
    } catch (error: any) {
      console.error("Error purchasing gift card:", error);
      toast.error(error.message || "Error al procesar la compra");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Gift Cards - Studio La Nave</title>
        <meta name="description" content="Regala experiencias únicas con las Gift Cards de Studio La Nave. Yoga, Método Wim Hof, Ice Bath y más." />
      </Helmet>

      <main className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Gift className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Gift Cards</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Regala experiencias de bienestar. El regalo perfecto para quienes buscan transformar su vida.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : packages.length === 0 ? (
            <div className="text-center py-20">
              <Gift className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Próximamente</h2>
              <p className="text-muted-foreground">
                Estamos preparando las Gift Cards. ¡Vuelve pronto!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Packages List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold mb-6">Elige tu Gift Card</h2>
                {packages.map((pkg) => {
                  const savings = calculateSavings(pkg);
                  return (
                    <Card
                      key={pkg.id}
                      className={`p-6 cursor-pointer transition-all ${
                        selectedPackage === pkg.id
                          ? "border-primary shadow-lg ring-2 ring-primary/20"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Gift className="h-5 w-5 text-primary" />
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
                              Ahorra ${savings.toLocaleString("es-CL")}
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
                  <h2 className="text-2xl font-bold mb-6">Tus datos</h2>
                  
                  {!selectedPackage && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Selecciona una Gift Card para continuar</p>
                    </div>
                  )}

                  {selectedPackage && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <Label htmlFor="buyerName">Tu nombre *</Label>
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
                        <Label htmlFor="buyerEmail">Tu email *</Label>
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
                        <p className="text-xs text-muted-foreground mt-1">
                          Recibirás el link para descargar la Gift Card
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="buyerPhone">Tu celular *</Label>
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

                      {/* Coupon Input */}
                      <div className="border-t pt-4">
                        <Label htmlFor="couponCode">¿Tienes un código de descuento?</Label>
                        <div className="flex gap-2 mt-2">
                          <Input
                            id="couponCode"
                            value={couponCode}
                            onChange={(e) => {
                              setCouponCode(e.target.value.toUpperCase());
                              setCouponError("");
                              setAppliedCoupon(null);
                            }}
                            placeholder="CODIGO"
                            className="font-mono uppercase"
                            disabled={isSubmitting || isValidatingCoupon || !!appliedCoupon}
                          />
                          {!appliedCoupon && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={validateCoupon}
                              disabled={!couponCode.trim() || isValidatingCoupon || isSubmitting}
                            >
                              {isValidatingCoupon ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Aplicar"
                              )}
                            </Button>
                          )}
                          {appliedCoupon && (
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setAppliedCoupon(null);
                                setCouponCode("");
                              }}
                              disabled={isSubmitting}
                            >
                              Quitar
                            </Button>
                          )}
                        </div>
                        {couponError && (
                          <p className="text-sm text-destructive mt-1">{couponError}</p>
                        )}
                        {appliedCoupon && (
                          <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                            <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                              ✓ Cupón {appliedCoupon.code} aplicado
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                              {appliedCoupon.discount_type === "percentage"
                                ? `-${appliedCoupon.discount_value}%`
                                : `-$${appliedCoupon.discount_value.toLocaleString("es-CL")}`}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Price Summary */}
                      {selectedPackage && appliedCoupon && (
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground line-through">Precio original:</span>
                            <span className="text-muted-foreground line-through">
                              ${packages.find(p => p.id === selectedPackage)?.price_clp.toLocaleString("es-CL")}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                            <span>Descuento:</span>
                            <span>
                              -${getDiscountAmount(packages.find(p => p.id === selectedPackage)!.price_clp).toLocaleString("es-CL")}
                            </span>
                          </div>
                          <div className="flex justify-between text-lg font-bold border-t pt-2">
                            <span>Total a pagar:</span>
                            <span className="text-primary">
                              ${calculateFinalPrice(packages.find(p => p.id === selectedPackage)!.price_clp).toLocaleString("es-CL")}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="bg-primary/5 rounded-lg p-4 space-y-2 border border-primary/20">
                        <p className="text-sm font-medium">🎁 Cómo funciona</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Recibirás un email con el link para descargar tu Gift Card</li>
                          <li>• Podrás descargar un PDF con diseño para regalar</li>
                          <li>• La persona que reciba el regalo usará los códigos para reservar</li>
                        </ul>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <Gift className="h-4 w-4 mr-2" />
                            Comprar Gift Card
                          </>
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
