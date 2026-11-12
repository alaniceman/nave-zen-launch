import { createFileRoute } from "@tanstack/react-router";
import AdminCapacityOverrides from "@/pages/admin/AdminCapacityOverrides";

export const Route = createFileRoute("/admin/capacidad")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminCapacityOverrides,
});
