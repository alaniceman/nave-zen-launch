import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

// Get Facebook browser ID from cookie
const getFbp = (): string | undefined => {
  const match = document.cookie.match(/_fbp=([^;]+)/);
  return match ? match[1] : undefined;
};

// Get Facebook click ID from cookie or URL
const getFbc = (): string | undefined => {
  const cookieMatch = document.cookie.match(/_fbc=([^;]+)/);
  if (cookieMatch) return cookieMatch[1];
  
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get("fbclid");
  if (fbclid) {
    return `fb.1.${Date.now()}.${fbclid}`;
  }
  
  return undefined;
};

const generateEventId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

interface TrackEventParams {
  eventName: string;
  eventId?: string;
  userEmail?: string;
  userPhone?: string;
  userName?: string;
  value?: number;
  currency?: string;
  contentName?: string;
  contentType?: string;
  contentIds?: string[];
  orderId?: string;
}

export const useFacebookConversionsAPI = () => {
  const trackServerEvent = useCallback(async ({
    eventName,
    eventId: externalEventId,
    userEmail,
    userPhone,
    userName,
    value,
    currency,
    contentName,
    contentType,
    contentIds,
    orderId,
  }: TrackEventParams): Promise<string> => {
    const eventId = externalEventId || generateEventId();
    
    try {
      const { data, error } = await supabase.functions.invoke("facebook-conversions", {
        body: {
          event_name: eventName,
          event_id: eventId,
          event_source_url: window.location.href,
          user_email: userEmail,
          user_phone: userPhone,
          user_name: userName,
          value,
          currency: currency || "CLP",
          content_name: contentName,
          content_type: contentType,
          content_ids: contentIds,
          order_id: orderId,
          fbc: getFbc(),
          fbp: getFbp(),
        },
      });

      if (error) {
        console.error("Facebook Conversions API error:", error);
      } else {
        console.log("Facebook Conversions API success:", data);
      }
    } catch (err) {
      console.error("Failed to send server event:", err);
    }

    return eventId;
  }, []);

  const trackPurchase = useCallback(async (params: {
    userEmail: string;
    userName: string;
    userPhone?: string;
    value: number;
    currency?: string;
    contentName: string;
    orderId: string;
    eventId?: string;
  }) => {
    return trackServerEvent({
      eventName: "Purchase",
      eventId: params.eventId,
      userEmail: params.userEmail,
      userName: params.userName,
      userPhone: params.userPhone,
      value: params.value,
      currency: params.currency,
      contentName: params.contentName,
      contentType: "product",
      contentIds: [params.orderId],
      orderId: params.orderId,
    });
  }, [trackServerEvent]);

  const trackInitiateCheckout = useCallback(async (params: {
    userEmail?: string;
    userName?: string;
    value?: number;
    contentName?: string;
  }) => {
    return trackServerEvent({
      eventName: "InitiateCheckout",
      userEmail: params.userEmail,
      userName: params.userName,
      value: params.value,
      contentName: params.contentName,
    });
  }, [trackServerEvent]);

  const trackLead = useCallback(async (params: {
    userEmail: string;
    userName?: string;
    userPhone?: string;
    contentName?: string;
  }) => {
    return trackServerEvent({
      eventName: "Lead",
      userEmail: params.userEmail,
      userName: params.userName,
      userPhone: params.userPhone,
      contentName: params.contentName,
    });
  }, [trackServerEvent]);

  const trackViewContent = useCallback(async (params: {
    contentName: string;
    value?: number;
  }) => {
    return trackServerEvent({
      eventName: "ViewContent",
      contentName: params.contentName,
      value: params.value,
    });
  }, [trackServerEvent]);

  return {
    trackServerEvent,
    trackPurchase,
    trackInitiateCheckout,
    trackLead,
    trackViewContent,
  };
};