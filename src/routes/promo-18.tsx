import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/promo-18")({
  beforeLoad: () => {
    throw redirect({ to: "/promo-18-septiembre", replace: true });
  },
});
