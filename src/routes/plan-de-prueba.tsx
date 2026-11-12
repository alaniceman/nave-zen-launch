import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import PlanDePrueba from "@/pages/PlanDePrueba";

export const Route = createFileRoute("/plan-de-prueba")({
  head: () => routeHead("/plan-de-prueba"),
  component: PlanDePrueba,
});
