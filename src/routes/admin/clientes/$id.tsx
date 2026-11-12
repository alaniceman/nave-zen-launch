import { createFileRoute } from "@tanstack/react-router";
import AdminCustomerDetail from "@/pages/admin/AdminCustomerDetail";

export const Route = createFileRoute("/admin/clientes/$id")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminCustomerDetail,
});
