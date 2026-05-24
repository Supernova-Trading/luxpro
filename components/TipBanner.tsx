"use client";

import { motion } from "framer-motion";
import type { Translation } from "@/lib/translations";

interface Props {
  t: Translation;
}

export default function TipBanner({ t }: Props) {
  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      className="relative rounded-[22px] overflow-hidden text-center gold-top-line"
      style={{
        background:
          "radial-gradient(ellipse at 50% 120%, rgba(200,168,75,0.18) 0%, transparent 60%), " +
          "radial-gradient(ellipse at 20% -10%, rgba(200,168,75,0.10) 0%, transparent 50%), " +
          "linear-gradient(160deg, #1A2330 0%, #0D1117 100%)",
        border: "1px solid rgba(200,168,75,0.40)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        padding: "12px 16px 10px",
      }}
    >
      {/* Decorative ambient glow disc */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "260px",
          height: "80px",
          background: "radial-gradient(ellipse, rgba(200,168,75,0.22) 0%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(8px)",
        }}
      />

      {/* Stars */}
      <div className="stars-gold mb-1.5 tracking-[4px] text-sm">★★★★★</div>

      {/* Heading */}
      <h2
        className="font-cormorant font-bold uppercase mb-1.5 leading-tight"
        style={{
          fontSize: "1.25rem",
          color: "var(--lp-gold)",
          letterSpacing: "2px",
          textShadow: "0 0 24px rgba(200,168,75,0.45)",
        }}
      >
        {t.tipYourDriver}
      </h2>

      {/* Divider */}
      <div
        aria-hidden
        style={{
          width: "60px",
          height: "1px",
          background: "linear-gradient(90deg, transparent, var(--lp-gold), transparent)",
          margin: "0 auto 8px",
          opacity: 0.6,
        }}
      />

      {/* Quote */}
      <p
        className="font-cormorant italic leading-snug"
        style={{
          fontSize: "0.875rem",
          color: "rgba(255,255,255,0.90)",
          letterSpacing: "0.3px",
          maxWidth: "520px",
          margin: "0 auto",
        }}
      >
        {t.tipQuote}
      </p>

      {/* Sub-label */}
      <p
        className="mt-2 uppercase font-semibold"
        style={{
          fontSize: "9px",
          letterSpacing: "3px",
          color: "rgba(200,168,75,0.55)",
        }}
      >
        Cash · Uber Cash · Card
      </p>
    </motion.div>
  );
}
