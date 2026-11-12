import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import BlogVinyasaYoga from "@/pages/blog/BlogVinyasaYoga";

export const Route = createFileRoute("/blog/vinyasa-yoga-flujo-respiracion-las-condes")({
  head: () => routeHead("/blog/vinyasa-yoga-flujo-respiracion-las-condes"),
  component: BlogVinyasaYoga,
});
