import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import FotosTallerWimHofSantiago from "@/pages/FotosTallerWimHofSantiago";

export const Route = createFileRoute("/fotos-taller/wim-hof-santiago")({
  head: () => routeHead("/fotos-taller/wim-hof-santiago"),
  component: FotosTallerWimHofSantiago,
});
