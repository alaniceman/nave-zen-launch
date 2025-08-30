import { useFacebookPixel } from "@/hooks/useFacebookPixel";

export function FacebookPixelRouterTracker() {
  // Tracks PageView on route changes via useLocation inside the hook
  useFacebookPixel();
  return null;
}

export default FacebookPixelRouterTracker;