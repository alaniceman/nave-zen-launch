import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import BlogPowerYoga from "@/pages/blog/BlogPowerYoga";

export const Route = createFileRoute("/blog/power-yoga-fuerza-resistencia")({
  head: () => routeHead("/blog/power-yoga-fuerza-resistencia"),
  component: BlogPowerYoga,
});
