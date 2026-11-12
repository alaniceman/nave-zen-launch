import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import BlogBiohacking from "@/pages/BlogBiohacking";

export const Route = createFileRoute("/blog/biohacking-hiit-breathwork-agua-fria-longevidad")({
  head: () => routeHead("/blog/biohacking-hiit-breathwork-agua-fria-longevidad"),
  component: BlogBiohacking,
});
