import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ name: "robots", content: "noindex, nofollow" }] }),
  ssr: false,
  component: () => (
    <ProtectedRoute requireAdmin>
      <AdminLayout />
    </ProtectedRoute>
  ),
});
