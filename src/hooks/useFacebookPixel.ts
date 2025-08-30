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
      window.fbq('track', 'PageView');
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

  return {
    trackEvent,
    trackLead,
    trackInitiateCheckout,
    trackViewContent,
  };
};