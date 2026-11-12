import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import AgendaPending from "@/pages/AgendaPending";

export const Route = createFileRoute("/agenda-nave-studio/pending")({
  head: () => routeHead("/agenda-nave-studio/pending"),
  component: AgendaPending,
});
