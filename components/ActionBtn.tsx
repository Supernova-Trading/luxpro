"use client";

import { motion } from "framer-motion";

// Two visual weights only — plain surface, or gold accent for the primary
// action in a row. Gold marks the primary action through its text/icon/
// border, not a filled background: a permanent gold surface on a
// non-toggle button is exactly the "accent as button surface" pattern the
// brand teardowns warn against (awesome-design-md/revolut/DESIGN.md:584) —
// gold should read as a deliberate signature, not a wash.
export default function ActionBtn({ accent, onClick, children }: { accent?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
      onClick={onClick}
      className="py-3.5 px-2 rounded-xl text-[11px] tracking-[1.5px] uppercase font-bold cursor-pointer flex items-center justify-center gap-1.5"
      style={{
        background: "var(--lp-surface-mid)",
        border: accent ? "1px solid rgba(200,168,75,0.55)" : "1px solid var(--lp-border)",
        color: accent ? "var(--lp-gold-text)" : "var(--text-primary)",
        transition: "opacity 150ms ease",
      }}
    >
      {children}
    </motion.button>
  );
}
