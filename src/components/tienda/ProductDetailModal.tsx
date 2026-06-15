import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ShopProduct } from "./ProductCard";

const formatCLP = (n: number) => `$${n.toLocaleString("es-CL")}`;

type Props = {
  product: ShopProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBuy: (p: ShopProduct) => void;
};

export const ProductDetailModal = ({ product, open, onOpenChange, onBuy }: Props) => {
  if (!product) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-space-grotesk text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        {product.image_url && (
          <div className="aspect-square w-full rounded-xl overflow-hidden bg-muted">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          </div>
        )}

        <p className="font-space-grotesk text-2xl font-bold text-primary">
          {formatCLP(product.price)}
        </p>

        {product.description && (
          <div className="font-inter text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
            {product.description}
          </div>
        )}

        <Button onClick={() => onBuy(product)} size="lg" className="w-full mt-2">
          Comprar
        </Button>
      </DialogContent>
    </Dialog>
  );
};
