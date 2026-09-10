"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  backdropClassName?: string;
  zIndexClassName?: string;
}

/**
 * ModalPortal:
 * - Mounts the modal directly to `document.body` via `createPortal`.
 * - Prevents the modal from being trapped inside parent containers (eliminating layout offsets,
 *   gutters/margins, or containing blocks caused by CSS transforms/filters/overflow).
 * - Covers the complete viewport (100vw x 100vh) edge-to-edge.
 * - Perfectly centers the modal in the user's active viewport without requiring scroll.
 * - Automatically handles scroll-locking on body while open, backdrop clicks, and Esc key dismissal.
 */
export default function ModalPortal({
  isOpen,
  onClose,
  children,
  closeOnBackdrop = true,
  closeOnEsc = true,
  backdropClassName = "bg-slate-900/60 backdrop-blur-sm",
  zIndexClassName = "z-[9999]",
}: ModalPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen || !closeOnEsc || !onClose) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 ${zIndexClassName} flex items-center justify-center p-4 sm:p-6 ${backdropClassName} animate-fadeIn`}
      onClick={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      {children}
    </div>,
    document.body
  );
}
