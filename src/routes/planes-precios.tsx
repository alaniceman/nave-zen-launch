import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import Planes from "@/pages/Planes";

export const Route = createFileRoute("/planes-precios")({
  head: () => routeHead("/planes-precios"),
  component: Planes,
});
