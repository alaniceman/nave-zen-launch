import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import BonosSuccess from "@/pages/BonosSuccess";

export const Route = createFileRoute("/bonos/success")({
  head: () => routeHead("/bonos/success"),
  component: BonosSuccess,
});
