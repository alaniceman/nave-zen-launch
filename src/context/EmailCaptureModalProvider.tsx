import { createContext, useState, ReactNode, useEffect } from "react";
import { EmailCaptureModal } from "@/components/EmailCaptureModal";

interface EmailCaptureModalContextType {
  openEmailCaptureModal: () => void;
  closeEmailCaptureModal: () => void;
}

export const EmailCaptureModalContext = createContext<EmailCaptureModalContextType | undefined>(undefined);

interface EmailCaptureModalProviderProps {
  children: ReactNode;
}

export const EmailCaptureModalProvider = ({ children }: EmailCaptureModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownThisSession, setHasShownThisSession] = useState(false);

  const openEmailCaptureModal = () => setIsOpen(true);
  const closeEmailCaptureModal = () => setIsOpen(false);

  // Smart trigger logic
  useEffect(() => {
    // Don't show if already subscribed
    if (localStorage.getItem('email-capture-subscribed')) {
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const showModal = () => {
      if (!hasShownThisSession && !isOpen) {
        setIsOpen(true);
        setHasShownThisSession(true);
      }
    };

    // Show after 30 seconds on any page
    timeoutId = setTimeout(showModal, 30000);

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownThisSession) {
        showModal();
      }
    };

    // Scroll trigger - 60% on certain pages
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent >= 60 && 
          (window.location.pathname.includes('/experiencias') || 
           window.location.pathname.includes('/planes')) &&
          !hasShownThisSession) {
        showModal();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('scroll', handleScroll);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  return (
    <EmailCaptureModalContext.Provider value={{ openEmailCaptureModal, closeEmailCaptureModal }}>
      {children}
      <EmailCaptureModal isOpen={isOpen} onClose={closeEmailCaptureModal} />
    </EmailCaptureModalContext.Provider>
  );
};