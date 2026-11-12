import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import Login from "@/pages/Login";

export const Route = createFileRoute("/login")({
  head: () => routeHead("/login"),
  component: Login,
});
