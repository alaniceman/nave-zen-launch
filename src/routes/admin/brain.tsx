import { createFileRoute } from "@tanstack/react-router";
import AdminBrain from "@/pages/admin/AdminBrain";

export const Route = createFileRoute("/admin/brain")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminBrain,
});
