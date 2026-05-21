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

  return (
    <div>
      <SectionHeader label={t.comfortItems} />

      <div className="grid grid-cols-4 gap-2.5">
        {items.map(({ icon, labelKey, msg }, idx) => {
          const isActive = !!active[idx];
          return (
            <motion.div
              key={idx}
              whileTap={{ scale: 0.95, transition: { duration: 0.08 } }}
              onClick={() => toggle(idx, msg)}
              className="relative flex flex-col items-center gap-3 py-4 px-2 rounded-[18px] cursor-pointer"
              style={{
                background: isActive ? "rgba(200,168,75,0.10)" : "rgba(255,255,255,0.05)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: isActive
                  ? "1px solid rgba(200,168,75,0.55)"
                  : "1px solid rgba(255,255,255,0.10)",
                boxShadow: isActive
                  ? "var(--glow-gold)"
                  : "0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
                transition: "box-shadow 200ms ease, border-color 200ms ease, background 200ms ease",
              }}
            >
              <div className="text-[36px] leading-none">{icon}</div>
              <div
                className="text-[12px] tracking-[2px] uppercase font-bold text-center"
                style={{ color: isActive ? "var(--lp-gold)" : "rgba(255,255,255,0.80)" }}
              >
                {t[labelKey]}
              </div>
              {/* Active dot */}
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
