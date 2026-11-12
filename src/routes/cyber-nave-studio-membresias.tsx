import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/cyber-nave-studio-membresias")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
