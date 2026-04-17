import { useEffect, useMemo, useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { reviews as sourceReviews, type Review } from "@/data/reviews";

const shuffleArray = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const TRUNCATE_LENGTH = 140;

const Stars = ({ size = 14 }: { size?: number }) => (
  <div className="flex items-center gap-0.5" aria-label="5 de 5 estrellas">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={size} className="fill-warm text-warm" strokeWidth={0} />
    ))}
  </div>
);

const CategoryChip = ({ category }: { category: Review["category"] }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-inter font-medium bg-primary/10 text-primary">
    {category}
  </span>
);

export const ReviewsTrustBar = () => {
  const reviews = useMemo(() => shuffleArray(sourceReviews), []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const touchStartX = useRef<number | null>(null);

  const scrollBy = (dir: "prev" | "next") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "next" ? 360 : -360, behavior: "smooth" });
  };

  const navigate = (dir: "prev" | "next") => {
    setOpenIndex((current) => {
      if (current === null) return current;
      const next = dir === "next" ? (current + 1) % reviews.length : (current - 1 + reviews.length) % reviews.length;
      return next;
    });
  };

  useEffect(() => {
    if (openIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") navigate("next");
      if (e.key === "ArrowLeft") navigate("prev");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openIndex]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) navigate(diff < 0 ? "next" : "prev");
    touchStartX.current = null;
  };

  const current = openIndex !== null ? reviews[openIndex] : null;

  const ExpandedContent = current && (
    <div
      className="space-y-5"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between">
        <Stars size={18} />
        <CategoryChip category={current.category} />
      </div>
      <blockquote className="font-inter text-base md:text-lg text-neutral-dark italic leading-relaxed">
        "{current.text}"
      </blockquote>
      <p className="font-space-grotesk font-bold text-sm text-neutral-dark">
        — {current.author}
      </p>
      <div className="flex items-center justify-between pt-4 border-t border-primary/10">
        <button
          onClick={() => navigate("prev")}
          aria-label="Reseña anterior"
          className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-primary/5 transition-colors text-neutral-dark font-inter text-sm"
        >
          <ChevronLeft size={18} /> Anterior
        </button>
        <span className="font-inter text-xs text-neutral-mid">
          {openIndex! + 1} / {reviews.length}
        </span>
        <button
          onClick={() => navigate("next")}
          aria-label="Reseña siguiente"
          className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-primary/5 transition-colors text-neutral-dark font-inter text-sm"
        >
          Siguiente <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );

  return (
    <section className="mb-16" aria-label="Reseñas de la comunidad Nave Studio">
      <style>{`.reviews-strip::-webkit-scrollbar{display:none}.reviews-strip{scrollbar-width:none}`}</style>

      <div className="text-center mb-8">
        <h3 className="font-space-grotesk font-bold text-2xl md:text-3xl text-neutral-dark">
          Lo que dice la comunidad
        </h3>
      </div>

      <div className="relative">
        {/* Edge fades */}
        <div className="hidden md:block pointer-events-none absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-neutral-light to-transparent z-10" />
        <div className="hidden md:block pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-light to-transparent z-10" />

        {/* Desktop nav buttons */}
        <button
          onClick={() => scrollBy("prev")}
          aria-label="Ver reseñas anteriores"
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-background shadow-medium border border-primary/10 hover:bg-primary/5 transition-colors"
        >
          <ChevronLeft size={20} className="text-neutral-dark" />
        </button>
        <button
          onClick={() => scrollBy("next")}
          aria-label="Ver más reseñas"
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-background shadow-medium border border-primary/10 hover:bg-primary/5 transition-colors"
        >
          <ChevronRight size={20} className="text-neutral-dark" />
        </button>

        <div
          ref={scrollRef}
          role="region"
          className="reviews-strip flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 md:px-12 pb-2"
        >
          {reviews.map((review, idx) => {
            const isLong = review.text.length > TRUNCATE_LENGTH;
            return (
              <button
                key={review.id}
                onClick={() => setOpenIndex(idx)}
                className="snap-start shrink-0 w-[85%] sm:w-[320px] md:w-[340px] text-left bg-background rounded-[var(--radius)] shadow-light border border-primary/10 p-6 hover:shadow-medium hover:border-primary/20 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label={`Leer reseña completa de ${review.author}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Stars />
                  <CategoryChip category={review.category} />
                </div>
                <blockquote className="font-inter text-sm text-neutral-dark italic leading-relaxed line-clamp-4 mb-3 min-h-[5.5rem]">
                  "{review.text}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <p className="font-space-grotesk font-bold text-sm text-neutral-dark">
                    {review.author}
                  </p>
                  {isLong && (
                    <span className="font-inter text-xs text-primary font-medium">
                      Ver más →
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded view */}
      {isMobile ? (
        <Sheet open={openIndex !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
          <SheetContent side="bottom" className="rounded-t-[var(--radius)] max-h-[85vh] overflow-y-auto">
            <SheetTitle className="sr-only">Reseña completa</SheetTitle>
            <SheetDescription className="sr-only">
              Reseña de {current?.author}
            </SheetDescription>
            {ExpandedContent}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={openIndex !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
          <DialogContent className="max-w-xl">
            <DialogTitle className="sr-only">Reseña completa</DialogTitle>
            <DialogDescription className="sr-only">
              Reseña de {current?.author}
            </DialogDescription>
            {ExpandedContent}
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};
