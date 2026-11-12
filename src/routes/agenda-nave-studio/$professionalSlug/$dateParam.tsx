import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import AgendaNaveStudio from "@/pages/AgendaNaveStudio";

export const Route = createFileRoute("/agenda-nave-studio/$professionalSlug/$dateParam")({
  head: ({ params }) => routeHead(`/agenda-nave-studio/${params.professionalSlug}/${params.dateParam}`),
  component: AgendaNaveStudio,
});
