"use client";

import { motion } from "framer-motion";

// Two visual weights only — plain surface, or gold accent for the primary
// action in a row. No per-button hue-coded gradients (green/orange), which
// read as an un-tokenized, generic-AI-app accent choice.
export default function ActionBtn({ accent, onClick, children }: { accent?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
      onClick={onClick}
      className="py-3.5 px-2 rounded-xl text-[11px] tracking-[1.5px] uppercase font-bold cursor-pointer flex items-center justify-center gap-1.5"
      style={{
        background: accent ? "rgba(200,168,75,0.16)" : "var(--lp-surface-mid)",
        border: accent ? "1px solid rgba(200,168,75,0.55)" : "1px solid var(--lp-border)",
        color: accent ? "var(--lp-gold)" : "var(--text-primary)",
        transition: "opacity 150ms ease",
      }}
    >
      {children}
    </motion.button>
  );
}
