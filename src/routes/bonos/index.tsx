import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import Bonos from "@/pages/Bonos";

export const Route = createFileRoute("/bonos/")({
  head: () => routeHead("/bonos"),
  component: Bonos,
});
