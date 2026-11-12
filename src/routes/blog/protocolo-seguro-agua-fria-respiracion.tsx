import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import BlogProtocoloSeguro from "@/pages/BlogProtocoloSeguro";

export const Route = createFileRoute("/blog/protocolo-seguro-agua-fria-respiracion")({
  head: () => routeHead("/blog/protocolo-seguro-agua-fria-respiracion"),
  component: BlogProtocoloSeguro,
});
