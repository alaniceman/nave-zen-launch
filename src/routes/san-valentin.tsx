import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import SanValentin from "@/pages/SanValentin";

export const Route = createFileRoute("/san-valentin")({
  head: () => routeHead("/san-valentin"),
  component: SanValentin,
});
