"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  children: React.ReactNode;
}

// Full-height overlay below the 56px top bar. Solid canvas, no blur, no
// radius — Bugatti has no glass or card chrome (DESIGN.md:322, :333).
export default function Sheet({ open, children }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          // Instant exit: a fading sheet still sits on top and swallows taps
          exit={{ opacity: 0, transition: { duration: 0 } }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute inset-x-0 bottom-0 z-40 overflow-y-auto px-5 py-6"
          style={{ top: 56, background: "var(--bx-canvas)", borderTop: "1px solid var(--bx-hairline)" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
