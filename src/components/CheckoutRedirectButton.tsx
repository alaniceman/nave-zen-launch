import { useCheckoutRedirect } from "@/hooks/useCheckoutRedirect";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface CheckoutRedirectButtonProps {
  children: ReactNode;
  url: string;
  className?: string;
  plan?: string;
}

export const CheckoutRedirectButton = ({ 
  children, 
  url, 
  className = "",
  plan 
}: CheckoutRedirectButtonProps) => {
  const { start } = useCheckoutRedirect();

  const handleClick = () => {
    start(url, plan);
  };

  return (
    <Button
      onClick={handleClick}
      className={className}
    >
      {children}
    </Button>
  );
};