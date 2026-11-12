import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import BlogYinVinyasa from "@/pages/BlogYinVinyasa";

export const Route = createFileRoute("/blog/yin-yoga-vinyasa-yoga-beneficios-como-combinarlos")({
  head: () => routeHead("/blog/yin-yoga-vinyasa-yoga-beneficios-como-combinarlos"),
  component: BlogYinVinyasa,
});
