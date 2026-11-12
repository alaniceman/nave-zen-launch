import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import TallerSantiago from "@/pages/TallerSantiago";

export const Route = createFileRoute("/taller-wim-hof-santiago-fundamentales-avanzado")({
  head: () => routeHead("/taller-wim-hof-santiago-fundamentales-avanzado"),
  component: TallerSantiago,
});
