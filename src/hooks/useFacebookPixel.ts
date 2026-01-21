import { useEffect } from 'react';
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

  const trackEvent = (eventName: string, parameters?: any) => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, parameters);
    }
  };

  const trackLead = (parameters?: any) => {
    trackEvent('Lead', parameters);
  };

  const trackInitiateCheckout = (parameters?: any) => {
    trackEvent('InitiateCheckout', parameters);
  };

  const trackViewContent = (parameters?: any) => {
    trackEvent('ViewContent', parameters);
  };

  const trackPurchase = (parameters?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_type?: string;
    content_ids?: string[];
  }) => {
    trackEvent('Purchase', parameters);
  };

  return {
    trackEvent,
    trackLead,
    trackInitiateCheckout,
    trackViewContent,
    trackPurchase,
  };
};