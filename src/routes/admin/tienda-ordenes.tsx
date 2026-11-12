import { createFileRoute } from "@tanstack/react-router";
import AdminShopOrders from "@/pages/admin/AdminShopOrders";

export const Route = createFileRoute("/admin/tienda-ordenes")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminShopOrders,
});
