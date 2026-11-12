import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import Experiencias from "@/pages/Experiencias";

export const Route = createFileRoute("/experiencias")({
  head: () => routeHead("/experiencias"),
  component: Experiencias,
});
