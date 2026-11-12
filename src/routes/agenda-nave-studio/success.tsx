import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import AgendaSuccess from "@/pages/AgendaSuccess";

export const Route = createFileRoute("/agenda-nave-studio/success")({
  head: () => routeHead("/agenda-nave-studio/success"),
  component: AgendaSuccess,
});
