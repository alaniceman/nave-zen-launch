import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import TalleresYRetiros from "@/pages/TalleresYRetiros";

export const Route = createFileRoute("/talleres-y-retiros")({
  head: () => routeHead("/talleres-y-retiros"),
  component: TalleresYRetiros,
});
