import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import AgendaFailure from "@/pages/AgendaFailure";

export const Route = createFileRoute("/agenda-nave-studio/failure")({
  head: () => routeHead("/agenda-nave-studio/failure"),
  component: AgendaFailure,
});
