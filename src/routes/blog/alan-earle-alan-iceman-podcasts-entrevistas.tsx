import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import BlogAlanEarlePodcasts from "@/pages/BlogAlanEarlePodcasts";

export const Route = createFileRoute("/blog/alan-earle-alan-iceman-podcasts-entrevistas")({
  head: () => routeHead("/blog/alan-earle-alan-iceman-podcasts-entrevistas"),
  component: BlogAlanEarlePodcasts,
});
