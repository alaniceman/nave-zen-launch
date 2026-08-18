import { useCallback } from 'react';
import {
  MetaEventName,
  MetaEventParams,
  trackMetaEvent,
} from '@/lib/metaPixel';

/**
 * Hook de conveniencia sobre el Pixel.
 * NOTA: no dispara PageView al montarse — el único PageView por navegación
 * lo emite FacebookPixelRouterTracker.
 */
export const useFacebookPixel = () => {
  const trackEvent = useCallback(
    (eventName: MetaEventName, parameters?: MetaEventParams, eventId?: string) => {
      trackMetaEvent(eventName, parameters, eventId);
    },
    []
  );

  const trackLead = useCallback((parameters?: MetaEventParams, eventId?: string) => {
    trackMetaEvent('Lead', parameters, eventId);
  }, []);

  const trackInitiateCheckout = useCallback((parameters?: MetaEventParams, eventId?: string) => {
    trackMetaEvent('InitiateCheckout', parameters, eventId);
  }, []);

  const trackViewContent = useCallback((parameters?: MetaEventParams, eventId?: string) => {
    trackMetaEvent('ViewContent', parameters, eventId);
  }, []);

  const trackContact = useCallback((parameters?: MetaEventParams, eventId?: string) => {
    trackMetaEvent('Contact', parameters, eventId);
  }, []);

  const trackPurchase = useCallback((parameters?: MetaEventParams, eventId?: string) => {
    trackMetaEvent('Purchase', parameters, eventId);
  }, []);

  return {
    trackEvent,
    trackLead,
    trackInitiateCheckout,
    trackViewContent,
    trackContact,
    trackPurchase,
  };
};
