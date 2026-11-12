import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dia-del-padre")({
  beforeLoad: () => {
    throw redirect({ to: "/promo-invierno", replace: true });
  },
});
