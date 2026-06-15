import { Button } from "@/components/ui/button";
import { ProductGallery } from "./ProductGallery";

export type ShopProduct = {
  id: string;
  name: string;
  short_description: string | null;
  description: string | null;
  price: number;
  image_url: string | null;
  image_urls: string[] | null;
  is_active: boolean;
  sort_order: number;
};

const formatCLP = (n: number) => `$${n.toLocaleString("es-CL")}`;

export const getProductImages = (p: Pick<ShopProduct, "image_url" | "image_urls">): string[] => {
  const arr = (p.image_urls || []).filter(Boolean);
  if (arr.length) return arr;
  return p.image_url ? [p.image_url] : [];
};

type Props = {
  product: ShopProduct;
  onDetails: () => void;
  onBuy: () => void;
};

export const ProductCard = ({ product, onDetails, onBuy }: Props) => {
  const images = getProductImages(product);
  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-background overflow-hidden hover:shadow-md transition-shadow">
      <ProductGallery images={images} alt={product.name} className="rounded-none" />
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-space-grotesk font-bold text-lg text-foreground leading-tight mb-1">
          {product.name}
        </h3>
        {product.short_description && (
          <p className="font-inter text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.short_description}
          </p>
        )}
        <p className="font-space-grotesk font-bold text-2xl text-primary mt-auto mb-4">
          {formatCLP(product.price)}
        </p>
        <div className="flex flex-col gap-2">
          <Button onClick={onBuy} className="w-full" size="lg">
            Comprar
          </Button>
          <Button onClick={onDetails} variant="outline" className="w-full" size="sm">
            Más detalles
          </Button>
        </div>
      </div>
    </article>
  );
};
