import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    fbq: any;
  }
}

export const useFacebookPixel = () => {
  const location = useLocation();

  // Track PageView on route changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      setTimeout(() => {
        window.fbq('track', 'PageView');
      }, 100);
    }
  }, [location.pathname]);

  const trackEvent = useCallback((eventName: string, parameters?: Record<string, unknown>, eventId?: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
      const STANDARD_EVENTS = new Set([
        'PageView', 'ViewContent', 'Search', 'AddToCart', 'AddToWishlist',
        'InitiateCheckout', 'AddPaymentInfo', 'Purchase', 'Lead', 'CompleteRegistration',
        'Contact', 'CustomizeProduct', 'Donate', 'FindLocation', 'Schedule',
        'StartTrial', 'SubmitApplication', 'Subscribe',
      ]);
      const method = STANDARD_EVENTS.has(eventName) ? 'track' : 'trackCustom';
      if (eventId) {
        window.fbq(method, eventName, parameters, { eventID: eventId });
      } else {
        window.fbq(method, eventName, parameters);
      }
    }
  }, []);

  const trackLead = useCallback((parameters?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'Lead', parameters);
    }
  }, []);

  const trackInitiateCheckout = useCallback((parameters?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', parameters);
    }
  }, []);

  const trackViewContent = useCallback((parameters?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', parameters);
    }
  }, []);

  const trackPurchase = useCallback((parameters?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_type?: string;
    content_ids?: string[];
  }, eventId?: string) => {
    if (typeof window !== 'undefined' && window.fbq) {
      if (eventId) {
        window.fbq('track', 'Purchase', parameters, { eventID: eventId });
      } else {
        window.fbq('track', 'Purchase', parameters);
      }
    }
  }, []);

  return {
    trackEvent,
    trackLead,
    trackInitiateCheckout,
    trackViewContent,
    trackPurchase,
  };
};