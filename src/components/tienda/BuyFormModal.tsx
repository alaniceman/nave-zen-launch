import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FloatingInput } from "@/components/ui/floating-input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import type { ShopProduct } from "./ProductCard";
import { trackMetaClientEvent } from "@/lib/metaTracking";
import { deterministicEventId, getMetaBrowserContext } from "@/lib/metaPixel";

const formatCLP = (n: number) => `$${n.toLocaleString("es-CL")}`;

type Props = {
  product: ShopProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const BuyFormModal = ({ product, open, onOpenChange }: Props) => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({ title: "Completa tu nombre y email", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const ctx = getMetaBrowserContext();
      const { data, error } = await supabase.functions.invoke("create-shop-preference", {
        body: {
          productId: product.id,
          buyerName: name.trim(),
          buyerEmail: email.trim(),
          buyerPhone: phone.trim() || undefined,
          fbp: ctx.fbp,
          fbc: ctx.fbc,
          eventSourceUrl: ctx.eventSourceUrl,
        },
      });
      if (error) throw error;
      if (data?.initPoint) {
        // InitiateCheckout sólo con orden creada y link de pago real.
        trackMetaClientEvent("InitiateCheckout", {
          eventId: deterministicEventId("initiatecheckout-shop", data.orderId),
          userEmail: email.trim(),
          userName: name.trim(),
          userPhone: phone.trim() || undefined,
          contentName: product.name,
          contentType: "product",
          contentCategory: "shop",
          contentIds: [product.id],
          numItems: 1,
          value: product.price,
          currency: "CLP",
          funnel: "shop",
          entityType: "shop_order",
          entityId: data.orderId,
          pixelParams: {
            content_name: product.name,
            content_category: "shop",
            content_ids: [product.id],
            value: product.price,
            currency: "CLP",
          },
        });
        window.location.href = data.initPoint;
      } else {
        throw new Error(data?.error || "No se pudo iniciar el pago");
      }
    } catch (err: any) {
      console.error("Shop checkout error:", err);
      toast({
        title: "Error al iniciar el pago",
        description: err.message || "Intenta de nuevo en un momento.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !loading && onOpenChange(o)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-space-grotesk text-xl">Comprar {product.name}</DialogTitle>
          <DialogDescription>
            Total: <span className="font-bold text-primary">{formatCLP(product.price)}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput id="buyer-name" label="Nombre" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          <FloatingInput id="buyer-email" label="Email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <FloatingInput id="buyer-phone" label="Teléfono (opcional)" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} hint="Ej: +56 9 4612 0426" />

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Redirigiendo a Mercado Pago...
              </>
            ) : (
              `Pagar ${formatCLP(product.price)}`
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Te llevamos al checkout de Mercado Pago.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
