import { createFileRoute } from "@tanstack/react-router";
import AdminMembershipPlans from "@/pages/admin/AdminMembershipPlans";

export const Route = createFileRoute("/admin/membresias")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminMembershipPlans,
});
