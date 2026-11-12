import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import WimHofTodosLosPodcasts from "@/pages/WimHofTodosLosPodcasts";

export const Route = createFileRoute("/wim-hof-todos-los-podcasts")({
  head: () => routeHead("/wim-hof-todos-los-podcasts"),
  component: WimHofTodosLosPodcasts,
});
