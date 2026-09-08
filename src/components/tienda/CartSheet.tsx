import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Trash2, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";
import { getProductImages } from "./ProductCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackMetaClientEvent } from "@/lib/metaTracking";
import { deterministicEventId, getMetaBrowserContext } from "@/lib/metaPixel";

const formatCLP = (n: number) => `$${n.toLocaleString("es-CL")}`;

export const CartSheet = () => {
  const { items, totalItems, totalPrice, setQuantity, remove, isOpen, setOpen } = useCart();
  const { toast } = useToast();
  const [step, setStep] = useState<"cart" | "form">("cart");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

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
          items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
          buyerName: name.trim(),
          buyerEmail: email.trim(),
          buyerPhone: phone.trim() || undefined,
          fbp: ctx.fbp,
          fbc: ctx.fbc,
          eventSourceUrl: ctx.eventSourceUrl,
        },
      });
      if (error) throw error;
      if (!data?.initPoint) throw new Error(data?.error || "No se pudo iniciar el pago");

      trackMetaClientEvent("InitiateCheckout", {
        eventId: deterministicEventId("initiatecheckout-shop", data.orderId),
        userEmail: email.trim(),
        userName: name.trim(),
        userPhone: phone.trim() || undefined,
        contentName: `Carrito Tienda (${totalItems} productos)`,
        contentType: "product",
        contentCategory: "shop",
        contentIds: items.map((i) => i.product.id),
        numItems: totalItems,
        value: totalPrice,
        currency: "CLP",
        funnel: "shop",
        entityType: "shop_order",
        entityId: data.orderId,
        pixelParams: {
          content_name: `Carrito Tienda (${totalItems} productos)`,
          content_category: "shop",
          content_ids: items.map((i) => i.product.id),
          value: totalPrice,
          currency: "CLP",
        },
      });
      window.location.href = data.initPoint;
    } catch (err: any) {
      console.error("Cart checkout error:", err);
      toast({
        title: "Error al iniciar el pago",
        description: err.message || "Intenta de nuevo en un momento.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !loading && setOpen(o)}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-space-grotesk text-xl">
            {step === "cart" ? "Tu carrito" : "Tus datos"}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center gap-3 text-muted-foreground">
            <ShoppingBag className="h-10 w-10" />
            <p className="font-inter text-sm">Tu carrito está vacío.</p>
          </div>
        ) : step === "cart" ? (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6 divide-y divide-border">
              {items.map(({ product, quantity }) => {
                const img = getProductImages(product)[0];
                return (
                  <div key={product.id} className="flex gap-3 py-4">
                    {img ? (
                      <img
                        src={img}
                        alt={product.name}
                        loading="lazy"
                        className="h-16 w-16 rounded-lg object-cover border border-border"
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-muted" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-space-grotesk font-semibold text-sm leading-tight line-clamp-2">
                        {product.name}
                      </p>
                      <p className="font-inter text-sm text-primary font-bold mt-1">
                        {formatCLP(product.price * quantity)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Quitar una unidad"
                          onClick={() => setQuantity(product.id, quantity - 1)}
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <span className="font-inter text-sm w-6 text-center">{quantity}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          aria-label="Agregar una unidad"
                          onClick={() => setQuantity(product.id, quantity + 1)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 ml-auto text-muted-foreground"
                          aria-label="Eliminar producto"
                          onClick={() => remove(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center justify-between font-space-grotesk">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">{formatCLP(totalPrice)}</span>
              </div>
              <Button size="lg" className="w-full" onClick={() => setStep("form")}>
                Ir a pagar
              </Button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 overflow-y-auto">
            <div>
              <Label htmlFor="cart-name">Nombre</Label>
              <Input id="cart-name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
            </div>
            <div>
              <Label htmlFor="cart-email">Email</Label>
              <Input id="cart-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="cart-phone">Teléfono (opcional)</Label>
              <Input
                id="cart-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+56 9 ..."
              />
            </div>

            <div className="mt-auto space-y-3 border-t border-border pt-4">
              <div className="flex items-center justify-between font-space-grotesk">
                <span className="font-semibold">Total ({totalItems})</span>
                <span className="text-2xl font-bold text-primary">{formatCLP(totalPrice)}</span>
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Redirigiendo a Mercado Pago...
                  </>
                ) : (
                  `Pagar ${formatCLP(totalPrice)}`
                )}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                disabled={loading}
                onClick={() => setStep("cart")}
              >
                Volver al carrito
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
};
