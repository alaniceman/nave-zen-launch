import { createFileRoute } from "@tanstack/react-router";
import AdminEmailTemplates from "@/pages/admin/AdminEmailTemplates";

export const Route = createFileRoute("/admin/emails")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminEmailTemplates,
});
