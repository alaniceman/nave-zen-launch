import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

type DialogViewportState = {
  height: number;
  top: number;
};

type DialogViewportStyle = CSSProperties & {
  "--dialog-viewport-height": string;
  "--dialog-viewport-top": string;
};

const getViewportState = (): DialogViewportState => {
  if (typeof window === "undefined") {
    return { height: 720, top: 0 };
  }

  const viewport = window.visualViewport;

  return {
    height: Math.floor(viewport?.height ?? window.innerHeight),
    top: Math.max(0, Math.floor(viewport?.offsetTop ?? 0)),
  };
};

export function useKeyboardAwareDialogViewport(
  open: boolean,
  onViewportChange?: () => void,
): DialogViewportStyle {
  const [viewport, setViewport] = useState<DialogViewportState>(getViewportState);
  const callbackRef = useRef(onViewportChange);

  useEffect(() => {
    callbackRef.current = onViewportChange;
  }, [onViewportChange]);

  useEffect(() => {
    if (!open || typeof window === "undefined") return;

    let frameId = 0;
    let timeoutId = 0;

    const updateViewport = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      if (timeoutId) window.clearTimeout(timeoutId);

      frameId = window.requestAnimationFrame(() => {
        setViewport(getViewportState());
        timeoutId = window.setTimeout(() => callbackRef.current?.(), 90);
      });
    };

    updateViewport();

    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener("resize", updateViewport);
    visualViewport?.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);
    window.addEventListener("orientationchange", updateViewport);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      if (timeoutId) window.clearTimeout(timeoutId);
      visualViewport?.removeEventListener("resize", updateViewport);
      visualViewport?.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
    };
  }, [open]);

  return useMemo(
    () =>
      ({
        "--dialog-viewport-height": `${viewport.height}px`,
        "--dialog-viewport-top": `${viewport.top}px`,
      }) as DialogViewportStyle,
    [viewport.height, viewport.top],
  );
}