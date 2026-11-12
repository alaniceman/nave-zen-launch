import { createFileRoute } from "@tanstack/react-router";
import AdminShopProducts from "@/pages/admin/AdminShopProducts";

export const Route = createFileRoute("/admin/tienda")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminShopProducts,
});
