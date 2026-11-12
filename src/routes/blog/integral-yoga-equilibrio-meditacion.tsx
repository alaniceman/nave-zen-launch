import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import BlogIntegralYoga from "@/pages/blog/BlogIntegralYoga";

export const Route = createFileRoute("/blog/integral-yoga-equilibrio-meditacion")({
  head: () => routeHead("/blog/integral-yoga-equilibrio-meditacion"),
  component: BlogIntegralYoga,
});
