"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "../Icon";
import type { Translation } from "@/lib/translations";
import type { PreviewStrings } from "@/lib/preview-strings";

interface Props {
  s: PreviewStrings;
  t: Translation;
  onSpeak: (text: string) => void;
  onShowQR: () => void;
  onClose: () => void;
}

const tap = { scale: 0.99, transition: { duration: 0.08 } };

export default function TipSheet({ s, t, onSpeak, onShowQR, onClose }: Props) {
  const [sent, setSent] = useState<"cash" | "uber" | null>(null);

  function flash(id: "cash" | "uber") {
    setSent(id);
    setTimeout(() => setSent((cur) => (cur === id ? null : cur)), 2500);
  }

  return (
    <div className="max-w-[880px]">
      <div className="flex items-center justify-between gap-6 mb-8">
        <div className="bx-display">{s.tipAmish}</div>
        <motion.button whileTap={tap} className="bx-pill" onClick={onClose}>
          {s.close}
        </motion.button>
      </div>

      <motion.button
        whileTap={tap}
        className="bx-row"
        style={{ minHeight: 84 }}
        onClick={() => { onSpeak("Thank you. Please hand your cash tip to Amish at drop-off."); flash("cash"); }}
      >
        <span className="bx-row-title is-lg">{s.cash}</span>
        {sent === "cash" ? (
          <span className="bx-row-status"><Icon name="check" size={14} />{s.sent}</span>
        ) : (
          <span className="bx-caption">{s.cashSub}</span>
        )}
      </motion.button>

      <motion.button
        whileTap={tap}
        className="bx-row"
        style={{ minHeight: 84 }}
        onClick={() => { onSpeak("Thank you. Please tip Amish through your Uber app after the journey."); flash("uber"); }}
      >
        <span className="bx-row-title is-lg">{s.uber}</span>
        {sent === "uber" ? (
          <span className="bx-row-status"><Icon name="check" size={14} />{s.sent}</span>
        ) : (
          <span className="bx-caption">{s.uberSub}</span>
        )}
      </motion.button>

      <motion.button whileTap={tap} className="bx-row" style={{ minHeight: 84, borderBottom: "none" }} onClick={onShowQR}>
        <span className="bx-row-title is-lg">{s.revolut}</span>
        <span className="bx-caption">{s.revolutSub}</span>
        <Icon name="chevron-right" size={20} className="bx-chevron" />
      </motion.button>

      {sent === "uber" && (
        <p className="bx-title mt-6" style={{ color: "var(--bx-muted)" }}>{t.uberPrompt}</p>
      )}
    </div>
  );
}
