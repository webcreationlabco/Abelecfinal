"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalBaseProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function ModalBase({ open, onClose, children }: ModalBaseProps) {
  // Lock body scroll & Escape key
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50"
            style={{ background: "rgba(16, 30, 48, 0.55)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-abelec-cream-light hover:bg-abelec-cream-line flex items-center justify-center transition-colors"
                aria-label="Fermer"
              >
                <X size={15} strokeWidth={2.2} className="text-abelec-navy" />
              </button>

              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
