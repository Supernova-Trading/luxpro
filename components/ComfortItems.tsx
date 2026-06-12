"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import type { Translation } from "@/lib/translations";

interface Props {
  t: Translation;
  onSpeak: (text: string) => void;
}

export default function ComfortItems({ t, onSpeak }: Props) {
  const items = [
    { icon: "🔌", labelKey: "charger"       as const, msg: "Amish, can I use the phone charger please" },
    { icon: "🍱", labelKey: "specialSnacks" as const, msg: "Amish, can I have some special snacks please" },
    { icon: "🧼", labelKey: "wipes"         as const, msg: "Amish, can I have some wet wipes please" },
    { icon: "🍬", labelKey: "mints"         as const, msg: "Amish, can I have some sweets and mints please" },
  ];

  const [active, setActive] = useState<Record<number, boolean>>({});

  function toggle(idx: number, msg: string) {
    const next = !active[idx];
    setActive((prev) => ({ ...prev, [idx]: next }));
    onSpeak(next ? msg : "That request has been removed.");
  }

  const glassCard: React.CSSProperties = {
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    transition: "box-shadow 200ms ease, border-color 200ms ease, background 200ms ease",
  };

  return (
    <div>
      <SectionHeader label={t.comfortItems} />

      {/* 4-col equal grid */}
      <div className="grid grid-cols-4 gap-2">
        {items.map(({ icon, labelKey, msg }, idx) => {
          const isActive = !!active[idx];
          return (
            <motion.div
              key={idx}
              whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
              whileHover={{ y: -2, transition: { type: "tween", duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
              onClick={() => toggle(idx, msg)}
              className="relative flex flex-col items-center gap-2 py-3 px-2 rounded-[18px] cursor-pointer"
              style={{
                ...glassCard,
                background: isActive ? "rgba(200,168,75,0.10)" : "rgba(255,255,255,0.05)",
                border: isActive
                  ? "1px solid rgba(200,168,75,0.55)"
                  : "1px solid rgba(255,255,255,0.10)",
                boxShadow: isActive ? "inset 0 0 0 1.5px rgba(200,168,75,0.70)" : "none",
              }}
            >
              <div className="text-[26px] leading-none">{icon}</div>
              <div
                className="text-[12px] tracking-[2px] uppercase font-bold text-center"
                style={{ color: isActive ? "var(--lp-gold)" : "var(--text-primary)" }}
              >
                {t[labelKey]}
              </div>
              <div
                className="absolute top-3 right-3 w-2 h-2 rounded-full"
                style={{
                  background: "var(--lp-gold)",
                  boxShadow: "0 0 8px rgba(200,168,75,0.70)",
                  opacity: isActive ? 1 : 0,
                  transition: "opacity 200ms ease",
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
