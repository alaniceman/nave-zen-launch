import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import PackRenovacion from "@/pages/PackRenovacion";

export const Route = createFileRoute("/pack-renovacion")({
  head: () => routeHead("/pack-renovacion"),
  component: PackRenovacion,
});
