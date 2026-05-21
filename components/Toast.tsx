"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Props {
  message: string;
  show: boolean;
}

export default function Toast({ message, show }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 40, x: "-50%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed bottom-7 left-1/2 z-[700] pointer-events-none"
          style={{
            background: "rgba(42,48,54,0.97)",
            backdropFilter: "blur(20px)",
            border: "1px solid var(--lp-gold)",
            borderRadius: 11,
            padding: "12px 22px",
            fontSize: 11,
            letterSpacing: "2px",
            color: "#fff",
            textTransform: "uppercase",
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
