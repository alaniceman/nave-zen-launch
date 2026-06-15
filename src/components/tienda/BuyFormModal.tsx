import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import type { ShopProduct } from "./ProductCard";

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
      const { data, error } = await supabase.functions.invoke("create-shop-preference", {
        body: {
          productId: product.id,
          buyerName: name.trim(),
          buyerEmail: email.trim(),
          buyerPhone: phone.trim() || undefined,
        },
      });
      if (error) throw error;
      if (data?.initPoint) {
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
          <div>
            <Label htmlFor="buyer-name">Nombre</Label>
            <Input id="buyer-name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          </div>
          <div>
            <Label htmlFor="buyer-email">Email</Label>
            <Input id="buyer-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="buyer-phone">Teléfono (opcional)</Label>
            <Input id="buyer-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+56 9 ..." />
          </div>

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
