import { createFileRoute } from "@tanstack/react-router";
import AdminMembershipLeads from "@/pages/admin/AdminMembershipLeads";

export const Route = createFileRoute("/admin/membresias-leads")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminMembershipLeads,
});
