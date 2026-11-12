import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import TiendaSuccess from "@/pages/TiendaSuccess";

export const Route = createFileRoute("/tienda/success")({
  head: () => routeHead("/tienda/success"),
  component: TiendaSuccess,
});
