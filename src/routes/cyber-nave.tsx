import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import CyberNave from "@/pages/CyberNave";

export const Route = createFileRoute("/cyber-nave")({
  head: () => routeHead("/cyber-nave"),
  component: CyberNave,
});
