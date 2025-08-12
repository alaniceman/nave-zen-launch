import { createContext, useState, ReactNode } from "react";
import { TrialClassModal } from "@/components/TrialClassModal";

interface TrialModalContextType {
  openTrialModal: () => void;
  closeTrialModal: () => void;
}

export const TrialModalContext = createContext<TrialModalContextType | undefined>(undefined);

interface TrialModalProviderProps {
  children: ReactNode;
}

export const TrialModalProvider = ({ children }: TrialModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openTrialModal = () => setIsOpen(true);
  const closeTrialModal = () => setIsOpen(false);

  return (
    <TrialModalContext.Provider value={{ openTrialModal, closeTrialModal }}>
      {children}
      <TrialClassModal isOpen={isOpen} onClose={closeTrialModal} />
    </TrialModalContext.Provider>
  );
};