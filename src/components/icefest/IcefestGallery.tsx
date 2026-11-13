import { useCallback, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

const files = import.meta.glob("@/assets/icefest/gallery/*.webp", { eager: true, import: "default" }) as Record<string, string>;
const uploadedFiles = import.meta.glob("@/assets/icefest/gallery/*.webp.asset.json", { eager: true, import: "default" }) as Record<string, { url: string }>;
const images = [
  ...Object.keys(files).sort().map((k) => files[k]),
  ...Object.keys(uploadedFiles).sort().map((k) => uploadedFiles[k].url),
];

const highlights = [
  { file: "icefest-17.webp", label: "Atravesar el frío" },
  { file: "icefest-09.webp", label: "Respirar juntos" },
  { file: "icefest-05.webp", label: "Acompañarnos" },
  { file: "icefest-12.webp", label: "Celebrar" },
  { file: "icefest-33.webp", label: "Ser comunidad" },
].map((photo) => ({ ...photo, index: images.findIndex((src) => src.split("?")[0].includes(photo.file.replace(".webp", ""))) }));

export default function IcefestGallery({ variant = "grid" }: { variant?: "grid" | "filmstrip" }) {
  const [open, setOpen] = useState<number | null>(null);
  const [stripRef, stripApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
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
      {variant === "filmstrip" ? (
        <section aria-label="Momentos del Icefest anterior" className="bg-background border-b border-border py-6 md:py-8">
          <div className="max-w-6xl mx-auto px-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-lg md:text-xl font-semibold">Así se vivió Icefest</h2>
              <div className="flex items-center gap-1">
                <Button asChild variant="link" size="sm"><a href="#fotos">Ver todas las fotos</a></Button>
                <Button variant="ghost" size="icon" aria-label="Fotos anteriores" title="Fotos anteriores" onClick={() => stripApi?.scrollPrev()}><ChevronLeft /></Button>
                <Button variant="ghost" size="icon" aria-label="Fotos siguientes" title="Fotos siguientes" onClick={() => stripApi?.scrollNext()}><ChevronRight /></Button>
              </div>
            </div>
            <div ref={stripRef} className="overflow-hidden">
              <div className="flex gap-3 touch-pan-y">
                {highlights.filter((photo) => photo.index >= 0).map((photo) => (
                  <div key={photo.file} className="min-w-0 flex-[0_0_65%] sm:flex-[0_0_35%] lg:flex-[0_0_calc((100%-48px)/5)]">
                    <Button variant="ghost" onClick={() => setOpen(photo.index)} aria-label={`Ampliar foto: ${photo.label}`} className="block h-auto w-full aspect-[4/5] overflow-hidden rounded-lg p-0">
                      <img src={images[photo.index]} alt={photo.label + " en el Icefest anterior"} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </Button>
                    <p className="mt-2 text-sm text-muted-foreground">{photo.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {images.map((src, i) => (
          <button key={src} onClick={() => setOpen(i)} className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-muted focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary">
            <img src={src} alt={`Icefest edición anterior ${i + 1}`} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </button>
        ))}
      </div>}
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
