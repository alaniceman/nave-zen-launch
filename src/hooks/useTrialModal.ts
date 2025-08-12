import { useContext } from "react";
import { TrialModalContext } from "@/context/TrialModalProvider";

export const useTrialModal = () => {
  const context = useContext(TrialModalContext);
  
  if (context === undefined) {
    throw new Error('useTrialModal must be used within a TrialModalProvider');
  }
  
  return context;
};