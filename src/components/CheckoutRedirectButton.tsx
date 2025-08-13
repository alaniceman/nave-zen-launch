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
  return (
    <Button
      data-checkout-url={url}
      data-plan={plan}
      className={className}
    >
      {children}
    </Button>
  );
};