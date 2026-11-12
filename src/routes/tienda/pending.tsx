import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import TiendaPending from "@/pages/TiendaPending";

export const Route = createFileRoute("/tienda/pending")({
  head: () => routeHead("/tienda/pending"),
  component: TiendaPending,
});
