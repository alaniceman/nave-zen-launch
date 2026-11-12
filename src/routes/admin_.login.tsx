import { createFileRoute } from "@tanstack/react-router";
import AdminLogin from "@/pages/admin/Login";

export const Route = createFileRoute("/admin_/login")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminLogin,
});
