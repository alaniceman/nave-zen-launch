import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import AgendaNaveStudio from "@/pages/AgendaNaveStudio";

export const Route = createFileRoute("/agenda-nave-studio")({
  head: () => routeHead("/agenda-nave-studio"),
  component: AgendaNaveStudio,
});
