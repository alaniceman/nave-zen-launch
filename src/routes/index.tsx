import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import Index from "@/pages/Index";

export const Route = createFileRoute("/")({
  head: () => routeHead("/"),
  component: Index,
});
