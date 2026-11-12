import { createFileRoute } from "@tanstack/react-router";
import AdminCustomers from "@/pages/admin/AdminCustomers";

export const Route = createFileRoute("/admin/clientes/")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminCustomers,
});
