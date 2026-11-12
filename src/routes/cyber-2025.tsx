import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import Cyber2025 from "@/pages/Cyber2025";

export const Route = createFileRoute("/cyber-2025")({
  head: () => routeHead("/cyber-2025"),
  component: Cyber2025,
});
