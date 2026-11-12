import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/planes")({
  beforeLoad: () => {
    throw redirect({ to: "/planes-precios", replace: true });
  },
});
