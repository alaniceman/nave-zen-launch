import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Campo con etiqueta flotante (patrón tipo Shopify Checkout).
 * Funciona con inputs controlados y con react-hook-form (usa placeholder=" ").
 */
const floatingFieldBase =
  "peer w-full rounded-lg border border-input bg-background px-3.5 text-base text-foreground ring-offset-background transition-[border-color,box-shadow] placeholder:text-transparent focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60";

const floatingLabelBase =
  "pointer-events-none absolute left-3.5 origin-left select-none text-muted-foreground transition-all duration-150 ease-out";

export interface FloatingInputProps extends React.ComponentProps<"input"> {
  label: string;
  error?: string;
  hint?: string;
  /** Contenido a la derecha dentro del campo (ej. botón "Aplicar"). */
  endAdornment?: React.ReactNode;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, hint, endAdornment, className, id, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? `ff-${autoId}`;

    return (
      <div className="w-full">
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            placeholder=" "
            aria-invalid={error ? true : undefined}
            className={cn(
              floatingFieldBase,
              "h-14 pb-2 pt-6",
              endAdornment && "pr-24",
              error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/25",
              className
            )}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              floatingLabelBase,
              "top-1/2 -translate-y-1/2 text-base",
              "peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-primary",
              "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs",
              error && "peer-focus:text-destructive"
            )}
          >
            {label}
          </label>
          {endAdornment && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">{endAdornment}</div>
          )}
        </div>
        {error ? (
          <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    );
  }
);
FloatingInput.displayName = "FloatingInput";

export interface FloatingTextareaProps extends React.ComponentProps<"textarea"> {
  label: string;
  error?: string;
  hint?: string;
}

const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ label, error, hint, className, id, rows = 3, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? `ft-${autoId}`;

    return (
      <div className="w-full">
        <div className="relative">
          <textarea
            id={inputId}
            ref={ref}
            rows={rows}
            placeholder=" "
            aria-invalid={error ? true : undefined}
            className={cn(
              floatingFieldBase,
              "min-h-[6.5rem] resize-y pb-2.5 pt-6",
              error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/25",
              className
            )}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={cn(
              floatingLabelBase,
              "top-4 text-base",
              "peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary",
              "peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs",
              error && "peer-focus:text-destructive"
            )}
          >
            {label}
          </label>
        </div>
        {error ? (
          <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    );
  }
);
FloatingTextarea.displayName = "FloatingTextarea";

export { FloatingInput, FloatingTextarea };
