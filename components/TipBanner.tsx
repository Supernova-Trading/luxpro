"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Translation } from "@/lib/translations";

interface Props {
  t: Translation;
  onShowQR: () => void;
  onSpeak: (text: string) => void;
}

export default function TipBanner({ t, onShowQR, onSpeak }: Props) {
  const [showUberPrompt, setShowUberPrompt] = useState(false);

  function handleUberTap() {
    onSpeak("Thank you. Please tip Amish through your Uber app after the journey.");
    setShowUberPrompt(true);
    setTimeout(() => setShowUberPrompt(false), 6000);
  }

  return (
    <motion.div
      whileTap={{ scale: 0.985 }}
      className="relative rounded-[22px] overflow-hidden text-center gold-top-line"
      style={{
        background: "var(--lp-banner-bg)",
        border: "1px solid rgba(200,168,75,0.40)",
        boxShadow: "var(--lp-banner-shadow)",
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
      <div className="stars-gold mb-1.5 tracking-[4px] text-sm" style={{ color: "var(--lp-gold-text)" }}>★★★★★</div>

      {/* Heading */}
      <h2
        className="font-cormorant font-bold uppercase mb-1.5 leading-tight"
        style={{
          fontSize: "1.25rem",
          color: "var(--lp-gold-text)",
          letterSpacing: "2px",
          textShadow: "var(--lp-gold-text-shadow)",
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
          color: "var(--lp-text-body)",
          letterSpacing: "0.3px",
          maxWidth: "520px",
          margin: "0 auto",
        }}
      >
        {t.tipQuote}
      </p>

      {/* Payment options — Cash · Uber · Bank Transfer (QR) */}
      <div className="grid grid-cols-3 gap-2 mt-2.5">
        {[
          { id: "cash", icon: "💵", label: t.payCash, onTap: () => onSpeak("Thank you. Please hand your cash tip to Amish at drop-off.") },
          { id: "uber", icon: "🚗", label: t.payUber, onTap: handleUberTap },
          { id: "bank", icon: "🏦", label: t.payBank, onTap: onShowQR },
        ].map(({ id, icon, label, onTap }) => (
          <motion.button
            key={id}
            whileTap={{ scale: 0.96, transition: { duration: 0.08 } }}
            onClick={onTap}
            className="flex items-center justify-center gap-2 rounded-[14px] uppercase font-bold py-2.5 px-2"
            style={{
              fontSize: "11px",
              letterSpacing: "1.5px",
              background: "var(--lp-overlay-low)",
              border: "1px solid rgba(200,168,75,0.30)",
              color: "var(--lp-gold-text)",
            }}
          >
            <span className="text-[16px] leading-none">{icon}</span>
            {label}
          </motion.button>
        ))}
      </div>
      {showUberPrompt && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="font-cormorant italic text-center mt-2"
          style={{ fontSize: "0.8rem", color: "var(--lp-text-sub)", letterSpacing: "0.3px" }}
        >
          {t.uberPrompt}
        </motion.p>
      )}
    </motion.div>
  );
}
