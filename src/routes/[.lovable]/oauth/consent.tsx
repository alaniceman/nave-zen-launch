import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import OAuthConsent from "@/pages/OAuthConsent";

export const Route = createFileRoute("/[.lovable]/oauth/consent")({
  head: () => routeHead("/[.lovable]/oauth/consent"),
  component: OAuthConsent,
});
