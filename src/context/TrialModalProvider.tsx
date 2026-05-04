import { createContext, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface TrialModalContextType {
  openTrialModal: () => void;
  closeTrialModal: () => void;
}

export const TrialModalContext = createContext<TrialModalContextType | undefined>(undefined);

export const TrialModalProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const openTrialModal = useCallback(() => {
    navigate("/plan-de-prueba");
  }, [navigate]);

  const closeTrialModal = useCallback(() => {
    // No-op — kept for interface compatibility
  }, []);

  return (
    <TrialModalContext.Provider value={{ openTrialModal, closeTrialModal }}>
      {children}
    </TrialModalContext.Provider>
  );
};