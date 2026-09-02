"use client";

import { useEffect } from "react";

/**
 * Global component that ensures hover effects (CSS :hover, transitions, dropdowns)
 * work smoothly even after the user selects words or text on the page.
 */
export default function SelectionHoverFix() {
  useEffect(() => {
    // 1. Mouse move: if user has finished selecting text and moves over an interactive element
    const handleMouseMove = (e) => {
      // Only execute when mouse button is UP (not in the middle of dragging selection)
      if (e.buttons === 0) {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed && selection.toString().trim().length > 0) {
          const target = e.target;
          if (!target || !(target instanceof Element)) return;

          // Check if hovering over any interactive or grouped hover element
          const isInteractive = target.closest(
            'a, button, [role="button"], input, select, textarea, nav, header, [data-testid], .cursor-pointer, .group, .hover-lift'
          );

          if (isInteractive) {
            const anchorNode = selection.anchorNode;
            const focusNode = selection.focusNode;
            const isInsideSelection =
              (anchorNode && isInteractive.contains(anchorNode)) ||
              (focusNode && isInteractive.contains(focusNode));

            if (!isInsideSelection) {
              // Immediately release selection lock so CSS :hover and pointer events fire with zero delay
              selection.removeAllRanges();
            }
          }
        }
      }
    };

    // 2. Pointer down: clear stale selection when clicking or starting a new action
    const handlePointerDown = (e) => {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed && selection.toString().trim().length > 0) {
        const target = e.target;
        if (!target || !(target instanceof Element)) return;

        const isInteractive = target.closest(
          'a, button, [role="button"], nav, header, .cursor-pointer, select, input'
        );
        if (isInteractive) {
          selection.removeAllRanges();
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return null;
}
