import { createFileRoute } from "@tanstack/react-router";
import AdminPackageOrders from "@/pages/admin/AdminPackageOrders";

export const Route = createFileRoute("/admin/ordenes")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminPackageOrders,
});
