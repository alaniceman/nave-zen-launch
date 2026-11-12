import { createFileRoute } from "@tanstack/react-router";
import AdminServices from "@/pages/admin/AdminServices";

export const Route = createFileRoute("/admin/servicios")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminServices,
});
