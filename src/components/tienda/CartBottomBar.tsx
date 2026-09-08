import { ShoppingCart, ChevronRight } from "lucide-react";
import { useCart } from "./CartContext";
import { getProductImages } from "./ProductCard";

const formatCLP = (n: number) => `$${n.toLocaleString("es-CL")}`;

export const CartBottomBar = () => {
  const { items, totalItems, totalPrice, setOpen } = useCart();

  if (totalItems === 0) return null;

  // Unique products to show as thumbnails (cap at 4 for space)
  const previews = items.slice(0, 4);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 px-4 py-3 md:px-6 md:py-3.5 text-left transition-colors hover:bg-muted/50 active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
        aria-label={`Ver carrito · ${totalItems} ${totalItems === 1 ? "producto" : "productos"} · Total ${formatCLP(totalPrice)}`}
      >
        {/* Thumbnails */}
        <div className="flex -space-x-3 shrink-0">
          {previews.map(({ product }) => {
            const img = getProductImages(product)[0];
            return img ? (
              <img
                key={product.id}
                src={img}
                alt=""
                loading="lazy"
                className="h-10 w-10 rounded-full border-2 border-background object-cover"
              />
            ) : (
              <div
                key={product.id}
                className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center"
              >
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          })}
          {items.length > previews.length && (
            <div className="h-10 w-10 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center">
              <span className="font-inter text-xs font-bold text-primary">
                +{items.length - previews.length}
              </span>
            </div>
          )}
        </div>

        {/* Summary text */}
        <div className="flex-1 min-w-0">
          <p className="font-space-grotesk text-sm font-semibold leading-tight truncate">
            {totalItems} {totalItems === 1 ? "producto" : "productos"} en el carrito
          </p>
          <p className="font-inter text-xs text-muted-foreground leading-tight truncate">
            {items.map((i) => `${i.quantity}× ${i.product.name}`).join(" · ")}
          </p>
        </div>

        {/* Total + CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right">
            <p className="font-space-grotesk text-base md:text-lg font-bold text-primary leading-none">
              {formatCLP(totalPrice)}
            </p>
            <p className="font-inter text-[10px] text-muted-foreground leading-none mt-0.5 hidden md:block">
              Total
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-2 md:px-4 md:py-2.5 text-primary-foreground font-space-grotesk text-sm font-semibold transition-colors">
            Ver carrito
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </button>
    </div>
  );
};
