import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import Tienda from "@/pages/Tienda";

export const Route = createFileRoute("/tienda")({
  head: () => routeHead("/tienda"),
  component: Tienda,
});
