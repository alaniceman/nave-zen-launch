import { useContext } from "react";
import { EmailCaptureModalContext } from "@/context/EmailCaptureModalProvider";

export const useEmailCaptureModal = () => {
  const context = useContext(EmailCaptureModalContext);
  
  if (context === undefined) {
    throw new Error('useEmailCaptureModal must be used within a EmailCaptureModalProvider');
  }
  
  return context;
};