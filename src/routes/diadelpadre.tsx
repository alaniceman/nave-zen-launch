import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/diadelpadre")({
  beforeLoad: () => {
    throw redirect({ to: "/promo-invierno", replace: true });
  },
});
