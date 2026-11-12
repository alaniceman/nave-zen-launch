import { createFileRoute } from "@tanstack/react-router";
import AdminMailerLite from "@/pages/admin/AdminMailerLite";

export const Route = createFileRoute("/admin/mailerlite")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminMailerLite,
});
