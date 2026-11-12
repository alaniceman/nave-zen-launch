import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import BlogProtocolo15Minutos from "@/pages/BlogProtocolo15Minutos";

export const Route = createFileRoute("/blog/protocolo-15-minutos-respiracion-agua-fria")({
  head: () => routeHead("/blog/protocolo-15-minutos-respiracion-agua-fria"),
  component: BlogProtocolo15Minutos,
});
