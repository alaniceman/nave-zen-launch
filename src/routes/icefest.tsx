import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import Icefest from "@/pages/Icefest";

export const Route = createFileRoute("/icefest")({
  head: () => routeHead("/icefest"),
  component: Icefest,
});
