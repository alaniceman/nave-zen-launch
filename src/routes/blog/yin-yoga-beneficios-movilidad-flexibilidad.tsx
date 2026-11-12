import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import BlogYinYoga from "@/pages/blog/BlogYinYoga";

export const Route = createFileRoute("/blog/yin-yoga-beneficios-movilidad-flexibilidad")({
  head: () => routeHead("/blog/yin-yoga-beneficios-movilidad-flexibilidad"),
  component: BlogYinYoga,
});
