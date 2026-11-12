import { createFileRoute } from "@tanstack/react-router";
import AdminAbandonedCarts from "@/pages/admin/AdminAbandonedCarts";

export const Route = createFileRoute("/admin/carros-abandonados")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminAbandonedCarts,
});
