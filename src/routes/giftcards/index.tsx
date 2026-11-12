import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import GiftCards from "@/pages/GiftCards";

export const Route = createFileRoute("/giftcards/")({
  head: () => routeHead("/giftcards"),
  component: GiftCards,
});
