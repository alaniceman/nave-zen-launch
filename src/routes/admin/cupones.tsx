import { createFileRoute } from "@tanstack/react-router";
import AdminCoupons from "@/pages/admin/AdminCoupons";

export const Route = createFileRoute("/admin/cupones")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminCoupons,
});
