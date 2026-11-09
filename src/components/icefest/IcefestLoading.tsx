import { Skeleton } from "@/components/ui/skeleton";

export function IcefestLoading() {
  return (
    <div
      className="icefest-theme min-h-screen bg-background text-foreground px-5 py-24"
      role="status"
      aria-label="Cargando Icefest"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-7">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-16 w-full max-w-2xl" />
        <Skeleton className="h-20 w-44" />
        <Skeleton className="h-10 w-full max-w-lg" />
        <Skeleton className="h-14 w-64" />
      </div>
    </div>
  );
}
