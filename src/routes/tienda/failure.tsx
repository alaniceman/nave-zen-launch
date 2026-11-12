import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import TiendaFailure from "@/pages/TiendaFailure";

export const Route = createFileRoute("/tienda/failure")({
  head: () => routeHead("/tienda/failure"),
  component: TiendaFailure,
});
