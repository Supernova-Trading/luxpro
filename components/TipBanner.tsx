"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "./Icon";
import type { Translation } from "@/lib/translations";

interface Props {
  t: Translation;
  onShowQR: () => void;
  onSpeak: (text: string) => void;
}

// Matches ComfortItems' one-shot confirmation flash (same constant, same
// mechanism) — these are action buttons, not persistent toggles.
const AUTO_RESET_MS = 2500;

export default function TipBanner({ t, onShowQR, onSpeak }: Props) {
  const [showUberPrompt, setShowUberPrompt] = useState(false);
  const [justTapped, setJustTapped] = useState<"cash" | "uber" | "bank" | null>(null);

  function flashTapped(id: "cash" | "uber" | "bank") {
    setJustTapped(id);
    setTimeout(() => setJustTapped((cur) => (cur === id ? null : cur)), AUTO_RESET_MS);
  }

  function handleUberTap() {
    onSpeak("Thank you. Please tip Amish through your Uber app after the journey.");
    flashTapped("uber");
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
        className="font-display font-bold uppercase mb-1.5 leading-tight"
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
        className="font-display italic leading-snug"
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
          { id: "cash", icon: "cash" as const, color: "var(--accent-positive)", label: t.payCash, onTap: () => { onSpeak("Thank you. Please hand your cash tip to Amish at drop-off."); flashTapped("cash"); } },
          { id: "uber", icon: "car" as const, color: "var(--icon-orange)", label: t.payUber, onTap: handleUberTap },
          { id: "bank", icon: "bank" as const, color: "var(--icon-teal)", label: t.payBank, onTap: () => { onShowQR(); flashTapped("bank"); } },
        ].map(({ id, icon, color, label, onTap }) => {
          const isActive = justTapped === id;
          return (
            <motion.button
              key={id}
              whileTap={{ scale: 0.96, transition: { duration: 0.08 } }}
              onClick={onTap}
              className="flex items-center justify-center gap-2 rounded-[14px] uppercase font-bold py-2.5 px-2"
              style={{
                fontSize: "11px",
                letterSpacing: "1.5px",
                background: isActive ? "var(--active-bg-strong)" : "var(--lp-overlay-low)",
                border: isActive ? "1px solid var(--active-border)" : "1px solid rgba(200,168,75,0.30)",
                boxShadow: isActive ? "inset 0 0 0 1.5px var(--active-ring)" : "none",
                color: isActive ? "var(--active-text)" : "var(--lp-gold-text)",
                transition: "box-shadow 200ms ease, border-color 200ms ease, background 200ms ease",
              }}
            >
              <Icon name={icon} size={16} style={{ color: isActive ? "var(--active-text)" : color }} />
              {label}
            </motion.button>
          );
        })}
      </div>
      {showUberPrompt && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="font-display italic text-center mt-2"
          style={{ fontSize: "0.8rem", color: "var(--lp-text-sub)", letterSpacing: "0.3px" }}
        >
          {t.uberPrompt}
        </motion.p>
      )}
    </motion.div>
  );
}
