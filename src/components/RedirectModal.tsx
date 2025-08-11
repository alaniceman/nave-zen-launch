import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type RedirectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  checkoutUrl: string | null;
  plan?: string | null;
};

// Accessible redirect modal shown before navigating to BoxMagic checkout
export const RedirectModal: React.FC<RedirectModalProps> = ({ isOpen, onClose, checkoutUrl, plan }) => {
  const titleId = React.useId();
  const descId = React.useId();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      
      <DialogContent
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="w-full sm:max-w-md sm:rounded-xl rounded-none bg-card text-foreground shadow-lg data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out sm:h-auto h-screen"
      >
        <DialogHeader>
          <DialogTitle id={titleId} className="font-space text-xl">Redirigiendo a BoxMagic…</DialogTitle>
          <DialogDescription id={descId} className="font-inter">
            Estamos abriendo tu checkout seguro{plan ? ` para el plan ${plan}.` : "."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex items-center gap-3">
          <span
            aria-hidden
            className="inline-block size-5 rounded-full border-2 border-accent border-t-transparent animate-spin"
          />
          <span className="text-sm text-muted-foreground">Esto tomará un instante…</span>
        </div>

        <div className="mt-6 space-y-3">
          {checkoutUrl && (
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-primary underline-offset-4 hover:underline font-medium story-link"
            >
              Si no te redirige, haz clic aquí
            </a>
          )}

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-lg border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground focus-visible:outline-dashed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label="Cancelar redirección"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RedirectModal;
