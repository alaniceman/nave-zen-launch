import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const files = import.meta.glob("@/assets/icefest/gallery/*.webp", { eager: true, import: "default" }) as Record<string, string>;
const uploadedFiles = import.meta.glob("@/assets/icefest/gallery/*.webp.asset.json", { eager: true, import: "default" }) as Record<string, { url: string }>;
const images = [
  ...Object.keys(files).sort().map((k) => files[k]),
  ...Object.keys(uploadedFiles).sort().map((k) => uploadedFiles[k].url),
];

export default function IcefestGallery() {
  const [open, setOpen] = useState<number | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (emblaApi && open !== null) emblaApi.scrollTo(open, true);
  }, [emblaApi, open]);
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setOpen(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {images.map((src, i) => (
          <button key={src} onClick={() => setOpen(i)} className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <img src={src} alt={`Icefest edición anterior ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </button>
        ))}
      </div>
      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="icefest-theme max-w-[100vw] w-screen h-[100dvh] p-0 bg-background border-none overflow-hidden [&>button]:hidden">
          <DialogTitle className="sr-only">Galería Icefest</DialogTitle>
          <DialogDescription className="sr-only">Desliza o usa las flechas para ver más fotos</DialogDescription>
          <button onClick={() => setOpen(null)} aria-label="Cerrar" className="absolute top-4 right-4 z-50 p-2 rounded-full bg-card text-foreground"><X className="w-6 h-6" /></button>
          <button onClick={prev} aria-label="Anterior" className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-card text-foreground hidden md:flex"><ChevronLeft className="w-7 h-7" /></button>
          <div className="w-full h-full overflow-hidden" ref={emblaRef}>
            <div className="flex h-full touch-pan-y">
              {images.map((src, i) => (
                <div key={src} className="flex-[0_0_100%] min-w-0 h-full flex items-center justify-center p-4 md:p-8">
                  {open !== null && Math.abs(i - open) <= 1 || (open !== null && Math.abs(i - open) === images.length - 1) ? (
                    <img src={src} alt={`Icefest edición anterior ${i + 1}`} className="max-w-full max-h-[85dvh] object-contain" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <button onClick={next} aria-label="Siguiente" className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-card text-foreground hidden md:flex"><ChevronRight className="w-7 h-7" /></button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm bg-card px-4 py-2 rounded-full">{open !== null && `${open + 1} / ${images.length}`}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
