import { useEffect } from "react";

/**
 * Traps focus inside a container while it's open.
 * Optionally auto-focuses the first focusable element.
 *
 * @param {React.RefObject} containerRef - The container element ref.
 * @param {boolean} active - Whether the trap is active (e.g., dropdown open).
 * @param {boolean} [autoFocus=true] - Whether to auto-focus the first element.
 */
export function useFocusTrap(containerRef, active, autoFocus = true) {
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;

    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([type='hidden']):not([disabled])",
      "select:not([disabled])",
      "details:not([disabled])",
      "summary:not(:disabled)",
      '[contenteditable]:not([contenteditable="false"])',
    ];

    const getFocusableElements = () =>
      Array.from(container.querySelectorAll(focusableSelectors.join(",")));

    const focusables = getFocusableElements();
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (autoFocus && first) {
      requestAnimationFrame(() => first.focus());
    }

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;
      if (focusables.length === 0) return;

      const activeEl = document.activeElement;
      const isFirst = activeEl === first;
      const isLast = activeEl === last;

      if (e.shiftKey && isFirst) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && isLast) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [containerRef, active, autoFocus]);
}
