import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import Blog from "@/pages/Blog";

export const Route = createFileRoute("/blog")({
  head: () => routeHead("/blog"),
  component: Blog,
});
