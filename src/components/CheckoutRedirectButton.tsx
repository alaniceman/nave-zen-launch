import { ReactNode } from "react";
import { useCheckoutRedirect } from "@/hooks/useCheckoutRedirect";

interface CheckoutRedirectButtonProps {
  children: ReactNode;
  url: string;
  plan?: string;
  className?: string;
  [key: string]: any;
}

export const CheckoutRedirectButton = ({ 
  children, 
  url,
  plan,
  className = "", 
  ...props 
}: CheckoutRedirectButtonProps) => {
  const { start } = useCheckoutRedirect();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    start(url, plan);
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