import { useTrialModal } from "@/hooks/useTrialModal";
import { ReactNode } from "react";

interface OpenTrialModalButtonProps {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export const OpenTrialModalButton = ({ 
  children, 
  className = "", 
  ...props 
}: OpenTrialModalButtonProps) => {
  const { openTrialModal } = useTrialModal();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openTrialModal();
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};