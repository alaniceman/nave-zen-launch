import { createFileRoute } from "@tanstack/react-router";
import AdminAIKnowledge from "@/pages/admin/AdminAIKnowledge";

export const Route = createFileRoute("/admin/nave-ai")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminAIKnowledge,
});
