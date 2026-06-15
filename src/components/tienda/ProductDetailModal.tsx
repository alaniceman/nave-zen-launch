import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getProductImages, type ShopProduct } from "./ProductCard";
import { ProductGallery } from "./ProductGallery";

const formatCLP = (n: number) => `$${n.toLocaleString("es-CL")}`;

type Props = {
  product: ShopProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBuy: (p: ShopProduct) => void;
};

export const ProductDetailModal = ({ product, open, onOpenChange, onBuy }: Props) => {
  if (!product) return null;
  const images = getProductImages(product);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-space-grotesk text-2xl">{product.name}</DialogTitle>
        </DialogHeader>

        {images.length > 0 && <ProductGallery images={images} alt={product.name} />}

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
