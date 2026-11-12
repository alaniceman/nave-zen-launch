import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import Coaches from "@/pages/Coaches";

export const Route = createFileRoute("/coaches")({
  head: () => routeHead("/coaches"),
  component: Coaches,
});
