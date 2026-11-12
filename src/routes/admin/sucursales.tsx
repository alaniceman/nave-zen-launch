import { createFileRoute } from "@tanstack/react-router";
import AdminBranches from "@/pages/admin/AdminBranches";

export const Route = createFileRoute("/admin/sucursales")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminBranches,
});
