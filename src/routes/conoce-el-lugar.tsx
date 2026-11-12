import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import ConoceElLugar from "@/pages/ConoceElLugar";

export const Route = createFileRoute("/conoce-el-lugar")({
  head: () => routeHead("/conoce-el-lugar"),
  component: ConoceElLugar,
});
