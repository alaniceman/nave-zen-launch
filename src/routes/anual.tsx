import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import PlanAnual2026 from "@/pages/PlanAnual2026";

export const Route = createFileRoute("/anual")({
  head: () => routeHead("/anual"),
  component: PlanAnual2026,
});
