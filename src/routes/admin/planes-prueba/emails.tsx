import { createFileRoute } from "@tanstack/react-router";
import AdminEmailPreview from "@/pages/admin/AdminEmailPreview";

export const Route = createFileRoute("/admin/planes-prueba/emails")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminEmailPreview,
});
